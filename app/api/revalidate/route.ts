import { revalidateTag } from "next/cache"

export default async function POST() {
  console.log('Revalidating Maps...')
  revalidateTag('maps')
  console.log('Maps Revalidated')
  return Response.json({ message: 'Maps Revalidated' }, { status: 201 })
}