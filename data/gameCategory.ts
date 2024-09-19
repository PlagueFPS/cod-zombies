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

const createGameCategoryDTO = (gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
  return gameCategorys.map(gameCategory => ({
    ...gameCategory.fields,
    image: resolveAsset(gameCategory.fields.image)
  }))
}