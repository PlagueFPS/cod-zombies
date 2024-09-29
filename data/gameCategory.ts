import "server-only"
import { nextCache } from "@/data/cache"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { resolveAsset } from "@/utils/contentful-utils"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { managementClient } from "@/contentful/contentful-management"
import { getAllNewCategoryIds } from "@/lib/kv"
import { z } from "zod"

export const getGameCategories = cache(async (draftMode: boolean) => {
  // if (IN_DEVELOPMENT || draftMode) {
  //   return fetchGameCategories(true)
  // }
  return getCategoriesFromCache()
})

export const getGameCategoryBySlug = cache(async (draftMode: boolean, categorySlug: string) => {
  // if (IN_DEVELOPMENT || draftMode) {
  //   return fetchGameCategoryBySlug(categorySlug)
  // }
  return getCategoryBySlugFromCache({ categorySlug })
})

export const getGameCategoryById = cache(async (draftMode: boolean, categoryId: string) => {
  // if (IN_DEVELOPMENT || draftMode) {
  //   return fetchGameCategoryById(categoryId)
  // }
  return getCategoryByIdFromCache({ categoryId})
}
)

const fetchGameCategories = cache(async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  }, draftMode)

  return createGameCategoryDTO(gameCategories.items)
})

const fetchGameCategoryById = cache(async (categoryId: string) => {
  const categories = await fetchGameCategories(false)
  const category = categories.find(category => category.id === categoryId)
  return category
})

const fetchGameCategoryBySlug = cache(async (categorySlug: string) => {
  const categories = await fetchGameCategories(false)
  const category = categories.find(category => category.slug === categorySlug)
  return category
})

const getCategoryByIdFromCache = nextCache({
  args: {
    categoryId: z.string(),
  },
  fn: ({ categoryId }) => fetchGameCategoryById(categoryId),
  revalidateTags: async ({ categoryId }) => {
    const category = await fetchGameCategoryById(categoryId)
    return category ? [`${CACHE_KEYS.GAME_CATEGORIES}-${category.id}`] : []
  }
})

const getCategoryBySlugFromCache = nextCache({
  args: {
    categorySlug: z.string(),
  },
  fn: ({ categorySlug }) => fetchGameCategoryBySlug(categorySlug),
  revalidateTags: async ({ categorySlug }) => {
    const category = await fetchGameCategoryBySlug(categorySlug)
    return category ? [`${CACHE_KEYS.GAME_CATEGORIES}-${category.id}`] : []
  }
})

const getCategoriesFromCache = nextCache({
  fn: () => fetchGameCategories(false),
  revalidateTags: () => [CACHE_KEYS.GAME_CATEGORIES]
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