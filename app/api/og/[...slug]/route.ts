import type { NextRequest } from "next/server"
import { createHash } from "node:crypto"
import { Effect, Layer, Match, Schema } from "effect"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import { getImageDataForType } from "@/data/og-images"
import { IMAGE_CACHE } from "@/lib/redis"
import { Cache } from "@/lib/services/Cache"
import { FileStorage } from "@/lib/services/FileStorage"
import { OgImageGenerationError } from "@/types/errors"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
	params: Promise<{ slug: string[] }>
}

const ParamsSchema = Schema.Struct({
	slug: Schema.Tuple(AllowedSlugsSchema, Schema.String),
})

const ImageGenLayer = Layer.mergeAll(Cache.Default, FileStorage.Default)

/**
 * Handles generation and caching of Open Graph images.
 *
 * 1. Fetches image data using the provided type and slug
 * 2. Generates a content hash from the URL and slug
 * 3. Checks for cached image using the hash
 * 4. Returns cached image URL if hashes match
 * 5. Otherwise, deletes old cached image, generates a new one, and updates the cache
 *
 * @param _ - Next.js request object
 * @param params - Object containing URL parameters
 * @returns Response with the image URL (cached or newly generated)
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const { storeImage, getImage, deleteImage } = yield* FileStorage
		const paramsResult = yield* Effect.promise(() => params)
		const { slug } = yield* Schema.decodeUnknown(ParamsSchema)(paramsResult)
		const type = slug[0]
		const entryId = slug[1]
		const imageData = yield* getImageDataForType(type, entryId)
		if (!imageData || !imageData.url)
			return yield* new OgImageGenerationError({
				message: `No image url found for type: ${type} and slug: ${entryId}`,
			})

		const { url, id, slug: entrySlug } = imageData
		const payload = `${url}-${entrySlug}`
		const contentHash = createHash("sha1").update(payload).digest("hex").substring(0, 16)
		const cachedHash = yield* IMAGE_CACHE.get(id)

		if (cachedHash === contentHash) {
			const existingImage = yield* getImage(`og-image-${entrySlug}-${contentHash}.jpg`)
			if (existingImage) {
				return new Response(existingImage.url, { status: 200 })
			}
		} else {
			// Delete old image and handle its failure seperately to avoid short-circuiting
			yield* deleteImage(`og-image-${entrySlug}-${cachedHash}.jpg`).pipe(
				Effect.withLogSpan("delete_old_og_image"),
				Effect.annotateLogs("entrySlug", entrySlug),
				Effect.annotateLogs("cachedHash", cachedHash),
				Effect.tapError(Effect.logError),
				Effect.catchAll(() => Effect.void),
			)
		}

		// Wrap slug in a promise as it is the expected type for the open graph image handlers: Promise<{ slug: string }>
		const newParams = new Promise<{ slug: string }>(resolve => resolve({ slug: entrySlug }))
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

		if (!response.ok) return new Response(response.statusText, { status: response.status })
		const buffer = yield* Effect.tryPromise({
			try: () => response.arrayBuffer(),
			catch: error =>
				new OgImageGenerationError({ message: "Failed to grab image buffer", cause: error }),
		})

		yield* IMAGE_CACHE.set(id, contentHash)
		const result = yield* storeImage(
			`og-image-${entrySlug}-${contentHash}.jpg`,
			Buffer.from(buffer),
		)

		return new Response(result.url, { status: 201 })
	}).pipe(
		Effect.withLogSpan("open_graph_image_handler"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			ParseError: () => Effect.succeed(new Response("Invalid Params", { status: 400 })),
			OGImageGenerationError: error => Effect.succeed(new Response(error.message, { status: 500 })),
		}),
		Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 500 }))),
		Effect.provide(ImageGenLayer),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}
