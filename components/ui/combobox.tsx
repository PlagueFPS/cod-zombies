"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomLink } from "../CustomLink/CustomLink"

interface Filter {
  id: string
  slug: string
  title: string
}

interface MapFilter extends Filter {
  game: {
    title: string,
    slug: string
  }
}

interface ComboboxProps {
  filters: (Filter | MapFilter)[]
  games: Filter[]
  maps: MapFilter[]
  currentFilter?: string
}

export function Combobox({ filters, games, maps, currentFilter }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentFilter
            ? filters.find(f => f.slug === currentFilter)?.title
            : "Filter by Game or Map"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No filter found.</CommandEmpty>
            <CommandGroup heading="Games">
              {games.map((game) => (
                <CustomLink key={ game.id } href={ `/side-quests/${game.slug}` } onClick={ () => setOpen(false) }>
                  <CommandItem
                    value={ game.slug }
                    onSelect={ () => setOpen(false) }
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentFilter === game.slug ? "opacity-100" : "opacity-0"
                      )}
                    />
                    { game.title }
                  </CommandItem>
                </CustomLink>
              ))}
            </CommandGroup>
            <CommandGroup heading="Maps">
              {maps.map((map) => (
                <CustomLink key={ map.id } href={ `/side-quests/${map.game.slug}/${map.slug}` }>
                  <CommandItem
                    key={ map.id }
                    value={ map.slug }
                    onSelect={ () => setOpen(false) }
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentFilter === map.slug ? "opacity-100" : "opacity-0"
                      )}
                    />
                    { map.title }
                  </CommandItem>
                </CustomLink>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
