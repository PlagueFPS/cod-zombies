"use client"
import { Suspense, useEffect, useState } from "react"
import MapCard from "./MapCard/MapCard"
import type { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { useSearchParams } from "next/navigation"
import { calculateSkip } from "@/utils/contentful-utils"
import { MAP_LIMIT } from "@/utils/constants"
import MapPaginationLoader from "../Loaders/MapPaginationLoader"
import MapPagination from "./MapPagination/MapPagination"

interface IMapGridClient {
  maps: Omit<FeaturedMapWithoutBody, "updatedAt">[]
  draftMode: boolean
}

export default function MapGridClient({ maps, draftMode }: IMapGridClient) {
  const searchParams = useSearchParams()
  const game = searchParams.getAll("game")
  const difficulty = searchParams.getAll("difficulty")
  const pageParam = searchParams.get("page")
  const page = pageParam ? parseInt(pageParam) : 1
  const skip = calculateSkip(page, MAP_LIMIT);
  const [filteredMaps, setFilteredMaps] = useState(maps)
  const paginatedMaps = filteredMaps.slice(skip, (MAP_LIMIT * page))

 useEffect(() => {
  let filtered = maps

  if (game.length > 0) {
    filtered = filtered.filter(map => game.includes(map.game.slug))
  }

  if (difficulty.length > 0) {
    filtered = filtered.filter(map => difficulty.includes(map.difficulty.toLowerCase()))
  }

  setFilteredMaps(filtered)
 }, [searchParams])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        { paginatedMaps.length > 0 ?  paginatedMaps.map((map, index) => (
            <MapCard key={ map.id } map={ map } mapIndex={ index } draftMode={ draftMode } />
          )) : (
            <p className="col-span-4 text-center text-muted-foreground">No quests found with the selected filters.</p>
          )}
      </div>
      <Suspense fallback={<MapPaginationLoader />}>
        <MapPagination maps={ filteredMaps } />
      </Suspense>
    </>
  )
}
