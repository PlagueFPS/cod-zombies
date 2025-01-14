import { draftMode } from "next/headers"
import SearchInput from "./SearchInput"
import { getMapSearchData } from "@/data/maps"
import { getGames } from "@/data/games"
import { getQuestSearchData } from "@/data/sideQuests"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const questsPromise = getQuestSearchData(isEnabled)
  const [maps, games, quests] = await Promise.all([mapsPromise, gamesPromise, questsPromise])
  const modifiedCategories = games.map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput 
        maps={ maps } 
        categories={ modifiedCategories }
        quests={ quests } 
      />
    </div>
  )
}
