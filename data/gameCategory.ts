import "server-only"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { resolveAsset } from "@/utils/contentful-utils"
import { unstable_cache } from "next/cache"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { managementClient } from "@/contentful/contentful-management"
import { getAllNewCategoryIds } from "@/lib/kv"

const fetchGameCategories = async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  }, draftMode)

  return await createGameCategoryDTO(gameCategories.items)
}

const cachedFetchGameCategories = unstable_cache(
  fetchGameCategories,
  ['game-categories'],
  { tags: [CACHE_KEYS.GAME_CATEGORIES] }
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

const createGameCategoryDTO = async(gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
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