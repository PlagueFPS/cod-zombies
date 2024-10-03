import "server-only"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import { cache } from "react"
import { calculateSkip, createFeaturedMapsDTO } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT, MAP_LIMIT } from "@/utils/constants"
import { nextCache } from "./cache"
import { z } from "zod"
import type { MinifiedFeaturedMap } from "@/types/FeaturedMap"

export const getFeaturedMaps = cache(async (draftMode: boolean) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    select: ["sys.id", "sys.updatedAt", "fields"]
  }, draftMode)
  
  return await createFeaturedMapsDTO(featuredMaps.items)
})

export const getFeaturedMapById = cache(async (draftMode: boolean, id: string) => {
  const featuredMaps = await getEntries<TypeFeaturedMapsSkeleton>({
    content_type: 'featuredMaps',
    order: ['-sys.createdAt'],
    'sys.id': id,
    select: ["sys.id", "sys.updatedAt", "fields"]
  }, draftMode)
  
  const featuredMapsDTO = await createFeaturedMapsDTO(featuredMaps.items)
  return featuredMapsDTO.find(map => map.id === id)
})

export const getFeaturedMapsByCategory = async (draftMode: boolean, category: string) => {
  if (draftMode || IN_DEVELOPMENT) {
    return await INTERNAL_getFeaturedMapsByCategory(draftMode, category)
  } else return getCachedFeaturedMapsByCategory({ category })
}

export const getFeaturedMapBySlug = async (draftMode: boolean, slug: string) => {
  if (draftMode || IN_DEVELOPMENT) {
    return await INTERNAL_getFeaturedMapBySlug(draftMode, slug)
  }
  else return await getCachedFeaturedMap({ slug })
}

export const getPaginatedFeaturedMaps = async (draftMode: boolean, page: number) => {
  if (draftMode || IN_DEVELOPMENT) {
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

const getCachedFeaturedMapsByCategory = nextCache({
  args: {
    category: z.string().trim()
  },
  handler: async ({ category }) => {
    return await INTERNAL_getFeaturedMapsByCategory(false, category)
  },
  revalidateTags: ({ category }) => 
    [CACHE_KEYS.FEATURED_MAPS.ALL, CACHE_KEYS.FEATURED_MAPS.CATEGORY(category)]
})

const getCachedFeaturedMap = nextCache({
  args: {
    slug: z.string().trim()
  },
  handler: async ({ slug }) => {
    return await INTERNAL_getFeaturedMapBySlug(false, slug)
  },
  revalidateTags: async ({ slug }) => {
    const map = await INTERNAL_getFeaturedMapBySlug(false, slug)
    if (!map) return []

    return [`${CACHE_KEYS.FEATURED_MAPS.ALL}`, `${CACHE_KEYS.FEATURED_MAPS.POST(map.id)}`]
  }
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

  const featuredMapsDTO = await createFeaturedMapsDTO(featuredMaps.items)
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

  const featuredMapsDTO = await createFeaturedMapsDTO(featuredMaps.items)
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

  const featuredMapsDTO: MinifiedFeaturedMap[] = await createFeaturedMapsDTO(featuredMaps.items)
  return {
    featuredMaps: featuredMapsDTO,
    totalMaps: featuredMaps.total
  }
})