import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect } from "effect"
import { LoadFontDataError } from "@/types/errors"

export const getFontData = Effect.gen(function* () {
	const [geistSemiBold, geistBold] = yield* Effect.all(
		[
			Effect.tryPromise({
				try: () => readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
				catch: error =>
					new LoadFontDataError({ message: "Failed to load `Geist-SemiBold` font", cause: error }),
			}),
			Effect.tryPromise({
				try: () => readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
				catch: error =>
					new LoadFontDataError({ message: "Failed to load `Geist-Bold` font", cause: error }),
			}),
		],
		{ concurrency: "unbounded" },
	)

	return { geistSemiBold, geistBold }
}).pipe(
	Effect.withLogSpan("get_font_data"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed(null)),
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
