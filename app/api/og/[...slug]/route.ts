import type { NextRequest } from "next/server"
import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, Layer, Match, Schema } from "effect"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import { IMAGE_CACHE } from "@/lib/redis"
import { Cache } from "@/lib/services/Cache"
import { FileStorage } from "@/lib/services/FileStorage"
import { OgImageGenerationError } from "@/types/errors"
import { createImageHash } from "@/utils/functions"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
	params: Promise<{ slug: string[] }>
}

const ParamsSchema = Schema.Struct({
	slug: Schema.Tuple(AllowedSlugsSchema, Schema.String),
})

const ImageGenLayer = Layer.mergeAll(Cache.Default, FileStorage.Default, FetchHttpClient.layer)

export async function GET(_: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const httpClient = yield* HttpClient.HttpClient
		const { storeImage, getImage } = yield* FileStorage
		const paramsResult = yield* Effect.promise(() => params)
		const { slug } = yield* Schema.decodeUnknown(ParamsSchema)(paramsResult)
		const type = slug[0]
		const entrySlug = slug[1]
		const newParams = new Promise<{ slug: string }>(resolve => resolve({ slug: entrySlug }))

		const imageId = yield* IMAGE_CACHE.get(entrySlug)

		if (imageId) {
			const existingImage = yield* getImage(`og-image-${entrySlug}-${imageId}.jpg`)
			if (existingImage) {
				const res = yield* httpClient.get(existingImage.downloadUrl)
				const buffer = yield* res.arrayBuffer
				return new Response(buffer, {
					status: 200,
					headers: {
						"Content-Type": "image/jpeg",
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				})
			}
		}

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
		const clonedResponse = response.clone()
		const buffer = yield* Effect.tryPromise({
			try: () => clonedResponse.arrayBuffer(),
			catch: error =>
				new OgImageGenerationError({ message: "Failed to grab image buffer", cause: error }),
		})

		const imageHash = createImageHash(buffer)
		yield* IMAGE_CACHE.set(entrySlug, imageHash)
		yield* storeImage(`og-image-${entrySlug}-${imageHash}.jpg`, Buffer.from(buffer))
		return response
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
