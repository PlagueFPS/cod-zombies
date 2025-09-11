import type { CollectionAfterChangeHook } from "payload"
import { Effect, Layer, Schedule } from "effect"
import { env } from "@/env"
import { isFirstTimePublish } from "@/utils/payload-utils"
import { after } from "next/server"
import { handleEntryBroadcast } from "@/usecases/email"
import { Payload } from "@/lib/services/Payload"
import { Email } from "@/lib/services/Email"

const broadcastLayer = Layer.merge(Email.Default, Payload.Default)

export const triggerBroadcast: CollectionAfterChangeHook = ({
	collection,
	previousDoc,
	doc,
	req: { payload },
}) => {
	if (env.VERCEL_ENV !== "production") {
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

	// Use `after` to prevent blocking the operation response
	after(async () => {
		await handleEntryBroadcast(collection.slug, doc.id).pipe(
			Effect.withLogSpan("trigger_broadcast"),
			Effect.tapBoth({
				onFailure: Effect.logError,
        onSuccess: () => Effect.log(`[BROADCAST] ${collection.slug} broadcast for ${doc.id} sent successfully!`)
			}),
			Effect.retry({
				while: error => error._tag === "EntryNotFoundError",
				times: 3,
				schedule: Schedule.fixed("500 millis"),
			}),
			Effect.catchAll(_error => Effect.void),
			Effect.ensureErrorType<never>(),
			Effect.provide(broadcastLayer),
			Effect.runPromise
		)
	})

	payload.logger.info(`[BROADCAST] running broadcast for ${collection.slug}: ${doc.id}`)
	return
}
