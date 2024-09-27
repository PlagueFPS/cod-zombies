import "server-only"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { resolveAsset } from "@/utils/contentful-utils"
import { unstable_cache } from "next/cache"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"

const CACHE_TAG = CACHE_KEYS.GAME_CATEGORIES

const fetchGameCategories = async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  }, draftMode)

  return createGameCategoryDTO(gameCategories.items)
}

const cachedFetchGameCategories = unstable_cache(
  fetchGameCategories,
  ['game-categories'],
  { tags: [CACHE_TAG] }
)

export const getGameCategories = cache(async (draftMode: boolean) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategories(true)
  }
  return cachedFetchGameCategories(false)
})

export const getGameCategoryBySlug = cache(async (draftMode: boolean, slug: string) => {
    const categories = await getGameCategories(draftMode)
    return categories.find(category => category.slug === slug)
  }
)

export const getGameCategoryById = cache(async (draftMode: boolean, id: string) => {
    const categories = await getGameCategories(draftMode)
    return categories.find(category => category.id === id)
  }
)

const createGameCategoryDTO = (gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
  return gameCategorys.map(gameCategory => ({
    ...gameCategory.fields,
    id: gameCategory.sys.id,
    image: resolveAsset(gameCategory.fields.image)
  }))
}