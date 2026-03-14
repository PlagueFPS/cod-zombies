import { Command, Options, Span } from "@effect/cli"
import { FileSystem, Path } from "@effect/platform"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Clock, Duration, Effect, Ref, Schema } from "effect"
import sharp from "sharp"

class ImageOptimizationError extends Schema.TaggedError<ImageOptimizationError>(
	"ImageOptimizationError",
)("ImageOptimizationError", {
	message: Schema.String,
	cause: Schema.Unknown,
}) {}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"]
const MAX_EFFORT = 6
const MAX_QUALITY = 100
const DEFAULT_SOURCE_DIR = "./newassets"
const DEFAULT_COPY_DIR = "./oldassets"

const isImageFile = (ext: string) => IMAGE_EXTS.includes(ext)

const dirOption = Options.directory("dir").pipe(
	Options.withDescription("Output directory where optimized images will be stored (required)"),
)

const sourceOption = Options.directory("source").pipe(
	Options.withDefault(DEFAULT_SOURCE_DIR),
	Options.withDescription("Source directory containing images to optimize"),
)

const mapOption = Options.boolean("map").pipe(
	Options.withDescription(
		"Resize image to 2048px width without optimization (keeps original format)",
	),
)

const noResizeOption = Options.boolean("noResize").pipe(
	Options.withDescription(
		"Only optimize, do not resize (for images ≤1920px or when resize is undesired)",
	),
)

const previewOption = Options.boolean("preview").pipe(
	Options.withDescription("Resize to 640x360 then optimize with max effort and quality"),
)

const transformMap = Effect.fn("transformMap")(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () =>
			image.resize({ width: 2048 }).webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform map image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformPreview = Effect.fn("transformPreview")(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () => image.resize(640, 360).webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform preview image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformOptimizeOnly = Effect.fn("transformOptimizeOnly")(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () => image.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform optimize only image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

const transformResizeAndOptimize = Effect.fn("transformResizeAndOptimize")(function* (
	image: sharp.Sharp,
	baseFileName: string,
	asset: string,
) {
	const buffer = yield* Effect.tryPromise({
		try: () =>
			image.resize({ width: 1920 }).webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer(),
		catch: cause =>
			new ImageOptimizationError({
				message: `Failed to transform resize and optimize image: ${asset}`,
				cause,
			}),
	})
	return { buffer, fileName: `${baseFileName}.webp` }
})

type TransformResult = Effect.Effect.Success<ReturnType<typeof transformMap>>

const optimizeCommand = Command.make(
	"optimize",
	{
		dir: dirOption,
		source: sourceOption,
		map: mapOption,
		noResize: noResizeOption,
		preview: previewOption,
	},
	({ dir: targetDir, source, map, noResize, preview }) =>
		Effect.gen(function* () {
			const startTime = yield* Clock.currentTimeMillis
			const fs = yield* FileSystem.FileSystem
			const path = yield* Path.Path
			const newAssets = yield* fs.readDirectory(source)
			const numRef = yield* Ref.make(0)

			const targetExists = yield* fs.exists(targetDir)
			if (!targetExists) yield* fs.makeDirectory(targetDir)

			const copyDirExists = yield* fs.exists(DEFAULT_COPY_DIR)
			if (!copyDirExists) yield* fs.makeDirectory(DEFAULT_COPY_DIR)

			yield* Effect.forEach(
				newAssets,
				asset =>
					Effect.gen(function* () {
						const extension = path.extname(asset)
						if (!isImageFile(extension)) return

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
								result = yield* transformMap(image, fileName, asset)
							} else if (preview) {
								result = yield* transformPreview(image, fileName, asset)
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
						yield* fs.copyFile(
							path.join(source, asset),
							path.join(DEFAULT_COPY_DIR, asset),
						)
						yield* fs.remove(path.join(source, asset))
						yield* Effect.log(`Transformed: ${fileName}; ${currentAsset}/${newAssets.length}`)
					}).pipe(Effect.withLogSpan("transform_asset")),
				{ concurrency: 2 },
			)

			const writtenAmount = yield* Ref.get(numRef)
			const endTime = yield* Clock.currentTimeMillis.pipe(
				Effect.map(endTime => endTime - startTime),
			)
			const totalTime =
				endTime > Duration.toMillis("1 minute")
					? `${Duration.toMinutes(endTime).toFixed(2)}m`
					: `${Duration.toSeconds(endTime).toFixed(2)}s`
			yield* Effect.log(
				`Successfully optimized ${writtenAmount}/${newAssets.length} images in ${totalTime}!`,
			)
		}).pipe(Effect.withLogSpan("optimize_assets")),
)

const cli = Command.run(optimizeCommand, {
	name: "Image Optimization CLI",
	version: "1.0.0",
	summary: Span.text("Optimize images with configurable resize and webp conversion"),
})

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain)
