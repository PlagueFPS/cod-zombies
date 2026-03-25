import type { PlatformError } from "effect/PlatformError"
import { NodeRuntime, NodeServices } from "@effect/platform-node"
import { Clock, Effect, FileSystem, HashSet, Path, Predicate, SynchronizedRef } from "effect"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"
import { toPascalCase } from "@/utils/shared-functions"

// Exclude these top-level directories entirely
const EXCLUDED_DIRS = HashSet.make("content", "opengraph-images")

const formatPath = Effect.fn("formatPath")(function* (dir: string, file: string) {
	const path = yield* Path.Path
	return path.relative(dir, file).split(path.sep).join("/")
})

const listTopLevelDirs = Effect.fn("listTopLevelDirsEffect")(function* (publicDir: string) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const files = yield* fs.readDirectory(publicDir)

	return yield* Effect.forEach(
		files,
		file =>
			Effect.gen(function* () {
				const filePath = path.join(publicDir, file)
				const stat = yield* fs.stat(filePath)
				if (stat.type === "Directory") return file
				return null
			}),
		{ concurrency: "unbounded" },
	).pipe(
		Effect.map(files =>
			files
				.filter(file => Predicate.isNotNull(file))
				.filter(file => !HashSet.has(EXCLUDED_DIRS, file)),
		),
	)
})

const collectImageFiles = Effect.fn("collectImageFiles")(function* (
	publicDir: string,
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

						if (stat.type === "Directory") yield* walk(full)
						else if (stat.type === "File") {
							const ext = path.extname(file).toLowerCase()
							if (HashSet.has(SUPPORTED_IMAGE_FORMATS, ext)) {
								const relative = yield* formatPath(publicDir, full)
								results.push(`/${relative}`)
							}
						}
					}),
				{ concurrency: "unbounded" },
			)
		})

	yield* walk(dir)
	return results
})

const collectRootImages = Effect.fn("collectRootImages")(function* (publicDir: string) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const files = yield* fs.readDirectory(publicDir)
	const results: string[] = []

	yield* Effect.forEach(
		files,
		file =>
			Effect.gen(function* () {
				const filePath = path.join(publicDir, file)
				const stat = yield* fs.stat(filePath)
				if (stat.type !== "File") return
				if (file.startsWith(".")) return

				const ext = path.extname(file).toLowerCase()
				if (HashSet.has(SUPPORTED_IMAGE_FORMATS, ext)) {
					const relative = yield* formatPath(publicDir, filePath)
					results.push(`/${relative}`)
				}
			}),
		{ concurrency: "unbounded" },
	)

	return results
})

function generateTypeForDir(typeName: string, imagePaths: string[]) {
	if (imagePaths.length === 0) {
		return `export type ${typeName} = never;\n`
	}
	const literals = imagePaths.map(p => `'${p.replace(/'/g, "\\'")}'`)
	return `export type ${typeName} =\n  ${literals.join(" |\n  ")};\n`
}

function headerComment(publicDir: string, duration: string | number) {
	const now = new Date().toISOString()
	return `/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:image:paths' to regenerate.
 *
 * public directory scanned: ${publicDir}
 * generated at: ${now}
 * generated in: ${duration}ms
 */\n\n`
}

export const generateImagePaths = Effect.fn("generateImagePaths")(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const cwd = process.cwd()
	const publicDir = path.join(cwd, "public")
	const outFile = path.join(cwd, "types", "generated", "image-paths.gen.ts")
	const exists = yield* fs.exists(publicDir)
	if (!exists) return yield* Effect.fail(`Public directory does not exist: ${publicDir}`)

	const startTime = yield* Clock.currentTimeMillis

	const rootImagesAbs = yield* collectRootImages(publicDir)
	const rootWebPaths = rootImagesAbs.sort()

	const topDirs = yield* listTopLevelDirs(publicDir)
	const totalImages = yield* SynchronizedRef.make(0)
	const perDir = yield* Effect.forEach(
		topDirs,
		dir =>
			Effect.gen(function* () {
				const fullDir = path.join(publicDir, dir)
				const images = yield* collectImageFiles(publicDir, fullDir)
				const webPaths = images.sort()
				yield* SynchronizedRef.update(totalImages, n => n + webPaths.length)
				return {
					dir,
					typeName: `${toPascalCase(dir)}ImagePath`,
					imagePaths: webPaths,
				}
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(results => results.sort((a, b) => a.dir.localeCompare(b.dir))))

	const durationMs = yield* Clock.currentTimeMillis.pipe(
		Effect.map(now => (now - startTime).toFixed(0)),
	)

	const lines: string[] = []
	lines.push(headerComment(path.relative(cwd, publicDir), durationMs))
	// root images type
	lines.push("/** Union of images located directly in `/public (root)` */\n")
	lines.push(generateTypeForDir("RootImagePath", rootWebPaths))

	// per-directory types
	for (const item of perDir) {
		lines.push(`/** Union of images in \`/${item.dir}\` */\n`)
		lines.push(generateTypeForDir(item.typeName, item.imagePaths))
	}

	// ImagePaths union - union of all types (RootImagePath and all per-dir types)
	const allTypeNames = ["RootImagePath", ...perDir.map(g => g.typeName)]
	lines.push(
		`/** Union of all generated image path types */\nexport type ImagePaths = ${allTypeNames.join(" | ")};\n`,
	)

	const generated = lines.join("\n")

	// write to outFile
	const outDir = path.dirname(outFile)
	const outDirExists = yield* fs.exists(outDir)
	if (!outDirExists) {
		yield* fs.makeDirectory(outDir, { recursive: true })
	}

	yield* fs.writeFileString(outFile, generated)
	yield* Effect.log(`Wrote generated types to: ${outFile}`)
	yield* Effect.log(
		`directories_scanned=${topDirs.length}, total_images=${yield* SynchronizedRef.get(totalImages)}, duration=${durationMs}ms`,
	)
	yield* Effect.forEach(
		perDir,
		item =>
			Effect.log(`- /${item.dir}: ${item.imagePaths.length} image(s) -> type ${item.typeName}`),
		{ concurrency: "unbounded" },
	)

	yield* Effect.log(`- / (root): ${rootWebPaths.length} image(s) -> type RootImagePath`)
})

export const runGenerateImagePathsProgram = generateImagePaths().pipe(
	Effect.provide(NodeServices.layer),
)

if (import.meta.main) {
	NodeRuntime.runMain(runGenerateImagePathsProgram)
}
