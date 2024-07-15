"use client"
import { GameCategory } from "@/types/GameCategory";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MapFiltersProps {
  currentCategory?: GameCategory
  gameCategories: {
    title: string,
    slug: GameCategory
  }[]
}

export default function MapFilters({ currentCategory, gameCategories }: MapFiltersProps) {
  const router = useRouter()

  const updateCategory = (category: string) => {
    if (currentCategory === category) return router.push('/')
    else return router.push(`/${category}`)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex w-max gap-3 text-foreground/80">
        { gameCategories.map((game, i) => (
          <Button 
            key={ `${game.slug}_${i}` } 
            size="sm" 
            variant={ currentCategory === game.slug ? "secondary" : "outline" } 
            onClick={ () => updateCategory(game.slug) }
          >
            { game.title }
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
