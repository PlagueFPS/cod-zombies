import type { SearchParams } from "@/utils/validationSchemas";
import HeroSection from "@/components/HeroSection/HeroSection";
import GridSection from "@/components/GridSection/GridSection";
import { Suspense } from "react";
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader";
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import FeaturedMapGrid from "@/components/MapGrid/FeaturedMapGrid";
import MapPaginationLoader from "@/components/Loaders/MapPaginationLoader";
import MapPagination from "@/components/MapGrid/MapPagination/MapPagination";
import type { Metadata } from "next";
import { env } from "@/env";

export const metadata: Metadata = {
  alternates: {
    canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}`
  }
}
interface HomePageProps {
  searchParams: Promise<SearchParams>
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="container flex flex-col gap-12 justify-center items-center">
      <HeroSection text="Call of Duty: Zombies" />
      <GridSection title="Main Quests">
        <Suspense fallback={<MapFiltersLoader />}>
          <MapFilters />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <FeaturedMapGrid searchParams={ searchParams } />
        </Suspense>
        <Suspense fallback={<MapPaginationLoader />}>
          <MapPagination searchParams={ searchParams } />
        </Suspense>
      </GridSection>
    </div>
  );
}