"use client"
import ClearFiltersButton from "@/components/FiltersCombobox/ClearFiltersButton"
import FiltersCombobox from "@/components/FiltersCombobox/FiltersCombobox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuestSearchParams } from "@/hooks/useQuestSearchParams"
import { Filter } from "@/types/Filter"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface IQuestFiltersClient {
  games: Filter[]
  maps: Filter[]
  difficulties: Filter[]
}

export default function QuestFiltersClient({ games, maps, difficulties }: IQuestFiltersClient) {
  const { searchParams, mapParams, difficultyParams, gameParams, toggleParam, clearParam, clearAllFilters } = useQuestSearchParams()
  const pathname = usePathname()
  const [selectedGames, setSelectedGames] = useState(gameParams)
  const [selectedMaps, setSelectedMaps] = useState(mapParams)
  const [selectedDifficulties, setSelectedDifficulties] = useState(difficultyParams)
  const isHomePage = pathname === "/"

  useEffect(() => {
    setSelectedGames(gameParams)
    setSelectedMaps(mapParams)
    setSelectedDifficulties(difficultyParams)
  }, [searchParams])

  const toggleGame = (game: string) => {
    const newSelectedGames = toggleParam("game", game, selectedGames)
    setSelectedGames(newSelectedGames)
  }

  const toggleMap = (map: string) => {
    const newSelectedMaps = toggleParam("map", map, selectedMaps)
    setSelectedMaps(newSelectedMaps)
  }

  const toggleDifficulty = (difficulty: string) => {
    const newSelectedDifficulties = toggleParam("difficulty", difficulty, selectedDifficulties)
    setSelectedDifficulties(newSelectedDifficulties)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex gap-2 items-center w-full">
        { isHomePage ? (
          <>
            <FiltersCombobox 
              data={ games }
              currentSelection={ selectedGames }
              title="Game"
              toggleParam={ toggleGame }
              clearParam={ () => clearParam("game") }
            />
            <FiltersCombobox 
              data={ difficulties }
              currentSelection={ selectedDifficulties }
              title="Difficulty"
              toggleParam={ toggleDifficulty }
              clearParam={ () => clearParam("difficulty") }
            />
          </>
        ) : (
          <FiltersCombobox 
            data={ maps }
            currentSelection={ selectedMaps }
            title="Map"
            toggleParam={ toggleMap }
            clearParam={ () => clearParam("map") }
          />
        ) }
        { selectedGames.length > 0 || selectedMaps.length > 0 || selectedDifficulties.length > 0 ? (
          <ClearFiltersButton onClick={ clearAllFilters } />
        ) : null}
      </div>
    </ScrollArea>
  )
}
