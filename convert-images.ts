import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, Ref } from "effect"
import sharp from "sharp"

const program = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const media = yield* fs.readDirectory("./media")
	const numRef = yield* Ref.make(0)
	let shouldOptimize = true

	yield* Effect.forEach(media, file =>
		Effect.gen(function* () {
			if (!file.startsWith("reckoning-")) return

			let image = yield* fs.readFile(path.join("./media", file))
			const extension = path.extname(file)
			if (extension === ".webp") shouldOptimize = false

			if (shouldOptimize) {
				image = yield* Effect.tryPromise({
					try: () => sharp(image).webp({ effort: 6 }).toBuffer(),
					catch: error => new Error(`Failed to transform image: ${file}`, { cause: error }),
				})
			}

			yield* fs.writeFile(
				path.join(process.cwd(), "./content/images/reckoning", file.replace(extension, ".webp")),
				image,
			)
			yield* Effect.log(`Optimized: ${shouldOptimize}; moved ${file} to reckoning`)
			yield* Ref.update(numRef, n => n + 1)
		}),
	)
	const current = yield* Ref.get(numRef)
	yield* Effect.log(`Converted ${current} images`)
}).pipe(
	Effect.withLogSpan("convert_images"),
	Effect.provide(Layer.merge(BunFileSystem.layer, Path.layer)),
)

BunRuntime.runMain(program)
