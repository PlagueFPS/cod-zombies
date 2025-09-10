import type { CollectionAfterChangeHook } from "payload"
import { Redacted } from "effect"
import { env } from "@/env"
import { isFirstTimePublish } from "@/utils/payload-utils"

// If we can use the `after` Next.js API in this hook, we can remove the API route entirely
export const triggerBroadcast: CollectionAfterChangeHook = ({
	collection,
	previousDoc,
	doc,
	req: { payload },
}) => {
	payload.logger.info({
		docId: doc.id,
		game: doc.game,
		map: doc.map,
		description: doc.description,
	})
	if (
		env.VERCEL_ENV !== "production" ||
		doc?.state === "Coming Soon" ||
		!isFirstTimePublish(previousDoc?._status, doc?._status)
	)
		return

	// await fetch(`${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/send-broadcast`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: Redacted.value(env.PAYLOAD_SECRET),
	// 	},
	// 	body: JSON.stringify({
	// 		collectionSlug: collection.slug,
	// 		documentId: doc.id,
	// 	}),
	// }).catch(payload.logger.error)

	payload.logger.info(`[EMAIL] Triggered broadcast for "${collection.slug}": ${doc.id}`)
	return
}
