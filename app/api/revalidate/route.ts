import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getMapBySlug } from "@/data/data"

export async function PUT(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Webhook-Secret')
 
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 403 })
  }

  const body = await req.json()
  const slug = body.slug
  const map = await getMapBySlug(slug)
  if (!map) return Response.json({ revalidated: false, message: 'Map Not Found' }, { status: 401 })
  const category = map.fields.gameCategory
  const path = `/${category?.fields.slug}/${map.fields.slug}`

  revalidatePath(path)
  return Response.json({ revalidated: true, message: `${path} Revalidated` }, { status: 201 })
}