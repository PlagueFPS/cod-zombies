import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader";
import { SideQuestFilters } from "@/components/QuestFilters/QuestFilters";
import { SideQuestGrid } from "@/components/QuestGrid/QuestGrid";
import { env } from "@/env";
import { GLOBAL_OG_PROPS } from "@/utils/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Side Quests',
  description: 'Discover & complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.',
  openGraph: {
    ...GLOBAL_OG_PROPS.openGraph,
    title: 'Side Quests',
    description: 'Discover & complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.',
    url: '/side-quests'
  },
  twitter: {
    title: 'Side Quests',
    description: 'Discover & complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.',
    card: 'summary_large_image'
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`
  }
}

export default function SideQuests() {
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <div className="container flex flex-col gap-12 justify-center items-center">
        <Breadcrumbs 
          links={[
            { title: 'Side Quests', href: '/side-quests' },
          ]}
        />
        <GridSection title="Side Quests">
          <Suspense fallback={<QuestFilterLoader />}>
            <SideQuestFilters />
          </Suspense>
          <Suspense fallback={<MapGridLoader />}>
            <SideQuestGrid  />
          </Suspense>
        </GridSection>
      </div>
    </div>
  )
}
