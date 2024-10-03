import { draftMode } from "next/headers"
import { getFeaturedMaps } from "@/data/featuredMaps"
import { getGameCategories } from "@/data/gameCategory"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const [featuredMaps, gameCategories] = await Promise.all([getFeaturedMaps(isEnabled), getGameCategories(isEnabled)])
  const modifiedCategories = [...gameCategories].reverse()
  const searchMaps = featuredMaps.map(map => ({
    id: map.id,
    title: map.title,
    slug: map.slug,
    category: map.category
  }))

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput maps={ searchMaps } categories={ modifiedCategories } />
    </div>
  )
}
