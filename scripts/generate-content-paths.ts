import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import {
	Clock,
	Effect,
	FileSystem,
	HashSet,
	Path,
	Predicate,
	Array as Arr,
	String as Str,
} from "effect"
import { toPascalCase } from "@/utils/shared-functions"
import { nowDate } from "@/utils/system-time"

const CONTENT_EXTENSIONS = HashSet.make(".mdx")

const formatContentPath = Effect.fn("formatContentPath")(function* (
	contentDir: string,
	filePath: string,
) {
	const path = yield* Path.Path
	const relative = path.relative(contentDir, filePath)
	const withSlashes = Arr.join(Str.split(relative, path.sep), "/")
	const ext = Str.toLowerCase(path.extname(withSlashes))

	const base = HashSet.has(CONTENT_EXTENSIONS, ext)
		? Str.slice(0, -ext.length)(withSlashes)
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

				if (stat.type === "Directory" && !Str.startsWith(".")(file)) return file

				return null
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(files => Arr.filter(files, Predicate.isNotNull)))
})

const collectContentFiles = Effect.fn("collectContentFiles")(function* (
	contentDir: string,
	dir: string,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const matches = yield* fs.glob("**/*.[mM][dD][xX]", { root: dir })

	const files = yield* Effect.filter(matches, file =>
		fs.stat(path.join(dir, file)).pipe(Effect.map(stat => stat.type === "File")),
	)

	return yield* Effect.forEach(files, file => formatContentPath(contentDir, path.join(dir, file)))
})

function generateTypeForDir(typeName: string, contentPaths: string[]) {
	if (contentPaths.length === 0) {
		return `export type ${typeName} = never;\n`
	}

	const literals = Arr.map(contentPaths, p => `"${Str.replace(/"/g, '\\"')(p)}"`)

	return `export type ${typeName} =\n  ${Arr.join(literals, " |\n  ")};\n`
}

function headerComment(contentDir: string, duration: string | number) {
	const now = nowDate().toISOString()

	return `/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:content:paths' to regenerate.
 *
 * content directory scanned: ${contentDir}
 * generated at: ${now}
 * generated in: ${duration}ms
 */\n\n`
}

/** @param cwd - Workspace root (must contain `content/` when run). */
export const generateContentPaths = Effect.fn("generateContentPaths")(function* (
	cwd: string = process.cwd(),
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const contentDir = path.join(cwd, "src/content")
	const outFile = path.join(cwd, "src/types", "generated", "content-paths.gen.ts")

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
	).pipe(Effect.map(results => results.sort((a, b) => Str.localeCompare(b.dir)(a.dir))))

	const durationMs = yield* Clock.currentTimeMillis.pipe(
		Effect.map(now => (now - startTime).toFixed(0)),
	)

	const lines: string[] = []
	lines.push(headerComment(path.relative(cwd, contentDir), durationMs))

	for (const item of perDir) {
		lines.push(`/** Union of content paths in \`content/${item.dir}\` */\n`)
		lines.push(generateTypeForDir(item.typeName, item.contentPaths))
	}

	const allTypeNames = Arr.map(perDir, g => g.typeName)
	lines.push(
		`/** Union of all generated content path types */\nexport type ContentPaths = ${Arr.join(allTypeNames, " | ")};\n`,
	)

	const generated = Arr.join(lines, "\n")

	const outDir = path.dirname(outFile)
	const outDirExists = yield* fs.exists(outDir)

	if (!outDirExists) {
		yield* fs.makeDirectory(outDir, { recursive: true })
	}

	yield* fs.writeFileString(outFile, generated)
	yield* Effect.log(`Wrote generated types to: ${outFile}`)
	yield* Effect.log(
		`directories_scanned=${subdirs.length}, total_files=${Arr.reduce(perDir, 0, (acc, d) => acc + d.contentPaths.length)}, duration=${durationMs}ms`,
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

if (import.meta.main) {
	generateContentPaths(process.cwd()).pipe(Effect.provide(BunServicesLayer), runMain)
}
