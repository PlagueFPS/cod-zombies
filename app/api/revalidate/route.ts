import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { revalidateTag } from "next/cache"

export async function POST(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Webhook-Secret')
  
  if (secret === process.env.REVALIDATE_SECRET) {
    const tag = req.nextUrl.searchParams.get('tag')
    if (tag) {
      revalidateTag(tag)
      return Response.json({ message: `${tag} revalidated`, time: Date.now() }, { status: 201 })
    }
    else return Response.json({ message: 'No tag provided' }, { status: 401 })
  }
  else return Response.json({ message: 'Invalid Secret' }, { status: 401 })
}