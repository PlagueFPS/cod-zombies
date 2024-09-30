import "server-only"
import { nextCache } from "@/data/cache"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { resolveAsset } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { managementClient } from "@/contentful/contentful-management"
import { getAllNewCategoryIds } from "@/data/kv"
import { z } from "zod"

export const getGameCategories = cache(async (draftMode: boolean) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategories(true)
  }
  return getCategories(false)
})

export const getGameCategoryBySlug = cache(async (draftMode: boolean, categorySlug: string) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategory(true, categorySlug)
  }
  return getCategoryFromCache({ categoryIdOrSlug: categorySlug, draftMode: false })
})

export const getGameCategoryById = cache(async (draftMode: boolean, categoryId: string) => {
  if (IN_DEVELOPMENT || draftMode) {
    return fetchGameCategory(true, categoryId)
  }
  return getCategoryFromCache({ categoryIdOrSlug: categoryId, draftMode: false })
})

const getCategoryFromCache = nextCache({
  args: {
    categoryIdOrSlug: z.union([
      z.string().regex(/^[a-zA-Z0-9]{22}$/, "Invalid Category ID format"), // ID validation
      z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Invalid Category Slug format") // Slug validation
    ]).describe("Contentful Category ID or Slug"),
    draftMode: z.literal(false)
  },
  fn: ({ categoryIdOrSlug, draftMode }) => fetchGameCategory(draftMode, categoryIdOrSlug),
  revalidateTags: async ({ categoryIdOrSlug, draftMode }) => {
    // Make sure we cache the category by id even if slug provided
    const category = await fetchGameCategory(draftMode, categoryIdOrSlug)
    return category ? [`${CACHE_KEYS.GAME_CATEGORIES}-${category.id}`] : []
  }
})

const getCategories = cache(async (draftMode: false) => {
  // We fetch all categories and then check if they are in the cache
  // This allows the content to be updated both when a individual category is updated
  // or when a new category is added without invalidating the entire cache
  const allCategories = await fetchGameCategories(false)
  const categories = await Promise.all(allCategories.map(({ id }) => getCategoryFromCache({ categoryIdOrSlug: id, draftMode })))
  return categories.filter(category => category !== null)
})

const fetchGameCategories = cache(async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt'],
  }, draftMode)

  return createGameCategoryDTO(gameCategories.items)
})

const fetchGameCategory = cache(async (draftMode: boolean, categoryIdOrSlug: string) => {
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
})

const createGameCategoryDTO = async (gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
  const { draftCategoryIds, changedCategoryIds } = await getDraftsOrChanged()
  const newCategoryIds = await getAllNewCategoryIds()

  return gameCategorys.map(gameCategory => {
    const categoryImage = resolveAsset(gameCategory.fields.image)
    const isDraft = draftCategoryIds.has(gameCategory.sys.id)
    const isChanged = changedCategoryIds.has(gameCategory.sys.id)
    const isNew = newCategoryIds.has(gameCategory.sys.id)

    return {
      ...gameCategory.fields,
      id: gameCategory.sys.id,
      image: categoryImage,
      isDraft: isDraft,
      isChanged: isChanged,
      isNew: isNew
    }
  })
}

const getDraftsOrChanged = async () => {
  const categories = await managementClient.entry.getMany({
    query: {
      content_type: 'gameCategory'
    }
  })

  const draftCategoryIds = new Set<string>()
  const changedCategoryIds = new Set<string>()
  
  categories.items.forEach(category => {
    if (!category.sys.publishedVersion) {
      draftCategoryIds.add(category.sys.id)
    } else if (!!category.sys.publishedVersion && category.sys.version >= category.sys.publishedVersion + 2) {
      changedCategoryIds.add(category.sys.id)
    }
  })
  
  return {
    draftCategoryIds,
    changedCategoryIds
  }
}