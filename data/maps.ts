import 'server-only'
import { revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'
import { CACHE_KEYS, MAP_LIMIT, MAX_NEW_TIME } from '@/utils/constants'
import { getEntries } from '@/contentful/contentful'
import type { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { calculateSkip, createImageDTO, createMapCategoryDTO, resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import { db } from '@/db/db'
import { maps } from '@/db/schema'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { Entry } from 'contentful'
import { eq } from 'drizzle-orm'
import { submitFeedbackUseCase } from '@/usecases/feedback'
import { FeaturedMapWithBody, FeaturedMapWithoutBody } from '@/types/FeaturedMap'

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

// export const getPaginatedMaps = cache(unstable_cache(async (draftMode: boolean, page: number, game?: string | string[], difficulty?: string | string[]) => {
//   const skip = calculateSkip(page, MAP_LIMIT)
//   const featuredMapsPromise = INTERNAL_getMapData(draftMode)
//   const mapIdsPromise = getMapIds()
//   const [mapsData, mapIds] = await Promise.all([featuredMapsPromise, mapIdsPromise])
//   let featuredMaps = mapsData
  
//   if (game) {
//     if (Array.isArray(game) && game.length > 0) {
//       featuredMaps = featuredMaps.filter(map => game.includes(createMapCategoryDTO(resolveEntry(map.fields.gameCategory)).slug))
//     } else if (typeof game === 'string') {
//       featuredMaps = featuredMaps.filter(map => createMapCategoryDTO(resolveEntry(map.fields.gameCategory)).slug === game)
//     }
//   }
//   if (difficulty) {
//     if (Array.isArray(difficulty) && difficulty.length > 0) {
//       featuredMaps = featuredMaps.filter(map => difficulty.includes(map.fields.difficulty.toLowerCase()))
//     } else if (typeof difficulty === 'string') {
//       featuredMaps = featuredMaps.filter(map => map.fields.difficulty.toLowerCase() === difficulty)
//     }
//   }

//   const paginatedMaps = featuredMaps.slice(skip, (MAP_LIMIT * page))
//   const maps = paginatedMaps.map(map => {
//     const mapData = resolveMapData(map, mapIds)
//     return {
//       ...mapData,
//       id: map.sys.id,
//       title: map.fields.title,
//       slug: map.fields.slug,
//       description: map.fields.description,
//       isComingSoon: map.fields.isComingSoon ?? false,
//       difficulty: map.fields.difficulty,
//     }
//   })
//     const totalPages = Math.ceil(featuredMaps.length / MAP_LIMIT)
//     const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
//     const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
//     const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1

//     return {
//       maps,
//       totalMaps: featuredMaps.length,
//       totalPages,
//       currentPage,
//       prevPage,
//       nextPage
//     }
//   }, [], {
//     tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
//   }))

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
    try {
      await db.insert(maps).values({ mapId, publishedAt: createdAt, status })
      return { error: null }
    } catch (error) {
      console.error(error)
      return { error: "Failed to store new map Id. Check server logs for more information." }
    }
  }

  export const getMapStatus = async (mapId: string) => {
    try {
      const status = await db.select({ 
        status: maps.status 
      }).from(maps).where(eq(maps.mapId, mapId)).limit(1)
      return status[0]
    } catch (error) {
      console.error(error)
      return { status: null }
    }
  }

  export const updateMapStatus = async (mapId: string) => {
    try {
      await db.update(maps).set({ status: "Published" }).where(eq(maps.mapId, mapId))
      return { error: null }
    } catch (error) {
      console.error(error)
      return { error: "Failed to update map status. Check server logs for more information." }
    }
  }

  export const enforceNewMapStatus = async () => {
    try {
      const newMaps = await db.select({ 
        mapId: maps.mapId, 
        publishedAt: maps.publishedAt 
      }).from(maps)

      for (const map of newMaps) {
        const currentTime = Date.now()
        const publishedTime = new Date(map.publishedAt).getTime()

        if (currentTime - publishedTime > MAX_NEW_TIME) {
          console.log(`[MAP ENFORCEMENT] Deleting Map ${map.mapId} from DB...`)
          await db.delete(maps).where(eq(maps.mapId, map.mapId))
          console.log(`[MAP ENFORCEMENT] revalidating ${CACHE_KEYS.FEATURED_MAPS.ALL}`)
          revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
        } else continue
      }
    } catch (error) {
      console.error(`[MAP ENFORCEMENT] Error enforcing maps: ${error}`)
      const { success } = await submitFeedbackUseCase({
        title: "Map Status Error",
        label: "issue",
        feedback: `Error enforcing maps: ${error}`
      })
      if (!success) console.error(`[MAP ENFORCEMENT] Failed to submit feedback`)
    }
  }

  const getMapIds = cache(unstable_cache(async () => {
    const newIdsPromise = db.select({ mapId: maps.mapId }).from(maps)
    const mapsPromise = getManagementEntries("featuredMaps")
    const [newMapIds, managementMaps] = await Promise.all([newIdsPromise, mapsPromise])
    const draftIds = new Set<string>()
    const changedIds = new Set<string>()
    const newIds = new Set<string>(newMapIds.map(id => id.mapId))

    managementMaps.items.forEach(map => {
      if (!map.sys.publishedVersion) {
        draftIds.add(map.sys.id)
      } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
        changedIds.add(map.sys.id)
      }
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
    const maps = await getEntries<TypeFeaturedMapsSkeleton>({
      content_type: "featuredMaps",
      order: ["-fields.releaseDate"],
      select: [
        "sys.id",
        "sys.updatedAt",
        "fields",
      ],
    }, draftMode)

    return maps.items
  })