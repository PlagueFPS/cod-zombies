import { headers } from "next/headers"
import { env } from "@/env"
import { kv } from "@vercel/kv"
import { CACHE_KEYS, NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"
import { revalidateTag } from "next/cache"
import { authorizedRequest } from "@/utils/functions"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization')

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  try {
    const mapKeys = await kv.keys(`${NEW_MAP_PREFIX}*`)
    if (mapKeys.length > 0) {
      for (const key of mapKeys) {
        try {
          const exists = await kv.exists(key)

          if (!exists) {
            revalidateTag(`${CACHE_KEYS.FEATURED_MAPS.ALL}`) // Key has expired, revalidate any data that uses this map
          }
        } 
        catch (error) {
          console.error(`[CRON] Error processing map key: ${key}`, error)
        }
      }
    }

    const categoryKeys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
    if (categoryKeys.length > 0) {
      for (const key of categoryKeys) {
        try {
          const exists = await kv.exists(key)
  
          if (!exists) {
            revalidateTag(`${CACHE_KEYS.GAME_CATEGORIES}`) // Key has expired, revalidate any data that uses this category
          }
        } 
        catch (error) {
          console.error(`[CRON] Error processing category key: ${key}`, error)
        }
      }
    }
  } 
  catch (error) {
    console.error("[CRON] Error in checkstatus cron job", error)
    return Response.json({ success: false }, { status: 500 })
  }

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true })
}
