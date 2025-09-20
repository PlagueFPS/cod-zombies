import type { CollectionAfterChangeHook } from "payload"
import { Effect, Redacted, Schedule } from "effect"
import { after } from "next/server"
import { env } from "@/env"
import { Email } from "@/lib/services/emails"
import { handleEntryBroadcast } from "@/usecases/email"
import { isFirstTimePublish } from "@/utils/payload-utils"

export const triggerBroadcast: CollectionAfterChangeHook = ({
	collection,
	previousDoc,
	doc,
	req: { payload },
}) => {
	if (Redacted.value(env.VERCEL_ENV) !== "production") {
		payload.logger.info(`[BROADCAST] Skipping broadcast - not in a live production environment`)
		return
	}

	if (doc?.state === "Coming Soon") {
		payload.logger.info(`[BROADCAST] Skipping broadcast - document is in a 'Coming Soon' state`)
		return
	}

	if (!isFirstTimePublish(previousDoc?._status, doc?._status)) {
		payload.logger.info(`[BROADCAST] Skipping broadcast - document has been published before`)
		return
	}

	payload.logger.info(`[BROADCAST] running broadcast for ${collection.slug}: ${doc.id}`)
	return
}
