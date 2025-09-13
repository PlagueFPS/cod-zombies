import { Duration, Effect, Redacted, Ref } from "effect"
import { headers } from "next/headers"
import { getNewMainQuests } from "@/data/main-quests"
import { getNewSideQuests } from "@/data/side-quests"
import { getNewZombies } from "@/data/zombies"
import { env } from "@/env"
import { Payload } from "@/lib/services/Payload"
import { AuthorizationError, UpdateEntryStatusError } from "@/types/errors"
import { MAX_NEW_TIME } from "@/utils/constants"
import { authorizedRequest } from "@/utils/functions"

export async function GET() {
	return await Effect.gen(function* () {
		const payload = yield* Payload
		const headerList = yield* Effect.promise(() => headers())
		const secret = headerList.get("Authorization")
		if (!secret) return yield* new AuthorizationError({ message: "Missing Auth Header" })

		const authed = yield* authorizedRequest(secret, `Bearer ${Redacted.value(env.CRON_SECRET)}`)
		if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

		const numRef = yield* Ref.make(0)
		const newEntries = yield* Effect.all([getNewMainQuests, getNewSideQuests, getNewZombies], {
			concurrency: 3,
		}).pipe(Effect.map(entries => [...entries[0], ...entries[1], ...entries[2]]))

		yield* Effect.forEach(newEntries, entry =>
			Effect.gen(function* () {
				if (!entry.newAt) {
					yield* Effect.log(`[STATUS ENFORCEMENT] Entry ${entry.id} has no newAt.`)
					return
				}
				const currentTime = Date.now()
				const newTime = new Date(entry.newAt).getTime()
				const passedTime = Duration.subtract(currentTime, newTime).pipe(Duration.toMillis)

				if (Duration.greaterThan(passedTime, MAX_NEW_TIME)) {
					const updatedEntry = yield* Effect.tryPromise({
						try: () =>
							payload.update({
								collection: entry.collection,
								id: entry.id,
								data: {
									state: null,
								},
								select: {
									title: true,
								},
							}),
						catch: error =>
							new UpdateEntryStatusError({ message: "Failed to update entry", cause: error }),
					})

					yield* Ref.update(numRef, num => num + 1)
					const currentTotal = yield* numRef.get
					yield* Effect.log(
						`[STATUS ENFORCEMENT] Entry ${updatedEntry.title} new state has been updated (${currentTotal}/${newEntries.length})`,
					)
					return
				}
			}),
		)

		const total = yield* numRef.get
		yield* Effect.log(`[STATUS ENFORCEMENT] Total updated entries: ${total}`)
		return new Response("ok", { status: 200 })
	}).pipe(
		Effect.withLogSpan("status_enforcement_cron"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(new Response(error.message, { status: 401 })),
		}),
		Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 500 }))),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
}
