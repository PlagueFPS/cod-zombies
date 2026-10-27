import { execSync } from "node:child_process"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import {
	DateTime,
	Effect,
	FileSystem,
	MutableHashMap,
	MutableHashSet,
	Option,
	Path,
	Ref,
	Schema,
	Array as Arr,
	String as Str,
	Record as Rec,
	pipe,
} from "effect"
import { DATE_OPTIONS } from "@/utils/constants"
import { nowDate } from "@/utils/system-time"
import {
	encodeLastModifiedData,
	type FileMetadata,
	type LastModifiedData,
} from "@/utils/validation-schemas"

export class DuplicateFilenameError extends Schema.TaggedError<
	DuplicateFilenameError,
	{ readonly brand: unique symbol }
>()("DuplicateFilenameError", {
	message: Schema.String,
}) {}

const toPosixPath = Str.replace(/\\/g, "/")

const stripSrcContentPrefix = Str.replace(/^src\/content\//, "")

const stripContentPrefix = Str.replace(/^content\//, "")

export const populateFilePaths = (
	allFiles: MutableHashSet.MutableHashSet<string>,
	repoRoot: string,
) => {
	const filePaths = MutableHashSet.empty<string>()
	const repoRootNormalized = toPosixPath(repoRoot)

	for (const filePath of allFiles) {
		const relativePath = Str.replace(
			`${repoRootNormalized}/src/content/`,
			"",
		)(toPosixPath(filePath))

		MutableHashSet.add(filePaths, relativePath)
	}

	return filePaths
}

const normalizeContentPath = (path: string) =>
	pipe(path, toPosixPath, stripSrcContentPrefix, stripContentPrefix)

const GitTimestampSchema = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^\d+$/)),
	Schema.decodeTo(Schema.FiniteFromString.pipe(Schema.check(Schema.isInt()))),
)

const GitFileLineSchema = Schema.Union([
	Schema.Tuple([Schema.Literals(["A", "M"]), Schema.NonEmptyString]),
	Schema.Tuple([
		Schema.String.pipe(Schema.check(Schema.isPattern(/^R/))),
		Schema.NonEmptyString,
		Schema.NonEmptyString,
	]),
])

const storeFileMetadata = Effect.fn("storeFileMetadata")(function* (
	path: string,
	currentTimestamp: Ref.Ref<Option.Option<DateTime.Utc>>,
	filePaths: MutableHashSet.MutableHashSet<string>,
	gitHistory: MutableHashSet.MutableHashSet<string>,
	result: Record<string, FileMetadata>,
) {
	if (!MutableHashSet.has(filePaths, path) || MutableHashSet.has(gitHistory, path)) {
		return
	}

	const timestamp = yield* Ref.get(currentTimestamp)

	if (Option.isNone(timestamp)) return

	MutableHashSet.add(gitHistory, path)
	result[path] = {
		lastModified: DateTime.toEpochMillis(timestamp.value),
		lastModifiedFormatted: DateTime.formatLocal(timestamp.value, DATE_OPTIONS),
	}
})

export const parseGitBatchOutput = Effect.fn("parseGitBatchOutput")(function* (
	output: string,
	allFiles: MutableHashSet.MutableHashSet<string>,
	repoRoot: string,
) {
	const lines = pipe(output, Str.trim, Str.split("\n"))
	const currentDate = yield* DateTime.make(nowDate()).pipe(Effect.fromOption)
	const currentTimestamp = yield* Ref.make(Option.none<DateTime.Utc>())
	const gitHistory = MutableHashSet.empty<string>()
	const filePaths = populateFilePaths(allFiles, repoRoot)
	const result: Record<string, FileMetadata> = {}

	for (const line of lines) {
		const timestamp = yield* Schema.decodeEffect(GitTimestampSchema)(line).pipe(
			Effect.option,
			Effect.map(Option.flatMap(seconds => DateTime.make(seconds * 1000))),
		)

		if (Option.isSome(timestamp)) {
			yield* Ref.set(currentTimestamp, timestamp)
			continue
		}

		const record = yield* Schema.decodeUnknownEffect(GitFileLineSchema)(Str.split(line, "\t")).pipe(
			Effect.option,
		)

		yield* Option.match(record, {
			onNone: () => Effect.void,
			onSome: fields => {
				const relativePath = fields[2] ?? Str.trim(fields[1])

				return storeFileMetadata(
					normalizeContentPath(relativePath),
					currentTimestamp,
					filePaths,
					gitHistory,
					result,
				)
			},
		})
	}

	// For files not found in git, use current date
	for (const path of filePaths) {
		if (!MutableHashSet.has(gitHistory, path)) {
			result[path] = {
				lastModified: DateTime.toEpochMillis(currentDate),
				lastModifiedFormatted: DateTime.formatLocal(currentDate, DATE_OPTIONS),
			}
		}
	}

	return result
})

