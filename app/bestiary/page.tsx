import BestiaryFilters from "@/components/BestiaryFilters/BestiaryFilters";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import BestiaryFiltersLoader from "@/components/Loaders/BestiaryFiltersLoader";
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
          <p className="text-lg text-muted-foreground">Explore the different zombie types featured in Call of Duty: Zombies</p>
          <Suspense fallback={<BestiaryFiltersLoader />}>
            <BestiaryFilters />
          </Suspense>
        </GridSection>
      </div>
    </div>
  )
}
