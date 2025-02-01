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
  const maps = await INTERNAL_getMapData(draftMode)

  return await Promise.all(maps.map(async map => {
    const { category, image, isDraft, isChanged, isNew } = await resolveMapData(map)
    return {
      id: map.sys.id,
      title: map.fields.title,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      description: map.fields.description,
      category,
      image,
      isDraft,
      isChanged,
      isNew
    }
  }))
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getMapSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const maps = await INTERNAL_getMapData(draftMode)

  return maps.map(map => ({
    id: map.sys.id,
    title: map.fields.title,
    slug: map.fields.slug,
    category: createMapCategoryDTO(resolveEntry(map.fields.gameCategory))
  }))
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
}))

export const getPaginatedMaps = cache(unstable_cache(async (draftMode: boolean, page: number) => {
  const featuredMaps = await INTERNAL_getMapData(draftMode)
  const skip = calculateSkip(page, MAP_LIMIT)
  const paginatedMaps = featuredMaps.slice(skip, (MAP_LIMIT * page))

  const maps = await Promise.all(paginatedMaps.map(async map => {
    const { category, image, isDraft, isChanged, isNew } = await resolveMapData(map)
    return {
      id: map.sys.id,
      title: map.fields.title,
      slug: map.fields.slug,
      description: map.fields.description,
      category,
      image,
      isDraft,
      isChanged,
      isNew
    }
  }))
    const totalPages = Math.ceil(featuredMaps.length / MAP_LIMIT)
    const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
    const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
    const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1

    return {
      maps,
      totalMaps: featuredMaps.length,
      totalPages,
      currentPage,
      prevPage,
      nextPage
    }
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
    const maps = await INTERNAL_getMapData(draftMode)
    const map = maps.find(m => m.fields.slug === slug)
    if (!map) return null
    const { category, image, isChanged, isDraft, isNew } = await resolveMapData(map)

    if (withBody) return {
      id: map.sys.id,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      title: map.fields.title,
      description: map.fields.description,
      body: map.fields.body,
      category,
      image,
      isChanged,
      isDraft,
      isNew,
    }
    
    return {
      id: map.sys.id,
      slug: map.fields.slug,
      updatedAt: map.sys.updatedAt,
      title: map.fields.title,
      description: map.fields.description,
      category,
      image,
      isChanged,
      isDraft,
      isNew,
    }
  }
  // We expose only the cached and memoized version of the function to be called externally
  export const getMapBySlug = cache(unstable_cache(INTERNAL_getMapBySlug, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  export const getMapMetadata = cache(unstable_cache(async (draftMode: boolean, identifier: string) => {
    const maps = await INTERNAL_getMapData(draftMode)
    const map = maps.find(m => m.fields.slug === identifier || m.sys.id === identifier)
    if (!map) return null
    const { category, image, } = await resolveMapData(map)
    return {
      id: map.sys.id,
      slug: map.fields.slug,
      title: map.fields.title,
      image,
      category
    }
  }, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  export const getMapsByCategory = cache(unstable_cache(async (draftMode: boolean, category: string) => {
    const featuredMaps = await INTERNAL_getMapData(draftMode)
    const categoryMaps = featuredMaps.filter(m => resolveEntry(m.fields.gameCategory)?.fields.slug === category)
    const maps = await Promise.all(categoryMaps.map(async map => {
      const { category, image, isDraft, isChanged, isNew } = await resolveMapData(map)
      return {
        id: map.sys.id,
        title: map.fields.title,
        slug: map.fields.slug,
        description: map.fields.description,
        category,
        image,
        isDraft,
        isChanged,
        isNew
      }
    }))

    return {
      maps,
      totalMaps: categoryMaps.length
    }
  }, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  export const getMapById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
    const maps = await INTERNAL_getMapData(draftMode)
    const map = maps.find(m => m.sys.id === id)
    if (!map) return null

    return {
      id: map.sys.id,
      slug: map.fields.slug,
      category: createMapCategoryDTO(resolveEntry(map.fields.gameCategory)).slug
    }
  }, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  export const storeNewMapId = async (mapId: string, createdAt: string) => {
    try {
      await db.insert(maps).values({ mapId, publishedAt: createdAt })
      return { error: null }
    } catch (error) {
      console.error(error)
      return { error: "Failed to store new map Id. Check server logs for more information." }
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

  const getMapIds = cache(async () => {
    const newIdsPromise = getNewMapIds()
    const draftAndChangedPromise = getDraftsAndChanged()
    const [newIds, { draftIds, changedIds }] = await Promise.all([newIdsPromise, draftAndChangedPromise])
    return { newIds, draftIds, changedIds }
  })

  const getNewMapIds = cache(unstable_cache(async () => {
    const ids = await db.select({ mapId: maps.mapId }).from(maps)
    return ids
  }, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  const getDraftsAndChanged = cache(unstable_cache(async () => {
    const maps = await getManagementEntries('featuredMaps')
    const draftIds = new Set<string>()
    const changedIds = new Set<string>()

    maps.items.forEach(map => {
      if (!map.sys.publishedVersion) {
        draftIds.add(map.sys.id)
      } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
        changedIds.add(map.sys.id)
      }
    })

    return { draftIds, changedIds }
  }, [], {
    tags: [CACHE_KEYS.FEATURED_MAPS.ALL]
  }))

  const resolveMapData = cache(async (map: Entry<TypeFeaturedMapsSkeleton, undefined, string>) => {
    const { newIds, draftIds, changedIds } = await getMapIds()
    const image = createImageDTO(resolveAsset(map.fields.image))
    const category = createMapCategoryDTO(resolveEntry(map.fields.gameCategory))
    const isDraft = draftIds.has(map.sys.id)
    const isChanged = changedIds.has(map.sys.id)
    const isNew = !!newIds.find(m => m.mapId === map.sys.id)

    return {
      image,
      category,
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
        "fields"
      ],
    }, draftMode)

    return maps.items
  })