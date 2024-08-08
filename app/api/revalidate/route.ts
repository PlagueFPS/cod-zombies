import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { getMapBySlug } from "@/data/data"
import { resolveEntry } from "@/utils/contentful-utils"

export async function PUT(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Webhook-Secret')
  
  if (secret === process.env.REVALIDATE_SECRET) {
    const revalidateMethod = req.nextUrl.searchParams.get('method')
    switch(revalidateMethod) {
      case 'tag' : {
        const tag = req.nextUrl.searchParams.get('tag')
        if (tag) {
          revalidateTag(tag)
          return Response.json({ revalidated: true, message: `${tag} revalidated`, time: Date.now() }, { status: 201 })
        }
        else return Response.json({ revalidated: false, message: 'No tag provided' }, { status: 401 })
      } 
      case 'path': {
        const body = await req.json()
        const slug = body.slug
        const map = await getMapBySlug(slug)
        if (!map) return Response.json({ revalidated: false, message: 'Invalid Slug' }, { status: 401 })
        const category = resolveEntry(map.fields.gameCategory)
        const path = `/${category?.fields.slug}/${map.fields.slug}`
        revalidatePath(path)
        return Response.json({ revalidated: true, message: `${path} revalidated`, time: Date.now() }, { status: 201 })
      }
    }
    
  }
  else return Response.json({ revalidated: false, message: 'Invalid Secret' }, { status: 401 })
}