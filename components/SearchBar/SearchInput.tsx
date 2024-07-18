"use client"
import { GameCategory } from "@/types/GameCategory";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchInputProps {
  maps: {
    title: string
    slug: string
    category: {
      slug: string | undefined
    }
  }[]
  gameCategories: {
    slug: GameCategory
    title: string
  }[]
}

export default function SearchInput({ maps, gameCategories }: SearchInputProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
 
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button variant="outline" size="icon" className="sm:hidden mr-2" onClick={ () => setOpen(!open) } title="open search menu">
        <Search className="h-5 w-5" />
      </Button>
      <Button variant="outline" className="hidden sm:flex gap-8 text-foreground/70" onClick={ () => setOpen(!open) }>
        Search for maps...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <CommandInput placeholder="Type a map or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          { gameCategories.map(game => (
            <CommandGroup heading={ game.title } key={ game.slug }>
              { maps.filter(map => map.category.slug === game.slug).map(map => (
                <Link key={ `${game.slug}_${map.slug}` } href={ `/${map.category.slug}/${map.slug}` } onClick={ () => setOpen(!open) }>
                  <CommandItem>
                    <span className="blur-none">{ map.title }</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
