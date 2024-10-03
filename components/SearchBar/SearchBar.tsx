import { draftMode } from "next/headers"
import { getSearchMaps } from "@/data/featuredMaps"
import { getGameCategories } from "@/data/gameCategory"
import SearchInput from "./SearchInput"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const [searchMaps, gameCategories] = await Promise.all([getSearchMaps(isEnabled), getGameCategories(isEnabled)])
  const modifiedCategories = [...gameCategories].reverse()

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput maps={ searchMaps } gameCategories={ modifiedCategories } />
    </div>
  )
}
