import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Effect } from "effect"

export const getFontData = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path

	const [geistSemiBold, geistBold] = yield* Effect.all(
		[
			fs.readFile(path.join(process.cwd(), "assets/Geist-SemiBold.otf")),
			fs.readFile(path.join(process.cwd(), "assets/Geist-Bold.otf")),
		],
		{ concurrency: "unbounded" },
	)

	return { geistSemiBold, geistBold }
}).pipe(
	Effect.withLogSpan("get_font_data"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed(null)),
	Effect.provide(Path.layer),
	Effect.provide(NodeContext.layer),
)

// export const getFontData = async () => {
// 	try {
// 		const [geistSemiBold, geistBold] = await Promise.all([
// 			readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
// 			readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
// 		])

// 		return { geistSemiBold, geistBold }
// 	} catch (error) {
// 		console.error(new LoadFontDataError({ message: "Failed to load font data.", cause: error }))
// 		return null
// 	}
// }
