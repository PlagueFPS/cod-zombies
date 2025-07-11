import "server-only"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect } from "effect"
import { LoadFontDataError } from "@/types/errors"

export const getFontData = Effect.gen(function* () {
	const geistSemiBoldEffect = Effect.tryPromise({
		try: () => readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
		catch: error =>
			new LoadFontDataError({ message: "Failed to load `Geist-SemiBold` font data", cause: error }),
	})
	const geistBoldEffect = Effect.tryPromise({
		try: () => readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
		catch: error =>
			new LoadFontDataError({ message: "Failed to load `Geist-Bold` font data", cause: error }),
	})

	const [geistSemiBold, geistBold] = yield* Effect.all([geistSemiBoldEffect, geistBoldEffect], {
		concurrency: "unbounded",
	})

	return { geistSemiBold, geistBold }
}).pipe(
	Effect.withLogSpan("get_font_data"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed(null)),
	Effect.runPromise,
)
