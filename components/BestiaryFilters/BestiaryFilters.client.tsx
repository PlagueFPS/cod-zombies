"use client"
import type { Filter } from "../FiltersCombobox/FiltersCombobox"
import { useQuestSearchParams } from "@/hooks/useQuestSearchParams"
import FiltersCombobox from "../FiltersCombobox/FiltersCombobox"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import ClearFiltersButton from "../FiltersCombobox/ClearFiltersButton"

interface BestiaryFiltersClientProps {
  games: Filter[]
  maps: Filter[]
  types: Filter[]
}

export default function BestiaryFiltersClient({ games, maps, types }: BestiaryFiltersClientProps) {
  const { mapParams, gameParams, typeParams, toggleParam, clearAllFilters, clearParam } = useQuestSearchParams()

  const toggleGame = (game: string) => {
    toggleParam("game", game, gameParams)
  }

  const toggleMap = (map: string) => {
    toggleParam("map", map, mapParams)
  }

  const toggleType = (type: string) => {
    toggleParam("type", type, typeParams)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex gap-2 items-center w-full">
        <FiltersCombobox
          data={types}
          currentSelection={typeParams}
          title="Type"
          toggleParam={toggleType}
          clearParam={() => clearParam("type")}
        />
        <FiltersCombobox
          data={games}
          currentSelection={gameParams}
          title="Game"
          toggleParam={toggleGame}
          clearParam={() => clearParam("game")}
        />
        <FiltersCombobox
          data={maps}
          currentSelection={mapParams}
          title="Map"
          toggleParam={toggleMap}
          enableInput
          inputPlaceholder="Search Map"
          clearParam={() => clearParam("map")}
        />
        {gameParams.length > 0 || mapParams.length > 0 || typeParams.length > 0 ? (
          <ClearFiltersButton onClick={clearAllFilters} />
        ) : null}
      </div>
      <ScrollBar orientation="horizontal" className="sr-only" />
    </ScrollArea>
  )
}
