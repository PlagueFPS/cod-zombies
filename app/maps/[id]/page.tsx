import type { MapId } from '@/map-configs';
import type { Metadata } from 'next';
import InteractiveMapWrapper from '@/components/InteractiveMap/InteractiveMapWrapper'
import { getAvailableMaps, getMapConfig } from '@/data/interactive-map'
import { env } from '@/env';
import { notFound } from 'next/navigation';

interface IInteractiveMapPage {
  params: Promise<{ id: MapId }>
}

export const generateStaticParams = () => {
  const maps = getAvailableMaps()
  return maps.map(map => ({
    id: map
  }))
}

export const generateMetadata = async ({ params }: IInteractiveMapPage): Promise<Metadata> => {
  const { id } = await params
  const { data: map, error } = await getMapConfig(id)
  if (error) notFound()
  const title = `${map.title} Interactive Map`

  return {
    title,
    description: map.description,
    openGraph: {
      title,
      description: map.description,
      url: `/maps/${map.id}`,
      images: {
        url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.id}-preview.webp`,
        width: 640,
        height: 360
      },
    },
    twitter: {
      title,
      description: map.description,
      card: 'summary_large_image'
    }
  } 
}

export default async function InteractiveMapPage({ params }: IInteractiveMapPage) {
  const { id } = await params
  const { data: config, error } = await getMapConfig(id)
  if (error) notFound()

  return <InteractiveMapWrapper mapConfig={ config } />
}
