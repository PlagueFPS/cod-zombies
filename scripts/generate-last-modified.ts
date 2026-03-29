import { execSync } from "node:child_process"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import {
	DateTime,
	Effect,
	FileSystem,
	MutableHashMap,
	MutableHashSet,
	Number as Num,
	Option,
	Path,
	Ref,
	Schema,
} from "effect"
import { DATE_OPTIONS } from "@/utils/constants"
import {
	encodeLastModifiedData,
	type FileMetadata,
	type LastModifiedData,
} from "@/utils/validation-schemas"

export class DuplicateFilenameError extends Schema.TaggedErrorClass<DuplicateFilenameError>()(
	"DuplicateFilenameError",
	{
		message: Schema.String,
	},
) {}

export const populateFilePaths = (
	allFiles: MutableHashSet.MutableHashSet<string>,
	repoRoot: string,
) => {
	const filePaths = MutableHashSet.empty<string>()
	for (const filePath of allFiles) {
		const normalizedPath = filePath.replace(/\\/g, "/")
		const repoRootNormalized = repoRoot.replace(/\\/g, "/")
		const relativePath = normalizedPath.replace(`${repoRootNormalized}/content/`, "")
		MutableHashSet.add(filePaths, relativePath)
	}
	return filePaths
}

const storeFileMetadata = Effect.fn("storeFileMetadata")(function* (
	path: string,
	currentTimestamp: Ref.Ref<string>,
	filePaths: MutableHashSet.MutableHashSet<string>,
	gitHistory: MutableHashSet.MutableHashSet<string>,
	result: Record<string, FileMetadata>,
) {
	if (!MutableHashSet.has(filePaths, path) || MutableHashSet.has(gitHistory, path)) {
		return
	}

	const timestampStr = yield* Ref.get(currentTimestamp)
	if (!timestampStr) return

	const timestamp = Num.parse(timestampStr).pipe(
		Option.flatMap(t => DateTime.make(new Date(t * 1000))),
	)
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
	const lines = output.trim().split("\n")
	const currentDate = yield* DateTime.make(new Date())
	const currentTimestamp = yield* Ref.make("")
	const gitHistory = MutableHashSet.empty<string>()
	const filePaths = populateFilePaths(allFiles, repoRoot)
	const result: Record<string, FileMetadata> = {}
	const digitPattern = /^\d+$/

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (!line || !line.trim()) continue

		if (digitPattern.test(line)) {
			yield* Ref.update(currentTimestamp, () => line)
			continue
		}

		if (line.startsWith("R")) {
			const parts = line.split("\t")
			if (parts.length < 3 || !parts[2]) continue

			const newPath = parts[2].replace(/\\/g, "/").replace("content/", "")
			yield* storeFileMetadata(newPath, currentTimestamp, filePaths, gitHistory, result)
		}

		if (line.startsWith("A\t") || line.startsWith("M\t")) {
			const gitPath = line.substring(2).trim().replace(/\\/g, "/")
			const relativePath = gitPath.replace("content/", "")
			yield* storeFileMetadata(relativePath, currentTimestamp, filePaths, gitHistory, result)
		}
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
				const mdxFiles = subFiles.filter(file => file.endsWith(".mdx"))

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
		return yield* new DuplicateFilenameError({
			message: `Duplicate file paths detected:\n${duplicates.join("\n")}`,
		})
	}

	return files
})

/** @param cwd - Workspace root (must contain `content/` and `data/` when run). */
export const generateLastModified = (cwd: string = process.cwd()) =>
	Effect.gen(function* () {
		const path = yield* Path.Path
		const fs = yield* FileSystem.FileSystem
		const contentDir = path.join(cwd, "content")
		const outputPath = path.join(cwd, `data/last-modified.json`)

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
			generated: new Date().toISOString(),
			files: fileMetadata,
		}

		yield* Effect.log(`Generated last modified dates for ${Object.keys(fileMetadata).length} files`)
		const encodedData = yield* encodeLastModifiedData(lastModifiedData)
		yield* fs.writeFileString(outputPath, encodedData)
		yield* Effect.log(`Data written to: ${outputPath}`)
	}).pipe(Effect.withLogSpan("generate_last_modified"), Effect.provide(BunServicesLayer))

if (import.meta.main) {
	runMain(generateLastModified(process.cwd()))
}
