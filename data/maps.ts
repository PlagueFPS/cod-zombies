import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { assertRelation } from "@/utils/payload-utils"

export const getMaps = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "maps",
							pagination: false,
							select: {
								title: true,
								slug: true,
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get maps",
							cause: error,
						}),
				})

				return docs
			}).pipe(
				Effect.withLogSpan("get_maps"),
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

export const getMapById = cache(
	unstable_cache(async (id: string) => {
		return await Effect.gen(function* () {
			const payload = yield* Payload
			const map = yield* Effect.tryPromise({
				try: () =>
					payload.findByID({
						collection: "maps",
						id,
						select: {
							slug: true,
							game: true,
						},
						populate: {
							games: {
								title: true,
								slug: true,
							},
						},
					}),
				catch: error =>
					new EntryNotFoundError({
						message: `Failed to get map by id: ${id}`,
						cause: error,
					}),
			}).pipe(
				Effect.flatMap(map =>
					Effect.gen(function* () {
						const game = yield* assertRelation(map.game)
						return {
							...map,
							game,
						}
					}),
				),
			)

			return map
		}).pipe(
			Effect.withLogSpan("get_map_by_id"),
			Effect.annotateLogs({ id }),
			Effect.tapError(Effect.logError),
			Effect.catchAll(_error => Effect.succeed(null)),
			Effect.ensureErrorType<never>(),
			Effect.provide(Payload.Default),
			Effect.runPromise,
		)
	}),
)
