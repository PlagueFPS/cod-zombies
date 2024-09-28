import { headers } from "next/headers"
import { env } from "@/env"
import { timingSafeEqual } from "crypto"
import { kv } from "@vercel/kv"
import { getFeaturedMapById } from "@/data/featuredMaps"
import { getGameCategoryById } from "@/data/gameCategory"
import { CACHE_KEYS, NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization')
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret || '')
  const validSecretBuffer = encoder.encode(`Bearer ${env.CRON_SECRET}`)

  if (!timingSafeEqual(secretBuffer, validSecretBuffer)) {
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const mapKeys = await kv.keys(`${NEW_MAP_PREFIX}*`)
  const categoryKeys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
  
  if (mapKeys.length > 0) {
    for (const key of mapKeys) {
      const exists = await kv.exists(key)
      if (!exists) {
        const mapId = key.replace(NEW_MAP_PREFIX, "")
        // Manually setting draftMode to false to prevent trying to revalidate draft content
        const map = await getFeaturedMapById(false, mapId)
        if (!map) continue
        const category = map.gameCategory
        // Key has expired, revalidate the corresponding path
        revalidatePath(`/${category?.fields.slug}/${map.slug}`)
      }
    }
  }

  if (categoryKeys.length > 0) {
    for (const key of categoryKeys) {
      const exists = await kv.exists(key)
      if (!exists) {
        const categoryId = key.replace(NEW_CATEGORY_PREFIX, "")
        // Manually setting draftMode to false to prevent trying to revalidate draft content
        const category = await getGameCategoryById(false, categoryId)
        if (!category) continue
        // Key has expired, revalidate the corresponding tag
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES)
      }
    }
  }

  return Response.json({ success: true })
}