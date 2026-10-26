import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import {
	Clock,
	Effect,
	FileSystem,
	HashSet,
	Path,
	Predicate,
	Schema,
	SynchronizedRef,
	Array as Arr,
	String as Str,
	Record as Rec,
} from "effect"
import sharp from "sharp"
import {
	isVariantImagePath,
	VARIANT_WIDTHS_LIST,
	variantWebPath,
	type ImageVariantMetadata,
} from "@/lib/image-variant-paths"
import { walkImageFiles } from "@/scripts/image-file-walk"
import { EXCLUDED_FROM_IMAGE_PATH_TYPES } from "@/scripts/image-variant-policy"
import { toPascalCase } from "@/utils/shared-functions"

export class ImageMetadataError extends Schema.TaggedError<
	ImageMetadataError,
	{ readonly brand: unique symbol }
>()("ImageMetadataError", {
	message: Schema.String,
	cause: Schema.Defect(),
}) {}

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
			Arr.flatMap(files, file =>
				Predicate.isNotNull(file) && !HashSet.has(EXCLUDED_FROM_IMAGE_PATH_TYPES, file)
					? [file]
					: [],
			),
		),
	)
})

const buildImageVariants = Effect.fnUntraced(function* (
	basePaths: readonly string[],
	existingPaths: ReadonlySet<string>,
	publicDir: string,
) {
	const path = yield* Path.Path

	const entries = yield* Effect.forEach(
		basePaths,
		basePath =>
			Effect.gen(function* () {
				const widths = Arr.filter(VARIANT_WIDTHS_LIST, width =>
					existingPaths.has(variantWebPath(basePath, width)),
				)

				if (widths.length === 0) return null

				const metadata = yield* Effect.tryPromise({
					try: () => sharp(path.join(publicDir, Str.slice(1)(basePath))).metadata(),
					catch: cause =>
						ImageMetadataError.make({
							message: `Failed to read base image dimensions: ${basePath}`,
							cause,
						}),
				})

				return [basePath, { sourceWidth: metadata.autoOrient.width, widths }] satisfies [
					string,
					ImageVariantMetadata,
				]
			}),
		{ concurrency: 16 },
	)

	return Rec.fromEntries(Arr.filter(entries, Predicate.isNotNull))
})

function generateTypeForDir(typeName: string, imagePaths: string[]) {
	if (imagePaths.length === 0) {
		return `export type ${typeName} = never;\n`
	}

	const literals = Arr.map(imagePaths, p => `'${Str.replace(/'/g, "\\'")(p)}'`)

	return `export type ${typeName} =\n  ${Arr.join(literals, " |\n  ")};\n`
}

function generateImageVariantsObject(variantMap: Record<string, ImageVariantMetadata>) {
	const entries = Rec.toEntries(variantMap).sort(([a], [b]) => Str.localeCompare(b)(a))

	if (entries.length === 0) {
		return "export const IMAGE_VARIANTS = {} as const satisfies Record<string, ImageVariantMetadata>\n"
	}

	const lines = Arr.map(entries, ([basePath, { sourceWidth, widths }]) => {
		const widthList = Arr.join(Arr.map(widths, String), ", ")

		return `  '${Str.replace(/'/g, "\\'")(basePath)}': { sourceWidth: ${sourceWidth}, widths: [${widthList}] },`
	})

	return `export const IMAGE_VARIANTS = {\n${Arr.join(lines, "\n")}\n} as const satisfies Record<string, ImageVariantMetadata>\n`
}

function isRootWebPath(webPath: string): boolean {
	return !Str.includes("/")(Str.slice(1)(webPath))
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
	const basePaths = Arr.filter(allWebPaths, webPath => !isVariantImagePath(webPath))
	const rootWebPaths = Arr.filter(basePaths, isRootWebPath).sort()

	const topDirs = yield* listTopLevelDirs(publicDir)
	const totalImages = yield* SynchronizedRef.make(0)

	const perDir = yield* Effect.forEach(
		topDirs,
		dir =>
			Effect.gen(function* () {
				const prefix = `/${dir}/`
				const webPaths = Arr.filter(basePaths, webPath => Str.startsWith(prefix)(webPath)).sort()
				yield* SynchronizedRef.update(totalImages, n => n + webPaths.length)

				return {
					dir,
					typeName: `${toPascalCase(dir)}ImagePath`,
					imagePaths: webPaths,
				}
			}),
		{ concurrency: "unbounded" },
	).pipe(Effect.map(results => results.sort((a, b) => Str.localeCompare(b.dir)(a.dir))))

	const variantMap = yield* buildImageVariants(basePaths, existingPaths, publicDir)

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

	const allTypeNames = ["RootImagePath", ...Arr.map(perDir, g => g.typeName)]
	lines.push(
		`/** Union of all generated image path types */\nexport type ImagePaths = ${Arr.join(allTypeNames, " | ")};\n`,
	)

	const generated = Arr.join(lines, "\n")

	const variantLines: string[] = []
	variantLines.push(`/**
 * THIS FILE IS AUTO-GENERATED.
 * Run 'generate:image:paths' to regenerate.
 */\n`)
	variantLines.push("import type { ImageVariantMetadata } from '@/lib/image-variant-paths'\n")
	variantLines.push(
		"/** Base image widths and available variants. Absent key = no variants (use base src only). */\n",
	)
	variantLines.push(generateImageVariantsObject(variantMap))

	const outDir = path.dirname(outFile)
	const outDirExists = yield* fs.exists(outDir)

	if (!outDirExists) {
		yield* fs.makeDirectory(outDir, { recursive: true })
	}

	yield* fs.writeFileString(outFile, generated)
	yield* fs.writeFileString(variantsOutFile, Arr.join(variantLines, "\n"))
	yield* Effect.log(`Wrote generated types to: ${outFile}`)
	yield* Effect.log(`Wrote variant manifest to: ${variantsOutFile}`)
	yield* Effect.log(
		`directories_scanned=${topDirs.length}, total_images=${yield* SynchronizedRef.get(totalImages)}, variant_entries=${Rec.keys(variantMap).length}, duration=${durationMs}ms`,
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
