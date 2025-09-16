import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, calculateTimeToRead, createMediaDto } from "@/utils/payload-utils"

export type MainQuestBySlug = NonNullable<Awaited<ReturnType<typeof getMainQuestBySlug>>>

export const getMainQuestMetadata = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.mainQuests.all, CACHE_KEYS.maps.all, CACHE_KEYS.games.all)

	return await getMainQuestMetadataEffect.pipe(
		Effect.withLogSpan("get_main_quest_metadata_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

export const getMainQuestBySlug = cache(async (slug: string) => {
	"use cache"
	const mainQuest = await getMainQuestBySlugEffect(slug).pipe(
		Effect.withLogSpan("get_main_quest_by_slug_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.mainQuests.all,
		CACHE_KEYS.mainQuests.byId(mainQuest?.id ?? ""),
		CACHE_KEYS.maps.byId(mainQuest?.mapId ?? ""),
		CACHE_KEYS.games.byId(mainQuest?.gameId ?? ""),
	)

	if (!mainQuest) return null
	const { mapId, gameId, ...quest } = mainQuest

	return quest
})

export const getMainQuestBroadcastInfo = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const quest = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "mainQuests",
					id,
					select: {
						title: true,
						map: true,
					},
					populate: {
						maps: {
							title: true,
							slug: true,
							game: true,
							description: true,
							image: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get main quest by id: ${id}`,
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
						map: {
							title: map.title,
							slug: map.slug,
						},
						game: {
							slug: game.slug,
							title: game.title,
						},
						image: createMediaDto(image),
						description: map.description,
					}
				}),
			),
		)

		return quest
	}).pipe(Effect.withLogSpan("get_main_quest_by_id"), Effect.annotateLogs({ id }))

const getMainQuestMetadataEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const quests = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "mainQuests",
				pagination: false,
				draft: IN_DEVELOPMENT,
				where: {
					state: {
						not_equals: "Coming Soon",
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
}).pipe(Effect.withLogSpan("get_main_quest_metadata"))

const getMainQuestBySlugEffect = (slug: string) =>
	Effect.gen(function* () {
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
						const timeToRead = calculateTimeToRead(quest.content)

						return {
							id: quest.id,
							mapId: map.id,
							gameId: game.id,
							state: quest.state,
							releaseDate: map.releaseDate,
							updatedAt: quest.updatedAt,
							title: map.title,
							slug: map.slug,
							timeToRead,
							description: map.description,
							game: {
								slug: game.slug,
								title: game.title,
							},
							image: createMediaDto(image),
							content: quest.content,
							difficulty: quest.difficulty,
							_status: quest._status,
						}
					}),
				),
			),
		)

		return mainQuest[0] ?? null
	}).pipe(Effect.withLogSpan("get_main_quest_by_slug"), Effect.annotateLogs({ slug }))
