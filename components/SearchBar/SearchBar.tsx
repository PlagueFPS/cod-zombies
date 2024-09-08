import { getMaps, getGameCategories } from "@/data/data"
import SearchInput from "./SearchInput"
import { draftMode } from "next/headers"

export default async function SearchBar() {
  const { isEnabled } = draftMode()
  const mapsPromise = getMaps(isEnabled)
  const gameCategoriesPromise = getGameCategories()
  const [{ maps }, gameCategories] = await Promise.all([mapsPromise, gameCategoriesPromise])
  const modifiedMaps = maps.map(map => {
    const category = map.fields.gameCategory
    
    return {
      title: map.fields.title,
      slug: map.fields.slug,
      category: category?.fields.slug
    }
  })
  const modifiedCategories = [...gameCategories].reverse()

  return (
    <div className="flex justify-center items-center w-fit">
      <SearchInput maps={ modifiedMaps } gameCategories={ modifiedCategories } />
    </div>
  )
}
