import type { GameCategory } from '@/types/GameCategory'
import { getMaps, getPagination } from '@/data/data'
import MapCard from './MapCard/MapCard'
import { MAP_LIMIT } from '@/utils/constants'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import MapCardLoader from '../Loaders/MapCardLoader'

interface MapGridProps {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
  category?: GameCategory | undefined
}

export default async function MapGrid({ searchParams, category }: MapGridProps) {
  const { isEnabled } = draftMode()
  const { skip } = await getPagination(searchParams ? searchParams.page : undefined)
  const { maps, totalMaps } = await getMaps(isEnabled, category, skip, MAP_LIMIT)
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      <>
        { maps.map((map, index) => (
          <Suspense key={ map.sys.id } fallback={<MapCardLoader />}>
            <MapCard map={ map } mapIndex={ index } totalMaps={ totalMaps } />
          </Suspense>
        ))}
      </>
    </div>
  )
}