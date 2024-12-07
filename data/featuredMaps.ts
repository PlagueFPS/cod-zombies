import "server-only"
import { cache } from "react"
import { nextCache } from "./cache"
import { getEntries } from "@/contentful/contentful"
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types"
import type { MinifiedFeaturedMap } from "@/types/FeaturedMap"
import { calculateSkip, createFeaturedMapsDTO, sortMaps } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT, MAP_LIMIT, MAX_NEW_TIME } from "@/utils/constants"
import { z } from "zod"
import { db } from "@/db/db"
import { maps } from "@/db/schema"
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { eq } from "drizzle-orm"
import { managementClient } from "@/contentful/contentfulManagement"

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
  if (draftMode) return await INTERNAL_getPaginatedFeaturedMaps(draftMode, page)
  return await getCachedPaginatedFeaturedMaps({ page })
}

export const getAllNewMapIds = async () => {
  return await getCachedAllNewMapIds()
}

export const getDraftsOrChanged = cache(async (contentType: "featuredMaps" | "gameCategory") => {
  const featuredMaps = await managementClient.entry.getMany({
    query: {
      content_type: contentType
    }
  })
  
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()

  featuredMaps.items.forEach(map => {
    if (!map.sys.publishedVersion) {
      draftIds.add(map.sys.id)
    } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
      changedIds.add(map.sys.id)
    }
  })

  return {
    draftIds,
    changedIds
  }
})

export const revalidatePagination = async (mapId: string) => {
  const maps = await getFeaturedMaps(IN_DEVELOPMENT)
  const mapIndex = maps.findIndex(map => map.id === mapId)
  if (mapIndex === -1) return { paginationPage: null }

  const paginationPage = Math.floor(mapIndex / MAP_LIMIT) + 1
  revalidateTag(CACHE_KEYS.FEATURED_MAPS.PAGINATION(paginationPage))
  return { paginationPage }
}

export const storeNewMapId = async (mapId: string, createdAt: string) => {
  await db.insert(maps).values({ mapId, publishedAt: createdAt })
}

export const enforceNewMapStatus = async () => {
  try {
   const newMaps = await db.select({
     mapId: maps.mapId, 
     publishedAt: maps.publishedAt 
   }).from(maps)
 
   newMaps.forEach(async map => {
     if (!map.publishedAt) return
     if (typeof map.publishedAt !== 'string') {
      await db.delete(maps).where(eq(maps.mapId, map.mapId))
      console.log(`Stored Map publishedAt was not a string. Check storing logic`, map.publishedAt)
      await submitFeedbackUseCase({
        title: "Map Status Error",
        name: "New Map Enforcement",
        label: "issue",
        feedback: `Stored Map publishedAt was not a string. Check storing logic. ID: ${map.mapId}`
      })
      return
     }
 
     const currentTime = Date.now()
     const creationTime = new Date(map.publishedAt).getTime()
 
     if (currentTime - creationTime > MAX_NEW_TIME) {
       await db.delete(maps).where(eq(maps.mapId, map.mapId))
       const featuredMap = await getFeaturedMapById(IN_DEVELOPMENT, map.mapId)
       if (!featuredMap) {
         // If the map is not found, skip revalidation
         console.error(`Could not find map for ID: ${map.mapId}`)
         await submitFeedbackUseCase({
          title: "Map Status Error",
          name: "New Map Enforcement",
          label: "issue",
          feedback: `Could not find map for ID: ${map.mapId}`
        })
         return
       }
 
       const categoryPath = `/${featuredMap.category.slug}`
       const mapPath = `/${categoryPath}/${featuredMap.slug}`
       // Revalidate the first page of pagination & Ids since it was new
       // This is to update the Data Cache
       revalidateTag(CACHE_KEYS.FEATURED_MAPS.IDS)
       revalidateTag(CACHE_KEYS.FEATURED_MAPS.PAGINATION(1))
       // Revalidate the category page the map belongs too
       // This is to update the ISR cache
       revalidatePath(categoryPath)
       // Revalidate the map slug page
       // This is to update the ISR cache
       revalidatePath(mapPath)
     } else return
   })
  } catch(error) {
     await submitFeedbackUseCase({
       title: "Map Status Error",
       name: "New Map Enforcement",
       label: "issue",
       feedback: `Error enforcing maps: ${error}`
     })
     console.error(`Error enforcing maps`, error)
     return
   }
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

const getCachedAllNewMapIds = unstable_cache(async () => {
  return await INTERNAL_getAllNewMapIds()
}, [], {
  tags: [CACHE_KEYS.FEATURED_MAPS.ALL, CACHE_KEYS.FEATURED_MAPS.IDS]
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

const INTERNAL_getAllNewMapIds = cache(async () => {
  const mapIDs = await db.select({ mapId: maps.mapId }).from(maps)
  return mapIDs
})