import type { GameCategory } from '@/types/GameCategory'
import { getMaps } from '@/data/data'
import MapCard from './MapCard/MapCard'
import { MAP_LIMIT } from '@/utils/constants'

interface MapGridProps {
  category?: GameCategory | undefined
  skip?: number
}

export default async function MapGrid({ category, skip }: MapGridProps) {
  const maps = await getMaps(category, skip, MAP_LIMIT)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.items.map((map, index) => (
        <MapCard key={ map.sys.id } map={ map } mapIndex={ index } totalMaps={ maps.total } />
      ))}
    </div>
  )
}
