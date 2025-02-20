import { draftMode } from "next/headers";
import { getGames } from "@/data/games";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChangedBadge, DraftBadge, NewBadge } from "@/components/CustomBadges/CustomBadges";
import { IN_DEVELOPMENT } from "@/utils/constants";
import { Fragment, Suspense } from "react";
import FilterLogo from "./FilterLogo";
import { CustomLink } from "@/components/CustomLink/CustomLink";
import { getMaps } from "@/data/maps";
import MapFilterClient from "./MapFilter.client";

interface MapFiltersProps {
  currentCategory?: string
}

const difficulties = [
  {
    id: "easy",
    title: "Easy",
  },
  {
    id: "medium",
    title: "Medium",
  },
  {
    id: "hard",
    title: "Hard",
  }
]

export default async function MapFilters({ currentCategory }: MapFiltersProps) {
  const { isEnabled } = await draftMode()
  const gamesPromise = getGames(isEnabled)
  const mapsPromise = getMaps(isEnabled)
  const [games, maps] = await Promise.all([gamesPromise, mapsPromise])
  const mapGames = new Set(maps.map(m => m.category.slug))
  const gameFilters = games.filter(g => mapGames.has(g.slug))

  return (
    <Suspense fallback="Loading...">
      <MapFilterClient 
        draftMode={ isEnabled }
        games={ gameFilters }
        difficulties={ difficulties }
      />
    </Suspense>
  )
}

// OLD MAP FILTERS

// export default async function MapFilters({ currentCategory }: MapFiltersProps) {
//   const { isEnabled } = await draftMode()
//   const gamesPromise = getGames(isEnabled)
//   const mapsPromise = getMaps(isEnabled)
//   const [games, maps] = await Promise.all([gamesPromise, mapsPromise])
//   const mapGames = new Set(maps.map(m => m.category.slug))
//   const gameFilters = games.filter(g => mapGames.has(g.slug))
  
//   const getHref = (category: string) => {
//     if (currentCategory === category) return '/'
//     else return `/${category}`
//   }

//   return (
//     <ScrollArea className="-mt-6 animate-fade-in">
//       <div className="inline-block pt-3">
//         <div className="relative inline-flex w-max gap-2">
//           { gameFilters.map(game => (
//             <Fragment key={ game.id }>
//               <Button
//                 size="sm"
//                 variant={ "outline" }
//                 asChild
//                 className={cn({
//                   "badge-primary-gradient border": currentCategory === game.slug
//                 }, `hover:border hover:border-primary hover:badge-primary-gradient 
//                   focus-visible:border focus-visible:border-primary focus-visible:badge-primary-gradient focus-visible:ring-0`
//                 )}
//               >
//                 <CustomLink href={ getHref(game.slug) } className="flex justify-center items-center gap-2">
//                   <FilterLogo
//                     slug={ game.slug }
//                     alt={ `${game.title} Logo` }
//                     width={ 24 } 
//                     height={ 24 } 
//                     className="size-6" 
//                   />
//                   <span>{ game.title }</span>
//                 </CustomLink>
//               </Button>
//               { game.isNew ? <NewBadge className="absolute -top-3 -right-3 z-10" /> : null }
//               { (isEnabled || IN_DEVELOPMENT) && game.isChanged ? <ChangedBadge className="absolute -top-3 -right-3 z-10" /> : null }
//               { (isEnabled || IN_DEVELOPMENT) && game.isDraft ? <DraftBadge className="absolute -top-3 -right-3 z-10" /> : null }
//             </Fragment>
//           )).reverse()}
//         </div>
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   )
// }