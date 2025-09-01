import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type SideQuestBySlug = NonNullable<Awaited<ReturnType<typeof getSideQuestBySlug>>>
export type MinifiedSideQuest = Awaited<ReturnType<typeof getSideQuests>>[number]

export const getSideQuests = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const sideQuests = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "sideQuests",
							pagination: false,
							draft: IN_DEVELOPMENT,
							sort: "-createdAt",
							select: {
								title: true,
								slug: true,
								description: true,
								map: true,
								isComingSoon: true,
								_status: true,
							},
							populate: {
								maps: {
									title: true,
									slug: true,
									image: true,
									game: true,
									releaseDate: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get side quests",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(sideQuests =>
						Effect.forEach(sideQuests.docs, sideQuest =>
							Effect.gen(function* () {
								const map = yield* assertRelation(sideQuest.map)
								const game = yield* assertRelation(map.game)
								const image = yield* assertRelation(map.image)

								return {
									id: sideQuest.id,
									title: sideQuest.title,
									slug: sideQuest.slug,
									description: sideQuest.description,
									game: {
										slug: game.slug,
										title: game.title,
									},
									map: {
										slug: map.slug,
										title: map.title,
									},
									image: createMediaDto(image),
									_status: sideQuest._status,
									isComingSoon: sideQuest.isComingSoon,
								}
							}),
						),
					),
				)

				return sideQuests
			}).pipe(
				Effect.withLogSpan("get_side_quests"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all, CACHE_KEYS.maps.all],
		},
	),
)

export const getSideQuestsMetadata = cache(
	unstable_cache(
		async (limit?: number) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const sideQuests = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "sideQuests",
							pagination: false,
							draft: IN_DEVELOPMENT,
							sort: "-createdAt",
							limit,
							where: {
								isComingSoon: {
									not_equals: true,
								},
							},
							select: {
								slug: true,
								description: true,
								map: true,
								updatedAt: true,
							},
							populate: {
								maps: {
									slug: true,
									game: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get side quests metadata",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(sideQuests =>
						Effect.forEach(sideQuests.docs, sideQuest =>
							Effect.gen(function* () {
								const map = yield* assertRelation(sideQuest.map)
								const game = yield* assertRelation(map.game)

								return {
									id: sideQuest.id,
									updatedAt: sideQuest.updatedAt,
									slug: sideQuest.slug,
									game: {
										slug: game.slug,
									},
									map: {
										slug: map.slug,
									},
								}
							}),
						),
					),
				)

				return sideQuests
			}).pipe(
				Effect.withLogSpan("get_side_quests_metadata"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all, CACHE_KEYS.maps.all],
		},
	),
)

export const getSideQuestBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const sideQuest = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "sideQuests",
							pagination: false,
							draft: IN_DEVELOPMENT,
							where: {
								slug: {
									equals: slug,
								},
							},
							select: {
								createdAt: false,
							},
							populate: {
								maps: {
									title: true,
									slug: true,
									game: true,
									image: true,
								},
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get side quest by slug: ${slug}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(sideQuest =>
						Effect.forEach(sideQuest.docs, sideQuest =>
							Effect.gen(function* () {
								const map = yield* assertRelation(sideQuest.map)
								const game = yield* assertRelation(map.game)
								const image = yield* assertRelation(map.image)

								return {
									...sideQuest,
									image: createMediaDto(image),
									map: {
										slug: map.slug,
										title: map.title,
									},
									game: {
										slug: game.slug,
										title: game.title,
									},
								}
							}),
						),
					),
				)

				return sideQuest[0] ?? null
			}).pipe(
				Effect.withLogSpan("get_side_quest_by_slug"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all, CACHE_KEYS.maps.all],
		},
	),
)

export const getSideQuestById = cache(
	unstable_cache(async (id: string) => {
		return await Effect.gen(function* () {
			const payload = yield* Payload
			const quest = yield* Effect.tryPromise({
				try: () =>
					payload.findByID({
						collection: "sideQuests",
						id,
						draft: IN_DEVELOPMENT,
						select: {
							title: true,
							slug: true,
							map: true,
						},
						populate: {
							maps: {
								title: true,
								slug: true,
								game: true,
								image: true,
							},
						},
					}),
				catch: error =>
					new EntryNotFoundError({
						message: `Failed to get side quest by id: ${id}`,
						cause: error,
					}),
			}).pipe(
				Effect.flatMap(quest =>
					Effect.gen(function* () {
						const map = yield* assertRelation(quest.map)
						const game = yield* assertRelation(map.game)
						const image = yield* assertRelation(map.image)

						return {
							...quest,
							image: createMediaDto(image),
							map: {
								slug: map.slug,
								title: map.title,
							},
							game: {
								slug: game.slug,
								title: game.title,
							},
						}
					}),
				),
			)

			return quest
		}).pipe(
			Effect.withLogSpan("get_side_quest_by_id"),
			Effect.tapError(Effect.logError),
			Effect.catchAll(_error => Effect.succeed(null)),
			Effect.ensureErrorType<never>(),
			Effect.provide(Payload.Default),
			Effect.runPromise,
		)
	}),
)
