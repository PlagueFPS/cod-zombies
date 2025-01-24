import { getMapsByCategory } from "@/data/maps"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import MapCardLoader from "../Loaders/MapCardLoader"
import MapCard from "./MapCard/MapCard"

interface CategoryMapGridProps {
  category: string
}

export default async function CategoryMapGrid({ category }: CategoryMapGridProps) {
  const { isEnabled } = await draftMode()
  const { maps } = await getMapsByCategory(isEnabled, category)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.map((map, index) => (
        <Suspense key={ map.id } fallback={<MapCardLoader />}>
          <MapCard 
            map={ map } 
            mapIndex={ index } 
          />
        </Suspense>
      ))}
    </div>
  )
}
