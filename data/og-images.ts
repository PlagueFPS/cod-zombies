import type { MainQuestBySlug } from "./main-quests"
import type { SideQuestBySlug } from "./side-quests"
import type { ZombieById } from "./zombies"
import { FetchHttpClient, HttpBody, HttpClient } from "@effect/platform"
import { Effect, Predicate, Redacted, Schedule } from "effect"
import { unstable_cacheLife as cacheLife } from "next/cache"
import { cache } from "react"
import { env } from "@/env"
import { ImageBodySchema, type TAllowedSlugs } from "@/utils/validation-schemas"

type ValidEntry = Omit<MainQuestBySlug, "content"> | Omit<SideQuestBySlug, "content"> | ZombieById

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
export const getCachedImageUrl = cache(async (type: TAllowedSlugs, entry: ValidEntry) => {
	"use cache"
	cacheLife("days")

	return await getImageUrl(type, entry).pipe(
		Effect.withLogSpan("get_cached_image_url"),
		Effect.tapError(Effect.logError),
		Effect.provide(FetchHttpClient.layer),
		Effect.catchAll(() => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

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
const getImageUrl = Effect.fnUntraced(function* (type: TAllowedSlugs, entry: ValidEntry) {
	const httpClient = (yield* HttpClient.HttpClient).pipe(
		HttpClient.retryTransient({
			times: 3,
			schedule: Schedule.exponential("500 millis", 2),
		}),
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
				game: entry.game.title,
				image: {
					url: entry.image.url ?? "",
					width: entry.image.width ?? 1200,
					height: entry.image.height ?? 630,
				},
				timeToRead: Predicate.hasProperty(entry, "timeToRead") ? entry.timeToRead : undefined,
				map: Predicate.hasProperty(entry, "map") ? entry.map.title : undefined,
				type: Predicate.hasProperty(entry, "type") ? entry.type : undefined,
				difficulty: Predicate.hasProperty(entry, "difficulty")
					? (entry.difficulty ?? undefined)
					: undefined,
			}),
		},
	)

	return yield* response.text
}, Effect.withLogSpan("get_image_url"))
