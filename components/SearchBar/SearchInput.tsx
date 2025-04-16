"use client"
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { Book, BookText, Brain, Search } from "lucide-react";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  maps: {
    id: string
    slug: string
    title: string
    game: {
      title: string
      slug: string
    }
  }[]
  games: {
    id: string
    slug: string
    title: string
  }[]
  quests: {
    id: string
    slug: string
    title: string
    game: {
      title: string
      slug: string
    }
    map: {
      title: string
      slug: string
    }
  }[]
  zombies: {
    id: string
    slug: string
    title: string
  }[]
}

const filters = [
  { name: "All", icon: Search },
  { name: "Main Quests", icon: BookText },
  { name: "Side Quests", icon: Book },
  { name: "Zombies", icon: Brain }
]

export default function SearchInput({ maps, games, quests, zombies }: SearchInputProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("All")

  const questMaps = useMemo(() => {
    const mapSlugs = new Set(quests.map(q => q.map.slug))
    return maps.filter(m => mapSlugs.has(m.slug))
  }, [maps, quests])

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
 
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onSelectHandler = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <>
      <Button type="button" size="sm" variant="outline" className="relative hidden sm:flex gap-x-2 w-64 text-muted-foreground text-xs rounded-sm" onClick={ () => setOpen(!open) }>
        <Search className="size-5" />
        <span className="text-sm">
          Search Guides...
        </span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 rounded bg-muted text-muted-foreground font-medium opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      </Button>
      <Button 
        type="button" 
        size="icon" 
        variant="ghost" 
        className="flex sm:hidden text-muted-foreground" 
        onClick={ () => setOpen(!open) }
        title="Search"
        aria-label="Search Guides"
      >
        <Search className="size-6" />
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <DialogTitle className="sr-only">Search Bar</DialogTitle>
        <DialogDescription className="sr-only">Search for quests</DialogDescription>
        <CommandInput placeholder="Search guides, zombies" className="text-base" />
        <div className="flex p-2 gap-1">
          { filters.map(f => (
            <Button
              key={ f.name }
              size={"sm"}
              variant="outline"
              onClick={ () => setFilter(f.name) }
              className={cn("flex items-center space-x-1 text-xs h-5 rounded-lg p-2 py-3", {
                'badge-primary-gradient': filter === f.name
              })}
            >
              <f.icon className="size-4" />
              <span className="blur-none">{ f.name }</span>
            </Button>
          ))}
        </div>
        <div className="relative">
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            { filter === "All" || filter === "Main Quests" ? (
              <>
                { games.map(game => (
                  <CommandGroup heading={ `${game.title} Main Quests` } key={ game.id }>
                    { maps.map(m => m.game.slug !== game.slug ? null : (
                      <CommandItem 
                        key={ `${game.id}_${m.id}` } 
                        onSelect={() => onSelectHandler(`/${m.game.slug}/${m.slug}`)}
                        className="gap-2 cursor-pointer"
                        >
                        <BookText className="size-4" />
                        <span className="blur-none">{ m.title }</span>
                      </CommandItem>
                      )
                    )}
                  </CommandGroup>
                ))}
              </>
            ) : null}
            { filter === "All" || filter === "Side Quests" ? (
              <>
                { questMaps.map(m => (
                  <CommandGroup heading={ `${m.title} Side Quests` } key={ m.id }>
                    { quests.map(q => q.map.slug !== m.slug ? null : (
                      <CommandItem 
                        key={ `${q.id}_${m.id}` } 
                        onSelect={() => onSelectHandler(`/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`)}
                        className="gap-2 cursor-pointer"
                        >
                        <Book className="size-4" />
                        <span className="blur-none">{ q.title }</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </>
            ) : null}
            { filter === "All" || filter === "Zombies" ? (
              <CommandGroup heading="Zombies">
                { zombies.map(zombie => (
                  <CommandItem key={ zombie.id } onSelect={() => onSelectHandler(`/bestiary/${zombie.slug}`)} className="gap-2 cursor-pointer">
                    <Brain className="size-4" />
                    <span className="blur-none">{ zombie.title }</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  )
}