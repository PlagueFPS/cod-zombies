"use server"
import { revalidateTag } from "next/cache"

export default async function revalidateMaps() { // This is a temp function for revalidating unstable_cache data during development
  revalidateTag('featuredMaps')
  revalidateTag('bo1-Maps')
  console.log('Maps Revalidated.')
}