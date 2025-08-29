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
								maps: true,
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get games",
							cause: error,
						}),
				})
			})
		},
		[],
		{
			tags: [],
		},
	),
)
