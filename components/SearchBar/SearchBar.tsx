import type { GameCategory } from "@/types/GameCategory"
import { resolveEntry } from "@/utils/contentful-utils"
import { getMaps, getGameCategories } from "@/data/data"
import SearchInput from "./SearchInput"
import { draftMode } from "next/headers"

export default async function SearchBar() {
  const { isEnabled } = draftMode()
  const mapsPromise = getMaps(isEnabled)
  const gameCategoriesPromise = getGameCategories()
  const [{ maps }, gameCategories] = await Promise.all([mapsPromise, gameCategoriesPromise])
  const modifiedMaps = maps.map(map => {
    const category = resolveEntry(map.fields.gameCategory)
    
    return {
      title: map.fields.title,
      slug: map.fields.slug,
      category: category?.fields.slug as GameCategory
    }
  })
  const categories = gameCategories

  return (
    <div className="flex justify-center items-center w-fit">
      <SearchInput maps={ modifiedMaps } gameCategories={ categories.reverse() } />
    </div>
  )
}
