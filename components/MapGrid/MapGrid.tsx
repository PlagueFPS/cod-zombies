import type { SearchParams } from '@/utils/validationSchemas'
import { Suspense } from 'react'
import MapGridLoader from '../Loaders/MapGridLoader'
import StaticMapGrid from './StaticMapGrid/StaticMapGrid'
import DynamicMapGrid from './DynamicMapGrid/DynamicMapGrid'

interface MapGridProps {
  searchParams?: Promise<SearchParams>
  category?: string
}

export default function MapGrid({ searchParams, category }: MapGridProps) {
  if (category) {
    return (
      <Suspense fallback={<MapGridLoader />}>
        <StaticMapGrid category={ category } />
      </Suspense>
    )
  } else {
    return (
      <Suspense fallback={<MapGridLoader />}>
        <DynamicMapGrid searchParams={ searchParams } />
      </Suspense>
    )
  }
}