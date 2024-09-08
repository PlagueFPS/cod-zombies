import type { GameCategory } from "@/types/GameCategory";
import { getGameCategories } from "@/data/data";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

interface MapFiltersProps {
  currentCategory?: GameCategory
}

export default async function MapFilters({ currentCategory }: MapFiltersProps) {
  const gameCategories = await getGameCategories()
  
  const getHref = (category: GameCategory) => {
    if (currentCategory === category) return '/'
    else return `/${category}`
  }

  return (
    <ScrollArea className="-mt-4 animate-fade-in">
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
