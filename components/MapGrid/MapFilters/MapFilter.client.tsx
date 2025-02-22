"use client"
import ClearFiltersButton from "@/components/FiltersCombobox/ClearFiltersButton";
import FiltersCombobox from "@/components/FiltersCombobox/FiltersCombobox";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IMapFiltersClient {
  games: {
    id: string;
    title: string;
    slug: string;
    isDraft: boolean;
    isChanged: boolean;
    isNew: boolean;
  }[]
  difficulties: {
    id: string
    slug: string
    title: string
  }[]
}

export default function MapFilterClient({ games, difficulties }: IMapFiltersClient) {
  const searchParams = useSearchParams()
  const [selectedGames, setSelectedGames] = useState(searchParams.getAll("game"))
  const [selectedDifficulties, setSelectedDifficulties] = useState(searchParams.getAll("difficulty"))

  useEffect(() => {
    setSelectedGames(searchParams.getAll("game"))
    setSelectedDifficulties(searchParams.getAll("difficulty"))
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

  const toggleDifficulty = (difficulty: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("difficulty")

    const newSelectedDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : [...selectedDifficulties, difficulty]

    setSelectedDifficulties(newSelectedDifficulties)
    newSelectedDifficulties.forEach(difficulty => params.append("difficulty", difficulty))
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearGames = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearDifficulties = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("difficulty")
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    params.delete("difficulty")
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
          data={ difficulties }
          currentSelection={ selectedDifficulties }
          title="Difficulty"
          toggleParam={ toggleDifficulty }
          clearParam={ clearDifficulties }
        />
        { selectedGames.length > 0 || selectedDifficulties.length > 0 ? (
          <ClearFiltersButton onClick={ clearAllFilters } />
        ) : null}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}