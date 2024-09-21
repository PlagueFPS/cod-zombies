import "server-only"
import { cache } from "react"
import { getEntries } from "@/contentful/contentful"
import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { resolveAsset } from "@/utils/contentful-utils"

export const getGameCategories = cache(async (draftMode: boolean) => {
  const gameCategories = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['sys.createdAt']
  }, draftMode)

  return createGameCategoryDTO(gameCategories.items)
})

export const getGameCategoryBySlug = cache(async (draftMode: boolean, slug: string) => {
  const categories = await getGameCategories(draftMode)
  const category = categories.find(cateogry => cateogry.slug === slug)
  return category
})

export const getGameCategoryById = cache(async (draftMode: boolean, id: string) => {
  const categories = await getGameCategories(draftMode)
  const category = categories.find(cateogry => cateogry.slug === id)
  return category
})

const createGameCategoryDTO = (gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
  return gameCategorys.map(gameCategory => ({
    ...gameCategory.fields,
    id: gameCategory.sys.id,
    image: resolveAsset(gameCategory.fields.image)
  }))
}