import HeroSection from "@/components/hero-section/hero-section";
import GridSection from "@/components/grid-section/grid-section";
import { Suspense } from "react";
import MapFiltersLoader from "@/components/loaders/map-filters-loader";
import { MainQuestFilters } from "@/components/quest-filters/quest-filters";
import GridLoader from "@/components/loaders/grid-loader";
import { MainQuestGrid } from "@/components/quest-grid/quest-grid";
import type { Metadata } from "next";
import { env } from "@/env";

export const metadata: Metadata = {
  alternates: {
    canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}`
  }
}

export default function Home() {
  return (
    <div className="container flex flex-col gap-12 justify-center items-center">
      <HeroSection />
      <GridSection title="Main Quests">
        <Suspense fallback={<MapFiltersLoader />}>
          <MainQuestFilters />
        </Suspense>
        <Suspense fallback={<GridLoader />}>
          <MainQuestGrid  />
        </Suspense>
      </GridSection>
    </div>
  );
}