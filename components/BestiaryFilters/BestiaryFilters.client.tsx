"use client"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"
import { Filter } from "@/types/Filter"
import { useEffect, useState } from "react"
import FiltersCombobox from "../FiltersCombobox/FiltersCombobox"
import { ScrollArea } from "../ui/scroll-area"
import ClearFiltersButton from "../FiltersCombobox/ClearFiltersButton"

interface BestiaryFiltersClientProps {
  games: Filter[]
  maps: Filter[]
  types: Filter[]
}

export default function BestiaryFiltersClient({ games, maps, types }: BestiaryFiltersClientProps) {
  const { searchParams, mapParams, gameParams, typeParams, toggleParam, clearAllFilters, clearParam } = useSiteSearchParams()
  const [selectedTypes, setSelectedTypes] = useState(typeParams)
  const [selectedGames, setSelectedGames] = useState(gameParams)
  const [selectedMaps, setSelectedMaps] = useState(mapParams)

  useEffect(() => {
    setSelectedTypes(typeParams)
    setSelectedGames(gameParams)
    setSelectedMaps(mapParams)
  }, [searchParams])

  const toggleGame = (game: string) => {
    const newSelectedGames = toggleParam("game", game, selectedGames)
    setSelectedGames(newSelectedGames)
  }

  const toggleMap = (map: string) => {
    const newSelectedMaps = toggleParam("map", map, selectedMaps)
    setSelectedMaps(newSelectedMaps)
  }

  const toggleType = (type: string) => {
    const newSelectedTypes = toggleParam("type", type, selectedTypes)
    setSelectedTypes(newSelectedTypes)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex gap-2 items-center w-full">
        <FiltersCombobox 
          data={ types }
          currentSelection={ selectedTypes }
          title="Type"
          toggleParam={ toggleType }
          clearParam={ () => clearParam("type") }
        />
        <FiltersCombobox 
          data={ games }
          currentSelection={ selectedGames }
          title="Game"
          toggleParam={ toggleGame }
          clearParam={ () => clearParam("game") }
        />
        <FiltersCombobox 
          data={ maps }
          currentSelection={ selectedMaps }
          title="Map"
          toggleParam={ toggleMap }
          clearParam={ () => clearParam("map") }
          enableInput
          inputPlaceholder="Search maps"
        />
        { selectedGames.length > 0 || selectedMaps.length > 0 || selectedTypes.length > 0 ? (
          <ClearFiltersButton onClick={ clearAllFilters } />
        ) : null}
      </div>
    </ScrollArea>
  )
}
