import "server-only"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import { cache } from "react"
import { resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import type { Entry } from "contentful"
import { managementClient } from "@/contentful/contentful-management"
import { MAP_LIMIT } from "@/utils/constants"

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

const createFeaturedMapsDTO = async (featuredMaps: Entry<TypeFeaturedMapsSkeleton, undefined, string>[]) => {
  const { draftMaps, changedMaps } = await getDraftsOrChanged()

  return featuredMaps.map(featuredMap => {
    const mapImage = resolveAsset(featuredMap.fields.image)
    const category = resolveEntry(featuredMap.fields.gameCategory)
    const draft = draftMaps.some(map => map.sys.id === featuredMap.sys.id)
    const changed = changedMaps.some(map => map.sys.id === featuredMap.sys.id)
    
    return {
      ...featuredMap.fields,
      id: featuredMap.sys.id,
      updatedAt: featuredMap.sys.updatedAt,
      image: mapImage,
      gameCategory: category,
      isDraft: draft,
      isChanged: changed
    }
  })
}

const getDraftsOrChanged = async () => {
  const featuredMaps = await managementClient.entry.getMany({
    query: {
      content_type: 'featuredMaps'
    }
  })
  
  const draftMaps = featuredMaps.items.filter(map => !map.sys.publishedVersion)
  const changedMaps = featuredMaps.items.filter(map => !!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2)
  return {
    draftMaps,
    changedMaps
  }
}
