"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CommandInput, Command, CommandList, CommandEmpty, CommandItem, CommandGroup } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CirclePlus, Gamepad2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IMapFiltersClient {
  draftMode: boolean
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
    title: string
  }[]
}

export default function MapFilterClient({ draftMode, games, difficulties }: IMapFiltersClient) {
  const router = useRouter()
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
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const toggleDifficulty = (difficulty: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("difficulty")

    const newSelectedDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : [...selectedDifficulties, difficulty]

    setSelectedDifficulties(newSelectedDifficulties)
    newSelectedDifficulties.forEach(difficulty => params.append("difficulty", difficulty))
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const clearGames = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const clearDifficulties = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("difficulty")
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2 items-center w-full">
      <MapFilterCombobox
        data={ games }
        currentSelection={ selectedGames }
        title="Game"
        placeholder="Game"
        toggleParam={ toggleGame }
        clearParam={ clearGames }
      />
      <MapFilterCombobox
        data={ difficulties }
        currentSelection={ selectedDifficulties }
        title="Difficulty"
        placeholder="Difficulty"
        toggleParam={ toggleDifficulty }
        clearParam={ clearDifficulties }
      />
    </div>
  )
}

interface IMapFilterCombobox {
  data: {
    id: string
    title: string
  }[]
  currentSelection: string[]
  title: string
  placeholder: string
  toggleParam: (param: string) => void
  clearParam: () => void
}

const MapFilterCombobox = ({ data, currentSelection, title, placeholder, toggleParam, clearParam }: IMapFilterCombobox) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={ open } onOpenChange={ setOpen }>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={ open }
          className="gap-2 border-dashed"
        >
          <CirclePlus className="size-5 text-primary" />
          { title }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={ placeholder } />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <div className="space-y-2 py-2">
                { data.map(item => (
                  <CommandItem key={ item.id } className="flex gap-2 items-center rounded">
                    <Checkbox id={ item.id } checked={ currentSelection.includes(item.id) } onCheckedChange={ () => toggleParam(item.id) } />
                    <Label htmlFor={ item.id } className="cursor-pointer font-normal">{ item.title }</Label>
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
