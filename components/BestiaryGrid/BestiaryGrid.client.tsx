"use client"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"
import type { MinifiedZombie } from "@/types/Zombie"
import { IN_DEVELOPMENT, MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { Suspense, useEffect, useState } from "react"
import FeaturedImage from "../FeaturedImage/FeaturedImage"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChangedBadge, DraftBadge, NewBadge, TypeBadge } from "../CustomBadges/CustomBadges"
import { CustomLink } from "../CustomLink/CustomLink"
import GridPagination from "../GridPagination/GridPagination"
import GridPaginationLoader from "../Loaders/GridPaginationLoader"

interface IBestiaryGridClient {
  zombies: MinifiedZombie[]
  draftMode: boolean
}

export default function BestiaryGridClient({ zombies, draftMode }: IBestiaryGridClient) {
  const { searchParams, gameParams, mapParams, typeParams, page, validatePageParam } = useSiteSearchParams()
  const [filteredZombies, setFilteredZombies] = useState(zombies)
  const skip = calculateSkip(page, MAP_LIMIT)
  const paginatedZombies = filteredZombies.slice(skip, (MAP_LIMIT * page))

  useEffect(() => {
    let filtered = zombies

    if (gameParams.length > 0) {
      filtered = filtered.filter(z => z.games.some(game => gameParams.includes(game.slug)) || z.slug === 'zombie')
    }

    if (mapParams.length > 0) {
      filtered = filtered.filter(z => z.maps.some(map => mapParams.includes(map.slug)) || z.slug === 'zombie')
    }

    if (typeParams.length > 0) {
      filtered = filtered.filter(z => typeParams.includes(z.type.toLowerCase()))
    }

    setFilteredZombies(filtered)
  }, [searchParams])

  useEffect(() => {
    validatePageParam(filteredZombies.length)
  }, [filteredZombies, validatePageParam])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        { paginatedZombies.length > 0 ? paginatedZombies.map((zombie, index) => (
          <ZombiePreviewCard 
            key={ zombie.id }
            zombie={ zombie }
            zombieIndex={ index }
            draftMode={ draftMode }
          />
        )) : (
          <p className="col-span-4 text-center text-muted-foreground">No zombies found with the selected filters.</p>
        )}
      </div>
      <Suspense fallback={<GridPaginationLoader />}>
        <GridPagination data={ filteredZombies } />
      </Suspense>
    </>
  )
}

interface IZombiePreviewCard {
  zombie: MinifiedZombie
  zombieIndex: number
  draftMode: boolean
}

function ZombiePreviewCard({ zombie, zombieIndex, draftMode }: IZombiePreviewCard) {
  const priority = zombieIndex === 0
  const alt = `${zombie.name} Image`


  return (
    <article className="max-h-[450px] h-full group outline-none">
      <CustomLink href={ `/bestiary/${zombie.slug}` } aria-label={ `View details for ${zombie.name}` }>
        <Card className={`
          relative h-full group-hover:border-primary group-hover:scale-105 
          group-focus-visible:scale-105 group-focus-visible:border-primary 
          cursor-pointer transition-transform overflow-hidden animate-fade-in 
          shadow-xl dark:shadow-none`}
        >
          <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
            { zombie.isNew ? <NewBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && zombie.isDraft ? <DraftBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && zombie.isChanged ? <ChangedBadge /> : null }
            <TypeBadge type={ zombie.type } />
            <Badge className='badge-primary-gradient'>
              { zombie.games[0].title }
            </Badge>
          </div>
          <div className="hidden dark:flex absolute inset-0 z-10 items-center w-full h-full opacity-25 blur-2xl">
            <FeaturedImage 
              featuredImage={ zombie.image } 
              priority={ priority } 
              quality={ 1 }
              sizes='32px'
              className='aspect-square scale-150'
            />
          </div>
          <CardHeader className="flex gap-2 flex-grow">
            <div className='relative overflow-hidden h-full w-full rounded-md'>
              <FeaturedImage 
                featuredImage={ zombie.image } 
                priority={ priority }
                alt={ alt }
                sizes='272px'
                className="h-44 object-cover object-top"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ zombie.name }</CardTitle>
              <CardDescription className="text-foreground/85">{ zombie.description }</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </CustomLink>
    </article>
  )
}