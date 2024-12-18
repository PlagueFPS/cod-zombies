import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader";
import QuestFilters from "@/components/QuestFilters/QuestFilters";
import { Suspense } from "react";


export default function SideQuests() {
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
        </GridSection>
      </div>
    </div>
  )
}
