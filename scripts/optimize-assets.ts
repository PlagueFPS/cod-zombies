import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Duration, Effect, Layer, Ref } from "effect"
import sharp from "sharp"

// Change this to the path where the new images you want to add are located
const NEW_ASSETS_DIR = "./newassets"
// Change this to the target path where the optimized images should end up
const TARGET_DIR = "./public/content/zetsubou-no-shima"

const program = Effect.gen(function* () {
	const startTime = performance.now()
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const newAssets = yield* fs.readDirectory(NEW_ASSETS_DIR)
	const numRef = yield* Ref.make(0)

	yield* Effect.forEach(
		newAssets,
		asset =>
			Effect.gen(function* () {
				const extension = path.extname(asset)
				const imagePath = path.join(NEW_ASSETS_DIR, asset)
				let fileName = path.basename(asset, extension)
				let imageBuffer = yield* fs.readFile(imagePath)
				let isTransformed = false

				// Only run optimization on images > 10KB or if the image is not an optimized format (.webp)
				if (extension !== ".webp" || imageBuffer.byteLength > 10_000) {
					yield* Effect.log(`Transforming image: ${asset}`)
					imageBuffer = yield* Effect.tryPromise({
						try: () => sharp(imageBuffer).webp({ effort: 6 }).toBuffer(),
						catch: error => new Error(`Failed to transform image: ${asset}`, { cause: error }),
					})
					isTransformed = true
					fileName = `${fileName}.webp`
				} else fileName = asset

				if (!isTransformed) yield* Effect.log(`Skipped transformation for ${fileName}`)

				yield* Ref.update(numRef, n => n + 1)
				const currentAsset = yield* Ref.get(numRef)

				yield* fs.writeFile(path.join(TARGET_DIR, fileName), imageBuffer)
				yield* Effect.log(`Transformed: ${fileName}; ${currentAsset}/${newAssets.length}`)
			}).pipe(Effect.withLogSpan("transform_asset")),
		{ concurrency: 2 },
	)

	const uploadedAmount = yield* Ref.get(numRef)
	const endTime = Duration.toSeconds(performance.now() - startTime)
	const totalTime =
		endTime > 60 ? `${Duration.toMinutes(endTime).toFixed(3)}m` : `${endTime.toFixed(3)}s`
	yield* Effect.log(
		`Successfully optimized ${uploadedAmount}/${newAssets.length} images in ${totalTime}!`,
	)
}).pipe(
	Effect.withLogSpan("optimize_assets"),
	Effect.provide(Layer.merge(Path.layer, BunFileSystem.layer)),
)

BunRuntime.runMain(program)
