import MapCard from './MapCard/MapCard'
import { draftMode } from 'next/headers'
import { getFeaturedMapsByCategory, getPaginatedFeaturedMaps } from '@/data/featuredMaps'
import { type SearchParams, validateSearchParams } from '@/utils/validationSchemas'

interface MapGridProps {
  searchParams?: Promise<SearchParams>
  category?: string
}

export default async function MapGrid({ searchParams, category }: MapGridProps) {
  const draftModePromise = draftMode()
  const searchParamsPromise = validateSearchParams(searchParams)
  const [{ isEnabled }, { page }] = await Promise.all([draftModePromise, searchParamsPromise])
  const { featuredMaps, totalMaps } = await chooseMapGridMaps(isEnabled, page, category)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center animate-fade-in">
      <>
        { featuredMaps.map((map, index) => (
          <MapCard key={ map.id } map={ map } mapIndex={ index } totalMaps={ totalMaps } />
        ))}
      </>
    </div>
  )
}

const chooseMapGridMaps = async (isEnabled: boolean, page: number, category: string | undefined) => {
  if (category) {
    const { featuredMaps, totalMaps } = await getFeaturedMapsByCategory(isEnabled, category)
    return {
      featuredMaps,
      totalMaps
    }
  } else {
    if (page) {
      const { featuredMaps, totalMaps } = await getPaginatedFeaturedMaps(isEnabled, page)
      return {
      featuredMaps,
      totalMaps
      }
    } else throw new Error('Expected page parameter')
  }
}