"use client"
import type { GameCategory } from "@/types/GameCategory";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

interface MapFiltersProps {
  currentCategory?: GameCategory
  gameCategories: {
    title: string,
    slug: GameCategory
  }[]
}

export default function MapFilters({ currentCategory, gameCategories }: MapFiltersProps) {
  const getHref = (category: GameCategory) => {
    if (currentCategory === category) return '/'
    else return `/${category}`
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex w-max gap-3">
        { gameCategories.map((game, i) => (
          <Button 
            key={ `${game.slug}_${i}` } 
            size="sm" 
            variant={ currentCategory === game.slug ? "secondary" : "outline" } 
            asChild
          >
            <Link href={ getHref(game.slug) }>
              { game.title }
            </Link>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
