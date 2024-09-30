import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { getFeaturedMapById } from "@/data/featuredMaps"
import { env } from "@/env"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"
import { isFirstTimePublish } from "@/utils/contentful-utils"
import { CACHE_KEYS } from "@/utils/constants"
import { storeNewCategoryId, storeNewMapId } from "@/data/kv"
import { authorizedRequest } from "@/utils/functions"

export async function PUT(req: NextRequest) {
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const webhookBody = await req.json()

  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const payload = ContentfulWebhookBodySchema.safeParse(webhookBody)
  if (!payload.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body', errors: payload.error.flatten().fieldErrors }, { status: 400 })
  }

  switch (payload.data.type) {
    case 'map': {
      const { mapId, createdAt, updatedAt } = payload.data
      // Manually setting draftMode to false to prevent trying to revalidate draft content
      const map = await getFeaturedMapById(false, mapId)
      if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 404 })

      const category = map.gameCategory
        
      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the mapId as new for 1 week
        await storeNewMapId(mapId, createdAt)
        const categoryPath = `/${category?.fields.slug}`
        
        // revalidate the category page if it is a newly created map
        revalidatePath(categoryPath)
        return Response.json({ revalidated: true, message: `${categoryPath} Revalidated` }, { status: 201 })
      }
      else { // revalidate the map page if it is an updated map
        const mapPath = `/${category?.fields.slug}/${map.slug}`
        revalidatePath(mapPath)
        
        return Response.json({ revalidated: true, message: `${mapPath} Revalidated` }, { status: 201 })
      }
    }  
    case 'category': {
      const { categoryId, createdAt, updatedAt } = payload.data

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the categoryId as new for 1 week
        await storeNewCategoryId(categoryId, createdAt)
      }
      return Response.json({ updated: true, message: `${categoryId} stored as new` }, { status: 201 })
    }
  }
}

export async function PATCH(req: NextRequest) {
  // This endpoint is for removing unpublished maps & categories via revalidation from the frontend
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const webhookBody = await req.json()
 
  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return Response.json({ removed: false, message: 'Unauthorized Request' }, { status: 401 })
  }
  
  const payload = ContentfulWebhookBodySchema.safeParse(webhookBody)
  if (!payload.success) {
    return Response.json({ removed: false, message: 'Invalid Request Body', errors: payload.error.flatten().fieldErrors }, { status: 400 })
  }

  switch (payload.data.type) {
    case 'map': {
      const { mapId } = payload.data
      // Manually setting draftMode to true to be able to remove unpublished maps
      const map = await getFeaturedMapById(true, mapId)
      if (!map) return Response.json({ removed: false, message: 'Map Not Found' }, { status: 404 })
      
      const category = map.gameCategory
      const mapPath = `/${category?.fields.slug}/${map.slug}`
      const categoryPath = `/${category?.fields.slug}`

      // revalidate anywhere the map exists to remove it
      revalidatePath(mapPath)
      revalidatePath(categoryPath)
      return Response.json({ removed: true, message: `${mapPath} and ${categoryPath} Revalidated` }, { status: 200 })
    }
    case 'category': {
      const { categoryId } = payload.data

      // Invalidate the category ID
      revalidateTag(`${CACHE_KEYS.GAME_CATEGORIES}-${categoryId}`)
      return Response.json({ removed: true, message: `${CACHE_KEYS.GAME_CATEGORIES}-${categoryId} Revalidated` }, { status: 200 })
    }
    default: {
      return Response.json({ removed: false, message: 'Invalid Request Type' }, { status: 400 })
    }
  }
}
