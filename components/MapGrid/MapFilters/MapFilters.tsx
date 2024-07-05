"use client"
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { gameList } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";


export default function MapFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

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
