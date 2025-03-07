import BestiaryFilters from "@/components/BestiaryFilters/BestiaryFilters";
import BestiaryGrid from "@/components/BestiaryGrid/BestiaryGrid";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import BestiaryFiltersLoader from "@/components/Loaders/BestiaryFiltersLoader";
import BestiaryGridLoader from "@/components/Loaders/BestiaryGridLoader";
import { Suspense } from "react";

export default function BestiaryPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="container flex flex-col gap-12 justify-center items-center">
        <Breadcrumbs 
          links={[
            { title: 'Bestiary', href: '/bestiary' },
          ]}
        />
        <GridSection title="Bestiary">
          <p className="text-lg text-muted-foreground -mt-7 mb-2">
            Learn about the weaknesses, behavior, and strategies to defeat the undead horde.
          </p>
          <Suspense fallback={<BestiaryFiltersLoader />}>
            <BestiaryFilters />
          </Suspense>
          <Suspense fallback={<BestiaryGridLoader />}>
            <BestiaryGrid />
          </Suspense>
        </GridSection>
      </div>
    </div>
  )
}
