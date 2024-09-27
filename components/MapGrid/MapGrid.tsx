import MapCard from './MapCard/MapCard'
import { draftMode } from 'next/headers'
import { getFeaturedMapsByCategory, getPaginatedFeaturedMaps } from '@/data/featuredMaps'
import { type SearchParams, validateSearchParams } from '@/utils/validationSchemas'
import { Suspense } from 'react'
import MapCardLoader from '../Loaders/MapCardLoader'

interface MapGridProps {
  searchParams?: Promise<SearchParams>
  category?: string
}

interface StaticMapGridProps {
  category: string
}

interface DynamicMapGridProps {
  searchParams: Promise<SearchParams> | undefined
} 

export default async function MapGrid({ searchParams, category }: MapGridProps) {
  if (category) {
    return <StaticMapGrid category={ category } />
  } else {
    return <DynamicMapGrid searchParams={ searchParams } />
  }
}

const StaticMapGrid = async ({ category }: StaticMapGridProps) => {
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

const DynamicMapGrid = async ({ searchParams }: DynamicMapGridProps) => {
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