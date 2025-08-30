import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { GetEntriesError } from "@/types/errors"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedMainQuest = Awaited<ReturnType<typeof getMainQuests>>[number]

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
			tags: [],
		},
	),
)

export const getMainQuestMetadata = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const { docs } = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "mainQuests",
							pagination: false,
							where: {
								isComingSoon: {
									equals: false,
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
				})

				return yield* Effect.forEach(docs, quest =>
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
				)
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
			tags: [],
		},
	),
)
