import { getGameCategories } from "@/utils/contentful-utils";
import TempButton from "@/components/TempButton";
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters";
import MapGrid from "@/components/MapGrid/MapGrid";
import { Suspense } from "react";

export default function Home() {
  const gameCategories = getGameCategories()

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock the Secrets of Call of Duty: <span className="text-primary">Zombies</span>
        </h2>
        <p className="text-foreground/90 text-sm md:text-base lg:text-lg">Explore our comprehensive guides to the most challenging and rewarding main quests in the Call of Duty Zombies universe</p>
        { process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && <TempButton /> }
      </section>
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">Featured Maps</h2>
        <Suspense fallback={<MapFiltersLoader />}>
          <MapFilters gameCategories={ gameCategories } />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <MapGrid />
        </Suspense>
      </section>
    </div>
  );
}
