import { kv } from "@vercel/kv"
import { CACHE_KEYS, IN_DEVELOPMENT, MAX_NEW_TIME, NEW_CATEGORY_PREFIX, NEW_MAP_PREFIX } from "@/utils/constants"
import { cache } from "react"
import { revalidateTag, revalidatePath } from "next/cache"
import { getFeaturedMapById } from "./featuredMaps"
import { getGameCategoryById } from "./gameCategory"
import { sendInternalEmailUseCase } from "@/usecases/email"

export const storeNewMapId = cache(async (mapId: string, createdAt: string) => {
  await kv.set(`${NEW_MAP_PREFIX}${mapId}`, createdAt)
})

export const getAllNewMapIds = cache(async () => {
  const keys = await kv.keys(`${NEW_MAP_PREFIX}*`)
  return new Set(keys.map(key => key.replace(NEW_MAP_PREFIX, "")))
})

export const storeNewCategoryId = cache(async (categoryId: string, createdAt: string) => {
  await kv.set(`${NEW_CATEGORY_PREFIX}${categoryId}`, createdAt)
})

export const getAllNewCategoryIds = cache(async () => {
  const keys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)
  return new Set(keys.map(key => key.replace(NEW_CATEGORY_PREFIX, "")))
})

export const enforceNewMapStatus = async () => {
  const mapKeys = await kv.keys(`${NEW_MAP_PREFIX}*`)

  for (const key of mapKeys) {
    const mapID = key.replace(NEW_MAP_PREFIX, "")
    try {
      const createdAt = await kv.get(key)
      if (!createdAt) continue
      if (typeof createdAt !== 'string') {
        await kv.del(key)
        continue
      }

      const currentTime = Date.now()
      const creationTime = new Date(createdAt).getTime()

      if (currentTime - creationTime > MAX_NEW_TIME) {
        await kv.del(key)
        const map = await getFeaturedMapById(IN_DEVELOPMENT, mapID)
        if (!map) {
          // If the map is not found, skip revalidation
          console.error(`Could not find map for ID: ${mapID}`)
          continue
        }
        const categoryPath = `/${map.category.slug}`
        const mapPath = `/${map.category.slug}/${map.slug}`
        // Revalidate the first page of pagination since it was new
        // This is to update the Data Cache
        revalidateTag(`${CACHE_KEYS.FEATURED_MAPS.PAGINATION(1)}`)
        // Revalidate the category page the map belongs too
        // This is to update the ISR cache
        revalidatePath(categoryPath)
        // Revalidate the map slug page
        // This is to update the ISR cache
        revalidatePath(mapPath)
      } else continue

    }
    catch(error) {
      await sendInternalEmailUseCase({
        subject: "Map Status Error",
        message: `Error processing map key: ${key}`
      })
      console.error(`Error processing map key: ${key}`, error)
      continue
    }
  }
}

export const enforceNewCategoryStatus = async () => {
  const categoryKeys = await kv.keys(`${NEW_CATEGORY_PREFIX}*`)

  for (const key of categoryKeys) {
    const categoryID = key.replace(NEW_CATEGORY_PREFIX, "")
    try {
      const createdAt = await kv.get(key)
      if (!createdAt) continue
      if (typeof createdAt !== 'string') {
        await kv.del(key)
        continue
      }

      const currentTime = Date.now()
      const creationTime = new Date(createdAt).getTime()

      if (currentTime - creationTime > MAX_NEW_TIME) {
        await kv.del(key)
        const category = await getGameCategoryById(IN_DEVELOPMENT, categoryID)
        if (!category) {
          // If the category is not found, skip revalidation
          console.error(`Could not find category for ID: ${categoryID}`)
          continue
        }
        // Revalidate the category data to update the Data Cache
        revalidateTag(`${CACHE_KEYS.GAME_CATEGORIES}`)
        // Revalidate the path to update the ISR cache
        revalidatePath(`/${category.slug}`)
      } else continue

    }
    catch(error) {
      await sendInternalEmailUseCase({
        subject: "Category Status Error",
        message: `Error processing category key: ${key}`
      })
      console.error(`Error processing category key: ${key}`, error)
      continue
    }
  }
}