import { draftMode } from "next/headers"
import { getFeaturedMaps } from "@/data/featuredMaps"
import { getGameCategories } from "@/data/gameCategory"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const [{ featuredMaps }, gameCategories] = await Promise.all([getFeaturedMaps(isEnabled), getGameCategories(isEnabled)])
  const modifiedMaps = featuredMaps.map(map => {
    const category = map.gameCategory
    
    return {
      title: map.title,
      slug: map.slug,
      category: category.slug
    }
  })
  const modifiedCategories = [...gameCategories].reverse()

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput maps={ modifiedMaps } gameCategories={ modifiedCategories } />
    </div>
  )
}
