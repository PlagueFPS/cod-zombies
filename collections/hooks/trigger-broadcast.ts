import type { CollectionAfterChangeHook } from "payload"
import { Effect, Layer, Schedule } from "effect"
import { after } from "next/server"
import { env } from "@/env"
import { Email } from "@/lib/services/Email"
import { Payload } from "@/lib/services/Payload"
import { handleEntryBroadcast } from "@/usecases/email"
import { isFirstTimePublish } from "@/utils/payload-utils"

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
				onSuccess: () =>
					Effect.log(`[BROADCAST] ${collection.slug} broadcast for ${doc.id} sent successfully!`),
			}),
			Effect.retry({
				while: error => error._tag === "EntryNotFoundError",
				times: 3,
				schedule: Schedule.fixed("500 millis"),
			}),
			Effect.catchAll(_error => Effect.void),
			Effect.ensureErrorType<never>(),
			Effect.provide(Layer.merge(Email.Default, Payload.Default)),
			Effect.runPromise,
		)
	})

	payload.logger.info(`[BROADCAST] running broadcast for ${collection.slug}: ${doc.id}`)
	return
}
