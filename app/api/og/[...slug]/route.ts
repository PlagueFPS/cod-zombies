import type { NextRequest } from "next/server"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import type { ImageResponse } from "next/og"
import { Effect, Schema } from "effect"
import { OGImageGenerationError } from "@/types/Error"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

const ParamsSchema = Schema.Struct({
  slug: Schema.Tuple(AllowedSlugsSchema, Schema.String)
})

export async function GET(_: NextRequest, { params }: RouteParams) {
  return Effect.gen(function*() {
    const { slug } = yield* Schema.decodeUnknown(ParamsSchema)(params)
    const type = slug[0]
    const entrySlug = slug[1]
    const newParams = new Promise<{ slug: string }>((resolve) => resolve({ slug: entrySlug }))
    let response: ImageResponse | null = null
    
    switch(type) {
      case "maps":
        response = yield* Effect.tryPromise({
          try: () => MapOpenGraphImage({ params: newParams }),
          catch: () => new OGImageGenerationError({ message: "Failed to generate open graph image for map" })
        })
        break
      case "side-quests":
        response = yield* Effect.tryPromise({
          try: () => SideQuestOpenGraphImage({ params: newParams }),
          catch: () => new OGImageGenerationError({ message: "Failed to generate open graph image for side quest" })
        })
        break
      case "zombies":
        response = yield* Effect.tryPromise({
          try: () => ZombieOpenGraphImage({ params: newParams }),
          catch: () => new OGImageGenerationError({ message: "Failed to generate open graph image for zombie" })
        })
        break
      default:
        return new Response('Not Found', { status: 404 })
    }
    
    if (!response || !response.ok) return new Response('Invalid Request', { status: 400 })
    return response
  }).pipe(
    Effect.withLogSpan("open_graph_image_handler"),
    Effect.tapError(Effect.logError),
    Effect.catchAll((error) => Effect.succeed(new Response(error.message, { status: 400 }))),
    Effect.runPromise
  )
}