"use client"
import { GameCategory } from "@/types/GameCategory";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MapFiltersProps {
  currentCategory?: GameCategory
  gameCategories: Promise<{
    title: string
    slug: GameCategory
  }[]> | {
    title: string,
    slug: GameCategory
  }[]
}

export default function MapFilters({ currentCategory, gameCategories }: MapFiltersProps) {
  const categories = gameCategories instanceof Promise ? use(gameCategories) : gameCategories
  const router = useRouter()

  const updateSearchParams = (category: string) => {
    if (currentCategory === category) return router.push('/')
    else return router.push(`/${category}`)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex w-max gap-3 text-foreground/80">
        { categories.map((game, i) => (
          <Button 
            key={ `${game.slug}_${i}` } 
            size="sm" 
            variant={ currentCategory === game.slug ? "secondary" : "outline" } 
            onClick={ () => updateSearchParams(game.slug) }
          >
            { game.title }
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
