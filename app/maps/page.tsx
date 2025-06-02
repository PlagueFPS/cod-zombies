import type { Metadata } from 'next';
import { GLOBAL_OG_PROPS } from '@/utils/constants';
import { getAvailableMaps, getMapConfig } from '@/data/interactive-map'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import GridSection from '@/components/GridSection/GridSection';
import { Suspense } from 'react';
import PreviewCard from '@/components/InteractiveMap/PreviewCard';

export const metadata: Metadata = {
  title: "Interactive Maps",
  description: "Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
  openGraph: {
    ...GLOBAL_OG_PROPS.openGraph,
    title: "Interactive Maps",
    description: "Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
    url: "/maps",
  },
  twitter: {
    title: "Interactive Maps",
    description: "Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
    card: "summary_large_image"
  }
}

export default function MapsPage() {
  const maps = getAvailableMaps()

  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <div className='container flex flex-col gap-6 justify-center items-center'>
        <Breadcrumbs 
          links={[
            { title: "Maps", href: "/maps" }
          ]}
        />
        <GridSection title='Interactive Maps'>
          <p className='sm:text-lg text-muted-foreground -mt-6 mb-2'>
            Browse our collection of interactive maps showcasing key spawn points, locations, and more.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-center'>
            { maps.map((map, index) => (
              <Suspense key={ map } fallback={<div>Loading Preview Card...</div>}>
                <PreviewCard mapId={ map } index={ index } />
              </Suspense>
            ))}
          </div>
        </GridSection>
      </div>
    </div>
  )
}
