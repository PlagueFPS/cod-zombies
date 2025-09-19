import { Effect, Either } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MapWithQuest = Awaited<ReturnType<typeof getMapsWithQuest>>[number]

export const getMaps = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.maps.all)

	return await getMapsEffect.pipe(
		Effect.withLogSpan("get_maps_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

export const getMapsWithQuest = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.maps.all, CACHE_KEYS.mainQuests.all)

	return await getMapsWithQuestEffect.pipe(
		Effect.withLogSpan("get_maps_with_quest_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

export const getMapById = cache(async (id: string) => {
	"use cache"
	const map = await getMapByIdEffect(id).pipe(
		Effect.withLogSpan("get_map_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
	if (!map) return null

	cacheTag(CACHE_KEYS.maps.all, CACHE_KEYS.maps.byId(id), CACHE_KEYS.games.byId(map.game.id))
	return map
})

export const getAdjacentMapsWithQuest = cache(async (currentReleaseDate: string) => {
	"use cache"
	const { prevMap, nextMap } = await getAdjacentMapsWithQuestEffect(currentReleaseDate).pipe(
		Effect.withLogSpan("get_adjancent_maps_with_quest"),
		Effect.catchAll(_error => Effect.succeed({ prevMap: null, nextMap: null })),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.maps.all,
		CACHE_KEYS.maps.byId(prevMap?.id ?? ""),
		CACHE_KEYS.maps.byId(nextMap?.id ?? ""),
		CACHE_KEYS.mainQuests.all,
		CACHE_KEYS.games.byId(prevMap?.game.id ?? ""),
		CACHE_KEYS.games.byId(nextMap?.game.id ?? ""),
	)

	return {
		prevMap: prevMap
			? {
					...prevMap,
					game: {
						title: prevMap.game.title,
						slug: prevMap.game.slug,
					},
				}
			: null,
		nextMap: nextMap
			? {
					...nextMap,
					game: {
						title: nextMap.game.title,
						slug: nextMap.game.slug,
					},
				}
			: null,
	}
})

const getMapsEffect = Effect.gen(function* () {
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
}).pipe(Effect.withLogSpan("get_maps"))

const getMapsWithQuestEffect = Effect.gen(function* () {
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
						state: true,
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
					const quest = map.mainQuest?.docs ? yield* assertRelation(map.mainQuest?.docs[0]) : null

					return {
						id: map.id,
						title: map.title,
						slug: map.slug,
						description: map.description,
						image: createMediaDto(image),
						game: {
							title: game.title,
							slug: game.slug,
						},
						difficulty: quest?.difficulty,
						state: quest?.state,
						_status: quest?._status,
					}
				}),
			),
		),
	)

	return maps
}).pipe(Effect.withLogSpan("get_maps_with_quest"))

const getMapByIdEffect = (id: string) =>
	Effect.gen(function* () {
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
						game: {
							id: game.id,
							title: game.title,
							slug: game.slug,
						},
					}
				}),
			),
		)

		return map
	}).pipe(Effect.withLogSpan("get_map_by_id"), Effect.annotateLogs({ id }))

