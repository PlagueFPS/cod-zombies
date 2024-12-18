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

interface Filter {
  id: string
  slug: string
  title: string
}

interface ComboboxProps {
  filters: Filter[]
  games: Filter[]
  maps: Filter[]
}

export function Combobox({ filters, games, maps }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? filters.find((filters) => filters.slug === value)?.title
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
                <CommandItem
                  key={ game.id }
                  value={ game.slug }
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === game.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  { game.title }
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Maps">
              {maps.map((map) => (
                <CommandItem
                  key={ map.id }
                  value={ map.slug }
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === map.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  { map.title }
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
