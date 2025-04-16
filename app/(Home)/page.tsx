import HeroSection from "@/components/HeroSection/HeroSection";
import GridSection from "@/components/GridSection/GridSection";
import { Suspense } from "react";
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader";
import { MainQuestFilters } from "@/components/QuestFilters/QuestFilters";
import GridLoader from "@/components/Loaders/GridLoader";
import { MainQuestGrid } from "@/components/QuestGrid/QuestGrid";
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