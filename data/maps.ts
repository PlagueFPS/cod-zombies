import { Effect, Either } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MapWithQuest = Awaited<ReturnType<typeof getMapsWithQuest>>[number]

export const getMaps = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const maps = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "maps",
							pagination: false,
							sort: "-releaseDate",
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
				}).pipe(Effect.map(maps => maps.docs))

				return maps
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
			tags: [CACHE_KEYS.maps.all],
		},
	),
)

export const getMapsWithQuest = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const maps = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "maps",
							pagination: false,
							sort: "-releaseDate",
							draft: IN_DEVELOPMENT,
							where: {
								mainQuest: {
									exists: true,
								},
							},
							select: {
								title: true,
								slug: true,
								description: true,
								image: true,
								game: true,
								mainQuest: true,
							},
							populate: {
								mainQuests: {
									isComingSoon: true,
									difficulty: true,
									_status: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get maps with main quests",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(maps =>
						Effect.forEach(maps.docs, map =>
							Effect.gen(function* () {
								const image = yield* assertRelation(map.image)
								const game = yield* assertRelation(map.game)
								const quest = map.mainQuest?.docs
									? yield* assertRelation(map.mainQuest?.docs[0])
									: null
								return {
									id: map.id,
									title: map.title,
									slug: map.slug,
									description: map.description,
									image: createMediaDto(image),
									game,
									difficulty: quest?.difficulty,
									isComingSoon: quest?.isComingSoon ?? false,
									_status: quest?._status,
								}
							}),
						),
					),
				)

				return maps
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
			tags: [CACHE_KEYS.maps.all, CACHE_KEYS.mainQuests.all],
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

export const getAdjancentMapsWithQuest = cache(
	unstable_cache(
		async (currentReleaseDate: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const prevMapEffect = Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "maps",
							draft: IN_DEVELOPMENT,
							sort: "-releaseDate",
							limit: 1,
							where: {
								and: [
									{
										releaseDate: {
											less_than: currentReleaseDate,
										},
									},
									{
										mainQuest: {
											exists: true,
										},
									},
								],
							},
							select: {
								title: true,
								slug: true,
								description: true,
								image: true,
								game: true,
								mainQuest: true,
							},
							populate: {
								mainQuests: {
									isComingSoon: true,
									difficulty: true,
									_status: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get previous map",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(maps =>
						Effect.forEach(maps.docs, map =>
							Effect.gen(function* () {
								const image = yield* assertRelation(map.image)
								const game = yield* assertRelation(map.game)
								const quest = map.mainQuest?.docs
									? yield* assertRelation(map.mainQuest?.docs[0])
									: null
								return {
									id: map.id,
									title: map.title,
									slug: map.slug,
									description: map.description,
									image: createMediaDto(image),
									game,
									difficulty: quest?.difficulty,
									isComingSoon: quest?.isComingSoon ?? false,
									_status: quest?._status,
								}
							}),
						),
					),
				)

				const nextMapEffect = Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "maps",
							draft: IN_DEVELOPMENT,
							where: {
								and: [
									{
										releaseDate: {
											greater_than: currentReleaseDate,
										},
									},
									{
										mainQuest: {
											exists: true,
										},
									},
								],
							},
							select: {
								title: true,
								slug: true,
								description: true,
								image: true,
								game: true,
								mainQuest: true,
							},
							populate: {
								mainQuests: {
									isComingSoon: true,
									difficulty: true,
									_status: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get next map",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(maps =>
						Effect.forEach(maps.docs, map =>
							Effect.gen(function* () {
								const image = yield* assertRelation(map.image)
								const game = yield* assertRelation(map.game)
								const quest = map.mainQuest?.docs
									? yield* assertRelation(map.mainQuest?.docs[0])
									: null
								return {
									id: map.id,
									title: map.title,
									slug: map.slug,
									description: map.description,
									image: createMediaDto(image),
									game,
									difficulty: quest?.difficulty,
									isComingSoon: quest?.isComingSoon ?? false,
									_status: quest?._status,
								}
							}),
						),
					),
				)

				const [prevMap, nextMap] = yield* Effect.all([prevMapEffect, nextMapEffect], {
					concurrency: "unbounded",
					mode: "either",
				})

				return {
					prevMap: Either.isLeft(prevMap)
						? null
						: prevMap.right.length > 0
							? prevMap.right[0]
							: null,
					nextMap: Either.isLeft(nextMap)
						? null
						: nextMap.right.length > 0
							? nextMap.right[0]
							: null,
				}
			}).pipe(
				Effect.withLogSpan("get_adjancent_maps_with_quest"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed({ prevMap: null, nextMap: null })),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.maps.all],
		},
	),
)
