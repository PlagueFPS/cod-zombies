"use client"
import ClearFiltersButton from "@/components/FiltersCombobox/ClearFiltersButton"
import FiltersCombobox from "@/components/FiltersCombobox/FiltersCombobox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface IQuestFiltersClient {
  games: {
    id: string
    slug: string
    title: string
  }[]
  maps: {
    id: string
    slug: string
    title: string
  }[]
}

export default function QuestFiltersClient({ games, maps }: IQuestFiltersClient) {
  const searchParams = useSearchParams()
  const [selectedGames, setSelectedGames] = useState(searchParams.getAll("game"))
  const [selectedMaps, setSelectedMaps] = useState(searchParams.getAll("map"))

  useEffect(() => {
    setSelectedGames(searchParams.getAll("game"))
    setSelectedMaps(searchParams.getAll("map"))
  }, [searchParams])

  const toggleGame = (game: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")

    const newSelectedGames = selectedGames.includes(game)
      ? selectedGames.filter((g) => g !== game)
      : [...selectedGames, game]

    setSelectedGames(newSelectedGames)
    newSelectedGames.forEach(game => params.append("game", game))
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const toggleMap = (map: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("map")

    const newSelectedMaps = selectedMaps.includes(map)
      ? selectedMaps.filter((m) => m !== map)
      : [...selectedMaps, map]

    setSelectedMaps(newSelectedMaps)
    newSelectedMaps.forEach(map => params.append("map", map))
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearGames = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearMaps = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("map")
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    params.delete("map")
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex gap-2 items-center w-full">
        <FiltersCombobox 
          data={ games }
          currentSelection={ selectedGames }
          title="Game"
          toggleParam={ toggleGame }
          clearParam={ clearGames }
        />
        <FiltersCombobox 
          data={ maps }
          currentSelection={ selectedMaps }
          title="Map"
          toggleParam={ toggleMap }
          clearParam={ clearMaps }
        />
        { selectedGames.length > 0 || selectedMaps.length > 0 ? (
          <ClearFiltersButton onClick={ clearAllFilters} />
        ) : null}
      </div>
    </ScrollArea>
  )
}
