import "server-only"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import { cache } from "react"
import { resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import type { Entry } from "contentful"
import { managementClient } from "@/contentful/contentful-management"
import { MAP_LIMIT } from "@/utils/constants"
import { getAllNewMapIds } from "@/data/kv"

/**
 * 
 * @param draftMode - the `isEnabled` value from calling `draftMode()` or `IN_DEVELOPMENT` when `draftMode` is not available
 * @returns unpaginated featured maps
 */
export const getFeaturedMaps = cache(async (draftMode: boolean) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
  }, draftMode)
  
  const featuredMapsDTO = await createFeaturedMapsDTO(featuredMaps.items)
  return {
    featuredMaps: featuredMapsDTO,
    totalMaps: featuredMaps.total
  }
})

/**
 * 
 * @param draftMode - the `isEnabled` value from calling `draftMode()` or `IN_DEVELOPMENT` when `draftMode` is not available
 * @param page - the page number from search params used to define the skip value
 * @returns paginated featured maps
 */
export const getPaginatedFeaturedMaps = cache(async (draftMode: boolean, page: number | undefined = 1) => {
  const { featuredMaps, totalMaps } = await getFeaturedMaps(draftMode)
  const totalPages = Math.ceil(totalMaps / MAP_LIMIT)
  const currentPage = page > totalPages ? totalPages : page
  const paginatedFeaturedMaps = featuredMaps.slice((currentPage - 1) * MAP_LIMIT, currentPage * MAP_LIMIT)
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  
  return {
    featuredMaps: paginatedFeaturedMaps,
    totalMaps,
    totalPages,
    currentPage,
    prevPage,
    nextPage
  }
})

/**
 * 
 * @param draftMode - the `isEnabled` value from calling `draftMode()` or `IN_DEVELOPMENT` when `draftMode` is not available
 * @param category - the category of the featured maps
 * @returns unpaginated and filtered featured maps by category
 */
export const getFeaturedMapsByCategory = cache(async (draftMode: boolean, category: string) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug[match]': category,
  }, draftMode)
  
  const featuredMapsDTO = await createFeaturedMapsDTO(featuredMaps.items)
  return {
    featuredMaps: featuredMapsDTO,
    totalMaps: featuredMaps.total
  }
})

/**
 * 
 * @param draftMode - the `isEnabled` value from calling `draftMode()` or `IN_DEVELOPMENT` when `draftMode` is not available
 * @param slug - the slug of the featured map
 * @returns the featured map with the given slug
 */
export const getFeaturedMapBySlug = cache(async (draftMode: boolean, slug: string) => {
  const { featuredMaps } = await getFeaturedMaps(draftMode)
  const featuredMap = featuredMaps.find(map => map.slug === slug)
  return featuredMap
})

export const getFeaturedMapById = cache(async (draftMode: boolean, id: string) => {
  const { featuredMaps } = await getFeaturedMaps(draftMode)
  const featuredMap = featuredMaps.find(map => map.id === id)
  return featuredMap
})

const createFeaturedMapsDTO = async (featuredMaps: Entry<TypeFeaturedMapsSkeleton, undefined, string>[]) => {
  const { draftMapIds, changedMapIds } = await getDraftsOrChanged()
  const newMapIds = await getAllNewMapIds()

  return featuredMaps.map(featuredMap => {
    const mapImage = resolveAsset(featuredMap.fields.image)
    const category = resolveEntry(featuredMap.fields.gameCategory)
    const isDraft = draftMapIds.has(featuredMap.sys.id)
    const isChanged = changedMapIds.has(featuredMap.sys.id)
    const isNew = newMapIds.has(featuredMap.sys.id)
    
    return {
      ...featuredMap.fields,
      id: featuredMap.sys.id,
      updatedAt: featuredMap.sys.updatedAt,
      image: mapImage,
      gameCategory: category,
      isDraft: isDraft,
      isChanged: isChanged,
      isNew: isNew
    }
  })
}

const getDraftsOrChanged = async () => {
  const featuredMaps = await managementClient.entry.getMany({
    query: {
      content_type: 'featuredMaps'
    }
  })
  
  const draftMapIds = new Set<string>()
  const changedMapIds = new Set<string>()

  featuredMaps.items.forEach(map => {
    if (!map.sys.publishedVersion) {
      draftMapIds.add(map.sys.id)
    } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
      changedMapIds.add(map.sys.id)
    }
  })

  return {
    draftMapIds,
    changedMapIds
  }
}
