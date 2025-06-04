import type { MapId } from '@/map-configs';
import type { Metadata } from 'next';
import type { MarkerCategory, MarkerType } from '@/types/InteractiveMap';
import InteractiveMapWrapper from '@/components/InteractiveMap/InteractiveMapWrapper'
import { getAvailableMaps, getMapConfig } from '@/data/interactive-map'
import { env } from '@/env';
import { notFound } from 'next/navigation';
import { GLOBAL_OG_PROPS } from '@/utils/constants';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import MapSidebar from '@/components/InteractiveMap/MapSidebar';
import { Suspense } from 'react';
import { markerTypeToCategory } from '@/map-configs/markers';

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
  if (error || !map) notFound()
  const title = `${map.title} Interactive Map`

  return {
    title,
    description: map.description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
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
  const cookiePromise = cookies()
  const { id } = await params
  const { data: config, error } = await getMapConfig(id)
  if (error) notFound()
  
  const cookieStore = await cookiePromise
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const availableMaps = getAvailableMaps()
  const uniqueMarkerTypes = Array.from(new Set(config.markers.map(marker => marker.type)))
  const groups: Record<MarkerCategory, MarkerType[]> = {
    general: [],
    equipment: [],
    upgrades: [],
    transportation: []
  }

  uniqueMarkerTypes.forEach(type => {
    if (type === "objective") return

    const category = markerTypeToCategory[type]
    if (category) {
      groups[category].push(type)
    }
  })

  const objectiveMarkers = config.markers.filter(marker => marker.type === "objective")

  return (
    <SidebarProvider defaultOpen={ defaultOpen }>
      <Suspense fallback={<div>Loading Sidebar...</div>}>
        <MapSidebar 
          groups={ groups }
          availableMaps={ availableMaps } 
          objectives={ objectiveMarkers } 
        />
      </Suspense>
      <div className='relative -mt-10 flex-1 h-screen w-screen overflow-hidden'>
        <InteractiveMapWrapper mapConfig={ config } />
      </div>
    </SidebarProvider>
  )
}
