import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { GetEntriesError } from "@/types/errors"
import { CACHE_KEYS } from "@/utils/constants"

export const getGames = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.games.all)

	return await getGamesEffect.pipe(
		Effect.withLogSpan("get_games_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getGamesEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const { docs } = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "games",
				pagination: false,
				select: {
					title: true,
					slug: true,
				},
			}),
		catch: error =>
			new GetEntriesError({
				message: "Failed to get games",
				cause: error,
			}),
	})

	return docs
}).pipe(Effect.withLogSpan("get_games"))
