import { draftMode } from "next/headers"
import { getFeaturedMapsByCategory } from "@/data/featuredMaps"
import MapCard from "@/components/MapGrid/MapCard/MapCard"
import MapCardLoader from "@/components/Loaders/MapCardLoader"
import { Suspense } from "react"

interface StaticMapGridProps {
  category: string
}

export default async function StaticMapGrid({ category }: StaticMapGridProps) {
  const { isEnabled } = await draftMode()
  const { featuredMaps, totalMaps } = await getFeaturedMapsByCategory(isEnabled, category)
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
