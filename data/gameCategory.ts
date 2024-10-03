import "server-only"
import { nextCache } from "@/data/cache"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import { createGameCategoryDTO } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"

export const getGameCategories = cache(async (draftMode: boolean) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategories(true)
  }
  return await getCachedCategories()
})

export const getGameCategoryBySlug = cache(async (draftMode: boolean, slug: string) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategory(true, slug)
  }
  const categories = await getCachedCategories()
  return categories.find(category => category.slug === slug)
})

const getCachedCategories = nextCache({
  handler: async () => {
    const categories = await fetchGameCategories(false)
    return categories
  },
  revalidateTags: () => [CACHE_KEYS.GAME_CATEGORIES]
})

export const fetchGameCategories = async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt'],
  }, draftMode)

  return await createGameCategoryDTO(gameCategories.items)
}

const fetchGameCategory = async (draftMode: boolean, categoryIdOrSlug: string) => {
  const categories = await fetchGameCategories(draftMode)
  const categoryById = categories.find(category => category.id === categoryIdOrSlug)
  if (!categoryById) {
    const categoryBySlug = categories.find(category => category.slug === categoryIdOrSlug)
    if (!categoryBySlug) {
      return null
    }
    return categoryBySlug
  }
  return categoryById
}