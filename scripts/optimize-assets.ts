import { parseArgs } from "node:util"
import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Duration, Effect, Layer, Ref } from "effect"
import sharp from "sharp"

// Change this to the path where the new images you want to add are located
const NEW_ASSETS_DIR = "./newassets"
// Change this to the target path where the optimized images should end up
const TARGET_DIR = "./public/gobblegums"

Effect.gen(function* () {
	const startTime = performance.now()
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const newAssets = yield* fs.readDirectory(NEW_ASSETS_DIR)
	const numRef = yield* Ref.make(0)
	const {
		values: { noResize },
	} = parseArgs({
		args: Bun.argv,
		options: {
			noResize: {
				type: "boolean",
			},
		},
		strict: true,
		allowPositionals: true,
	})

	const exists = yield* fs.exists(TARGET_DIR)
	if (!exists) yield* fs.makeDirectory(TARGET_DIR)

	yield* Effect.forEach(
		newAssets,
		asset =>
			Effect.gen(function* () {
				const extension = path.extname(asset)
				const imagePath = path.join(NEW_ASSETS_DIR, asset)
				let fileName = path.basename(asset, extension)
				let imageBuffer = yield* fs.readFile(imagePath)

				// Only run optimization on images > 10KB or if the image is not an optimized format (.webp)
				if (extension !== ".webp" || imageBuffer.byteLength > 10_000) {
					yield* Effect.log("Reading metadata...")
					const image = sharp(imageBuffer)
					const metadata = yield* Effect.tryPromise({
						try: () => image.metadata(),
						catch: error => new Error(`Failed to read image metadata: ${asset}`, { cause: error }),
					})

					yield* Effect.log(`Transforming image: ${asset}`)
					imageBuffer = yield* Effect.tryPromise({
						try: () => {
							if (noResize || metadata.width <= 1920) {
								return image.webp({ effort: 6 }).toBuffer()
							}
							return image.resize({ width: 1920 }).webp({ effort: 6 }).toBuffer()
						},
						catch: error => new Error(`Failed to transform image: ${asset}`, { cause: error }),
					})

					fileName = `${fileName}.webp`
				} else {
					fileName = asset
					yield* Effect.log(`Skipped transformation for ${fileName}`)
				}

				yield* Ref.update(numRef, n => n + 1)
				const currentAsset = yield* Ref.get(numRef)

				yield* fs.writeFile(path.join(TARGET_DIR, fileName), imageBuffer)
				yield* Effect.log(`Transformed: ${fileName}; ${currentAsset}/${newAssets.length}`)
			}).pipe(Effect.withLogSpan("transform_asset")),
		{ concurrency: 2 },
	)

	const writtenAmount = yield* Ref.get(numRef)
	const endTime = Duration.toSeconds(performance.now() - startTime)
	const totalTime =
		endTime > 60 ? `${Duration.toMinutes(endTime).toFixed(2)}m` : `${endTime.toFixed(2)}s`
	yield* Effect.log(
		`Successfully optimized ${writtenAmount}/${newAssets.length} images in ${totalTime}!`,
	)
}).pipe(
	Effect.withLogSpan("optimize_assets"),
	Effect.provide(Layer.merge(Path.layer, BunFileSystem.layer)),
	BunRuntime.runMain,
)
