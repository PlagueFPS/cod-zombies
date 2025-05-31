import InteractiveMapWrapper from '@/components/InteractiveMap/InteractiveMapWrapper'
import { getMapConfig } from '@/data/interactive-map'

export default async function MapPage() {
  const mapConfig = await getMapConfig("citadelle-des-morts")

  return <InteractiveMapWrapper mapConfig={ mapConfig } />
}
