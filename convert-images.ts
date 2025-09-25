import { FileSystem, Path } from "@effect/platform"
import { NodeFileSystem, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Ref } from "effect"
import sharp from "sharp"

const program = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const media = yield* fs.readDirectory("./media")
	const numRef = yield* Ref.make(0)

	yield* Effect.forEach(media, file =>
		Effect.gen(function* () {
			if (!file.startsWith("cotd-")) return

			const image = yield* fs.readFile(path.join("./media", file))
			const extension = path.extname(file)
			if (extension === ".webp") return

			const optimizedImage = yield* Effect.tryPromise({
				try: () => sharp(image).webp({ effort: 6 }).toBuffer(),
				catch: error => new Error(`Failed to transform image: ${file}`, { cause: error }),
			})

			yield* fs.writeFile(
				path.join(
					process.cwd(),
					"./content/images/call-of-the-dead",
					file.replace(extension, ".webp"),
				),
				optimizedImage,
			)
			yield* Effect.log(`Converted ${file} to webp`)
			yield* Ref.update(numRef, n => n + 1)
		}),
	)
	const current = yield* Ref.get(numRef)
	yield* Effect.log(`Converted ${current} images`)
}).pipe(
	Effect.withLogSpan("convert_images"),
	Effect.provide(Layer.merge(NodeFileSystem.layer, Path.layer)),
)

NodeRuntime.runMain(program)
