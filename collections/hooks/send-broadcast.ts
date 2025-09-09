import type { CollectionAfterChangeHook } from "payload"
import { Effect } from "effect"
import { env } from "@/env"
import { sendQuestReleaseBroadcast } from "@/usecases/email"
import { isFirstTimePublish } from "@/utils/payload-utils"

export const sendBroadcast: CollectionAfterChangeHook = async ({
	collection,
	doc,
	previousDoc,
}) => {
	// if (env.VERCEL_ENV !== "production" || !isFirstTimePublish(previousDoc?._status, doc?._status)) return

	return await Effect.gen(function* () {
		switch (collection.slug) {
			case "mainQuests": {
				const _redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/${doc.game.slug}/${doc.slug}`
				const _imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/${collection.slug}/${doc.id}`
				yield* Effect.log(`[BROADCAST]`, `GAME: ${doc.game}`, `MAP: ${doc.map}`)
				return
				// return yield* sendQuestReleaseBroadcast({
				//   type: "Main",
				//   redirectUrl,
				//   imageUrl,
				//   title: doc.title,
				//   description: doc.description,
				// })
			}
			default:
				yield* Effect.log(`[BROADCAST] skipping broadcast for ${collection.slug}`)
		}
	}).pipe(Effect.withLogSpan("send_broadcast_hook"))
}
