import { getFeaturedMaps } from '@/data/featuredMaps'
import { FeaturedMap } from '@/types/FeaturedMap'
import { validateSearchParams, type SearchParams } from '@/utils/validationSchemas'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import MapCard from './MapCard/MapCard'
import MapCardLoader from '../Loaders/MapCardLoader'

interface MapGridProps {
  searchParams?: Promise<SearchParams>
  category?: string
}

export default async function MapGrid({ searchParams, category }: MapGridProps) {
  const { isEnabled } = await draftMode()
  let featuredMaps: FeaturedMap[]
  let totalMaps: number

  if (category) {
    const { featuredMaps: allFeaturedMaps, totalMaps: categoryTotalMaps } = await getFeaturedMaps(isEnabled)
    featuredMaps = allFeaturedMaps.filter(map => map.gameCategory.slug === category)
    totalMaps = categoryTotalMaps
  }
  else {
    const { page } = await validateSearchParams(searchParams)
    const { featuredMaps: paginatedFeaturedMaps, totalMaps: paginatedTotalMaps } = await getFeaturedMaps(isEnabled, page)
    featuredMaps = paginatedFeaturedMaps
    totalMaps = paginatedTotalMaps
  }

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