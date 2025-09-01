// import { Effect, Schema } from "effect"
// import { getMapById } from "@/data/maps"
// import { getCachedImageUrl } from "@/data/og-images"
// import { getSideQuestById } from "@/data/side-quests"
// import { getZombieById } from "@/data/zombies"
// import { PreviewImageError } from "@/types/errors"

// const PreviewImageParamsSchema = Schema.Tuple(
// 	Schema.Literal("maps", "side-quests", "zombies"),
// 	Schema.String,
// )

// export async function GET(
// 	_req: Request,
// 	{ params }: RouteContext<"/api/newsletter/preview-image/[...path]">,
// ) {
// 	return await Effect.gen(function* () {
// 		const { path } = yield* Effect.promise(() => params)
// 		const [type, id] = yield* Schema.decodeUnknown(PreviewImageParamsSchema)(path)

// 		switch (type) {
// 			case "maps": {
// 				const map = yield* Effect.promise(() => getMapById(id))
// 				if (!map) return yield* new PreviewImageError({ message: "Map not found" })

// 				const imageUrl = yield* Effect.promise(() => getCachedImageUrl("maps", map))
// 				if (!imageUrl) return yield* new PreviewImageError({ message: "Image URL not found" })

// 				return Response.redirect(imageUrl)
// 			}
// 			case "side-quests": {
// 				const sideQuest = yield* Effect.promise(() => getSideQuestById(id))
// 				if (!sideQuest) return yield* new PreviewImageError({ message: "Side Quest not found" })

// 				const imageUrl = yield* Effect.promise(() => getCachedImageUrl("side-quests", sideQuest))
// 				if (!imageUrl) return yield* new PreviewImageError({ message: "Image URL not found" })

// 				return Response.redirect(imageUrl)
// 			}
// 			case "zombies": {
// 				const zombie = yield* Effect.promise(() => getZombieById(id))
// 				if (!zombie) return yield* new PreviewImageError({ message: "Zombie not found" })

// 				const imageUrl = yield* Effect.promise(() => getCachedImageUrl("zombies", zombie))
// 				if (!imageUrl) return yield* new PreviewImageError({ message: "Image URL not found" })

// 				return Response.redirect(imageUrl)
// 			}
// 		}
// 	}).pipe(
// 		Effect.withLogSpan("preview_image_get_handler"),
// 		Effect.tapError(Effect.logError),
// 		Effect.catchTags({
// 			ParseError: _error => Effect.succeed(new Response("Invalid Request", { status: 400 })),
// 			PreviewImageError: _error =>
// 				Effect.succeed(new Response("Resource not found", { status: 404 })),
// 		}),
// 		Effect.ensureErrorType<never>(),
// 		Effect.runPromise,
// 	)
// }
