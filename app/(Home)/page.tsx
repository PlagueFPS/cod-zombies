import { getGameCategories, getSkipAndPage } from "@/data/data";
import TempButton from "@/components/TempButton";
import MapGridLoader from "@/components/Loaders/MapGridLoader";
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters";
import MapGrid from "@/components/MapGrid/MapGrid";
import { Suspense } from "react";
import MapPagination from "@/components/MapGrid/MapPagination/MapPagination";

interface HomePageProps {
  searchParams: { 
    [key: string]: string | string[] | undefined 
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page } = searchParams
  const gameCategories = await getGameCategories()
  const { skip, currentPage, totalPages } = await getSkipAndPage(page)

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h1 className="flex flex-col font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
            Unlock the Secrets of
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2">
            Call of Duty: 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-primary"> Zombies</span>
          </span>
        </h1>
        <p className="text-sm md:text-base lg:text-lg">
          Explore our comprehensive guides to the most challenging and rewarding main quests in Call of Duty: Zombies
        </p>
        { process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && <TempButton /> }
      </section>
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
            Featured Maps
        </h2>
        <MapFilters gameCategories={ gameCategories } />
        <Suspense fallback={<MapGridLoader />}>
          <MapGrid skip={ skip } />
        </Suspense>
        <MapPagination currentPage={ currentPage } totalPages={ totalPages } />
      </section>
    </div>
  );
}
