import type { GameCategory } from '@/types/GameCategory'
import { getMaps } from '@/data/data'
import MapCard from './MapCard/MapCard'
import { MAP_LIMIT } from '@/utils/constants'
import { draftMode } from 'next/headers'

interface MapGridProps {
  category?: GameCategory | undefined
  skip?: number
}

export default async function MapGrid({ category, skip }: MapGridProps) {
  const { isEnabled } = draftMode()
  const { maps, totalMaps } = await getMaps(isEnabled, category, skip, MAP_LIMIT)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { maps.map((map, index) => (
        <MapCard key={ map.sys.id } map={ map } mapIndex={ index } totalMaps={ totalMaps } />
      ))}
    </div>
  )
}
