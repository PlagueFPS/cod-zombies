"use client"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SearchInputProps {
  maps: {
    title: string
    slug: string
    category: string | undefined
  }[]
}

export default function SearchInput({ maps }: SearchInputProps) {
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
      <Button variant="outline" className="gap-8 text-foreground/70" onClick={ () => setOpen(!open) }>
        Search for maps...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <CommandInput placeholder="Type a map or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Black Ops 1">
            { maps.filter(map => map.category === 'Black Ops 1').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandGroup heading="Black Ops 2">
            { maps.filter(map => map.category === 'Black Ops 2').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandGroup heading="Black Ops 3">
            { maps.filter(map => map.category === 'Black Ops 3').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandGroup heading="Black Ops 4">
            { maps.filter(map => map.category === 'Black Ops 4').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandGroup heading="Black Ops Cold War">
            { maps.filter(map => map.category === 'Black Ops Cold War').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          {/* <CommandGroup heading="Black Ops 6">
            { maps.filter(map => map.category === 'Black Ops 6').map((map, i) => (
              <Link key={ `${map.slug}_${i}` } href={ `/maps/${map.slug}` }>       
                <CommandItem>
                  <span className="blur-none">{ map.title }</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  )
}
