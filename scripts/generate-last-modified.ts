import type { CommonErrorProps } from "@/types/errors"
import { execSync } from "node:child_process"
import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Data, Effect, Layer } from "effect"
import { DATE_OPTIONS } from "@/utils/constants"

class DuplicateFilenameError extends Data.TaggedError("DuplicateFilenameError")<CommonErrorProps> {}

interface FileMetadata {
	lastModified: string
	lastModifiedFormatted: string
	commitHash?: string
}

interface LastModifiedData {
	version: string
	generated: string
	files: Record<string, FileMetadata>
}

const parseGitBatchOutput = (output: string, allFiles: string[], repoRoot: string) => {
	const lines = output.trim().split("\n")
	const result: Record<string, FileMetadata> = {}
	const currentDate = new Date()
	const gitHistory = new Set<string>()

	// Create a map of normalized paths relative to content dir
	const filePathMap = new Map<string, string>()
	for (const filePath of allFiles) {
		const normalizedPath = filePath.replace(/\\/g, "/")
		const repoRootNormalized = repoRoot.replace(/\\/g, "/")
		const relativePath = normalizedPath.replace(`${repoRootNormalized}/content/`, "")
		filePathMap.set(relativePath, relativePath)
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

					if (filePathMap.has(newPath) && !gitHistory.has(newPath)) {
						const timestamp = new Date(parseInt(currentTimestamp, 10) * 1000)
						result[newPath] = {
							lastModified: timestamp.toISOString(),
							lastModifiedFormatted: timestamp.toLocaleDateString(undefined, DATE_OPTIONS),
							...(currentCommit && { commitHash: currentCommit }),
						}
						gitHistory.add(newPath)
					}
				}
			} else if (line.startsWith("A\t") || line.startsWith("M\t")) {
				// Added or Modified: "A\tcontent/file.mdx" or "M\tcontent/file.mdx"
				const gitPath = line.substring(2).trim().replace(/\\/g, "/")
				const relativePath = gitPath.replace("content/", "")

				if (filePathMap.has(relativePath) && !gitHistory.has(relativePath)) {
					const timestamp = new Date(parseInt(currentTimestamp, 10) * 1000)
					result[relativePath] = {
						lastModified: timestamp.toISOString(),
						lastModifiedFormatted: timestamp.toLocaleDateString(undefined, DATE_OPTIONS),
						...(currentCommit && { commitHash: currentCommit }),
					}
					gitHistory.add(relativePath)
				}
			}
		}
	}

	// For files not found in git, use current date
	for (const [relativePath] of filePathMap) {
		if (!gitHistory.has(relativePath)) {
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
		const pathCountMap = new Map<string, number>()
		const subDirs = yield* fs.readDirectory(dir)

		for (const subDir of subDirs) {
			const subDirPath = path.join(dir, subDir)
			const subFiles = yield* fs.readDirectory(subDirPath)
			const mdxFiles = subFiles.filter(file => file.endsWith(".mdx"))

			for (const file of mdxFiles) {
				const fullPath = path.join(process.cwd(), `./content/${subDir}/${file}`)
				files.push(fullPath)

				// Track relative paths to detect duplicates
				const relativePath = `${subDir}/${file}`
				const count = pathCountMap.get(relativePath) || 0
				pathCountMap.set(relativePath, count + 1)
			}
		}

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
	const buffer = Buffer.from(JSON.stringify(lastModifiedData, null, 2))
	yield* fs.writeFile(outputPath, buffer)
	yield* Effect.log(`Data written to: ${outputPath}`)
}).pipe(
	Effect.withLogSpan("generate_last_modified"),
	Effect.provide(Layer.merge(BunFileSystem.layer, Path.layer)),
)

BunRuntime.runMain(generateLastModified)
