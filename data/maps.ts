import "server-only"
import type { Entry } from "contentful"
import type { TypeFeaturedMapsSkeleton } from "@/types/contentful-types"
import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { getNewEntries } from "@/lib/redis"
import { Cache } from "@/lib/services/Cache"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"
import { createImageDto, createMapCategoryDto } from "@/utils/contentful-utils"

export type FeaturedMap = NonNullable<Awaited<ReturnType<typeof getMapBySlug>>>
export type MinifiedFeaturedMap = Awaited<ReturnType<typeof getMaps>>[number]
export type Difficulty = "Easy" | "Medium" | "Hard"

export const getMaps = cache(
	unstable_cache(
		async (draftMode: boolean) => {
			return await Effect.gen(function* () {
				const [maps, mapIds] = yield* Effect.all([INTERNAL_getMapData(), getMapIds], {
					concurrency: "unbounded",
				})

				return yield* Effect.forEach(
					maps,
					map =>
						Effect.gen(function* () {
							const mapData = yield* resolveMapData(map, mapIds)
							return {
								...mapData,
								id: map.sys.id,
								title: map.fields.title,
								slug: map.fields.slug,
								updatedAt: map.sys.updatedAt,
								description: map.fields.description,
								isComingSoon: map.fields.isComingSoon ?? false,
								difficulty: map.fields.difficulty,
							}
						}),
					{ concurrency: "unbounded" },
				)
			}).pipe(
				Effect.withLogSpan("get_maps"),
				Effect.annotateLogs("draftMode", draftMode),
				Effect.provide(CMS.Default(draftMode)),
				Effect.provide(Cache.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.featuredMaps.all],
		},
	),
)

export const getMapSearchData = cache(
	unstable_cache(
		async (draftMode: boolean) => {
			return await Effect.gen(function* () {
				const maps = yield* INTERNAL_getMapData()
				const filteredMaps = maps.filter(map => !map.fields.isComingSoon)

				return yield* Effect.forEach(
					filteredMaps,
					map =>
						Effect.gen(function* () {
							return {
								id: map.sys.id,
								title: map.fields.title,
								slug: map.fields.slug,
								game: yield* createMapCategoryDto(map.fields.gameCategory),
							}
						}),
					{ concurrency: "unbounded" },
				)
			}).pipe(
				Effect.withLogSpan("get_map_search_data"),
				Effect.annotateLogs("draftMode", draftMode),
				Effect.provide(CMS.Default(draftMode)),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.featuredMaps.all],
		},
	),
)

export const getMapBySlug = cache(
	unstable_cache(
		async (draftMode: boolean, slug: string) => {
			return await Effect.gen(function* () {
				const maps = yield* INTERNAL_getMapData()

				const map = maps.find(m => m.fields.slug === slug)
				if (!map) {
					yield* Effect.logWarning(`map with slug ${slug} not found`)
					return null
				}

				const mapIds = yield* getMapIds
				const mapData = yield* resolveMapData(map, mapIds)

				return {
					...mapData,
					id: map.sys.id,
					slug: map.fields.slug,
					updatedAt: map.sys.updatedAt,
					title: map.fields.title,
					description: map.fields.description,
					body: map.fields.body,
					isComingSoon: map.fields.isComingSoon ?? false,
					difficulty: map.fields.difficulty,
					timeToRead: map.fields.timeToRead,
				}
			}).pipe(
				Effect.withLogSpan("get_map_by_slug"),
				Effect.annotateLogs({ slug, draftMode }),
				Effect.provide(CMS.Default(draftMode)),
				Effect.provide(Cache.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.featuredMaps.all],
		},
	),
)

export const getMapById = cache(
	unstable_cache(
		async (draftMode: boolean, id: string) => {
			return await Effect.gen(function* () {
				const maps = yield* INTERNAL_getMapData()

				const map = maps.find(m => m.sys.id === id)
				if (!map) {
					yield* Effect.logWarning(`map with id ${id} not found`)
					return null
				}

				const game = yield* createMapCategoryDto(map.fields.gameCategory)

				return {
					id: map.sys.id,
					slug: map.fields.slug,
					title: map.fields.title,
					description: map.fields.description,
					isComingSoon: map.fields.isComingSoon ?? false,
					image: createImageDto(map.fields.image),
					game: game.slug,
				}
			}).pipe(
				Effect.withLogSpan("get_map_by_id"),
				Effect.annotateLogs({ id, draftMode }),
				Effect.provide(CMS.Default(draftMode)),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.featuredMaps.all],
		},
	),
)

const getMapIds = Effect.gen(function* () {
	const [maps, newEntries] = yield* Effect.all([INTERNAL_getManagementMapData(), getNewEntries], {
		concurrency: "unbounded",
	})

	const draftIds = new Set<string>()
	const changedIds = new Set<string>()
	const newIds = new Set<string>()

	maps.forEach(map => {
		if (!map.sys.publishedVersion) {
			draftIds.add(map.sys.id)
		} else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
			changedIds.add(map.sys.id)
		}
	})

	newEntries.forEach(entry => {
		if (entry.type !== "mainQuest") return
		newIds.add(entry.entryId)
	})

	return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_map_ids"))

const resolveMapData = (
	map: Entry<TypeFeaturedMapsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>,
	mapIds: Effect.Effect.Success<typeof getMapIds>,
) =>
	Effect.gen(function* () {
		const { draftIds, changedIds, newIds } = mapIds
		const image = createImageDto(map.fields.image)
		const game = yield* createMapCategoryDto(map.fields.gameCategory)
		const isDraft = draftIds.has(map.sys.id)
		const isChanged = changedIds.has(map.sys.id)
		const isNew = newIds.has(map.sys.id)

		return {
			image,
			game,
			isDraft,
			isChanged,
			isNew,
		}
	}).pipe(Effect.withLogSpan("resolve_map_data"))

const INTERNAL_getManagementMapData = cache(() =>
	Effect.gen(function* () {
		const { getManagementEntries } = yield* CMS
		const data = yield* getManagementEntries("featuredMaps")
		return data.items
	}).pipe(
		Effect.withLogSpan("internal_get_management_map_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)

const INTERNAL_getMapData = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const data = yield* getEntries<TypeFeaturedMapsSkeleton>({
			content_type: "featuredMaps",
			order: ["-fields.releaseDate"],
			select: ["sys.id", "sys.updatedAt", "fields"],
		})
		return data.items
	}).pipe(
		Effect.withLogSpan("internal_get_map_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)