export const getAllContentFiles = Effect.fn("getAllContentFiles")(function* (dir: string) {
	const path = yield* Path.Path
	const fs = yield* FileSystem.FileSystem
	const files = MutableHashSet.empty<string>()
	const pathCountMap = MutableHashMap.empty<string, number>()
	const subDirs = yield* fs.readDirectory(dir)

	yield* Effect.forEach(
		subDirs,
		subDir =>
			Effect.gen(function* () {
				const subDirPath = path.join(dir, subDir)
				const subFiles = yield* fs.readDirectory(subDirPath)
				const mdxFiles = Arr.filter(subFiles, file => Str.endsWith(".mdx")(file))

				for (const file of mdxFiles) {
					const fullPath = path.join(dir, subDir, file)
					MutableHashSet.add(files, fullPath)

					// Track relative paths to detect duplicates
					const relativePath = `${subDir}/${file}`

					const count = MutableHashMap.get(pathCountMap, relativePath).pipe(
						Option.getOrElse(() => 0),
					)

					MutableHashMap.set(pathCountMap, relativePath, count + 1)
				}
			}),
		{ concurrency: 1 },
	)

	// Check for duplicate paths (same path appearing multiple times)
	const duplicates: string[] = []

	for (const [relativePath, count] of pathCountMap) {
		if (count > 1) {
			duplicates.push(`${relativePath} (appears ${count} times)`)
		}
	}

	if (duplicates.length > 0) {
		return yield* DuplicateFilenameError.make({
			message: `Duplicate file paths detected:\n${Arr.join(duplicates, "\n")}`,
		})
	}

	return files
})

/** @param cwd - Workspace root (must contain `src/content/` and `src/data/` when run). */
export const generateLastModified = (cwd: string = process.cwd()) =>
	Effect.gen(function* () {
		const path = yield* Path.Path
		const fs = yield* FileSystem.FileSystem
		const contentDir = path.join(cwd, "src/content")
		const outputPath = path.join(cwd, `src/data/last-modified.json`)

		const allFiles = yield* getAllContentFiles(contentDir)

		const gitOutput = yield* Effect.try({
			try: () => {
				// Use --name-status to show renames (R lines), --diff-filter=AMR for added/modified/renamed
				const result = execSync(
					`git log --all --name-status --format="%ct" --diff-filter=AMR -- "${contentDir}"`,
					{
						encoding: "utf-8",
						stdio: ["ignore", "pipe", "ignore"],
						maxBuffer: 10 * 1024 * 1024,
					},
				)

				return result || ""
			},
			catch: () => "",
		})

		const fileMetadata = yield* parseGitBatchOutput(gitOutput, allFiles, cwd)

		const lastModifiedData: LastModifiedData = {
			version: "1.0",
			generated: nowDate().toISOString(),
			files: fileMetadata,
		}

		yield* Effect.log(`Generated last modified dates for ${Rec.keys(fileMetadata).length} files`)
		const encodedData = yield* encodeLastModifiedData(lastModifiedData)
		yield* fs.writeFileString(outputPath, encodedData)
		yield* Effect.log(`Data written to: ${outputPath}`)
	}).pipe(Effect.withLogSpan("generate_last_modified"), Effect.provide(BunServicesLayer))

if (import.meta.main) {
	runMain(generateLastModified(process.cwd()))
}
