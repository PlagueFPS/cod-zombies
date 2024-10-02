import type { SearchParams } from "@/utils/validationSchemas";
import HeroSection from "@/components/HeroSection/HeroSection";
import MapSection from "@/components/MapSection/MapSection";
import { Suspense } from "react";
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader";
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import FeaturedMapGrid from "@/components/MapGrid/FeaturedMapGrid";
import MapPaginationLoader from "@/components/Loaders/MapPaginationLoader";
import MapPagination from "@/components/MapGrid/MapPagination/MapPagination";

interface HomePageProps {
  searchParams: Promise<SearchParams>
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection text="Call of Duty: Zombies" />
      <MapSection>
        <Suspense fallback={<MapFiltersLoader />}>
          <MapFilters />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <FeaturedMapGrid searchParams={ searchParams } />
        </Suspense>
        <Suspense fallback={<MapPaginationLoader />}>
          <MapPagination searchParams={ searchParams } />
        </Suspense>
      </MapSection>
    </div>
  );
}