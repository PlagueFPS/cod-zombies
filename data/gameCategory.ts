import "server-only"
import { nextCache } from "@/data/cache"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import { createGameCategoryDTO } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"

export const getGameCategories = async (draftMode: boolean) => {
  if (IN_DEVELOPMENT || draftMode) {
    return INTERNAL_getGameCategories(true)
  }
  return await getCachedCategories()
}

export const getGameCategoryBySlug = async (draftMode: boolean, slug: string) => {
  if (IN_DEVELOPMENT || draftMode) {
    return INTERNAL_getGameCategory(true, slug)
  }
  const categories = await getCachedCategories()
  return categories.find(category => category.slug === slug)
}

export const getGameCategoryById = async (draftMode: boolean, id: string) => {
  return await INTERNAL_getGameCategory(draftMode, id)
}

const getCachedCategories = nextCache({
  handler: async () => {
    const categories = await INTERNAL_getGameCategories(false)
    return categories
  },
  revalidateTags: () => [CACHE_KEYS.GAME_CATEGORIES]
})

const INTERNAL_getGameCategories = cache(async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt'],
  }, draftMode)

  return await createGameCategoryDTO(gameCategories.items)
})

const INTERNAL_getGameCategory = cache(async (draftMode: boolean, categoryIdOrSlug: string) => {
  const categories = await INTERNAL_getGameCategories(draftMode)
  const categoryById = categories.find(category => category.id === categoryIdOrSlug)
  if (!categoryById) {
    const categoryBySlug = categories.find(category => category.slug === categoryIdOrSlug)
    if (!categoryBySlug) {
      return null
    }
    return categoryBySlug
  }
  return categoryById
})