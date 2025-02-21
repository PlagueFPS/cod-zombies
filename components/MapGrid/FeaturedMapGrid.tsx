import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
import { draftMode } from "next/headers"
import { getPaginatedMaps } from "@/data/maps"
import { Suspense } from "react"
import MapCardLoader from "../Loaders/MapCardLoader"
import MapCard from "./MapCard/MapCard"

interface FeaturedMapGridProps {
  searchParams: Promise<SearchParams>
}

export default async function FeaturedMapGrid({ searchParams }: FeaturedMapGridProps) {
  const draftModePromise = draftMode()
  const searchParamsPromise = validateSearchParams(searchParams)
  const [{ isEnabled }, { page, game, difficulty }] = await Promise.all([draftModePromise, searchParamsPromise])
  const { maps } = await getPaginatedMaps(isEnabled, page, game, difficulty)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.length > 0 ?  maps.map((map, index) => (
        <Suspense key={ map.id } fallback={<MapCardLoader />}>
          <MapCard map={ map } mapIndex={ index } />
        </Suspense>
      )) : (
        <p className="col-span-4 text-center text-muted-foreground">No quests found with the selected filters.</p>
      )}
    </div>
  )
}
