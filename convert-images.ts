import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, Ref } from "effect"
import sharp from "sharp"

const IMAGE_DIR = "./public/perks"

const convertImages = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const media = yield* fs.readDirectory(IMAGE_DIR)
	const numRef = yield* Ref.make(0)

	// Filter for non-WebP image files
	const imageExtensions = [".jpg", ".jpeg", ".png", ".avif", ".bmp", ".tiff", ".gif"]
	const imageFiles = media.filter(file => {
		const extension = path.extname(file).toLowerCase()
		return imageExtensions.includes(extension)
	})

	yield* Effect.log(`Found ${imageFiles.length} non-WebP images to convert`)

	yield* Effect.forEach(imageFiles, file =>
		Effect.gen(function* () {
			const originalPath = path.join(IMAGE_DIR, file)
			const oldAssetsPath = path.join("./old-assets", file)
			const webpPath = path.join(IMAGE_DIR, file.replace(path.extname(file), ".webp"))

			// Read original image
			const originalImage = yield* fs.readFile(originalPath)

			// Convert to WebP
			const webpImage = yield* Effect.tryPromise({
				try: () => sharp(originalImage).webp({ effort: 6 }).toBuffer(),
				catch: error => new Error(`Failed to convert image: ${file}`, { cause: error }),
			})

			// Write WebP version to original location
			yield* fs.writeFile(webpPath, webpImage)

			// Move original to old-assets
			yield* fs.writeFile(oldAssetsPath, originalImage)
			yield* fs.remove(originalPath)

			yield* Effect.log(`Converted ${file} to WebP and moved original to old-assets`)
			yield* Ref.update(numRef, n => n + 1)
		}),
	)

	const current = yield* Ref.get(numRef)
	yield* Effect.log(`Successfully converted ${current} images to WebP`)
}).pipe(
	Effect.withLogSpan("convert_images"),
	Effect.provide(Layer.merge(BunFileSystem.layer, Path.layer)),
)

BunRuntime.runMain(convertImages)
