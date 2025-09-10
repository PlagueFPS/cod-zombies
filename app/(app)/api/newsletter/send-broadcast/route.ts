import type { NextRequest } from "next/server"
import { Effect, Layer, Redacted, Schedule } from "effect"
import { getMainQuestBroadcastInfo } from "@/data/main-quests"
import { getSideQuestBroadcastInfo } from "@/data/side-quests"
import { getZombieBroadcastInfo } from "@/data/zombies"
import { env } from "@/env"
import { Email } from "@/lib/services/Email"
import { Payload } from "@/lib/services/Payload"
import { AuthorizationError, JSONParseError } from "@/types/errors"
import { sendQuestReleaseBroadcast, sendZombieReleaseBroadcast } from "@/usecases/email"
import { authorizedRequest } from "@/utils/functions"
import { decodeAllowedSlugs, decodeBroadcastParams } from "@/utils/validation-schemas"

const broadcastLayer = Layer.merge(Email.Default, Payload.Default)

export async function POST(request: NextRequest) {
	return await Effect.gen(function* () {
		const { collection, id } = yield* Effect.tryPromise({
			try: () => request.json(),
			catch: error => new JSONParseError({ message: "Invalid JSON", cause: error }),
		}).pipe(decodeBroadcastParams)

		const secret = request.headers.get("Authorization") || ""
		const authed = yield* authorizedRequest(secret, Redacted.value(env.PAYLOAD_SECRET))
		if (!authed)
			return yield* new AuthorizationError({
				message: "Unauthorized",
			})

		const collectionSlug = yield* decodeAllowedSlugs(collection)

		switch (collectionSlug) {
			case "mainQuests": {
				const mainQuest = yield* getMainQuestBroadcastInfo(id)
				const imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/mainQuests/${mainQuest.id}`
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/${mainQuest.game.slug}/${mainQuest.map.slug}`
				return yield* sendQuestReleaseBroadcast({
					type: "Main",
					redirectUrl,
					imageUrl,
					title: mainQuest.map.title,
					description: mainQuest.description,
				})
			}
			case "sideQuests": {
				const sideQuest = yield* getSideQuestBroadcastInfo(id)
				const imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/sideQuests/${sideQuest.id}`
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/${sideQuest.game.slug}/${sideQuest.map.slug}/${sideQuest.slug}`
				return yield* sendQuestReleaseBroadcast({
					type: "Side",
					redirectUrl,
					imageUrl,
					title: sideQuest.title,
					description: sideQuest.description,
				})
			}
			case "zombies": {
				const zombie = yield* getZombieBroadcastInfo(id)
				const imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/zombies/${zombie.id}`
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`

				return yield* sendZombieReleaseBroadcast({
					redirectUrl,
					imageUrl,
					title: zombie.title,
					description: zombie.description,
					type: zombie.type,
				})
			}
			default:
				yield* Effect.log(`No broadcast for collection: ${collectionSlug}`)
				return
		}
	}).pipe(
		Effect.withLogSpan("send_broadcast_api"),
		Effect.tapError(Effect.logError),
		Effect.retry({
			while: error => error._tag === "EntryNotFoundError",
			times: 3,
			schedule: Schedule.exponential("500 millis", 2),
		}),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(new Response(error.message, { status: 401 })),
			ParseError: error => Effect.succeed(new Response(error.message, { status: 400 })),
			EntryNotFoundError: error => Effect.succeed(new Response(error.message, { status: 404 })),
		}),
		Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 500 }))),
		Effect.ensureErrorType<never>(),
		Effect.provide(broadcastLayer),
		Effect.runPromise,
	)
}
