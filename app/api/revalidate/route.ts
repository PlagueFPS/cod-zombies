import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getFeaturedMapById } from "@/data/featuredMaps"
import { env } from "@/env"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"

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

  const { mapId } = bodyValidation.data
  // Manually setting draftMode to false to prevent trying to revalidate draft content
  const map = await getFeaturedMapById(false, mapId)
  if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 404 })
    
  const category = map.gameCategory
  const path = `/${category?.fields.slug}/${map.slug}`

  revalidatePath(path)
  return Response.json({ revalidated: true, message: `${path} Revalidated` }, { status: 201 })
}