const getAdjacentMapsWithQuestEffect = (currentReleaseDate: string) =>
	Effect.gen(function* () {
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
							state: true,
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
						const quest = map.mainQuest?.docs ? yield* assertRelation(map.mainQuest?.docs[0]) : null

						return {
							id: map.id,
							title: map.title,
							slug: map.slug,
							description: map.description,
							image: createMediaDto(image),
							game: {
								id: game.id,
								title: game.title,
								slug: game.slug,
							},
							difficulty: quest?.difficulty,
							state: quest?.state,
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
					sort: "releaseDate",
					limit: 1,
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
							state: true,
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
						const quest = map.mainQuest?.docs ? yield* assertRelation(map.mainQuest?.docs[0]) : null

						return {
							id: map.id,
							title: map.title,
							slug: map.slug,
							description: map.description,
							image: createMediaDto(image),
							game: {
								id: game.id,
								title: game.title,
								slug: game.slug,
							},
							difficulty: quest?.difficulty,
							state: quest?.state,
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
			prevMap: Either.isLeft(prevMap) ? null : prevMap.right.length > 0 ? prevMap.right[0] : null,
			nextMap: Either.isLeft(nextMap) ? null : nextMap.right.length > 0 ? nextMap.right[0] : null,
		}
	}).pipe(Effect.withLogSpan("get_adjancent_maps_with_quest"))

export interface Map {
	id: string
	title: string
	releaseDate: Date
	description: string
	image: string
}

const mapRegistry = {
	nachtDerUntoten: {
		id: "nacht-der-untoten",
		title: "Nacht der Untoten",
		releaseDate: new Date("November 11, 2008 07:00 AM"),
		description: "You drove them deep into the heart of the Reich. You thought they were dead. You were wrong.",
		image: "/maps/nacht-der-untoten.webp",
	},
	verruckt: {
		id: "verruckt",
		title: "Verrückt",
		releaseDate: new Date("March 19, 2009 08:00 AM"),
		description: "Welcome to Wittenau Sanitorium, a German asylum with dark corridors, terrifying undead enemies, and even darker secrets.",
		image: "/maps/verruckt.webp",
	},
	shiNoNuma: {
		id: "shi-no-numa",
		title: "Shi No Numa",
		releaseDate: new Date("June 10, 2009 08:00 AM"),
		description: 'A "swamp of death" located in Japanese territory, surrounded by a sweltering jungle, hellhounds, and endless armies of the undead.',
		image: "/maps/shi-no-numa.webp",
	},
	derRiese: {
		id: "der-riese",
		title: "Der Riese",
		releaseDate: new Date("August 05, 2009 08:00 AM"),
		description: 'The Giant is rising. Face the might of the Nazi Zombies in their heartland. This is where it all began. This is where the master plan took shape. Is this where it all ends?',
		image: "/maps/der-riese.webp",
	},
	kinoDerToten: {
		id: "kino-der-toten",
		title: "Kino der Toten",
		releaseDate: new Date("November 09, 2010 07:00 AM"),
		description: "Battle the undead in this theatrical installment of 'Zombies'. New twists and clues could uncover the final plan. It's show time!",
		image: "/maps/kino-der-toten.webp",
	},
	five: {
		id: "five",
		title: '"Five"',
		releaseDate: new Date("November 09, 2010 08:00 AM"),
		description: 'The Pentagon is under attack! Washington is going to DEFCON 1 in this installment of "Zombies".',
		image: "/maps/five.webp",
	},
	ascension: {
		id: "ascension",
		title: "Ascension",
		releaseDate: new Date("February 01, 2011 07:00 AM"),
		description: 'The risen dead have overtaken a Soviet cosmodrome and all Hell has broken loose. The countdown to the zombie apocalypse has begun.',
		image: "/maps/ascension.webp",
	},
	callOfTheDead: {
		id: "call-of-the-dead",
		title: "Call of the Dead",
		releaseDate: new Date("March 17, 2011 08:00 AM"),
		description: 'A shipwrecked crew of fearless explorers is hopelessly stranded in an abandoned Siberian outpost. Their dream of discovering the true origins of the mysterious Element 115 unravels into a Hellish nightmare.',
		image: "/maps/call-of-the-dead.webp",
	},
	shangriLa: {
		id: "shangri-la",
		title: "Shangri-La",
		releaseDate: new Date("June 28, 2011 08:00 AM"),
		description: 'A legendary shrine lost in an exotic jungle, where the undead lurk within a treacherous labyrinth of underground caverns, deadly traps, and dark secrets.',
		image: "/maps/shangri-la.webp",
	},
	moon: {
		id: "moon",
		title: "Moon",
		releaseDate: new Date("August 23, 2011 08:00 AM"),
		description: '"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth." (JKF, 1961)',
		image: "/maps/moon.webp",
	},
	// page 3 of maps
} satisfies Record<string, Map>