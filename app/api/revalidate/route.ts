import { revalidateTag } from "next/cache"

export async function POST() {
  console.log('Revalidating maps and categories...')
  revalidateTag('maps')
  revalidateTag('categories')
  console.log('Maps and Categories Revalidated')
  return Response.json({ message: 'Maps and Categories Revalidated' }, { status: 201 })
}