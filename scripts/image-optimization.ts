import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Clock, Duration, Effect, FileSystem, HashSet, Path, Schema, Ref } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import sharp from "sharp"
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

const mapOption = Flag.boolean("map").pipe(
	Flag.withAlias("m"),
	Flag.withDescription("Resize image to 2048px width with optimization."),
)

const noResizeOption = Flag.boolean("no-resize").pipe(
	Flag.withDescription(
		"Only optimize, do not resize (default for images ≤1920px or when resize is undesired).",
	),
)

const previewOption = Flag.boolean("preview").pipe(
	Flag.withAlias("p"),
	Flag.withDescription("Resize to 640x360 then optimize with max effort and quality."),
)

const iconOption = Flag.boolean("icon").pipe(
	Flag.withAlias("i"),
	Flag.withDescription(
		"Resize to 256w (maintains aspect ratio) then optimize with max effort and quality.",
	),
)

const transformMap = Effect.fnUntraced(function* (
	metadata: sharp.Metadata,
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	let resizeOption: sharp.ResizeOptions = { width: 2048, withoutEnlargement: true }
	if (metadata.width < 2048) {
		resizeOption = { width: 2048, height: 2048, fit: "contain" }
	}

	const buffer = yield* Effect.tryPromise({
		try: () =>
			image
				.rotate()
				.resize(resizeOption)
				.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY })
				.toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform map image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformPreview = Effect.fnUntraced(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () =>
			image
				.rotate()
				.resize(640, 360, { withoutEnlargement: true })
				.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY })
				.toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform preview image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformOptimizeOnly = Effect.fnUntraced(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () => image.rotate().webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform optimize only image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformResizeAndOptimize = Effect.fnUntraced(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () =>
			image
				.rotate()
				.resize({ width: 1920, withoutEnlargement: true })
				.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY })
				.toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform resize and optimize image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformIcon = Effect.fnUntraced(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () =>
			image
				.rotate()
				.resize({ width: 256, withoutEnlargement: true })
				.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY })
				.toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform icon image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

type TransformResult = Effect.Success<ReturnType<typeof transformMap>>

export type OptimizeCliOptions = {
	readonly dir: string
	readonly source: string
	readonly map: boolean
	readonly noResize: boolean
	readonly preview: boolean
	readonly icon: boolean
}

export const optimizeAssetsEffect = (args: OptimizeCliOptions) =>
	Effect.gen(function* () {
		const { dir: targetDir, source, map, noResize, preview, icon } = args
		const startTime = yield* Clock.currentTimeMillis
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const newAssets = yield* fs.readDirectory(source)
		const numRef = yield* Ref.make(0)

		yield* Effect.filterOrElse(
			fs.exists(targetDir),
			exists => exists,
			() => fs.makeDirectory(targetDir),
		)

		yield* Effect.filterOrElse(
			fs.exists(DEFAULT_COPY_DIR),
			exists => exists,
			() => fs.makeDirectory(DEFAULT_COPY_DIR),
		)

		yield* Effect.forEach(
			newAssets,
			asset =>
				Effect.gen(function* () {
					const extension = path.extname(asset)
					if (!HashSet.has(SUPPORTED_IMAGE_FORMATS, extension)) return

					const imagePath = path.join(source, asset)
					let fileName = path.basename(asset, extension)
					let imageBuffer = yield* fs.readFile(imagePath)

					if (extension !== ".webp" || imageBuffer.byteLength > 10_000) {
						yield* Effect.log("Reading metadata...")
						const image = sharp(imageBuffer)
						const metadata = yield* Effect.tryPromise({
							try: () => image.metadata(),
							catch: cause =>
								new ImageOptimizationError({
									message: `Failed to read image metadata: ${asset}`,
									cause,
								}),
						})

						yield* Effect.log(`Transforming image: ${asset}`)
						let result: TransformResult

						if (map) {
							result = yield* transformMap(metadata, image, fileName, asset)
						} else if (preview) {
							result = yield* transformPreview(image, fileName, asset)
						} else if (icon) {
							result = yield* transformIcon(image, fileName, asset)
						} else if (noResize || metadata.width <= 1920) {
							result = yield* transformOptimizeOnly(image, fileName, asset)
						} else {
							result = yield* transformResizeAndOptimize(image, fileName, asset)
						}

						imageBuffer = result.buffer
						fileName = result.fileName
					} else {
						fileName = asset
						yield* Effect.log(`Skipped transformation for ${fileName}`)
					}

					yield* Ref.update(numRef, n => n + 1)
					const currentAsset = yield* Ref.get(numRef)

					yield* fs.writeFile(path.join(targetDir, fileName), imageBuffer)
					yield* fs.copyFile(path.join(source, asset), path.join(DEFAULT_COPY_DIR, asset))
					yield* fs.remove(path.join(source, asset))
					yield* Effect.log(`Transformed: ${fileName}; ${currentAsset}/${newAssets.length}`)
				}).pipe(Effect.withLogSpan("transform_asset")),
			{ concurrency: 2 },
		)

		const writtenAmount = yield* Ref.get(numRef)
		const endTime = yield* Clock.currentTimeMillis.pipe(Effect.map(endTime => endTime - startTime))
		const totalTime = Duration.format(Duration.millis(endTime))
		yield* Effect.log(
			`Successfully optimized ${writtenAmount}/${newAssets.length} images in ${totalTime}!`,
		)
	}).pipe(Effect.withLogSpan("optimize_assets"))

export const optimizeCommand = Command.make(
	"optimize",
	{
		dir: dirOption,
		source: sourceOption,
		map: mapOption,
		noResize: noResizeOption,
		preview: previewOption,
		icon: iconOption,
	},
	(args: OptimizeCliOptions) => optimizeAssetsEffect(args),
)

if (import.meta.main) {
	Command.run(optimizeCommand, {
		version: "1.0.0",
	}).pipe(Effect.provide(BunServicesLayer), runMain)
}
