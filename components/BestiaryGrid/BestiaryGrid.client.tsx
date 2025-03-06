"use client"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"
import type { Zombie } from "@/types/Zombie"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { useEffect, useState } from "react"
import FeaturedImage from "../FeaturedImage/FeaturedImage"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface IBestiaryGridClient {
  zombies: Omit<Zombie, "updatedAt">[]
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
  )
}

interface IZombiePreviewCard {
  zombie: Omit<Zombie, "updatedAt">
  zombieIndex: number
  draftMode: boolean
}

function ZombiePreviewCard({ zombie, zombieIndex, draftMode }: IZombiePreviewCard) {
  const priority = zombieIndex === 0
  const alt = `${zombie.name} Image`

  return (
    <article className="max-h-[450px] h-full group outline-none">
      <Card className="h-full rounded-xl bg-background">
        <CardHeader className="relative h-64 overflow-hidden space-y-0 p-0">
          <div className="absolute z-20 top-2 right-2 flex items-center justify-center gap-1">
            <Badge className="badge-primary-gradient">{ zombie.type }</Badge>
            <Badge className="badge-primary-gradient">{ zombie.games[0].title }</Badge>
          </div>
          <FeaturedImage 
            featuredImage={ zombie.image }
            alt={ alt }
            sizes="320px"
            priority={ priority }
            className="w-full h-full object-cover aspect-square rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <CardTitle className="text-2xl font-bold drop-shadow-lg">{ zombie.name }</CardTitle>
          </div>
        </CardHeader>
        <CardDescription className="p-4">{ zombie.description }</CardDescription>
      </Card>
    </article>
  )
}