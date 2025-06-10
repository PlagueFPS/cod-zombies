import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CirclePlus, Trash } from "lucide-react"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { capatilize } from "@/utils/functions"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { useImageState } from "@/hooks/useImageState"
import Image, { ImageProps } from "next/image"
import { DifficultyBadge, TypeBadge } from "../CustomBadges/CustomBadges"
import type { Difficulty } from "@/types/FeaturedMap"
import { ZombieType } from "@/types/Zombie"

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
          className="gap-2 border-dashed"
        >
          <CirclePlus className="size-4 text-primary" />
          { title }
          { currentSelection.length > 0 && (
            <>
              <Separator orientation="vertical" className="min-h-5" />
              { currentSelection.length === 1 ? (
                <>
                  { 
                    title === 'Difficulty' ? <DifficultyBadge difficulty={ capatilize(currentSelection[0]) as Difficulty } /> 
                    : title === 'Type' ? <TypeBadge type={ capatilize(currentSelection[0]) as ZombieType } /> 
                    : <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{ capatilize(currentSelection[0]) }</Badge>
                  }
                </>
              ) : (
                <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{ currentSelection.length }</Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          { enableInput && <CommandInput placeholder={ inputPlaceholder ?? title } /> }
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <div className="space-y-2 py-2">
                { data.map(item => (
                  <CommandItem key={ item.id } className="flex gap-2 items-center rounded data-[selected=true]:bg-transparent">
                    <Checkbox  
                      checked={ currentSelection.includes(item.slug) } 
                      onCheckedChange={ () => toggleParam(item.slug) } 
                      className="cursor-pointer" 
                    />
                    { title === "Game" ? <FilterLogo slug={ item.slug } className="size-4" /> : null }
                    <Label htmlFor={ item.id } className="cursor-pointer font-normal w-full" onClick={ () => toggleParam(item.slug) }>
                      { title === "Difficulty" ? <DifficultyBadge difficulty={ item.title as Difficulty } /> 
                        : title === "Type" ? <TypeBadge type={ item.title as ZombieType } /> 
                        : item.title 
                      }
                    </Label>
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
        { currentSelection.length > 0 && (
          <div className="sticky bottom-0 flex items-center justify-center w-full border-t py-1">
            <Button variant={"ghost"} size={"sm"} onClick={ clearParam } className="items-center justify-center">
              <Trash className="size-4 text-red-800 dark:text-red-400" />
              <span>Clear { title } Filters</span>
            </Button>
          </div>
        )}
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

  if (imageErrored || slug === "world-at-war") return null

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