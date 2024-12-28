import 'server-only'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { CACHE_KEYS, MAP_LIMIT } from '@/utils/constants'
import { getEntries } from '@/contentful/contentful'
import type { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { calculateSkip, createImageDTO, createMapCategoryDTO, resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import { db } from '@/db/db'
import { maps } from '@/db/schema'
import { managementClient } from '@/contentful/contentfulManagement'
import { Entry } from 'contentful'

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

  export const getMapBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
    const maps = await INTERNAL_getMapData(draftMode)
    const map = maps.find(m => m.fields.slug === slug)
    if (!map) return null
    const { category, image, isChanged, isDraft, isNew } = await resolveMapData(map)

    return {
      id: map.sys.id,
      updatedAt: map.sys.updatedAt,
      releaseDate: map.fields.releaseDate,
      title: map.fields.title,
      slug: map.fields.slug,
      description: map.fields.description,
      body: map.fields.body,
      category,
      image,
      isChanged,
      isDraft,
      isNew
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
    const maps = await managementClient.entry.getMany({
      query: {
        content_type: "featuredMaps"
      }
    })
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