import type { BroadcastEntry } from "@/utils/revalidation-handlers"
import type { TAllowedSlugs } from "@/utils/validation-schemas"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect, Match } from "effect"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import { IMAGE_CACHE } from "@/lib/redis"
import { FileStorage } from "@/lib/services/FileStorage"
import { LoadFontDataError, OgImageGenerationError } from "@/types/errors"

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
 * If not, it generates a new image, caches it, and returns the URL.
 *
 * @param type - The type of the entry (map, zombie, side-quest)
 * @param entry - The entry object containing at least the id, slug, and image URL
 * @returns The image URL (cached or newly generated)
 *
 * @example
 * const imageUrl = yield* getImageUrl("maps", entryObject) // https://example.com/og-image-url.jpg
 */
export const getImageUrl = Effect.fnUntraced(function* <T extends BroadcastEntry>(
	type: TAllowedSlugs,
	entry: T,
) {
	const { getImage, storeImage, deleteImage } = yield* FileStorage
	const { id, slug, image } = entry
	const payload = `${image.url}-${slug}`
	const contentHash = createHash("sha1").update(payload).digest("hex").substring(0, 16)
	const cachedHash = yield* IMAGE_CACHE.get(id)
	if (cachedHash === contentHash) {
		const existingImage = yield* getImage(`og-image-${slug}-${contentHash}.jpg`)
		return existingImage.url
	}

	// Wrap slug in a promise as it is the expected type for the open graph image handlers: Promise<{ slug: string }>
	const newParams = new Promise<{ slug: string }>(resolve => resolve({ slug }))
	const response = yield* Match.value(type).pipe(
		Match.when("maps", () =>
			Effect.tryPromise({
				try: () => MapOpenGraphImage({ params: newParams }),
				catch: () =>
					new OgImageGenerationError({ message: "Failed to generate open graph image for map" }),
			}),
		),
		Match.when("side-quests", () =>
			Effect.tryPromise({
				try: () => SideQuestOpenGraphImage({ params: newParams }),
				catch: () =>
					new OgImageGenerationError({
						message: "Failed to generate open graph image for side quest",
					}),
			}),
		),
		Match.when("zombies", () =>
			Effect.tryPromise({
				try: () => ZombieOpenGraphImage({ params: newParams }),
				catch: () =>
					new OgImageGenerationError({
						message: "Failed to generate open graph image for zombie",
					}),
			}),
		),
		Match.orElse(
			slug =>
				new OgImageGenerationError({
					message: `No OG image generation available for slug: ${slug}`,
				}),
		),
	)
	if (!response.ok)
		return yield* new OgImageGenerationError({
			message: "Failed to generate open graph image",
			cause: `Status: ${response.status}, Status Text: ${response.statusText}`,
		})

	const buffer = yield* Effect.tryPromise({
		try: () => response.arrayBuffer(),
		catch: error =>
			new OgImageGenerationError({ message: "Failed to grab image buffer", cause: error }),
	})
	const result = yield* storeImage(`og-image-${slug}-${contentHash}.jpg`, Buffer.from(buffer))
	yield* IMAGE_CACHE.set(id, contentHash)

	// Delete old image and handle its failure seperately to avoid short-circuiting
	yield* deleteImage(`og-image-${slug}-${cachedHash}.jpg`).pipe(
		Effect.withLogSpan("delete_old_og_image"),
		Effect.annotateLogs({ id, slug, cachedHash }),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.void),
	)

	return result.url
}, Effect.withLogSpan("get_image_url"))
