import { Effect, Either } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { createAmmoModDto } from "./ammo-mods"

export type MinifiedZombie = Awaited<ReturnType<typeof getZombies>>[number]
export type ZombieBySlug = NonNullable<Awaited<ReturnType<typeof getZombieBySlug>>>
export type ZombieById = NonNullable<Awaited<ReturnType<typeof getZombieById>>>
export type PreviewZombie = NonNullable<
	Awaited<ReturnType<typeof getAdjacentZombies>>["prevZombie"]
>

export const getZombies = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.zombies.all, CACHE_KEYS.games.all, CACHE_KEYS.maps.all)

	return await getZombiesEffect.pipe(
		Effect.withLogSpan("get_zombies_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

export const getZombiesMetadata = cache(async () => {
	"use cache"
	cacheTag(CACHE_KEYS.zombies.all, CACHE_KEYS.games.all, CACHE_KEYS.maps.all)

	return await getZombieMetadataEffect.pipe(
		Effect.withLogSpan("get_zombies_metadata_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

export const getZombieBySlug = cache(async (slug: string) => {
	"use cache"
	const zombie = await getZombieBySlugEffect(slug).pipe(
		Effect.withLogSpan("get_zombie_by_slug_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.zombies.all,
		CACHE_KEYS.zombies.byId(zombie?.id ?? ""),
		CACHE_KEYS.games.all,
		CACHE_KEYS.maps.all,
	)

	return zombie
})

export const getAdjacentZombies = cache(async (currentReleaseDate: string) => {
	"use cache"
	const { prevZombie, nextZombie } = await getAdjacentZombiesEffect(currentReleaseDate).pipe(
		Effect.withLogSpan("get_adjacent_zombies_cached"),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)

	cacheTag(
		CACHE_KEYS.zombies.all,
		CACHE_KEYS.games.all,
		CACHE_KEYS.maps.all,
		CACHE_KEYS.zombies.byId(prevZombie?.id ?? ""),
		CACHE_KEYS.zombies.byId(nextZombie?.id ?? ""),
	)

	return {
		prevZombie,
		nextZombie,
	}
})

export const getZombieById = cache(async (id: string) => {
	"use cache"
	cacheTag(
		CACHE_KEYS.zombies.all,
		CACHE_KEYS.zombies.byId(id),
		CACHE_KEYS.games.all,
		CACHE_KEYS.maps.all,
	)

	return await getZombieByIdEffect(id).pipe(
		Effect.withLogSpan("get_zombie_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
})

const getZombiesEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const zombies = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "zombies",
				pagination: false,
				draft: IN_DEVELOPMENT,
				sort: "-releaseDate",
				select: {
					title: true,
					slug: true,
					description: true,
					type: true,
					maps: true,
					games: true,
					image: true,
					state: true,
					_status: true,
				},
			}),
		catch: error =>
			new GetEntriesError({
				message: "Failed to get zombies",
				cause: error,
			}),
	}).pipe(
		Effect.flatMap(zombies =>
			Effect.forEach(zombies.docs, doc =>
				Effect.gen(function* () {
					const maps = yield* Effect.forEach(doc.maps, map => assertRelation(map))
					const games = yield* Effect.forEach(doc.games, game => assertRelation(game))
					const image = yield* assertRelation(doc.image)

					return {
						...doc,
						maps,
						games,
						image: createMediaDto(image),
					}
				}),
			),
		),
	)

	return zombies
}).pipe(Effect.withLogSpan("get_zombies"))

const getZombieMetadataEffect = Effect.gen(function* () {
	const payload = yield* Payload
	const { docs } = yield* Effect.tryPromise({
		try: () =>
			payload.find({
				collection: "zombies",
				pagination: false,
				draft: IN_DEVELOPMENT,
				sort: "-releaseDate",
				where: {
					state: {
						not_equals: "Coming Soon",
					},
				},
				select: {
					updatedAt: true,
					title: true,
					slug: true,
				},
			}),
		catch: error =>
			new GetEntriesError({
				message: "Failed to get zombies metadata",
				cause: error,
			}),
	})

	return docs
}).pipe(Effect.withLogSpan("get_zombies_metadata"))

const getZombieBySlugEffect = (slug: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const zombie = yield* Effect.tryPromise({
			try: () =>
				payload.find({
					collection: "zombies",
					pagination: false,
					draft: IN_DEVELOPMENT,
					limit: 1,
					sort: "-releaseDate",
					depth: 3,
					where: {
						slug: {
							equals: slug,
						},
					},
					select: {
						createdAt: false,
					},
					populate: {
						zombieAttacks: {
							title: true,
							description: true,
							range: true,
						},
						ammoMods: {
							title: true,
							description: true,
							image: true,
							augments: true,
						},
						augments: {
							title: true,
							description: true,
							image: true,
							type: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get zombie by slug: ${slug}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(zombie =>
				Effect.forEach(zombie.docs, zombie =>
					Effect.gen(function* () {
						const map = yield* Effect.forEach(zombie.maps, map => assertRelation(map))
						const game = yield* Effect.forEach(zombie.games, game => assertRelation(game))
						const image = yield* assertRelation(zombie.image)
						const attacks = yield* Effect.forEach(zombie.attacks, attack => assertRelation(attack))
						const elementalWeakness = zombie.elementalWeakness
							? yield* Effect.forEach(zombie.elementalWeakness, elementalWeakness =>
									createAmmoModDto(elementalWeakness),
								)
							: []
						const weakPoints = zombie.weakPoints
							? yield* Effect.forEach(zombie.weakPoints, weakPoint => assertRelation(weakPoint))
							: []

						return {
							...zombie,
							maps: map,
							games: game,
							image: createMediaDto(image),
							attacks,
							elementalWeakness,
							weakPoints,
						}
					}),
				),
			),
		)

		return zombie[0] ?? null
	}).pipe(Effect.withLogSpan("get_zombie_by_slug"), Effect.annotateLogs({ slug }))

const getAdjacentZombiesEffect = (currentReleaseDate: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const prevZombieEffect = Effect.tryPromise({
			try: () =>
				payload.find({
					collection: "zombies",
					draft: IN_DEVELOPMENT,
					sort: "-releaseDate",
					limit: 1,
					where: {
						releaseDate: {
							less_than: currentReleaseDate,
						},
					},
					select: {
						title: true,
						slug: true,
						description: true,
						type: true,
						maps: true,
						image: true,
						state: true,
						_status: true,
					},
				}),
			catch: error =>
				new GetEntriesError({
					message: "Failed to get previous zombie",
					cause: error,
				}),
		}).pipe(
			Effect.withLogSpan("get_previous_zombie"),
			Effect.tapError(Effect.logError),
			Effect.flatMap(zombie =>
				Effect.forEach(zombie.docs, zombie =>
					Effect.gen(function* () {
						// we only care about the first map for prev/next cards
						const map = yield* assertRelation(zombie.maps[0])
						const image = yield* assertRelation(zombie.image)

						const { maps, ...zombieData } = zombie
						return {
							...zombieData,
							map: map,
							image: createMediaDto(image),
						}
					}),
				),
			),
		)

		const nextZombieEffect = Effect.tryPromise({
			try: () =>
				payload.find({
					collection: "zombies",
					draft: IN_DEVELOPMENT,
					sort: "releaseDate",
					limit: 1,
					where: {
						releaseDate: {
							greater_than: currentReleaseDate,
						},
					},
					select: {
						title: true,
						slug: true,
						description: true,
						type: true,
						maps: true,
						image: true,
						state: true,
						_status: true,
					},
				}),
			catch: error =>
				new GetEntriesError({
					message: "Failed to get next zombie",
					cause: error,
				}),
		}).pipe(
			Effect.withLogSpan("get_next_zombie"),
			Effect.tapError(Effect.logError),
			Effect.flatMap(zombie =>
				Effect.forEach(zombie.docs, zombie =>
					Effect.gen(function* () {
						// we only care about the first map for prev/next cards
						const map = yield* assertRelation(zombie.maps[0])
						const image = yield* assertRelation(zombie.image)

						const { maps, ...zombieData } = zombie
						return {
							...zombieData,
							map: map,
							image: createMediaDto(image),
						}
					}),
				),
			),
		)

		const [prevZombie, nextZombie] = yield* Effect.all([prevZombieEffect, nextZombieEffect], {
			concurrency: "unbounded",
			mode: "either",
		})

		return {
			prevZombie: Either.isLeft(prevZombie)
				? null
				: prevZombie.right.length > 0
					? prevZombie.right[0]
					: null,
			nextZombie: Either.isLeft(nextZombie)
				? null
				: nextZombie.right.length > 0
					? nextZombie.right[0]
					: null,
		}
	}).pipe(Effect.withLogSpan("get_adjacent_zombies"), Effect.annotateLogs({ currentReleaseDate }))

const getZombieByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const zombie = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "zombies",
					id,
					draft: IN_DEVELOPMENT,
					depth: 3,
					select: {
						updatedAt: true,
						title: true,
						slug: true,
						games: true,
						maps: true,
						image: true,
						type: true,
						weakPoints: true,
						elementalWeakness: true,
					},
					populate: {
						ammoMods: {
							title: true,
							image: true,
							description: true,
							augments: true,
						},
						augments: {
							title: true,
							type: true,
							description: true,
							image: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get zombie by id: ${id}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(zombie =>
				Effect.gen(function* () {
					const image = yield* assertRelation(zombie.image)
					const game = yield* assertRelation(zombie.games[0])
					const map = yield* assertRelation(zombie.maps[0])
					const weakPoints = zombie.weakPoints
						? yield* Effect.forEach(zombie.weakPoints, weakPoint => assertRelation(weakPoint))
						: []
					const elementalWeakness = zombie.elementalWeakness
						? yield* Effect.forEach(
								zombie.elementalWeakness,
								elementalWeakness => createAmmoModDto(elementalWeakness),
								{ concurrency: "unbounded" },
							)
						: []

					return {
						...zombie,
						image: createMediaDto(image),
						game,
						map,
						weakPoints,
						elementalWeakness,
					}
				}),
			),
		)

		return zombie
	}).pipe(Effect.withLogSpan("get_zombie_by_id"), Effect.annotateLogs({ id }))

export const getZombieBroadcastInfo = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const zombie = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "zombies",
					id,
					select: {
						title: true,
						slug: true,
						type: true,
						description: true,
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get zombie by id: ${id}`,
					cause: error,
				}),
		})

		return zombie
	}).pipe(Effect.withLogSpan("get_zombie_broadcast_info"), Effect.annotateLogs({ id }))
