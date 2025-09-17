import { Duration, Effect, Redacted, Ref } from "effect"
import { env } from "@/env"
import { Payload } from "@/lib/payload"
import { AuthorizationError, GetEntriesError, UpdateEntryStatusError } from "@/types/errors"
import { MAX_NEW_TIME } from "@/utils/constants"
import { authorizedRequest } from "@/utils/functions"

export async function GET(request: Request) {
	return await Effect.gen(function* () {
		const payload = yield* Payload
		const secret = request.headers.get("Authorization")
		if (!secret) return yield* new AuthorizationError({ message: "Missing Auth Header" })

		const authed = yield* authorizedRequest(secret, `Bearer ${Redacted.value(env.CRON_SECRET)}`)
		if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

		const numRef = yield* Ref.make(0)
		const newMainQuests = yield* Effect.tryPromise({
			try: () =>
				payload.db.drizzle.query.main_quests.findMany({
					columns: {
						id: true,
						newAt: true,
					},
					where: (main_quests, { isNotNull }) => isNotNull(main_quests.newAt),
				}),
			catch: error =>
				new GetEntriesError({ message: "Failed to fetch new main quests", cause: error }),
		}).pipe(
			Effect.map(mainQuests =>
				mainQuests.map(mainQuest => ({ ...mainQuest, collection: "mainQuests" as const })),
			),
		)

		const newSideQuests = yield* Effect.tryPromise({
			try: () =>
				payload.db.drizzle.query.side_quests.findMany({
					columns: {
						id: true,
						newAt: true,
					},
					where: (side_quests, { isNotNull }) => isNotNull(side_quests.newAt),
				}),
			catch: error =>
				new GetEntriesError({ message: "Failed to fetch new side quests", cause: error }),
		}).pipe(
			Effect.map(sideQuests =>
				sideQuests.map(sideQuest => ({ ...sideQuest, collection: "sideQuests" as const })),
			),
		)

		const newZombies = yield* Effect.tryPromise({
			try: () =>
				payload.db.drizzle.query.zombies.findMany({
					columns: {
						id: true,
						newAt: true,
					},
					where: (zombies, { isNotNull }) => isNotNull(zombies.newAt),
				}),
			catch: error => new GetEntriesError({ message: "Failed to fetch new zombies", cause: error }),
		}).pipe(
			Effect.map(zombies => zombies.map(zombie => ({ ...zombie, collection: "zombies" as const }))),
		)

		const newEntries = [...newMainQuests, ...newSideQuests, ...newZombies]
		for (const entry of newEntries) {
			if (!entry.newAt) {
				yield* Effect.log(`[STATE ENFORCEMENT] Entry ${entry.id} has no newAt.`)
				continue
			}
			const currentTime = Date.now()
			const newTime = new Date(entry.newAt).getTime()
			const passedTime = Duration.subtract(currentTime, newTime).pipe(Duration.toMillis)
			if (Duration.lessThanOrEqualTo(passedTime, MAX_NEW_TIME)) {
				yield* Effect.log(`[STATE ENFORCEMENT] Entry ${entry.id} has not passed the new time.`)
				continue
			}

			// This will trigger our revalidation afterChange hook for each updated collection
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
				`[STATE ENFORCEMENT] Entry ${updatedEntry.title} new state has been updated (${currentTotal}/${newEntries.length})`,
			)
		}

		const total = yield* numRef.get
		yield* Effect.log(`[STATE ENFORCEMENT] Total updated entries: ${total}`)
		return new Response("ok", { status: 200 })
	}).pipe(
		Effect.withLogSpan("state_enforcement_cron"),
		Effect.timeout("30 seconds"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(new Response(error.message, { status: 401 })),
			TimeoutException: error => Effect.succeed(new Response(error.message, { status: 504 })),
			UpdateEntryStatusError: error => Effect.succeed(new Response(error.message, { status: 424 })),
			GetEntriesError: error => Effect.succeed(new Response(error.message, { status: 424 })),
			PayloadInitError: error => Effect.succeed(new Response(error.message, { status: 424 })),
		}),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}
