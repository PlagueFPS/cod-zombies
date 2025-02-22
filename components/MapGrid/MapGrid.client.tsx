"use client"
import { use, useEffect, useState } from "react"
import MapCard from "./MapCard/MapCard"
import type { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { useSearchParams } from "next/navigation"
import { validateSearchParams } from "@/utils/validationSchemas"

interface IMapGridClient {
  maps: Omit<FeaturedMapWithoutBody, "updatedAt">[]
  draftMode: boolean
}

export default function MapGridClient({ maps, draftMode }: IMapGridClient) {
  const searchParams = useSearchParams()
  const { game, difficulty } = use(validateSearchParams(searchParams))
  const [filteredMaps, setFilteredMaps] = useState(maps)

  useEffect(() => {
    setFilteredMaps(maps.filter(map => {
      return (
        (game ? map.game.slug === game : true) &&
        (difficulty ? map.difficulty === difficulty : true)
      )
    }))
  }, [searchParams, maps])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { filteredMaps.length > 0 ?  filteredMaps.map((map, index) => (
          <MapCard key={ map.id } map={ map } mapIndex={ index } draftMode={ draftMode } />
        )) : (
          <p className="col-span-4 text-center text-muted-foreground">No quests found with the selected filters.</p>
        )}
    </div>
  )
}
