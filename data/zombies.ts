import "server-only"
import type { Entry } from "contentful"
import type { TypeReferencedMapsSkeleton, TypeZombiesSkeleton } from "@/types/contentful-types"
import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { getNewEntries } from "@/lib/redis"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"
import {
	createImageDto,
	createItemTooltipDto,
	createMapCategoryDto,
	createQuestMapDto,
	createZombieAttackDto,
} from "@/utils/contentful-utils"
import { DataLayer } from "./utils"

export type Zombie = NonNullable<Awaited<ReturnType<typeof getZombieBySlug>>>
export type MinifiedZombie = Awaited<ReturnType<typeof getZombies>>[number]
export type ZombieById = NonNullable<Awaited<ReturnType<typeof getZombieById>>>
export type ZombieType = "Boss" | "Special" | "Elite" | "Normal"

export const getZombies = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const [zombies, zombieIds] = yield* Effect.all([INTERNAL_getZombies(), getZombieIds], {
					concurrency: "unbounded",
				})

				return zombies.map(zombie => {
					const { elementalWeakness, attacks, ...zombieData } = resolveZombieData(zombie, zombieIds)
					return {
						...zombieData,
						id: zombie.sys.id,
						name: zombie.fields.name,
						slug: zombie.fields.slug,
						description: zombie.fields.description,
						type: zombie.fields.type,
						updatedAt: zombie.sys.updatedAt,
						isComingSoon: zombie.fields.isComingSoon ?? false,
					}
				})
			}).pipe(
				Effect.withLogSpan("get_zombies"),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.zombies.all],
		},
	),
)

export const getZombieSearchData = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const [zombies, zombieIds] = yield* Effect.all([INTERNAL_getZombies(), getZombieIds], {
					concurrency: "unbounded",
				})
				const currentZombies = zombies.filter(z => !z.fields.isComingSoon)

				return currentZombies.map(zombie => {
					const { games, maps } = resolveZombieData(zombie, zombieIds)
					return {
						id: zombie.sys.id,
						name: zombie.fields.name,
						slug: zombie.fields.slug,
						type: zombie.fields.type,
						games,
						maps,
					}
				})
			}).pipe(
				Effect.withLogSpan("get_zombie_search_data"),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.zombies.all],
		},
	),
)

export const getZombieBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const zombies = yield* INTERNAL_getZombies()

				const zombie = zombies.find(z => z.fields.slug === slug)
				if (!zombie) return null

				const zombieIds = yield* getZombieIds
				const zombieData = resolveZombieData(zombie, zombieIds)

				return {
					...zombieData,
					id: zombie.sys.id,
					slug: zombie.fields.slug,
					name: zombie.fields.name,
					description: zombie.fields.description,
					type: zombie.fields.type,
					updatedAt: zombie.sys.updatedAt,
					weakPoints: zombie.fields.weakPoints,
					speed: zombie.fields.speed,
					spawnBehavior: zombie.fields.spawnBehavior,
					combatStrategy: zombie.fields.combatStrategy,
					isComingSoon: zombie.fields.isComingSoon ?? false,
				}
			}).pipe(
				Effect.withLogSpan("get_zombie_by_slug"),
				Effect.annotateLogs({ slug }),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.zombies.all],
		},
	),
)

export const getZombieById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const zombies = yield* INTERNAL_getZombies()

				const zombie = zombies.find(z => z.sys.id === id)
				if (!zombie) return null

				return {
					id: zombie.sys.id,
					updatedAt: zombie.sys.updatedAt,
					title: zombie.fields.name,
					slug: zombie.fields.slug,
					type: zombie.fields.type,
					description: zombie.fields.description,
					image: createImageDto(zombie.fields.image),
					isComingSoon: zombie.fields.isComingSoon ?? false,
					game: createMapCategoryDto(zombie.fields.games[0]).title,
					map: createQuestMapDto(zombie.fields.maps[0]).title,
				}
			}).pipe(
				Effect.withLogSpan("get_zombie_by_id"),
				Effect.annotateLogs({ id }),
				Effect.ensureErrorType<never>(),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.zombies.all],
		},
	),
)

