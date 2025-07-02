import type { NextRequest } from "next/server"
import { Effect, Match, Schema } from "effect"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import { OgImageGenerationError } from "@/types/errors"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
	params: Promise<{ slug: string[] }>
}

const ParamsSchema = Schema.Struct({
	slug: Schema.Tuple(AllowedSlugsSchema, Schema.String),
})

export async function GET(_: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const { slug } = yield* Schema.decodeUnknown(ParamsSchema)(params)
		const type = slug[0]
		const entrySlug = slug[1]
		const newParams = new Promise<{ slug: string }>(resolve => resolve({ slug: entrySlug }))
		let response: Response | null = null

		const match = Match.value(type).pipe(
			Match.when("maps", () =>
				Effect.tryPromise({
					try: () => MapOpenGraphImage({ params: newParams }),
					catch: () => new OgImageGenerationError({ message: "Failed to generate open graph image for map" }),
				}),
			),
			Match.when("side-quests", () =>
				Effect.tryPromise({
					try: () => SideQuestOpenGraphImage({ params: newParams }),
					catch: () => new OgImageGenerationError({ message: "Failed to generate open graph image for side quest" }),
				}),
			),
			Match.when("zombies", () =>
				Effect.tryPromise({
					try: () => ZombieOpenGraphImage({ params: newParams }),
					catch: () => new OgImageGenerationError({ message: "Failed to generate open graph image for zombie" }),
				}),
			),
			Match.orElse(
				slug => new OgImageGenerationError({ message: `No OG image generation available for slug: ${slug}` }),
			),
		)

		response = yield* match

		if (response && !response.ok) return new Response(response.statusText, { status: response.status })
		return response
	}).pipe(
		Effect.withLogSpan("open_graph_image_handler"),
		Effect.tapError(Effect.logError),
		Effect.catchTag("ParseError", () => Effect.succeed(new Response("Invalid Request", { status: 400 }))),
		Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 400 }))),
		Effect.runPromise,
	)
}
