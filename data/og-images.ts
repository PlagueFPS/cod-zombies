import type { CommonErrorProps } from "@/types/errors"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { HttpClient } from "@effect/platform"
import { Data, Effect, Redacted, Schedule } from "effect"
import sharp from "sharp"
import { env } from "@/env"
import { FileStorage } from "@/lib/services/file-storage"
import { getServerUrl } from "@/utils/functions"

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

export const optimizeImageForOG = (fileUrl: string) =>
	Effect.gen(function* () {
		let urlToFetch = `${getServerUrl()}${fileUrl}`
		const httpClient = (yield* HttpClient.HttpClient).pipe(
			HttpClient.retryTransient({ times: 3, schedule: Schedule.exponential("300 millis", 2) }),
		)

		// When not in dev, we need to fetch from our storage provider
		if (Redacted.value(env.VERCEL_ENV) !== "development") {
			const filename = fileUrl.split("/").at(-1)
			if (!filename)
				return yield* new OptimizeImageError({
					message: "Failed to resolve filename",
					cause: `Could not find filename in URL: ${fileUrl}`,
				})

			const { getFile } = yield* FileStorage
			const { url } = yield* getFile(filename)
			urlToFetch = url
		}

		const res = yield* httpClient.get(urlToFetch)
		const buffer = yield* res.arrayBuffer
		const optimizedImage = yield* Effect.tryPromise({
			try: () => sharp(buffer).resize(1200).png({ quality: 75 }).toBuffer(),
			catch: error => new OptimizeImageError({ message: "Failed to optimize image", cause: error }),
		})

		return optimizedImage
	}).pipe(Effect.withLogSpan("optimize_image_for_og"))
