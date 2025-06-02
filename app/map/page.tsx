import type { Metadata } from 'next';
import { GLOBAL_OG_PROPS } from '@/utils/constants';
import { getMapConfig } from '@/data/interactive-map'
import InteractiveMapWrapper from '@/components/InteractiveMap/InteractiveMapWrapper'

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

export default async function MapPage() {
  const mapConfig = await getMapConfig("shattered-veil")

  return <InteractiveMapWrapper mapConfig={ mapConfig } />
}
