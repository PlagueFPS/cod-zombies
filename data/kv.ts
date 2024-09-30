import { kv } from "@vercel/kv"
import { NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"
import { cache } from "react"

const oneWeek = 7 * 24 * 60 * 60 // 1 week in seconds

export const storeNewMapId = cache(async (mapId: string, createdAt: string) => {
  try {
    await kv.set(`${NEW_MAP_PREFIX}${mapId}`, createdAt, { ex: oneWeek, nx: true })
  } catch (error) {
    console.error(`[KV] Error storing new map id: ${mapId}`, error)
  }
})

export const getAllNewMapIds = cache(async () => {
  try {
    const keys = await kv.keys(`${NEW_MAP_PREFIX}*`)
    if (keys.length > 0) {
      return new Set(keys.map(key => key.replace(NEW_MAP_PREFIX, "")))
    }
    return new Set<string>()
  } catch (error) {
    console.error(`[KV] Error getting all new map ids`, error)
    return new Set<string>()
  }
})

export const storeNewCategoryId = cache(async (categoryId: string, createdAt: string) => {
  try {
    await kv.set(`${NEW_CATEGORY_PREFIX}${categoryId}`, createdAt, { ex: oneWeek, nx: true })
  } catch (error) {
    console.error(`[KV] Error storing new category id: ${categoryId}`, error)
  }
})

export const getAllNewCategoryIds = cache(async () => {
  try {
    const keys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
    if (keys.length > 0) {
      return new Set(keys.map(key => key.replace(NEW_CATEGORY_PREFIX, "")))
    }
    return new Set<string>()
  } catch (error) {
    console.error(`[KV] Error getting all new category ids`, error)
    return new Set<string>()
  }
})