import { draftMode } from "next/headers"
import SearchInput from "./SearchInput"
import { getMapSearchData } from "@/data/maps"
import { getGames } from "@/data/games"
import { getQuestSearchData } from "@/data/sideQuests"
import { getZombieSearchData } from "@/data/zombies"

export default async function SearchBar() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const questsPromise = getQuestSearchData(isEnabled)
  const zombiesPromise = getZombieSearchData(isEnabled)
  const [maps, games, quests, zombies] = await Promise.all([mapsPromise, gamesPromise, questsPromise, zombiesPromise])
  const modifiedGames = games.map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))
  const modifiedZombies = zombies.map(zombie => ({
    id: zombie.id,
    title: zombie.name,
    slug: zombie.slug
  }))

  return (
    <div className="flex justify-center items-center w-fit animate-fade-in">
      <SearchInput 
        maps={ maps } 
        games={ modifiedGames }
        quests={ quests }
        zombies={ modifiedZombies }
      />
    </div>
  )
}
