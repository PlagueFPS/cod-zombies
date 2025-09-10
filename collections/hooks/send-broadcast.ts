import type { CollectionAfterChangeHook } from "payload"
import { Redacted } from "effect"
import { env } from "@/env"
import { isFirstTimePublish } from "@/utils/payload-utils"

export const triggerBroadcast: CollectionAfterChangeHook = ({
	collection,
	previousDoc,
	doc,
	req: { payload },
}) => {
	if (
		env.VERCEL_ENV !== "production" ||
		doc.isComingSoon ||
		!isFirstTimePublish(previousDoc?._status, doc?._status)
	)
		return

	// using void to prevent the hook from waiting for the fetch to complete
	void fetch(
		`${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/send-broadcast/${collection.slug}/${doc.id}`,
		{
			method: "GET",
			headers: {
				Authorization: Redacted.value(env.PAYLOAD_SECRET),
			},
		},
	).catch(payload.logger.error)

	payload.logger.info(`[EMAIL] Triggered broadcast for "${collection.slug}": ${doc.id}`)
	return
}
