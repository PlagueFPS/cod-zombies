import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidateTag } from "next/cache"

export async function PUT(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Webhook-Secret')
  
  if (secret === process.env.REVALIDATE_SECRET) {
    const tag = req.nextUrl.searchParams.get('tag')
    if (tag) {
      revalidateTag(tag)
      return Response.json({ revalidated: true, message: `${tag} revalidated`, time: Date.now() }, { status: 204 })
    }
    else return Response.json({ revalidated: false, message: 'No tag provided' }, { status: 401 })
  }
  else return Response.json({ revalidated: false, message: 'Invalid Secret' }, { status: 401 })
}