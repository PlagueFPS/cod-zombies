import type { PlatformError } from "effect/PlatformError"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Clock, Effect, FileSystem, HashSet, Path, Predicate } from "effect"
import { toPascalCase } from "@/utils/shared-functions"

const CONTENT_EXTENSIONS = HashSet.make(".mdx")

const formatContentPath = Effect.fn("formatContentPath")(function* (
	contentDir: string,
	filePath: string,
) {
	const path = yield* Path.Path
	const relative = path.relative(contentDir, filePath)
	const withSlashes = relative.split(path.sep).join("/")
	const ext = path.extname(withSlashes).toLowerCase()
	const base = HashSet.has(CONTENT_EXTENSIONS, ext)
		? withSlashes.slice(0, -ext.length)
		: withSlashes
	return `content/${base}`
})

const listContentSubdirs = Effect.fn("listContentSubdirs")(function* (contentDir: string) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const files = yield* fs.readDirectory(contentDir)

	return yield* Effect.forEach(
		files,
		file =>
			Effect.gen(function* () {
				const filePath = path.join(contentDir, file)
				const stat = yield* fs.stat(filePath)
				if (stat.type === "Directory" && !file.startsWith(".")) return file
				return null
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(files => files.filter(Predicate.isNotNull)))
})

const collectContentFiles = Effect.fn("collectContentFiles")(function* (
	contentDir: string,
	dir: string,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const results: string[] = []

	const walk = (current: string): Effect.Effect<void, PlatformError, Path.Path> =>
		Effect.gen(function* () {
			const files = yield* fs.readDirectory(current)
			yield* Effect.forEach(
				files,
				file =>
					Effect.gen(function* () {
						if (file.startsWith(".")) return

						const full = path.join(current, file)
						const stat = yield* fs.stat(full)

						if (stat.type === "Directory") {
							yield* walk(full)
						} else if (stat.type === "File") {
							const ext = path.extname(file).toLowerCase()
							if (HashSet.has(CONTENT_EXTENSIONS, ext)) {
								const contentPath = yield* formatContentPath(contentDir, full)
								results.push(contentPath)
							}
						}
					}),
				{ concurrency: "unbounded" },
			)
		})

	yield* walk(dir)
	return results
})

function generateTypeForDir(typeName: string, contentPaths: string[]) {
	if (contentPaths.length === 0) {
		return `export type ${typeName} = never;\n`
	}
	const literals = contentPaths.map(p => `"${p.replace(/"/g, '\\"')}"`)
	return `export type ${typeName} =\n  ${literals.join(" |\n  ")};\n`
}

function headerComment(contentDir: string, duration: string | number) {
	const now = new Date().toISOString()
	return `/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:content:paths' to regenerate.
 *
 * content directory scanned: ${contentDir}
 * generated at: ${now}
 * generated in: ${duration}ms
 */\n\n`
}

const generateContentPaths = Effect.fn("generateContentPaths")(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const cwd = process.cwd()
	const contentDir = path.join(cwd, "content")
	const outFile = path.join(cwd, "types", "generated", "content-paths.gen.ts")

	const exists = yield* fs.exists(contentDir)
	if (!exists) return yield* Effect.fail(`Content directory does not exist: ${contentDir}`)

	const startTime = yield* Clock.currentTimeMillis

	const subdirs = yield* listContentSubdirs(contentDir)
	const perDir = yield* Effect.forEach(
		subdirs,
		dir =>
			Effect.gen(function* () {
				const fullDir = path.join(contentDir, dir)
				const paths = yield* collectContentFiles(contentDir, fullDir)
				const sortedPaths = paths.sort()
				return {
					dir,
					typeName: `${toPascalCase(dir)}Paths`,
					contentPaths: sortedPaths,
				}
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(results => results.sort((a, b) => a.dir.localeCompare(b.dir))))

	const durationMs = yield* Clock.currentTimeMillis.pipe(
		Effect.map(now => (now - startTime).toFixed(0)),
	)

	const lines: string[] = []
	lines.push(headerComment(path.relative(cwd, contentDir), durationMs))

	for (const item of perDir) {
		lines.push(`/** Union of content paths in \`content/${item.dir}\` */\n`)
		lines.push(generateTypeForDir(item.typeName, item.contentPaths))
	}

	const allTypeNames = perDir.map(g => g.typeName)
	lines.push(
		`/** Union of all generated content path types */\nexport type ContentPaths = ${allTypeNames.join(" | ")};\n`,
	)

	const generated = lines.join("\n")

	const outDir = path.dirname(outFile)
	const outDirExists = yield* fs.exists(outDir)
	if (!outDirExists) {
		yield* fs.makeDirectory(outDir, { recursive: true })
	}

	yield* fs.writeFileString(outFile, generated)
	yield* Effect.log(`Wrote generated types to: ${outFile}`)
	yield* Effect.log(
		`directories_scanned=${subdirs.length}, total_files=${perDir.reduce((acc, d) => acc + d.contentPaths.length, 0)}, duration=${durationMs}ms`,
	)
	yield* Effect.forEach(
		perDir,
		item =>
			Effect.log(
				`- content/${item.dir}: ${item.contentPaths.length} file(s) -> type ${item.typeName}`,
			),
		{ concurrency: "unbounded" },
	)
})

generateContentPaths().pipe(Effect.provide(BunServices.layer), BunRuntime.runMain)
