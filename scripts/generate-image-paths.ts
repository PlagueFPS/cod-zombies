import type { PlatformError } from "effect/PlatformError"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Clock, Effect, FileSystem, HashSet, Path, Predicate, SynchronizedRef } from "effect"
import {
	isVariantImagePath,
	VARIANT_WIDTHS_LIST,
	variantWebPath,
	type VariantWidth,
} from "@/scripts/image-optimization-utils"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"
import { toPascalCase } from "@/utils/shared-functions"

// Exclude these top-level directories entirely from ImagePaths
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
	options?: { includeVariants?: boolean },
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const includeVariants = options?.includeVariants ?? false
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
								const webPath = `/${relative}`
								if (!includeVariants && isVariantImagePath(webPath)) return
								results.push(webPath)
							}
						}
					}),
				{ concurrency: "unbounded" },
			)
		})

	yield* walk(dir)
	return results
})

const collectRootImages = Effect.fn("collectRootImages")(function* (
	publicDir: string,
	options?: { includeVariants?: boolean },
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const includeVariants = options?.includeVariants ?? false
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
					const webPath = `/${relative}`
					if (!includeVariants && isVariantImagePath(webPath)) return
					results.push(webPath)
				}
			}),
		{ concurrency: "unbounded" },
	)

	return results
})

function filterBaseImagePaths(imagePaths: string[]): string[] {
	return imagePaths.filter(path => !isVariantImagePath(path))
}

function buildVariantWidthsMap(
	allImagePaths: string[],
	existingPaths: ReadonlySet<string>,
): Record<string, readonly VariantWidth[]> {
	const variantMap: Record<string, VariantWidth[]> = {}

	for (const basePath of allImagePaths) {
		if (isVariantImagePath(basePath)) continue

		const widths: VariantWidth[] = []
		for (const width of VARIANT_WIDTHS_LIST) {
			if (existingPaths.has(variantWebPath(basePath, width))) {
				widths.push(width)
			}
		}

		if (widths.length > 0) {
			variantMap[basePath] = widths
		}
	}

	return variantMap
}

function generateTypeForDir(typeName: string, imagePaths: string[]) {
	if (imagePaths.length === 0) {
		return `export type ${typeName} = never;\n`
	}
	const literals = imagePaths.map(p => `'${p.replace(/'/g, "\\'")}'`)
	return `export type ${typeName} =\n  ${literals.join(" |\n  ")};\n`
}

function generateVariantWidthsObject(variantMap: Record<string, readonly VariantWidth[]>) {
	const entries = Object.entries(variantMap).sort(([a], [b]) => a.localeCompare(b))
	if (entries.length === 0) {
		return "export const VARIANT_WIDTHS = {} as const satisfies Record<string, readonly number[]>\n"
	}

	const lines = entries.map(([basePath, widths]) => {
		const widthList = widths.join(", ")
		return `  '${basePath.replace(/'/g, "\\'")}': [${widthList}],`
	})

	return `export const VARIANT_WIDTHS = {\n${lines.join("\n")}\n} as const satisfies Record<string, readonly number[]>\n`
}

/** @param cwd - Workspace root (must contain `public/` when run). */
export const generateImagePaths = Effect.fn("generateImagePaths")(function* (
	cwd: string = process.cwd(),
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const publicDir = path.join(cwd, "public")
	const outFile = path.join(cwd, "src/types", "generated", "image-paths.gen.ts")
	const variantsOutFile = path.join(cwd, "src/types", "generated", "image-variants.gen.ts")
	const exists = yield* fs.exists(publicDir)
	if (!exists) return yield* Effect.fail(`Public directory does not exist: ${publicDir}`)

	const startTime = yield* Clock.currentTimeMillis

	const rootImagesAbs = filterBaseImagePaths(yield* collectRootImages(publicDir))
	const rootWebPaths = rootImagesAbs.sort()

	const topDirs = yield* listTopLevelDirs(publicDir)
	const totalImages = yield* SynchronizedRef.make(0)
	const perDir = yield* Effect.forEach(
		topDirs,
		dir =>
			Effect.gen(function* () {
				const fullDir = path.join(publicDir, dir)
				const images = filterBaseImagePaths(yield* collectImageFiles(publicDir, fullDir))
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

	const allPublicImages = [
		...(yield* collectRootImages(publicDir, { includeVariants: true })),
		...(yield* Effect.forEach(
			yield* fs.readDirectory(publicDir),
			file =>
				Effect.gen(function* () {
					const filePath = path.join(publicDir, file)
					const stat = yield* fs.stat(filePath)
					if (stat.type !== "Directory") return [] as string[]
					return yield* collectImageFiles(publicDir, filePath, { includeVariants: true })
				}),
			{ concurrency: "unbounded" },
		).pipe(Effect.map(nested => nested.flat()))),
	]
	const existingPaths = new Set(allPublicImages)
	const basePaths = filterBaseImagePaths(allPublicImages)
	const variantMap = buildVariantWidthsMap(basePaths, existingPaths)

	const durationMs = yield* Clock.currentTimeMillis.pipe(
		Effect.map(now => (now - startTime).toFixed(0)),
	)

	const lines: string[] = []
	lines.push(`/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:image:paths' to regenerate.
 */\n`)
	lines.push("/** Union of images located directly in `/public (root)` */\n")
	lines.push(generateTypeForDir("RootImagePath", rootWebPaths))

	for (const item of perDir) {
		lines.push(`/** Union of images in \`/${item.dir}\` */\n`)
		lines.push(generateTypeForDir(item.typeName, item.imagePaths))
	}

	const allTypeNames = ["RootImagePath", ...perDir.map(g => g.typeName)]
	lines.push(
		`/** Union of all generated image path types */\nexport type ImagePaths = ${allTypeNames.join(" | ")};\n`,
	)

	const generated = lines.join("\n")

	const variantLines: string[] = []
	variantLines.push(`/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:image:paths' to regenerate.
 */\n`)
	variantLines.push(
		"/** Base path -> available pre-generated widths, sorted ascending. Absent key = no variants (use base src only). */\n",
	)
	variantLines.push(generateVariantWidthsObject(variantMap))

	const outDir = path.dirname(outFile)
	const outDirExists = yield* fs.exists(outDir)
	if (!outDirExists) {
		yield* fs.makeDirectory(outDir, { recursive: true })
	}

	yield* fs.writeFileString(outFile, generated)
	yield* fs.writeFileString(variantsOutFile, variantLines.join("\n"))
	yield* Effect.log(`Wrote generated types to: ${outFile}`)
	yield* Effect.log(`Wrote variant manifest to: ${variantsOutFile}`)
	yield* Effect.log(
		`directories_scanned=${topDirs.length}, total_images=${yield* SynchronizedRef.get(totalImages)}, variant_entries=${Object.keys(variantMap).length}, duration=${durationMs}ms`,
	)
	yield* Effect.forEach(
		perDir,
		item =>
			Effect.log(`- /${item.dir}: ${item.imagePaths.length} image(s) -> type ${item.typeName}`),
		{ concurrency: "unbounded" },
	)

	yield* Effect.log(`- / (root): ${rootWebPaths.length} image(s) -> type RootImagePath`)
})

if (import.meta.main) {
	generateImagePaths(process.cwd()).pipe(Effect.provide(BunServicesLayer), runMain)
}
