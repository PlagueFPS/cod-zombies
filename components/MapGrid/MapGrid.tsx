import type { GameCategory } from '@/types/GameCategory'
import { getMaps } from '@/utils/contentful-utils'
import MapCard from './MapCard/MapCard'

interface MapGridProps {
  category?: GameCategory | undefined
}

export default async function MapGrid({ category }: MapGridProps) {
  const maps = await getMaps(category)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.items.map(map => (
        <MapCard key={ map.sys.id } map={ map } />
      ))}
    </div>
  )
}
