import { resolveEntry } from "@/utils/contentful-utils"
import { getMaps, getGameCategories } from "@/data/data"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const maps = (await getMaps()).items.map(map => {
    const category = resolveEntry(map.fields.gameCategory)
    
    return {
      title: map.fields.title,
      slug: map.fields.slug,
      category: {
        slug: category?.fields.slug
      }
    }
  })
  const gameCategories = await getGameCategories()

  return (
    <div className="flex justify-center items-center w-1/2">
      <SearchInput maps={ maps } gameCategories={ gameCategories } />
    </div>
  )
}
