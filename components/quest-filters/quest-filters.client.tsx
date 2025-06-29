"use client"
import ClearFiltersButton from "@/components/filters-combobox/clear-filters-button"
import FiltersCombobox from "@/components/filters-combobox/filters-combobox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useQuestSearchParams } from "@/hooks/use-quest-search-params"
import type { Filter } from "@/components/filters-combobox/filters-combobox"
import { usePathname } from "next/navigation"

interface IQuestFiltersClient {
  games: Filter[]
  maps: Filter[]
  difficulties: Filter[]
}

export default function QuestFiltersClient({ games, maps, difficulties }: IQuestFiltersClient) {
  const { mapParams, difficultyParams, gameParams, toggleParam, clearParam, clearAllFilters } = useQuestSearchParams()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const toggleGame = (game: string) => {
    toggleParam("game", game, gameParams)
  }

  const toggleMap = (map: string) => {
    toggleParam("map", map, mapParams)
  }

  const toggleDifficulty = (difficulty: string) => {
    toggleParam("difficulty", difficulty, difficultyParams)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex gap-2 items-center w-full">
        {isHomePage ? (
          <>
            <FiltersCombobox
              data={games}
              currentSelection={gameParams}
              title="Game"
              toggleParam={toggleGame}
              clearParam={() => clearParam("game")}
            />
            <FiltersCombobox
              data={difficulties}
              currentSelection={difficultyParams}
              title="Difficulty"
              toggleParam={toggleDifficulty}
              clearParam={() => clearParam("difficulty")}
            />
          </>
        ) : (
          <FiltersCombobox
            data={maps}
            currentSelection={mapParams}
            title="Map"
            toggleParam={toggleMap}
            clearParam={() => clearParam("map")}
          />
        )}
        {gameParams.length > 0 || mapParams.length > 0 || difficultyParams.length > 0 ? (
          <ClearFiltersButton onClick={clearAllFilters} />
        ) : null}
      </div>
      <ScrollBar orientation="horizontal" className="sr-only" />
    </ScrollArea>
  )
}
