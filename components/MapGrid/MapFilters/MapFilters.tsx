"use client"
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GameCategory } from "@/types/GameCategory";
import { gameList } from "@/utils/constants";
import { useRouter } from "next/navigation";

interface MapFiltersProps {
  category: GameCategory | undefined
}

export default function MapFilters({ category }: MapFiltersProps) {
  const router = useRouter()

  const updateSearchParams = (gameId: string) => {
    if (category === gameId) return router.push('/')
    else return router.push(`/?category=${gameId}`)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex w-max gap-3 text-foreground/80">
        { gameList.map((game, i) => (
          <Button 
            key={ `${game.id}_${i}` } 
            size="sm" 
            variant={ category === game.id ? "secondary" : "outline" } 
            onClick={ () => updateSearchParams(game.id) }
          >
            { game.name }
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
