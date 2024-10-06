import { draftMode } from "next/headers";
import { getGameCategories } from "@/data/gameCategory";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  currentCategory?: string
}

export default async function MapFilters({ currentCategory }: MapFiltersProps) {
  const { isEnabled } = await draftMode()
  const gameCategories = await getGameCategories(isEnabled)
  
  const getHref = (category: string) => {
    if (currentCategory === category) return '/'
    else return `/${category}`
  }

  return (
    <ScrollArea className="-mt-4 animate-fade-in">
      <div className="flex w-max gap-3">
        { gameCategories.map(game => (
          <Button 
            key={ game.id } 
            size="sm" 
            variant={ "outline" }
            asChild
            className={cn({
              "badge-primary-gradient border": currentCategory === game.slug
            }, `hover:border hover:border-primary hover:badge-primary-gradient 
              focus-visible:border focus-visible:border-primary focus-visible:badge-primary-gradient focus-visible:ring-0`
            )}
          >
            <Link href={ getHref(game.slug) } aria-label={ game.description }>
              { game.title }
            </Link>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
