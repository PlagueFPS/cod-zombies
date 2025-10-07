import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { detectContentType } from "next/dist/server/image-optimizer"
import sharp from "sharp"

const _program = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const media = yield* fs.readDirectory("./content/images/the-tomb")

	yield* Effect.forEach(media, image =>
		Effect.gen(function* () {
			const imageBuffer = yield* fs.readFile(path.join("./content/images/the-tomb", image))
			const contentType = yield* Effect.tryPromise(() =>
				detectContentType(Buffer.from(imageBuffer), null),
			)

			if (contentType !== "image/webp") {
				yield* Effect.log(
					`${image} is not a webp image. It is a ${contentType} image. Converting to webp...`,
				)
				const optimizedImage = yield* Effect.tryPromise(() =>
					sharp(imageBuffer).webp({ effort: 6 }).toBuffer(),
				)
				yield* fs.writeFile(path.join("./content/images/the-tomb", image), optimizedImage)
			}
		}),
	)

	yield* Effect.log("Done")
})

BunRuntime.runMain(_program.pipe(Effect.provide(Layer.merge(BunFileSystem.layer, Path.layer))))
