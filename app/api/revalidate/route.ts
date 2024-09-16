import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getMapBySlug } from "@/data/data"
import { serverEnv } from "@/env/server"
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas"

export async function PUT(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Revalidate-Secret')
 
  if (secret !== serverEnv.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const bodyValidation = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!bodyValidation.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body' }, { status: 400 })
  }

  const { slug } = bodyValidation.data
  const map = await getMapBySlug(slug)
  if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 404 })
    
  const category = map.fields.gameCategory
  const path = `/${category?.fields.slug}/${map.fields.slug}`

  revalidatePath(path)
  return Response.json({ revalidated: true, message: `${path} Revalidated` }, { status: 201 })
}