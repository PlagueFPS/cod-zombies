import 'server-only'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { CACHE_KEYS } from '@/utils/constants'
import { getEntries, getManagementEntries } from '@/contentful/contentful'
import type { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { createImageDTO, createMapCategoryDTO, resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import { Entry } from 'contentful'
import { getNewEntries } from '@/lib/redis'
import { Effect, Layer } from 'effect'
import { CMS, CMSManagement } from '@/lib/services/CMS'
import { Cache } from '@/lib/services/Cache'

const DataLayer = Layer.merge(CMSManagement.Default, Cache.Default)

export const getMaps = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*() {
    const maps = yield* INTERNAL_getMapData()
    if (!maps) return []

    const mapIds = yield* getMapIds

    return maps.map(map => {
      const mapData = resolveMapData(map, mapIds)
      return {
        ...mapData,
        id: map.sys.id,
        title: map.fields.title,
        slug: map.fields.slug,
        updatedAt: map.sys.updatedAt,
        description: map.fields.description,
        isComingSoon: map.fields.isComingSoon ?? false,
        difficulty: map.fields.difficulty ?? null,
      }
    })
  }).pipe(
    Effect.withLogSpan("get_maps"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getMapSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*() {
    const maps = yield* INTERNAL_getMapData()
    if (!maps) return []
    
    return maps.filter(map => !map.fields.isComingSoon).map(map => ({
      id: map.sys.id,
      title: map.fields.title,
      slug: map.fields.slug,
      game: createMapCategoryDTO(resolveEntry(map.fields.gameCategory))
    }))
  }).pipe(
    Effect.withLogSpan("get_map_search_data"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getMapBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  return Effect.gen(function*() {
    const maps = yield* INTERNAL_getMapData()
    if (!maps) return null

    const map = maps.find(m => m.fields.slug === slug)
    if (!map) return null

    const mapIds = yield* getMapIds
    const mapData = resolveMapData(map, mapIds)

    return {
      ...mapData,
      id: map.sys.id,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      title: map.fields.title,
      description: map.fields.description,
      body: map.fields.body,
      isComingSoon: map.fields.isComingSoon ?? false,
      difficulty: map.fields.difficulty ?? null,
      timeToRead: map.fields.timeToRead,
    }
  }).pipe(
    Effect.withLogSpan("get_map_by_slug"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getMapById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  return Effect.gen(function*() {
    const maps = yield* INTERNAL_getMapData()
    if (!maps) return null
    
    const map = maps.find(m => m.sys.id === id)
    if (!map) return null

    return {
      id: map.sys.id,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      title: map.fields.title,
      description: map.fields.description,
      body: map.fields.body,
      isComingSoon: map.fields.isComingSoon ?? false,
      difficulty: map.fields.difficulty ?? null,
      timeToRead: map.fields.timeToRead,
    }
  }).pipe(
    Effect.withLogSpan("get_map_by_id"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

const getMapIds = Effect.gen(function*() {
  const [maps, newEntries] = yield* Effect.all([
    getManagementEntries("featuredMaps"), 
    getNewEntries()
  ], { concurrency: "unbounded" })

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

const resolveMapData = (map: Entry<TypeFeaturedMapsSkeleton, undefined, string>, mapIds: Effect.Effect.Success<typeof getMapIds>) => {
  const { draftIds, changedIds, newIds } = mapIds
  const image = createImageDTO(resolveAsset(map.fields.image))
  const game = createMapCategoryDTO(resolveEntry(map.fields.gameCategory))
  const isDraft = draftIds.has(map.sys.id)
  const isChanged = changedIds.has(map.sys.id)
  const isNew = newIds.has(map.sys.id)

  return {
    image,
    game,
    isDraft,
    isChanged,
    isNew
  }
}

const INTERNAL_getMapData = cache(() => getEntries<TypeFeaturedMapsSkeleton>({
  content_type: "featuredMaps",
  order: ["-fields.releaseDate"],
  select: [
    "sys.id",
    "sys.updatedAt",
    "fields",
  ],
}))