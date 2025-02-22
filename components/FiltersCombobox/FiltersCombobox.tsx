import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CirclePlus, Trash } from "lucide-react"
import { Separator } from "../ui/seperator"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { capatilize } from "@/utils/functions"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

interface IFiltersCombobox {
  data: {
    id?: string
    slug: string
    title: string
  }[]
  currentSelection: string[]
  title: string
  enableInput?: boolean
  inputPlaceholder?: string
  toggleParam: (param: string) => void
  clearParam: () => void
}

const FiltersCombobox = ({ data, currentSelection, title, inputPlaceholder, enableInput, toggleParam, clearParam }: IFiltersCombobox) => {
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
          { enableInput && <CommandInput placeholder={ inputPlaceholder } /> }
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

export default FiltersCombobox