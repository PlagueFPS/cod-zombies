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
import { useImageState } from "@/hooks/useImageState"
import Image, { ImageProps } from "next/image"
import { DifficultyBadge } from "../CustomBadges/CustomBadges"
import type { Difficulty } from "@/types/FeaturedMap"

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
      <PopoverContent className="w-52 p-0">
        <Command>
          { enableInput && <CommandInput placeholder={ inputPlaceholder } /> }
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <div className="space-y-2 py-2">
                { data.map(item => (
                  <CommandItem key={ item.id } className="flex gap-2 items-center rounded">
                    <Checkbox id={ item.id } checked={ currentSelection.includes(item.slug) } onCheckedChange={ () => toggleParam(item.slug) } />
                    { title === "Game" ? <FilterLogo slug={ item.slug } className="size-4" /> : null }
                    <Label htmlFor={ item.id } className="cursor-pointer font-normal w-full">
                      { title === "Difficulty" ? <DifficultyBadge difficulty={ item.title as Difficulty } /> : item.title }
                    </Label>
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

interface IFilterLogo extends Omit<ImageProps, "src" | "alt"> {
  slug: string
}

const FilterLogo = ({ slug, ...props }: IFilterLogo) => {
  const { imageLoaded, setImageLoaded,imageErrored, setImageErrored } = useImageState()

  if (imageErrored) return null

  return (
    <Image
      {...props}
      unoptimized
      src={`/${slug}_logo.webp`}
      alt={ `${slug} Logo` }
      height={ 32 }
      width={ 32 }
      onError={ () => setImageErrored(true) }
      onLoad={ () => setImageLoaded(true) }
      className={cn('opacity-0', props.className, {
        'animate-fade-in opacity-100': imageLoaded
      })}
    />
  )
}