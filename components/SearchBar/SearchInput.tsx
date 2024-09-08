"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useScreen } from "@/hooks/useScreen";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
import { DialogDescription, DialogTitle } from "../ui/dialog";

interface SearchInputProps {
  maps: {
    title: string
    slug: string
    category: string | undefined
  }[]
  gameCategories: {
    slug: string
    title: string
  }[]
}

export default function SearchInput({ maps, gameCategories }: SearchInputProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { isDesktop } = useScreen(640)

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

  const onSelectHandler = (category: string | undefined, mapSlug: string) => {
    setOpen(false)
    router.push(`/${category}/${mapSlug}`)
  }

  return (
    <>
      <Button type="button" variant="outline" className="flex gap-3 sm:gap-8 text-foreground/70 w-fit" onClick={ () => setOpen(!open) }>
        { isDesktop ? (
          <>
            Search for maps...
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl+K</span>
            </kbd>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Search
          </>
          )}
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <DialogTitle className="sr-only">Search Bar</DialogTitle>
        <DialogDescription className="sr-only">Search for maps</DialogDescription>
        <CommandInput placeholder="Type a map or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          { gameCategories.map(game => (
            <CommandGroup heading={ game.title } key={ game.slug }>
              { maps.filter(map => map.category === game.slug).map(map => (
                <Link key={ `${game.slug}_${map.slug}` } href={ `/${map.category}/${map.slug}` } onClick={ () => setOpen(false) }>
                  <CommandItem onSelect={ () => onSelectHandler(map.category, map.slug) }>
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
