import { draftMode } from "next/headers"
import SearchInput from "./SearchInput"
import { getMapSearchData } from "@/data/maps"
import { getGames } from "@/data/games"
import { getQuestSearchData } from "@/data/sideQuests"
import { getZombieSearchData } from "@/data/zombies"
import { getAvailableMaps } from "@/data/interactive-map"

interface ISearchBar {
  showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const questsPromise = getQuestSearchData(isEnabled)
  const zombiesPromise = getZombieSearchData(isEnabled)
  const availableMaps = getAvailableMaps()
  const [maps, games, quests, zombies] = await Promise.all([mapsPromise, gamesPromise, questsPromise, zombiesPromise])
  const modifiedGames = games.filter(g => !g.isComingSoon).map(game => ({
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
        showFull={ showFull }
        availableMaps={ availableMaps }
      />
    </div>
  )
}
