"use client"
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { gameList } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";


export default function MapFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  const updateSearchParams = (gameId: string) => {
    if (filter === gameId) return router.push('/')
    else return router.push(`/?filter=${gameId}`)
  }

  return (
    <ScrollArea className="-mt-4">
      <div className="flex w-max gap-3">
        { gameList.map((game, i) => (
          <>
            <Button 
              key={ `${game.id}_${i}` } 
              size="sm" 
              variant={ filter === game.id ? "secondary" : "outline" } 
              onClick={ () => updateSearchParams(game.id) }
            >
              { game.name }
            </Button>
          </>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
