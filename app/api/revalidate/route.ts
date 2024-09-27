import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getFeaturedMapById } from "@/data/featuredMaps"
import { env } from "@/env"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"
import { isFirstTimePublish } from "@/utils/contentful-utils"

export async function PUT(req: NextRequest) {
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
 
  if (secret !== env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const bodyValidation = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!bodyValidation.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body' }, { status: 400 })
  }

  const { mapId, createdAt, updatedAt } = bodyValidation.data
  // Manually setting draftMode to false to prevent trying to revalidate draft content
  const map = await getFeaturedMapById(false, mapId)
  if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 404 })

  const category = map.gameCategory
  
  if (isFirstTimePublish(createdAt, updatedAt)) { // revalidate the category page if it is a newly created map
    const categoryPath = `/${category?.fields.slug}`
    revalidatePath(categoryPath)

    return Response.json({ revalidated: true, message: `${categoryPath} Revalidated` }, { status: 201 })
  }
  else { // revalidate the map page if it is an updated map
    const mapPath = `/${category?.fields.slug}/${map.slug}`
    revalidatePath(mapPath)
    
    return Response.json({ revalidated: true, message: `${mapPath} Revalidated` }, { status: 201 })
  }
}

export async function DELETE(req: NextRequest) {
  const headersList = await headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
 
  if (secret !== env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }
  
  const bodyValidation = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!bodyValidation.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body' }, { status: 400 })
  }

  const { mapId } = bodyValidation.data
  // Manually setting draftMode to true to be able to remove unpublished maps
  const map = await getFeaturedMapById(true, mapId)
  if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 404 })

  const category = map.gameCategory
  const mapPath = `/${category?.fields.slug}/${map.slug}`
  const categoryPath = `/${category?.fields.slug}`
  // revalidate anywhere the map exists to remove it
  revalidatePath(mapPath)
  revalidatePath(categoryPath)

  return Response.json({ revalidated: true, message: `${mapPath} and ${categoryPath} Revalidated` }, { status: 201 })
}
