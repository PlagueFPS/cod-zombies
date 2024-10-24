import "server-only"
import { cache } from "react"
import { nextCache } from "./cache"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import type { MinifiedFeaturedMap } from "@/types/FeaturedMap"
import { calculateSkip, createFeaturedMapsDTO, sortMaps } from "@/utils/contentful-utils"
import { CACHE_KEYS, MAP_LIMIT } from "@/utils/constants"
import { z } from "zod"

export const getFeaturedMaps = cache(async (draftMode: boolean) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    select: ["sys.id", "sys.updatedAt", "fields"]
  }, draftMode)
  const sortedMaps = featuredMaps.items.sort(sortMaps)

  return await createFeaturedMapsDTO(sortedMaps)
})

export const getFeaturedMapById = cache(async (draftMode: boolean, id: string) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'sys.id': id,
    select: ["sys.id", "sys.updatedAt", "fields"]
  }, draftMode)
  const sortedMaps = featuredMaps.items.sort(sortMaps)
  
  const featuredMapsDTO = await createFeaturedMapsDTO(sortedMaps)
  return featuredMapsDTO.find(map => map.id === id)
})

export const getFeaturedMapsByCategory = async (draftMode: boolean, category: string) => {
  return await INTERNAL_getFeaturedMapsByCategory(draftMode, category)
}

export const getFeaturedMapBySlug = async (draftMode: boolean, slug: string) => {
  return await INTERNAL_getFeaturedMapBySlug(draftMode, slug)
}

export const getPaginatedFeaturedMaps = async (draftMode: boolean, page: number) => {
  if (draftMode) {
    return await INTERNAL_getPaginatedFeaturedMaps(draftMode, page)
  }
  else return await getCachedPaginatedFeaturedMaps({ page })
}

const getCachedPaginatedFeaturedMaps = nextCache({
  args: {
    page: z.number().int().positive(),
  },
  handler: async ({ page }) => {
    return await INTERNAL_getPaginatedFeaturedMaps(false, page)
  },
  revalidateTags: ({ page }) => 
    [
      CACHE_KEYS.FEATURED_MAPS.ALL, 
      CACHE_KEYS.FEATURED_MAPS.PAGINATION(page)
    ],
})

const INTERNAL_getPaginatedFeaturedMaps = cache(async (draftMode: boolean, page: number) => {
  const skip = calculateSkip(page, MAP_LIMIT)
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    select: [
      "sys.id", "sys.updatedAt", "fields.title", "fields.slug",
      "fields.image", "fields.gameCategory", "fields.description"
    ],
    skip,
    limit: MAP_LIMIT
  }, draftMode)
  const sortedMaps = featuredMaps.items.sort(sortMaps)

  const featuredMapsDTO = await createFeaturedMapsDTO(sortedMaps)
  const totalPages = Math.ceil(featuredMaps.total / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1

  return { 
    featuredMaps: featuredMapsDTO as MinifiedFeaturedMap[],
    totalMaps: featuredMaps.total,
    totalPages,
    currentPage,
    prevPage,
    nextPage
  }
})

const INTERNAL_getFeaturedMapBySlug = cache(async (draftMode: boolean, slug: string) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    'fields.slug': slug,
    select: ["sys.id", "sys.updatedAt", "fields"]
  }, draftMode)
  const sortedMaps = featuredMaps.items.sort(sortMaps)

  const featuredMapsDTO = await createFeaturedMapsDTO(sortedMaps)
  return featuredMapsDTO.find(map => map.slug === slug)
})

const INTERNAL_getFeaturedMapsByCategory = cache(async (draftMode: boolean, category: string) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    'fields.gameCategory.sys.contentType.sys.id': 'gameCategory',
    'fields.gameCategory.fields.slug': category,
    select: [
      "sys.id", "sys.updatedAt", "fields.title", "fields.slug", 
      "fields.image", "fields.gameCategory", "fields.description"
    ],
    order: ["-sys.createdAt"]
  }, draftMode)
  const sortedMaps = featuredMaps.items.sort(sortMaps)

  const featuredMapsDTO: MinifiedFeaturedMap[] = await createFeaturedMapsDTO(sortedMaps)
  return {
    featuredMaps: featuredMapsDTO,
    totalMaps: featuredMaps.total
  }
})