import type { PlatformError } from "effect/PlatformError"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Clock, Duration, Effect, FileSystem, HashSet, Path, Schema, Ref } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import sharp, { type Sharp } from "sharp"
import { generateImagePaths } from "@/scripts/generate-image-paths"
import {
	getCategoryFromRelativePath,
	getVariantWidths,
	shouldGenerateVariants,
	variantFileName,
} from "@/scripts/image-optimization-utils"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"

export class ImageOptimizationError extends Schema.TaggedErrorClass<ImageOptimizationError>()(
	"ImageOptimizationError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}

const MAX_EFFORT = 6
const MAX_QUALITY = 80
const DEFAULT_SOURCE_DIR = "./newassets"
const DEFAULT_COPY_DIR = "./oldassets"

const dirOption = Flag.directory("output-dir").pipe(
	Flag.withAlias("o"),
	Flag.withDescription("Output directory where optimized images will be stored. (required)"),
)

const sourceOption = Flag.directory("source-dir").pipe(
	Flag.withDefault(DEFAULT_SOURCE_DIR),
	Flag.withAlias("s"),
	Flag.withDescription(
		`Source directory containing images to optimize. (default: ${DEFAULT_SOURCE_DIR})`,
	),
)

const encodeBaseWebp = Effect.fnUntraced(function* (image: Sharp, asset: string) {
	return yield* Effect.tryPromise({
		try: () => image.rotate().webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to encode base image: ${asset}`,
				cause,
			}),
	})
})

const encodeVariantWebp = Effect.fnUntraced(function* (image: Sharp, width: number, asset: string) {
	return yield* Effect.tryPromise({
		try: () =>
			image
				.rotate()
				.resize({ width, withoutEnlargement: true })
				.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY })
				.toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to encode ${width}px variant: ${asset}`,
				cause,
			}),
	})
})

const collectImageFiles = Effect.fnUntraced(function* (sourceDir: string) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const results: string[] = []

	const walk = (
		current: string,
	): Effect.Effect<void, PlatformError, Path.Path | FileSystem.FileSystem> =>
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
							return
						}

						if (stat.type === "File") {
							const ext = path.extname(file).toLowerCase()
							if (HashSet.has(SUPPORTED_IMAGE_FORMATS, ext)) {
								const relative = path.relative(sourceDir, full).split(path.sep).join("/")
								results.push(relative)
							}
						}
					}),
				{ concurrency: "unbounded" },
			)
		})

	yield* walk(sourceDir)
	return results
})

const ensureDirectory = Effect.fnUntraced(function* (dir: string) {
	const fs = yield* FileSystem.FileSystem
	yield* Effect.filterOrElse(
		fs.exists(dir),
		exists => exists,
		() => fs.makeDirectory(dir, { recursive: true }),
	)
})

export type OptimizeCliOptions = {
	readonly dir: string
	readonly source: string
}

export const optimizeAssetsEffect = (args: OptimizeCliOptions) =>
	Effect.gen(function* () {
		const { dir: targetDir, source } = args
		const startTime = yield* Clock.currentTimeMillis
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const assets = yield* collectImageFiles(source)
		const numRef = yield* Ref.make(0)

		yield* ensureDirectory(targetDir)
		yield* ensureDirectory(DEFAULT_COPY_DIR)

		yield* Effect.forEach(
			assets,
			relativeAsset =>
				Effect.gen(function* () {
					const extension = path.extname(relativeAsset)
					const relativeDir = path.dirname(relativeAsset)
					const baseName = path.basename(relativeAsset, extension)
					const category = getCategoryFromRelativePath(relativeAsset)
					const sourcePath = path.join(source, relativeAsset)
					const outputDir = relativeDir === "." ? targetDir : path.join(targetDir, relativeDir)

					yield* ensureDirectory(outputDir)

					const imageBuffer = yield* fs.readFile(sourcePath)
					const image = sharp(imageBuffer)
					const metadata = yield* Effect.tryPromise({
						try: () => image.metadata(),
						catch: cause =>
							new ImageOptimizationError({
								message: `Failed to read image metadata: ${relativeAsset}`,
								cause,
							}),
					})

					if (metadata.width === undefined) {
						return yield* Effect.fail(
							new ImageOptimizationError({
								message: `Image has no width metadata: ${relativeAsset}`,
								cause: relativeAsset,
							}),
						)
					}

					yield* Effect.log(`Transforming image: ${relativeAsset}`)

					const baseBuffer = yield* encodeBaseWebp(image, relativeAsset)
					const baseFileName = `${baseName}.webp`
					yield* fs.writeFile(
						path.join(outputDir, baseFileName),
						new Uint8Array(baseBuffer as Buffer),
					)

					if (shouldGenerateVariants(category)) {
						const variantWidths = getVariantWidths(metadata.width)
						yield* Effect.forEach(
							variantWidths,
							width =>
								Effect.gen(function* () {
									const variantBuffer = yield* encodeVariantWebp(image, width, relativeAsset)
									yield* fs.writeFile(
										path.join(outputDir, variantFileName(baseName, width)),
										new Uint8Array(variantBuffer as Buffer),
									)
								}),
							{ concurrency: 1 },
						)
					}

					const copyDestDir =
						relativeDir === "." ? DEFAULT_COPY_DIR : path.join(DEFAULT_COPY_DIR, relativeDir)
					yield* ensureDirectory(copyDestDir)
					yield* fs.copyFile(sourcePath, path.join(copyDestDir, path.basename(relativeAsset)))
					yield* fs.remove(sourcePath)

					yield* Ref.update(numRef, n => n + 1)
					const currentAsset = yield* Ref.get(numRef)
					yield* Effect.log(
						`Transformed: ${relativeDir === "." ? baseFileName : `${relativeDir}/${baseFileName}`}; ${currentAsset}/${assets.length}`,
					)
				}).pipe(Effect.withLogSpan("transform_asset")),
			{ concurrency: 2 },
		)

		const writtenAmount = yield* Ref.get(numRef)
		const endTime = yield* Clock.currentTimeMillis.pipe(Effect.map(endTime => endTime - startTime))
		const totalTime = Duration.format(Duration.millis(endTime))
		yield* Effect.log(
			`Successfully optimized ${writtenAmount}/${assets.length} images in ${totalTime}!`,
		)
	}).pipe(Effect.withLogSpan("optimize_assets"))

export const optimizeCommand = Command.make(
	"optimize",
	{
		dir: dirOption,
		source: sourceOption,
	},
	(args: OptimizeCliOptions) =>
		optimizeAssetsEffect(args).pipe(
			Effect.flatMap(() =>
				Effect.gen(function* () {
					yield* Effect.log("Regenerating image paths and variant manifest...")
					yield* generateImagePaths(process.cwd())
				}),
			),
		),
)

if (import.meta.main) {
	Command.run(optimizeCommand, {
		version: "1.0.0",
	}).pipe(Effect.provide(BunServicesLayer), runMain)
}
