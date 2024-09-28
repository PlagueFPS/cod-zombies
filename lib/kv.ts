import { kv } from "@vercel/kv"
import { NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"

const oneWeek = 7 * 24 * 60 * 60 // 1 week in seconds

export const storeNewMapId = async (mapId: string, createdAt: string) => {
  await kv.set(`${NEW_MAP_PREFIX}${mapId}`, createdAt, { ex: oneWeek, nx: true })
}

export const getNewMapId = async (mapId: string) => {
  const value = await kv.get(`${NEW_MAP_PREFIX}${mapId}`)
  if (!value) return
  return value
}

export const getAllNewMapIds = async () => {
  const keys = await kv.keys(`${NEW_MAP_PREFIX}*`)
  if (keys.length > 0) {
    const values = await kv.mget(...keys)
    const newMapIds = new Set<string>()
    keys.forEach((key, index) => {
      if (values[index]) {
        newMapIds.add(key.replace(NEW_MAP_PREFIX, ""))
      }
    })

    return newMapIds
  }
}

export const storeNewCategoryId = async (categoryId: string, createdAt: string) => {
  await kv.set(`${NEW_CATEGORY_PREFIX}${categoryId}`, createdAt, { ex: oneWeek, nx: true })
}

export const getNewCategoryId = async (categoryId: string) => {
  const value = await kv.get(`${NEW_CATEGORY_PREFIX}${categoryId}`)
  if (!value) return
  return value
}

export const getAllNewCategoryIds = async () => {
  const keys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
  if (keys.length > 0) {
    const values = await kv.mget(...keys)
    const newCategoryIds = new Set<string>()
    keys.forEach((key, index) => {
      if (values[index]) {
        newCategoryIds.add(key.replace(NEW_CATEGORY_PREFIX, ""))
      }
    })
  
    return newCategoryIds
  }
}