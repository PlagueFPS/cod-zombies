import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidateTag } from "next/cache"
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

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the mapId as new for 1 week
        await storeNewMapId(mapId, createdAt)
        return Response.json({ updated: true, message: `${mapId} stored as new` }, { status: 201 })
      }
      else { // revalidate the specific map if it is an updated map
        revalidateTag(`${CACHE_KEYS.FEATURED_MAPS}-${mapId}`)
        return Response.json({ revalidated: true, message: `${CACHE_KEYS.FEATURED_MAPS}-${mapId} Revalidated` }, { status: 201 })
      }
    }  
    case 'category': {
      const { categoryId, createdAt, updatedAt } = payload.data

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the categoryId as new for 1 week
        await storeNewCategoryId(categoryId, createdAt)
        return Response.json({ updated: true, message: `${categoryId} stored as new` }, { status: 201 })
      }
      else { // revalidate the specific category if it is an updated category
        revalidateTag(`${CACHE_KEYS.GAME_CATEGORIES}-${categoryId}`)
        return Response.json({ revalidated: true, message: `${CACHE_KEYS.GAME_CATEGORIES}-${categoryId} Revalidated` }, { status: 201 })
      }
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

      // Invalidate the map ID
      revalidateTag(`${CACHE_KEYS.FEATURED_MAPS}-${mapId}`)
      return Response.json({ removed: true, message: `${CACHE_KEYS.FEATURED_MAPS}-${mapId} Revalidated` }, { status: 200 })
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
