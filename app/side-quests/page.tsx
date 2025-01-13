import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader";
import QuestFilters from "@/components/QuestFilters/QuestFilters";
import QuestGrid from "@/components/QuestGrid/QuestGrid";
import { GLOBAL_OG_PROPS } from "@/utils/constants";
import { SearchParams } from "@/utils/validationSchemas";
import { Metadata } from "next";
import { Suspense } from "react";

interface ISideQuests {
  searchParams: Promise<SearchParams>
}

export const generateMetadata = (): Metadata => {
  const title = 'Side Quests'
  const description = 'Explore our comprehensive guides to the hidden Side Quests and Easter Eggs beyond the Main Story in Call of Duty: Zombies'
  return {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/side-quests`
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default function SideQuests({ searchParams }: ISideQuests) {
  return (
    <div className='flex flex-col gap-16 justify-center items-center w-full'>
      <div className="container flex flex-col gap-16 justify-center items-center">
      <Breadcrumbs 
          links={[
            { title: 'Side Quests', href: '/side-quests', active: true },
          ]}
        />
        <GridSection title="Featured Side Quests">
          <Suspense fallback={<QuestFilterLoader />}>
            <QuestFilters />
          </Suspense>
          <Suspense fallback={<MapGridLoader />}>
            <QuestGrid searchParams={ searchParams } />
          </Suspense>
        </GridSection>
      </div>
    </div>
  )
}
