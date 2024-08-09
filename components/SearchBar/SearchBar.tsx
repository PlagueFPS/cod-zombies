import type { GameCategory } from "@/types/GameCategory"
import { resolveEntry } from "@/utils/contentful-utils"
import { getMaps, getGameCategories } from "@/data/data"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const maps = (await getMaps()).maps.map(map => {
    const category = resolveEntry(map.fields.gameCategory)
    
    return {
      title: map.fields.title,
      slug: map.fields.slug,
      category: category?.fields.slug as GameCategory
    }
  })
  const gameCategories = await getGameCategories()

  return (
    <div className="flex justify-center items-center w-fit">
      <SearchInput maps={ maps } gameCategories={ gameCategories } />
    </div>
  )
}
