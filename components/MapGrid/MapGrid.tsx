import { getAllMaps } from '@/utils/contentful-utils'
import MapCard from './MapCard/MapCard'

export default async function MapGrid() {
  const posts = await getAllMaps()
  const featuredMaps = posts.items

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { featuredMaps.map(map => (
        <MapCard key={ map.sys.id } map={ map } />
      ))}
    </div>
  )
}
