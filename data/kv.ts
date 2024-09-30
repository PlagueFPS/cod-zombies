import { kv } from "@vercel/kv"
import { NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"
import { cache } from "react"

const oneWeek = 7 * 24 * 60 * 60 // 1 week in seconds

export const storeNewMapId = cache(async (mapId: string, createdAt: string) => {
  await kv.set(`${NEW_MAP_PREFIX}${mapId}`, createdAt, { ex: oneWeek, nx: true })
})

export const getAllNewMapIds = cache(async () => {
  const keys = await kv.keys(`${NEW_MAP_PREFIX}*`)
  return new Set(keys.map(key => key.replace(NEW_MAP_PREFIX, "")))
})

export const storeNewCategoryId = cache(async (categoryId: string, createdAt: string) => {
  await kv.set(`${NEW_CATEGORY_PREFIX}${categoryId}`, createdAt, { ex: oneWeek, nx: true })
})

export const getAllNewCategoryIds = cache(async () => {
  const keys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
  return new Set(keys.map(key => key.replace(NEW_CATEGORY_PREFIX, "")))
})