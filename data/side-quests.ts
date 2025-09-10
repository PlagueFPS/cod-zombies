import { Effect, Either } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import {
	assertRelation,
	calculateTimeToRead,
	createMediaDto,
	isDocumentNew,
} from "@/utils/payload-utils"

export type SideQuestBySlug = NonNullable<Awaited<ReturnType<typeof getSideQuestBySlug>>>
export type MinifiedSideQuest = Awaited<ReturnType<typeof getSideQuests>>[number]

export const getSideQuests = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.sideQuests.all, CACHE_KEYS.maps.all, CACHE_KEYS.games.all)

	return await getSideQuestsEffect.pipe(
		Effect.withLogSpan("get_side_quests_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

export const getSideQuestsMetadata = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.sideQuests.all, CACHE_KEYS.maps.all, CACHE_KEYS.games.all)

	return await getSideQuestsMetadataEffect.pipe(
		Effect.withLogSpan("get_side_quests_metadata_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

export const getSideQuestBySlug = cache(async (slug: string) => {
	"use cache"
	const sideQuest = await getSideQuestBySlugEffect(slug).pipe(
		Effect.withLogSpan("get_side_quest_by_slug_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.sideQuests.all,
		CACHE_KEYS.sideQuests.byId(sideQuest?.id ?? ""),
		CACHE_KEYS.maps.byId(sideQuest?.map.id ?? ""),
		CACHE_KEYS.games.byId(sideQuest?.game.id ?? ""),
	)

	if (!sideQuest) return null
	return {
		...sideQuest,
		game: {
			slug: sideQuest.game.slug,
			title: sideQuest.game.title,
		},
		map: {
			slug: sideQuest.map.slug,
			title: sideQuest.map.title,
		},
	}
})

export const getSideQuestById = cache(async (id: string) => {
	"use cache"

	const quest = await getSideQuestByIdEffect(id).pipe(
		Effect.withLogSpan("get_side_quest_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.sideQuests.all,
		CACHE_KEYS.sideQuests.byId(id),
		CACHE_KEYS.maps.byId(quest?.map.id ?? ""),
		CACHE_KEYS.games.byId(quest?.game.id ?? ""),
	)

	if (!quest) return null
	return {
		...quest,
		game: {
			slug: quest.game.slug,
			title: quest.game.title,
		},
		map: {
			slug: quest.map.slug,
			title: quest.map.title,
		},
	}
})

export const getAdjacentSideQuests = cache(async (currentCreatedAt: string) => {
	"use cache"
	const { prevQuest, nextQuest } = await getAdjacentSideQuestsEffect(currentCreatedAt).pipe(
		Effect.withLogSpan("get_adjancent_side_quests_cached"),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.sideQuests.all,
		CACHE_KEYS.sideQuests.byId(prevQuest?.id ?? ""),
		CACHE_KEYS.sideQuests.byId(nextQuest?.id ?? ""),
	)

	return {
		prevQuest,
		nextQuest,
	}
})

const getSideQuestByIdEffect = (id: string) =>
	Effect.gen(function* () {
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
							id: map.id,
							slug: map.slug,
							title: map.title,
						},
						game: {
							id: game.id,
							slug: game.slug,
							title: game.title,
						},
					}
				}),
			),
		)

		return quest
	}).pipe(Effect.withLogSpan("get_side_quest_by_id"))

const getSideQuestsEffect = Effect.gen(function* () {
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
					firstPublishedAt: true,
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
					const isNew = isDocumentNew(sideQuest.firstPublishedAt)

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
						isNew,
					}
				}),
			),
		),
	)

	return sideQuests
}).pipe(Effect.withLogSpan("get_side_quests"))

const getSideQuestsMetadataEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const sideQuests = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "sideQuests",
				pagination: false,
				draft: IN_DEVELOPMENT,
				sort: "-createdAt",
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
}).pipe(Effect.withLogSpan("get_side_quests_metadata"))

const getSideQuestBySlugEffect = (slug: string) =>
	Effect.gen(function* () {
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
						const timeToRead = calculateTimeToRead(sideQuest.content)
						const isNew = isDocumentNew(sideQuest.firstPublishedAt)

						return {
							...sideQuest,
							timeToRead,
							image: createMediaDto(image),
							map: {
								id: map.id,
								slug: map.slug,
								title: map.title,
							},
							game: {
								id: game.id,
								slug: game.slug,
								title: game.title,
							},
							isNew,
						}
					}),
				),
			),
		)

		return sideQuest[0] ?? null
	}).pipe(Effect.withLogSpan("get_side_quest_by_slug"))

const getAdjacentSideQuestsEffect = (currentCreatedAt: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const prevQuestEffect = Effect.tryPromise({
			try: () =>
				payload.find({
					collection: "sideQuests",
					draft: IN_DEVELOPMENT,
					sort: "-createdAt",
					limit: 1,
					where: {
						createdAt: {
							less_than: currentCreatedAt,
						},
					},
					select: {
						title: true,
						slug: true,
						description: true,
						map: true,
						isComingSoon: true,
						_status: true,
						firstPublishedAt: true,
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
				new GetEntriesError({
					message: "Failed to get previous side quest",
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(sideQuests =>
				Effect.forEach(sideQuests.docs, sideQuest =>
					Effect.gen(function* () {
						const map = yield* assertRelation(sideQuest.map)
						const game = yield* assertRelation(map.game)
						const image = yield* assertRelation(map.image)
						const isNew = isDocumentNew(sideQuest.firstPublishedAt)

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
							isNew,
						}
					}),
				),
			),
		)

		const nextQuestEffect = Effect.tryPromise({
			try: () =>
				payload.find({
					collection: "sideQuests",
					draft: IN_DEVELOPMENT,
					sort: "createdAt",
					limit: 1,
					where: {
						createdAt: {
							greater_than: currentCreatedAt,
						},
					},
					select: {
						title: true,
						slug: true,
						description: true,
						map: true,
						isComingSoon: true,
						_status: true,
						firstPublishedAt: true,
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
				new GetEntriesError({
					message: "Failed to get next side quest",
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(sideQuests =>
				Effect.forEach(sideQuests.docs, sideQuest =>
					Effect.gen(function* () {
						const map = yield* assertRelation(sideQuest.map)
						const game = yield* assertRelation(map.game)
						const image = yield* assertRelation(map.image)
						const isNew = isDocumentNew(sideQuest.firstPublishedAt)

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
							isNew,
						}
					}),
				),
			),
		)

		const [prevQuest, nextQuest] = yield* Effect.all([prevQuestEffect, nextQuestEffect], {
			concurrency: "unbounded",
			mode: "either",
		})

		return {
			prevQuest: Either.isLeft(prevQuest)
				? null
				: prevQuest.right.length > 0
					? prevQuest.right[0]
					: null,
			nextQuest: Either.isLeft(nextQuest)
				? null
				: nextQuest.right.length > 0
					? nextQuest.right[0]
					: null,
		}
	}).pipe(
		Effect.withLogSpan("get_adjancent_side_quests"),
		Effect.annotateLogs({ currentCreatedAt }),
	)

export const getSideQuestBroadcastInfo = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const quest = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "sideQuests",
					id,
					select: {
						title: true,
						slug: true,
						map: true,
						description: true,
					},
					populate: {
						maps: {
							slug: true,
							game: true,
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

					return {
						...quest,
						map: {
							slug: map.slug,
						},
						game: {
							slug: game.slug,
						},
					}
				}),
			),
		)

		return quest
	}).pipe(Effect.withLogSpan("get_side_quest_broadcast_info"), Effect.annotateLogs({ id }))
