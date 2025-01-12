import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader";
import QuestFilters from "@/components/QuestFilters/QuestFilters";
import QuestGrid from "@/components/QuestGrid/QuestGrid";
import { SearchParams } from "@/utils/validationSchemas";
import { Suspense } from "react";

interface ISideQuests {
  searchParams: Promise<SearchParams>
}

export default function SideQuests({ searchParams }: ISideQuests) {
  return (
    <div className='flex flex-col gap-16 justify-center items-center w-full'>
      <div className="container flex flex-col gap-16 justify-center items-center">
        <Breadcrumbs 
          links={[
            { title: 'Side Quests', href: '/side-quests', active: true }
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
