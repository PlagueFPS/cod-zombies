"use client"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"
import type { MinifiedZombie } from "@/types/Zombie"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { Suspense, useEffect, useState } from "react"
import GridPagination from "../GridPagination/GridPagination"
import GridPaginationLoader from "../Loaders/GridPaginationLoader"
import BestiaryCard from "../BestiaryCard/BestiaryCard"

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
          <BestiaryCard 
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