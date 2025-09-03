import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedMainQuest = Awaited<ReturnType<typeof getMainQuests>>[number]
export type MainQuestBySlug = NonNullable<Awaited<ReturnType<typeof getMainQuestBySlug>>>

export const getMainQuests = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "mainQuests",
							pagination: false,
							sort: "-createdAt",
							select: {
								isComingSoon: true,
								difficulty: true,
								map: true,
								_status: true,
							},
							populate: {
								maps: {
									title: true,
									slug: true,
									description: true,
									game: true,
									image: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get main quests",
							cause: error,
						}),
				})

				return yield* Effect.forEach(docs, quest =>
					Effect.gen(function* () {
						const map = yield* assertRelation(quest.map)
						const game = yield* assertRelation(map.game)
						const image = yield* assertRelation(map.image)

						return {
							_status: quest._status,
							id: quest.id,
							isComingSoon: quest.isComingSoon,
							title: map.title,
							slug: map.slug,
							description: map.description,
							game: {
								slug: game.slug,
								title: game.title,
							},
							image: createMediaDto(image),
							difficulty: quest.difficulty,
						}
					}),
				)
			}).pipe(
				Effect.withLogSpan("get_main_quests"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.mainQuests.all],
		},
	),
)

export const getMainQuestMetadata = cache(
	unstable_cache(
		async (limit?: number) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const quests = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "mainQuests",
							pagination: false,
							draft: IN_DEVELOPMENT,
							limit,
							where: {
								isComingSoon: {
									not_equals: true,
								},
							},
							select: {
								difficulty: true,
								map: true,
							},
							populate: {
								maps: {
									updatedAt: true,
									title: true,
									slug: true,
									game: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: "Failed to get main quest metadata",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(quests =>
						Effect.forEach(quests.docs, quest =>
							Effect.gen(function* () {
								const map = yield* assertRelation(quest.map)
								const game = yield* assertRelation(map.game)

								return {
									id: quest.id,
									updatedAt: map.updatedAt,
									title: map.title,
									slug: map.slug,
									game: game,
									difficulty: quest.difficulty,
								}
							}),
						),
					),
				)

				return quests
			}).pipe(
				Effect.withLogSpan("get_main_quest_metadata"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed([])),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.mainQuests.all],
		},
	),
)

export const getMainQuestBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const mainQuest = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "mainQuests",
							pagination: false,
							draft: IN_DEVELOPMENT,
							limit: 1,
							where: {
								"map.slug": {
									equals: slug,
								},
							},
							select: {
								title: false,
								createdAt: false,
							},
							populate: {
								maps: {
									title: true,
									slug: true,
									game: true,
									image: true,
									description: true,
									releaseDate: true,
								},
							},
						}),
					catch: error =>
						new GetEntriesError({
							message: `Failed to get main quest by slug: ${slug}`,
							cause: error,
						}),
				}).pipe(
					Effect.flatMap(quests =>
						Effect.forEach(quests.docs, quest =>
							Effect.gen(function* () {
								const map = yield* assertRelation(quest.map)
								const game = yield* assertRelation(map.game)
								const image = yield* assertRelation(map.image)

								return {
									id: quest.id,
									releaseDate: map.releaseDate,
									updatedAt: quest.updatedAt,
									title: map.title,
									slug: map.slug,
									description: map.description,
									game: {
										slug: game.slug,
										title: game.title,
									},
									image: createMediaDto(image),
									content: quest.content,
									isComingSoon: quest.isComingSoon,
									difficulty: quest.difficulty,
									_status: quest._status,
								}
							}),
						),
					),
				)

				return mainQuest[0] ?? null
			}).pipe(
				Effect.withLogSpan("get_main_quest_by_slug"),
				Effect.annotateLogs({ slug }),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.mainQuests.all],
		},
	),
)
