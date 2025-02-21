"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CommandInput, Command, CommandList, CommandEmpty, CommandItem, CommandGroup, CommandSeparator } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/seperator";
import { cn } from "@/lib/utils";
import { capatilize } from "@/utils/functions";
import { CirclePlus, Gamepad2, Trash, Trash2 } from "lucide-react";
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
    slug: string
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

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("game")
    params.delete("difficulty")
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <ScrollArea className="-mt-4">
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
        { selectedGames.length > 0 || selectedDifficulties.length > 0 ? (
          <Button
            variant="outline"
            size={"sm"}
            className="gap-2 border-red-600 border-dashed text-red-900 dark:text-red-300"
            onClick={ clearAllFilters }
          >
          <Trash2 className="size-4 text-red-800 dark:text-red-500" />
          Clear Filters
        </Button>
        ) : null}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

interface IMapFilterCombobox {
  data: {
    id?: string
    slug: string
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
          size={"sm"}
          role="combobox"
          aria-expanded={ open }
          className="gap-2 border-dashed border-primary/25"
        >
          <CirclePlus className="size-4 text-primary" />
          { title }
          { currentSelection.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-5" />
              <Badge className={cn('badge-primary-gradient', {
                'badge-easy-gradient': currentSelection.length === 1 && title === 'Difficulty' && currentSelection[0] === 'easy',
                'badge-medium-gradient': currentSelection.length === 1 && title === 'Difficulty' && currentSelection[0] === 'medium',
                'badge-hard-gradient': currentSelection.length === 1 && title === 'Difficulty' && currentSelection[0] === 'hard',
              })}>{ currentSelection.length === 1 ? capatilize(currentSelection[0]) : currentSelection.length }</Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* No need to search currently, add back if needed */}
          {/* <CommandInput placeholder={ placeholder } /> */}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <div className="space-y-2 py-2">
                { data.map(item => (
                  <CommandItem key={ item.id } className="flex gap-2 items-center rounded">
                    <Checkbox id={ item.id } checked={ currentSelection.includes(item.slug) } onCheckedChange={ () => toggleParam(item.slug) } />
                    <Label htmlFor={ item.id } className="cursor-pointer font-normal w-full">{ item.title }</Label>
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
            { currentSelection.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={ () => clearParam() } className="flex gap-2 items-center justify-center cursor-pointer">
                    <Trash className="size-4 text-red-800 dark:text-red-500" />
                    Clear { title } Filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
