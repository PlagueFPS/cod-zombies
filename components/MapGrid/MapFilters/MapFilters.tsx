import { draftMode } from "next/headers";
import { getGameCategories } from "@/data/gameCategory";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChangedBadge, DraftBadge, NewBadge } from "@/components/CustomBadges/CustomBadges";
import { IN_DEVELOPMENT } from "@/utils/constants";

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
    <ScrollArea className="-mt-6 animate-fade-in">
      <div className="inline-block pt-3">
        <div className="relative inline-flex w-max gap-2">
          { gameCategories.map(game => (
            <>
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
              { game.isNew ? <NewBadge className="absolute -top-3 -right-3 z-10" /> : null }
              { (isEnabled || IN_DEVELOPMENT) && game.isChanged ? <ChangedBadge className="absolute -top-3 -right-3 z-10" /> : null }
              { (isEnabled || IN_DEVELOPMENT) && game.isDraft ? <DraftBadge className="absolute -top-3 -right-3 z-10" /> : null }
            </>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
