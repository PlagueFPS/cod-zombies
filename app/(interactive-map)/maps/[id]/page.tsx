import type { MapId } from '@/map-configs';
import type { Metadata } from 'next';
import type { MarkerCategory } from '@/map-configs/markers';
import InteractiveMapWrapper from '@/components/InteractiveMap/InteractiveMapWrapper'
import { getAvailableMaps, getMapConfig } from '@/data/interactive-map'
import { env } from '@/env';
import { notFound } from 'next/navigation';
import { GLOBAL_OG_PROPS } from '@/utils/constants';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import MapSidebar from '@/components/InteractiveMap/MapSidebar';
import { Suspense } from 'react';
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
  const config = await getMapConfig(id)
  if (!config) notFound()
  const title = `${config.title} Interactive Map`

  return {
    title,
    description: config.description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description: config.description,
      url: `/maps/${config.id}`,
      images: {
        url: `${env.NEXT_PUBLIC_WEBSITE_URL}/previews/${config.id}-preview.webp`,
        width: 640,
        height: 360
      },
    },
    twitter: {
      title,
      description: config.description,
      card: 'summary_large_image'
    }
  } 
}

export default async function InteractiveMapPage({ params }: IInteractiveMapPage) {
  const cookiePromise = cookies()
  const { id } = await params
  const config = await getMapConfig(id)
  if (!config) notFound()
  
  const cookieStore = await cookiePromise
  const availableMaps = getAvailableMaps()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState ? sidebarState === "true" : true
  const groups: Record<MarkerCategory, Set<string>> = {
    general: new Set(),
    equipment: new Set(),
    upgrades: new Set(),
    objectives: new Set(),
    transportation: new Set(),
    intel: new Set()
  }

  config.markers.forEach(marker => {
    switch(marker.category) {
      case "general":
        if (marker.type && marker.type === "label") {
          groups.general.add(marker.type)
        }
        else groups.general.add(marker.id)
        break
      case "equipment":
        if (marker.type && marker.type === "weapon-wall-buy") {
          groups.equipment.add(marker.type)
        }
        else groups.equipment.add(marker.id)
        break
      case "upgrades":
        if (marker.type && marker.type === "perk") {
          groups.upgrades.add(marker.type)
        }
        else groups.upgrades.add(marker.id)
        break
      case "objectives":
        groups.objectives.add(marker.id)
        break
      case "transportation":
        groups.transportation.add(marker.id)
        break
      case "intel":
        groups.intel.add(marker.id)
        break
    }
  })

  return (
    <SidebarProvider defaultOpen={ defaultOpen }>
      <Suspense fallback={<SidebarLoader />}>
        <MapSidebar 
          groups={ groups }
          availableMaps={ availableMaps }
          mapMarkers={ config.markers }
        />
      </Suspense>
      <div className='h-svh w-svw'>
        <CustomSideBarTrigger />
        <InteractiveMapWrapper mapConfig={ config } />
      </div>
    </SidebarProvider>
  )
}
