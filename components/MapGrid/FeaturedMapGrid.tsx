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
  const [{ isEnabled }, { page }] = await Promise.all([draftModePromise, searchParamsPromise])
  const { maps, totalMaps } = await getPaginatedMaps(isEnabled, page)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.map((map, index) => (
        <Suspense key={ map.id } fallback={<MapCardLoader />}>
          <MapCard map={ map } mapIndex={ index } totalMaps={ totalMaps } />
        </Suspense>
      ))}
    </div>
  )
}
