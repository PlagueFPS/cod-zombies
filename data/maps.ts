import 'server-only'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { CACHE_KEYS } from '@/utils/constants'
import { getEntries } from '@/contentful/contentful'
import type { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { createImageDTO, createMapCategoryDTO, resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { Entry } from 'contentful'
import { FeaturedMapWithBody, FeaturedMapWithoutBody } from '@/types/FeaturedMap'
import { tryCatch } from '@/utils/functions'
import { NEW_ENTRY_KV } from '@/lib/redis'

export const getMaps = cache(unstable_cache(async (draftMode: boolean) => {
  const mapsPromise = INTERNAL_getMapData(draftMode)
  const mapIdsPromise = getMapIds()
  const [maps, mapIds] = await Promise.all([mapsPromise, mapIdsPromise])

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
      difficulty: map.fields.difficulty,
    }
  })
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getMapSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const maps = await INTERNAL_getMapData(draftMode)

  return maps.filter(map => !map.fields.isComingSoon).map(map => ({
    id: map.sys.id,
    title: map.fields.title,
    slug: map.fields.slug,
    game: createMapCategoryDTO(resolveEntry(map.fields.gameCategory))
  }))
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

  // We're creating some function overloads to keep the return typesafe
  // this way typescript knows if body actually exists in the result or not
  // based on the params passed; avoiding needing to always check for the body ourselves
  function INTERNAL_getMapBySlug(draftMode: boolean, slug: string, withBody: true): Promise<FeaturedMapWithBody | null>
  function INTERNAL_getMapBySlug(draftMode: boolean, slug: string, withBody?: false): Promise<FeaturedMapWithoutBody | null>
  function INTERNAL_getMapBySlug(draftMode: boolean, slug: string, withBody?: boolean): Promise<FeaturedMapWithBody | FeaturedMapWithoutBody | null>
  // Actual function implementation
  async function INTERNAL_getMapBySlug(draftMode: boolean, slug: string, withBody = false): Promise<FeaturedMapWithBody | FeaturedMapWithoutBody | null> {
    const mapsPromise = INTERNAL_getMapData(draftMode)
    const mapIdsPromise = getMapIds()
    const [maps, mapIds] = await Promise.all([mapsPromise, mapIdsPromise])
    const map = maps.find(m => m.fields.slug === slug)
    if (!map) return null
    const mapData = resolveMapData(map, mapIds)

    if (withBody) return {
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
    
    return {
      ...mapData,
      id: map.sys.id,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      title: map.fields.title,
      description: map.fields.description,
      isComingSoon: map.fields.isComingSoon ?? false,
      difficulty: map.fields.difficulty,
    }
  }
  // We expose only the cached and memoized version of the function to be called externally
  export const getMapBySlug = cache(unstable_cache(INTERNAL_getMapBySlug, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

export const getMapById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const maps = await INTERNAL_getMapData(draftMode)
  const map = maps.find(m => m.sys.id === id)
  if (!map) return null

  return {
    id: map.sys.id,
    slug: map.fields.slug,
    title: map.fields.title,
    description: map.fields.description,
    isComingSoon: map.fields.isComingSoon ?? false,
    image: createImageDTO(resolveAsset(map.fields.image)),
    game: createMapCategoryDTO(resolveEntry(map.fields.gameCategory)).slug
  }
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const storeNewMapId = async (mapId: string, createdAt: string, status: "Coming Soon" | "Published") => {
  return await tryCatch(NEW_ENTRY_KV.set(mapId, createdAt, status, "mainQuest"))
}

export const getMapStatus = async (mapId: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(mapId))

  if (error || !data) {
    console.error(error)
    return { status: null }
  }

  return { status: data.status }
}

export const updateMapStatus = async (mapId: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(mapId))
  if (error || !data) {
    console.error(error)
    return { error }
  }
  
  const { error: updateError } = await tryCatch(NEW_ENTRY_KV.set(mapId, data.createdAt, "Published", "mainQuest"))
  if (updateError) {
    console.error(updateError)
    return { error: updateError }
  }

  return { error: null }
}

const getMapIds = cache(unstable_cache(async () => {
  const mapsPromise = getManagementEntries("featuredMaps")
  const newEntriesPromise = tryCatch(NEW_ENTRY_KV.getAll())
  const [maps, newEntries] = await Promise.all([mapsPromise, newEntriesPromise])
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  if (maps.error || !maps.data) {
    console.error(`Error getting management maps`, maps.error)
  }
  
  if (newEntries.error || !newEntries.data) {
    console.error(`Error getting new maps`, newEntries.error)
  }

  maps.data?.items.forEach(map => {
    if (!map.sys.publishedVersion) {
      draftIds.add(map.sys.id)
    } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
      changedIds.add(map.sys.id)
    }
  })

  newEntries.data?.forEach(entry => {
    if (entry.type !== "mainQuest") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

const resolveMapData = cache((map: Entry<TypeFeaturedMapsSkeleton, undefined, string>, mapIds: Awaited<ReturnType<typeof getMapIds>>) => {
  const { changedIds, draftIds, newIds } = mapIds
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
})

const INTERNAL_getMapData = cache(async (draftMode: boolean) => {
  const { data, error } = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: "featuredMaps",
    order: ["-fields.releaseDate"],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields",
    ],
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  return data.items
})