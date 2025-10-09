import type { CommonErrorProps } from "@/types/errors"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Data, Effect } from "effect"

export class ReadFileError extends Data.TaggedError("ReadFileError")<CommonErrorProps> {}

export const getFonts = Effect.gen(function* () {
	const boldFont = yield* Effect.tryPromise({
		try: () => readFile(join(process.cwd(), "/assets/Geist-Bold.otf")),
		catch: error => new ReadFileError({ message: "Failed to get bold font", cause: error }),
	})

	const semiBoldFont = yield* Effect.tryPromise({
		try: () => readFile(join(process.cwd(), "/assets/Geist-SemiBold.otf")),
		catch: error => new ReadFileError({ message: "Failed to get semi-bold font", cause: error }),
	})

	return { boldFont, semiBoldFont }
}).pipe(Effect.withLogSpan("get_fonts"))

export const getImageData = (id: string) =>
	Effect.gen(function* () {
		const imageBuffer = yield* Effect.tryPromise({
			try: () => readFile(join(process.cwd(), "assets", "og", `og-${id}.jpg`)),
			catch: error => new ReadFileError({ message: "Failed to read image", cause: error }),
		})

		return `data:image/jpeg; base64,${imageBuffer.toString("base64")}`
	}).pipe(Effect.withLogSpan("get_image_data"))
