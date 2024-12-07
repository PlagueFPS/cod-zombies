import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { env } from "@/env"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"
import { isFirstTimePublish } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { storeNewMapId } from "@/data/featuredMaps"
import { storeNewCategoryId } from "@/data/gameCategory"
import { authorizedRequest } from "@/utils/functions"
import { getFeaturedMapById, revalidatePagination } from "@/data/featuredMaps"
import { getGameCategoryById } from "@/data/gameCategory"

export async function PUT(req: NextRequest) {
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const webhookBodyPromise = req.json()

  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return Response.json({ updated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const webhookBody = await webhookBodyPromise
  const payload = ContentfulWebhookBodySchema.safeParse(webhookBody)
  if (!payload.success) {
    return Response.json({ updated: false, message: 'Invalid Request Body', errors: payload.error.flatten().fieldErrors }, { status: 400 })
  }

  switch (payload.data.type) {
    case 'map': {
      const { mapId, createdAt, updatedAt } = payload.data 

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the mapId as new for 1 week 
        // revalidate all pagination pages to correctly update each page
        // Since a new map is being added
        await storeNewMapId(mapId, createdAt)
        revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
        return Response.json({ updated: true, message: `${mapId} stored as new` }, { status: 201 })
      }
      else { // revalidate the specific map if it is an updated map
        const map = await getFeaturedMapById(IN_DEVELOPMENT, mapId)
        if (!map) return Response.json({ revalidate: false, message: 'Map not found' }, { status: 404 })
        
        const path = `/${map.category.slug}/${map.slug}`
        revalidatePath(path)

        // revalidate the paginated page the map currently lives on
        const { paginationPage } = await revalidatePagination(mapId)
        return Response.json({ updated: true, message: `${path} and ${paginationPage} Revalidated` }, { status: 201 })
      }
    }  
    case 'category': {
      const { categoryId, createdAt, updatedAt } = payload.data

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the categoryId as new and revalidate all category data
        await storeNewCategoryId(categoryId, createdAt)
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
        return Response.json({ updated: true, message: `${categoryId} stored as new` }, { status: 201 })
      }
      else {
        const category = await getGameCategoryById(IN_DEVELOPMENT, categoryId)
        if (!category) return Response.json({ updated: false, message: 'Category not found' }, { status: 404 })

        // revalidate all category data and the path to re-run generateMetadata
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
        revalidatePath(`/${category.slug}`)
        return Response.json({ updated: true, message: `${CACHE_KEYS.GAME_CATEGORIES.ALL} Revalidated` }, { status: 201 })
      }
    }
    default: {
      return Response.json({ updated: false, message: "Invalid Request Type" }, { status: 400 })
    }
  }
}

export async function PATCH(req: NextRequest) {
  // This endpoint is for removing unpublished maps & categories via revalidation from the frontend
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const webhookBodyPromise = req.json()
 
  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return Response.json({ removed: false, message: 'Unauthorized Request' }, { status: 401 })
  }
  
  const webhookBody = await webhookBodyPromise
  const payload = ContentfulWebhookBodySchema.safeParse(webhookBody)
  if (!payload.success) {
    return Response.json({ removed: false, message: 'Invalid Request Body', errors: payload.error.flatten().fieldErrors }, { status: 400 })
  }

  switch (payload.data.type) {
    case 'map': {
      const { mapId } = payload.data

      // manually setting draftMode to true because we are fetching an unpublished map
      const map = await getFeaturedMapById(true, mapId)
      if (!map) return Response.json({ removed: false, message: 'Map not found' }, { status: 404 })
      const mapPath = `/${map.category.slug}/${map.slug}`
      const categoryPath = `/${map.category.slug}`

      // revalidate the map data to update the Data Cache
      revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      // revalidate the map and category page to update the ISR cache
      revalidatePath(mapPath)
      revalidatePath(categoryPath)
      return Response.json({ 
        removed: true, 
        message: `${CACHE_KEYS.FEATURED_MAPS.ALL}, ${categoryPath}, and ${mapPath} Revalidated` 
      }, { status: 200 })
    }
    case 'category': {
      const { categoryId } = payload.data

      // manually setting draftMode to true because we are fetching an unpublished map
      const category = await getGameCategoryById(true, categoryId)
      if (!category) return Response.json({ removed: false, message: 'Category not found' }, { status: 404 })
      const categoryPath = `/${category.slug}`

      // revalidate the category data to update the Data Cache
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      // revalidate the category page to update the ISR cache
      revalidatePath(categoryPath)
      return Response.json({ removed: true, message: `${CACHE_KEYS.GAME_CATEGORIES.ALL} and ${categoryPath} Revalidated` }, { status: 200 })
    }
    default: {
      return Response.json({ removed: false, message: 'Invalid Request Type' }, { status: 400 })
    }
  }
}
