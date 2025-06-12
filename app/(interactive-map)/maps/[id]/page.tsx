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
import { CustomSideBarTrigger } from '@/components/InteractiveMap/CustomSidebarTrigger';
import SidebarLoader from '@/components/Loaders/SidebarLoader';

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
        url: `${env.NEXT_PUBLIC_WEBSITE_URL}/previews/${map.id}-preview.webp`,
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
  const availableMaps = getAvailableMaps()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState ? sidebarState === "true" : true
  const uniqueMarkerTypes = Array.from(new Set(config.markers.map(marker => marker.type)))
  const objectiveMarkers = config.markers.filter(marker => marker.type === "objective")
  const groups: Record<MarkerCategory, MarkerType[]> = {
    general: [],
    equipment: [],
    upgrades: [],
    transportation: [],
    intel: []
  }

  uniqueMarkerTypes.forEach(type => {
    if (type === "objective") return

    const category = markerTypeToCategory[type]
    if (category) {
      groups[category].push(type)
    }
  })

  return (
    <SidebarProvider defaultOpen={ defaultOpen }>
      <Suspense fallback={<SidebarLoader />}>
        <MapSidebar 
          groups={ groups }
          availableMaps={ availableMaps } 
          objectives={ objectiveMarkers }
          uniqueMarkerTypes={ uniqueMarkerTypes } 
        />
      </Suspense>
      <div className='h-svh w-svw'>
        <CustomSideBarTrigger />
        <InteractiveMapWrapper mapConfig={ config } />
      </div>
    </SidebarProvider>
  )
}
