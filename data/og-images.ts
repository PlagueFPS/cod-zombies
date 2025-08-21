import type { BroadcastEntry } from "@/utils/revalidation-handlers"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { FetchHttpClient, HttpBody, HttpClient } from "@effect/platform"
import { Effect, Predicate, Redacted, Schedule } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { env } from "@/env"
import { LoadFontDataError } from "@/types/errors"
import { capitalize } from "@/utils/functions.client"
import { ImageBodySchema, type TAllowedSlugs } from "@/utils/validation-schemas"

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
/**
 * Retrieves the Open Graph image URL for a given entry from cache if available.
 * Otherwise, retrieves it from File Storage or generates a new image.
 *
 * @param type - The type of the entry (map, zombie, side-quest)
 * @param entry - The entry object containing at least the id, slug, and image URL
 * @returns The image URL (cached or newly generated)
 *
 * @example
 * const imageUrl = await getCachedImageUrl("maps", entryObject) // https://example.com/og-image-url.jpg
 *
 */
export const getCachedImageUrl = cache(
	unstable_cache(
		async (type: TAllowedSlugs, entry: BroadcastEntry) => {
			return await getImageUrl(type, entry).pipe(
				Effect.withLogSpan("get_cached_image_url"),
				Effect.tapError(Effect.logError),
				Effect.provide(FetchHttpClient.layer),
				Effect.catchAll(() => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.runPromise,
			)
		},
		[],
		{
			revalidate: 86400, // 24 hours
		},
	),
)

/**
 * Retrieves the Open Graph image URL for a given entry from File Storage if available.
 * If not, it generates a new image, stores it, and returns the URL.
 *
 * @param type - The type of the entry (map, zombie, side-quest)
 * @param entry - The entry object containing at least the id, slug, and image URL
 * @returns The image URL (cached or newly generated)
 *
 * @example
 * const imageUrl = yield* getImageUrl("maps", entryObject) // https://example.com/og-image-url.jpg
 */
const getImageUrl = Effect.fnUntraced(function* (type: TAllowedSlugs, entry: BroadcastEntry) {
	const httpClient = (yield* HttpClient.HttpClient).pipe(
		HttpClient.retryTransient({
			times: 3,
			schedule: Schedule.exponential("50 millis", 2),
		}),
		HttpClient.filterStatusOk,
	)
	const response = yield* httpClient.post(
		"https://api-codzombiesguides.netlify.app/get-image-url",
		{
			urlParams: {
				type,
			},
			headers: {
				Authorization: Redacted.value(env.IMAGE_API_TOKEN),
			},
			body: yield* HttpBody.jsonSchema(ImageBodySchema)({
				id: entry.id,
				slug: entry.slug,
				title: entry.title,
				updatedAt: entry.updatedAt,
				game: capitalize(entry.game),
				image: {
					url: entry.image.url ?? "",
					width: entry.image.width ?? 1200,
					height: entry.image.height ?? 630,
				},
				timeToRead: Predicate.hasProperty(entry, "timeToRead") ? entry.timeToRead : undefined,
				map: Predicate.hasProperty(entry, "map") ? capitalize(entry.map) : undefined,
				type: Predicate.hasProperty(entry, "type") ? entry.type : undefined,
				difficulty: Predicate.hasProperty(entry, "difficulty") ? entry.difficulty : undefined,
			}),
		},
	)

	return yield* response.text
}, Effect.withLogSpan("get_image_url"))
