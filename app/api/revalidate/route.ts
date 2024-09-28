import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { timingSafeEqual } from "crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { getFeaturedMapById } from "@/data/featuredMaps"
import { getGameCategoryById } from "@/data/gameCategory"
import { env } from "@/env"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"
import { isFirstTimePublish } from "@/utils/contentful-utils"
import { CACHE_KEYS } from "@/utils/constants"
import { storeNewCategoryId, storeNewMapId } from "@/lib/kv"

export async function PUT(req: NextRequest) {
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret || '')
  const validSecretBuffer = encoder.encode(env.REVALIDATE_SECRET)
 
  if (!timingSafeEqual(secretBuffer, validSecretBuffer)) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const payload = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!payload.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body', errors: payload.error.message }, { status: 400 })
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
      // Manually setting draftMode to false to prevent trying to revalidate draft content
      const category = await getGameCategoryById(false, categoryId)
      if (!category) return Response.json({ revalidated: false, message: 'Category Not Found' }, { status: 404 })
      
      if (isFirstTimePublish(createdAt, updatedAt)) {
        // store the categoryId as new for 1 week
        await storeNewCategoryId(categoryId, createdAt)
      }
        // Invalidate the category data set
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES)
        return Response.json({ revalidated: true, message: `${CACHE_KEYS.GAME_CATEGORIES} Revalidated` }, { status: 201 })
    }
  }
}

export async function DELETE(req: NextRequest) {
  // This endpoint is for removing unpublished maps via revalidation from the frontend
  // We do not delete any data from Contentful or a Database
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret || '')
  const validSecretBuffer = encoder.encode(env.REVALIDATE_SECRET)
 
  if (!timingSafeEqual(secretBuffer, validSecretBuffer)) {
    return Response.json({ deleted: false, message: 'Unauthorized Request' }, { status: 401 })
  }
  
  const payload = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!payload.success) {
    return Response.json({ deleted: false, message: 'Invalid Request Body', errors: payload.error.message }, { status: 400 })
  }

  switch (payload.data.type) {
    case 'map': {
      const { mapId } = payload.data
      // Manually setting draftMode to true to be able to remove unpublished maps
      const map = await getFeaturedMapById(true, mapId)
      if (!map) return Response.json({ deleted: false, message: 'Map Not Found' }, { status: 404 })
      
      const category = map.gameCategory
      const mapPath = `/${category?.fields.slug}/${map.slug}`
      const categoryPath = `/${category?.fields.slug}`

      // revalidate anywhere the map exists to remove it
      revalidatePath(mapPath)
      revalidatePath(categoryPath)
      return Response.json({ deleted: true, message: `${mapPath} and ${categoryPath} Revalidated` }, { status: 200 })
    }
    case 'category': {
      const { categoryId } = payload.data
      // Manually setting draftMode to true to be able to remove unpublished categories
      const category = await getGameCategoryById(true, categoryId)
      if (!category) return Response.json({ deleted: false, message: 'Category Not Found' }, { status: 404 })

      // Invalidate the category data set
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES)
      return Response.json({ deleted: true, message: `${CACHE_KEYS.GAME_CATEGORIES} Revalidated` }, { status: 200 })
    }
  }
}
