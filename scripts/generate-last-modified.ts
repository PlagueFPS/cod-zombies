import { execSync } from "node:child_process"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Effect, FileSystem, MutableHashMap, MutableHashSet, Option, Path, Schema } from "effect"
import { DATE_OPTIONS } from "@/utils/constants"
import { encodeLastModifiedData, type FileMetadata, type LastModifiedData } from "@/utils/validation-schemas"

class DuplicateFilenameError extends Schema.TaggedErrorClass<DuplicateFilenameError>()(
	"DuplicateFilenameError",
	{
		message: Schema.String,
	},
) {}

const parseGitBatchOutput = (output: string, allFiles: string[], repoRoot: string) => {
	const lines = output.trim().split("\n")
	const currentDate = new Date()
	const result: Record<string, FileMetadata> = {}
	const gitHistory = MutableHashSet.empty<string>()

	// Create a map of normalized paths relative to content dir
	const filePaths = MutableHashSet.empty<string>()
	for (const filePath of allFiles) {
		const normalizedPath = filePath.replace(/\\/g, "/")
		const repoRootNormalized = repoRoot.replace(/\\/g, "/")
		const relativePath = normalizedPath.replace(`${repoRootNormalized}/content/`, "")
		MutableHashSet.add(filePaths, relativePath)
	}

	let currentTimestamp: string | null = null
	let currentCommit: string | null = null

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (!line) continue

		if (line.match(/^\d+$/)) {
			currentTimestamp = line
		} else if (line.match(/^[a-f0-9]{40}$/)) {
			currentCommit = line.substring(0, 7)
		} else if (line.trim() && currentTimestamp) {
			// Handle status lines: "A\tfile", "M\tfile", or "R100\told\tnew"
			if (line.startsWith("R")) {
				// Rename: "R100\tcontent/old.mdx\tcontent/new.mdx"
				const parts = line.split("\t")
				if (parts.length === 3 && parts[2]) {
					const newPath = parts[2].replace(/\\/g, "/").replace("content/", "")

					if (MutableHashSet.has(filePaths, newPath) && !MutableHashSet.has(gitHistory, newPath)) {
						const timestamp = new Date(parseInt(currentTimestamp, 10) * 1000)
						MutableHashSet.add(gitHistory, newPath)
						result[newPath] = {
							lastModified: timestamp.toISOString(),
							lastModifiedFormatted: timestamp.toLocaleDateString(undefined, DATE_OPTIONS),
							...(currentCommit && { commitHash: currentCommit }),
						}
					}
				}
			} else if (line.startsWith("A\t") || line.startsWith("M\t")) {
				// Added or Modified: "A\tcontent/file.mdx" or "M\tcontent/file.mdx"
				const gitPath = line.substring(2).trim().replace(/\\/g, "/")
				const relativePath = gitPath.replace("content/", "")

				if (
					MutableHashSet.has(filePaths, relativePath) &&
					!MutableHashSet.has(gitHistory, relativePath)
				) {
					const timestamp = new Date(parseInt(currentTimestamp, 10) * 1000)
					MutableHashSet.add(gitHistory, relativePath)
					result[relativePath] = {
						lastModified: timestamp.toISOString(),
						lastModifiedFormatted: timestamp.toLocaleDateString(undefined, DATE_OPTIONS),
						...(currentCommit && { commitHash: currentCommit }),
					}
				}
			}
		}
	}

	// For files not found in git, use current date
	for (const relativePath of filePaths) {
		if (!MutableHashSet.has(gitHistory, relativePath)) {
			result[relativePath] = {
				lastModified: currentDate.toISOString(),
				lastModifiedFormatted: currentDate.toLocaleDateString(undefined, DATE_OPTIONS),
			}
		}
	}

	return result
}

const getAllContentFiles = (dir: string) =>
	Effect.gen(function* () {
		const path = yield* Path.Path
		const fs = yield* FileSystem.FileSystem
		const files: string[] = []
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
						const fullPath = path.join(process.cwd(), `./content/${subDir}/${file}`)
						files.push(fullPath)

						// Track relative paths to detect duplicates
						const relativePath = `${subDir}/${file}`
						const count = MutableHashMap.get(pathCountMap, relativePath).pipe(
							Option.getOrElse(() => 0),
						)
						MutableHashMap.set(pathCountMap, relativePath, count + 1)
					}
				}),
			{ concurrency: "unbounded" },
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

const generateLastModified = Effect.gen(function* () {
	const path = yield* Path.Path
	const fs = yield* FileSystem.FileSystem
	const contentDir = path.join(process.cwd(), "content")
	const outputPath = path.join(process.cwd(), `data/last-modified.json`)

	const allFiles = yield* getAllContentFiles(contentDir)

	const gitOutput = yield* Effect.try({
		try: () => {
			// Use --name-status to show renames (R lines), --diff-filter=AMR for added/modified/renamed
			const result = execSync(
				`git log --all --name-status --format="%ct%n%H" --diff-filter=AMR -- "${contentDir}"`,
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

	const fileMetadata = parseGitBatchOutput(gitOutput, allFiles, process.cwd())

	const lastModifiedData: LastModifiedData = {
		version: "1.0",
		generated: new Date().toISOString(),
		files: fileMetadata,
	}

	yield* Effect.log(`Generated last modified dates for ${Object.keys(fileMetadata).length} files`)
	const encodedData = yield* encodeLastModifiedData(lastModifiedData)
	yield* fs.writeFileString(outputPath, encodedData)
	yield* Effect.log(`Data written to: ${outputPath}`)
}).pipe(Effect.withLogSpan("generate_last_modified"), Effect.provide(BunServices.layer))

BunRuntime.runMain(generateLastModified)
