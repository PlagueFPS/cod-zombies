import type { CommonErrorProps } from "@/types/errors"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Data, Effect } from "effect"
import sharp from "sharp"

export class ReadFileError extends Data.TaggedError("ReadFileError")<CommonErrorProps> {}
export class OptimizeImageError extends Data.TaggedError("OptimizeImageError")<CommonErrorProps> {}

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

export const optimizeImageForOG = (imagePath: string) =>
	Effect.gen(function* () {
		const imageBuffer = yield* Effect.tryPromise({
			try: () => readFile(join(process.cwd(), "public", imagePath)),
			catch: error => new ReadFileError({ message: "Failed to read image", cause: error }),
		})
		const optimizedImage = yield* Effect.tryPromise({
			try: () => sharp(imageBuffer).resize(1200).png({ quality: 75 }).toBuffer(),
			catch: error => new OptimizeImageError({ message: "Failed to optimize image", cause: error }),
		})

		return `data:image/png;base64,${optimizedImage.toString("base64")}`
	}).pipe(Effect.withLogSpan("optimize_image_for_og"))
