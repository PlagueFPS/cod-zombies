import { draftMode } from "next/headers"
import { validateSearchParams } from "@/utils/validationSchemas"
import { getPaginatedFeaturedMaps } from "@/data/featuredMaps"
import MapCard from "@/components/MapGrid/MapCard/MapCard"
import MapCardLoader from "@/components/Loaders/MapCardLoader"
import { Suspense } from "react"
import type { SearchParams } from "@/utils/validationSchemas"

interface DynamicMapGridProps {
  searchParams: Promise<SearchParams> | undefined
}
export default async function DynamicMapGrid({ searchParams }: DynamicMapGridProps) {
  const draftModePromise = draftMode()
  const searchParamsPromise = validateSearchParams(searchParams)
  const [{ isEnabled }, { page }] = await Promise.all([draftModePromise, searchParamsPromise])
  const { featuredMaps, totalMaps } = await getPaginatedFeaturedMaps(isEnabled, page)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center animate-fade-in">
      { featuredMaps.map((map, index) => (
          <Suspense key={ map.id } fallback={<MapCardLoader />}>
            <MapCard map={ map } mapIndex={ index } totalMaps={ totalMaps } />
          </Suspense>
        ))}
    </div>
  )
}