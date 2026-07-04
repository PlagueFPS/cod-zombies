import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Clock, Effect, FileSystem, HashSet, Path, Predicate, SynchronizedRef } from "effect"
import {
	isVariantImagePath,
	VARIANT_WIDTHS_LIST,
	variantWebPath,
	type VariantWidth,
} from "@/lib/image-variant-paths"
import { walkImageFiles } from "@/scripts/image-file-walk"
import { EXCLUDED_FROM_IMAGE_PATH_TYPES } from "@/scripts/image-variant-policy"
import { toPascalCase } from "@/utils/shared-functions"

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
				.filter(file => !HashSet.has(EXCLUDED_FROM_IMAGE_PATH_TYPES, file)),
		),
	)
})

function buildVariantWidthsMap(
	basePaths: readonly string[],
	existingPaths: ReadonlySet<string>,
): Record<string, readonly VariantWidth[]> {
	// Filesystem discovery: which variant widths exist on disk (not encode-time policy).
	const variantMap: Record<string, VariantWidth[]> = {}

	for (const basePath of basePaths) {
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

function isRootWebPath(webPath: string): boolean {
	return !webPath.slice(1).includes("/")
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

	const allWebPaths = yield* walkImageFiles(publicDir, {
		format: "web",
		includeVariants: true,
	})
	const existingPaths = new Set(allWebPaths)
	const basePaths = allWebPaths.filter(webPath => !isVariantImagePath(webPath))
	const rootWebPaths = basePaths.filter(isRootWebPath).sort()

	const topDirs = yield* listTopLevelDirs(publicDir)
	const totalImages = yield* SynchronizedRef.make(0)
	const perDir = yield* Effect.forEach(
		topDirs,
		dir =>
			Effect.gen(function* () {
				const prefix = `/${dir}/`
				const webPaths = basePaths.filter(webPath => webPath.startsWith(prefix)).sort()
				yield* SynchronizedRef.update(totalImages, n => n + webPaths.length)
				return {
					dir,
					typeName: `${toPascalCase(dir)}ImagePath`,
					imagePaths: webPaths,
				}
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(results => results.sort((a, b) => a.dir.localeCompare(b.dir))))

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