export const getReferencedMaps = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const maps = yield* INTERNAL_getReferencedMaps()

				return maps.map(map => ({
					id: map.sys.id,
					...createQuestMapDto(map),
				}))
			}).pipe(
				Effect.withLogSpan("get_referenced_maps"),
				Effect.ensureErrorType<never>(),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.zombies.all],
		},
	),
)

export const getZombie = Effect.fnUntraced(function* (id: string) {
	const { getEntry } = yield* CMS
	return yield* getEntry<TypeZombiesSkeleton>(id).pipe(
		Effect.map(zombie => ({
			id: zombie.sys.id,
			updatedAt: zombie.sys.updatedAt,
			title: zombie.fields.name,
			slug: zombie.fields.slug,
			type: zombie.fields.type,
			description: zombie.fields.description,
			image: createImageDto(zombie.fields.image),
			isComingSoon: zombie.fields.isComingSoon ?? false,
			game: createMapCategoryDto(zombie.fields.games[0]).title,
			map: createQuestMapDto(zombie.fields.maps[0]).title,
		})),
	)
})

const resolveZombieData = (
	zombie: Entry<TypeZombiesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>,
	zombieIds: Effect.Effect.Success<typeof getZombieIds>,
) => {
	const { changedIds, draftIds, newIds } = zombieIds
	const games = zombie.fields.games.map(game => createMapCategoryDto(game))
	const maps = zombie.fields.maps.map(map => createQuestMapDto(map))
	const attacks = zombie.fields.attacks.map(attack => createZombieAttackDto(attack))
	const image = createImageDto(zombie.fields.image)
	const elementalWeakness =
		zombie.fields.elementalWeakness
			?.map(weakness => {
				if (!weakness) return null
				return createItemTooltipDto(weakness)
			})
			.filter(weakness => weakness !== null) ?? []

	const isDraft = draftIds.has(zombie.sys.id)
	const isChanged = changedIds.has(zombie.sys.id)
	const isNew = newIds.has(zombie.sys.id)

	return {
		image,
		games,
		maps,
		attacks,
		elementalWeakness,
		isDraft,
		isChanged,
		isNew,
	}
}

const getZombieIds = Effect.gen(function* () {
	const [zombies, newEntries] = yield* Effect.all(
		[INTERNAL_getManagementZombies(), getNewEntries],
		{
			concurrency: "unbounded",
		},
	)

	const draftIds = new Set<string>()
	const changedIds = new Set<string>()
	const newIds = new Set<string>()

	zombies.forEach(zombie => {
		if (!zombie.sys.publishedVersion) {
			draftIds.add(zombie.sys.id)
		} else if (
			!!zombie.sys.publishedVersion &&
			zombie.sys.version >= zombie.sys.publishedVersion + 2
		) {
			changedIds.add(zombie.sys.id)
		}
	})

	newEntries.forEach(entry => {
		if (entry.type !== "zombie") return
		newIds.add(entry.entryId)
	})

	return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_zombie_ids"))

const INTERNAL_getManagementZombies = cache(() =>
	Effect.gen(function* () {
		const { getManagementEntries } = yield* CMS
		const zombies = yield* getManagementEntries("zombies")
		return zombies.items
	}).pipe(
		Effect.withLogSpan("internal_get_management_zombies"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)

const INTERNAL_getZombies = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const data = yield* getEntries<TypeZombiesSkeleton>({
			content_type: "zombies",
			order: ["-fields.releaseDate"],
			select: ["sys.id", "sys.updatedAt", "fields"],
		})
		return data.items
	}).pipe(
		Effect.withLogSpan("internal_get_zombies"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)

const INTERNAL_getReferencedMaps = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const data = yield* getEntries<TypeReferencedMapsSkeleton>({
			content_type: "referencedMaps",
			order: ["-fields.releaseDate"],
		})
		return data.items
	}).pipe(
		Effect.withLogSpan("internal_get_referenced_maps"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)
