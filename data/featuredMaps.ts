import "server-only"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import { cache } from "react"
import { createFeaturedMapsDTO } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT, MAP_LIMIT } from "@/utils/constants"
import { nextCache } from "./cache"
import { z } from "zod"
import { FeaturedMap } from "@/types/FeaturedMap"

interface FeaturedMapsResult {
  featuredMaps: FeaturedMap[];
  totalMaps: number;
}

interface PaginatedFeaturedMapsResult extends FeaturedMapsResult {
  totalPages: number
  currentPage: number
  prevPage: number
  nextPage: number
}

async function getFeaturedMapsBase(draftMode: boolean): Promise<FeaturedMapsResult>
async function getFeaturedMapsBase(draftMode: boolean, page: number): Promise<PaginatedFeaturedMapsResult>
async function getFeaturedMapsBase(draftMode: boolean, page?: number): Promise<FeaturedMapsResult | PaginatedFeaturedMapsResult> {
  // if (IN_DEVELOPMENT || draftMode) {
  //   const { featuredMaps, totalMaps } = await fetchFeaturedMaps(true)
  //   if (page) return getPaginatedFeaturedMaps(featuredMaps, totalMaps, page)
  //   return { featuredMaps, totalMaps }
  // }
  const { featuredMaps, totalMaps } = await getFeaturedMapsFromCache(false)
  if (page) return getPaginatedFeaturedMaps(featuredMaps, totalMaps, page)
  return {
    featuredMaps,
    totalMaps
  }
}

export const getFeaturedMaps = cache(getFeaturedMapsBase)

const getPaginatedFeaturedMaps = cache(async (featuredMaps: FeaturedMap[], totalMaps: number, page: number) => {
  const totalPages = Math.ceil(totalMaps / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
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

export const getFeaturedMapBySlug = cache(async (draftMode: boolean, slug: string) => {
  return fetchFeaturedMap(draftMode, slug)
})

export const getFeaturedMapById = cache(async (draftMode: boolean, id: string) => {
  return fetchFeaturedMap(draftMode, id)
})

const getFeaturedMapsFromCache = cache(async (draftMode: false) => {
  const { featuredMaps, totalMaps } = await fetchFeaturedMaps(draftMode)
  const cachedMaps = await Promise.all(featuredMaps.map(({ id }) => getFeaturedMapFromCache({ mapId: id, draftMode })))
  return {
    featuredMaps: cachedMaps.filter(map => map !== null),
    totalMaps
  }
})

const getFeaturedMapFromCache = nextCache({
  args: {
    mapId: z.string(),
    draftMode: z.literal(false)
  },
  handler: async ({ mapId, draftMode }) => {
    const map = await fetchFeaturedMap(draftMode, mapId)
    if (map) {
      const { body, ...restOfMap } = map
      return restOfMap
    }
    return null
  },
  revalidateTags: ({ result }) => {
    return result ? [`${CACHE_KEYS.FEATURED_MAPS}-${result.id}`] : []
  }
})

const fetchFeaturedMaps = cache(async (draftMode: boolean) => {
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

const fetchFeaturedMap = cache(async (draftMode: boolean, idOrSlug: string) => {
  const { featuredMaps } = await fetchFeaturedMaps(draftMode)
  return featuredMaps.find(map => map.id === idOrSlug || map.slug === idOrSlug)
})
