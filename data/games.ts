import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { GetEntriesError } from "@/types/errors"

export const getGames = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
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
			}).pipe(
				Effect.withLogSpan("get_games"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [],
		},
	),
)
