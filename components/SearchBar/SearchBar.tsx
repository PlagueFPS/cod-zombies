import { draftMode } from "next/headers"
import SearchInput from "./SearchInput"
import { getMapSearchData } from "@/data/maps"
import { getGames } from "@/data/games"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const [maps, games] = await Promise.all([mapsPromise, gamesPromise])
  const modifiedCategories = games.map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput maps={ maps } categories={ modifiedCategories } />
    </div>
  )
}
