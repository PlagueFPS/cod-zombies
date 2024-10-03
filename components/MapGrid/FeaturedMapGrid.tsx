import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
import { draftMode } from "next/headers"
import { getPaginatedFeaturedMaps } from "@/data/featuredMaps"
import { Suspense } from "react"
import MapCardLoader from "../Loaders/MapCardLoader"
import MapCard from "./MapCard/MapCard"

interface FeaturedMapGridProps {
  searchParams: Promise<SearchParams>
}

export default async function FeaturedMapGrid({ searchParams }: FeaturedMapGridProps) {
  const [{ isEnabled }, { page }] = await Promise.all([draftMode(), validateSearchParams(searchParams)])
  const { featuredMaps, totalMaps } = await getPaginatedFeaturedMaps(isEnabled, page)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { featuredMaps.map((map, index) => (
        <Suspense key={ map.id } fallback={<MapCardLoader />}>
          <MapCard map={ map } mapIndex={ index } totalMaps={ totalMaps } />
        </Suspense>
      ))}
    </div>
  )
}
