import type { GameCategory } from "@/types/GameCategory"
import { Suspense } from "react"
import MapFilters from "../MapGrid/MapFilters/MapFilters"
import MapGridLoader from "../Loaders/MapGridLoader"
import MapGrid from "../MapGrid/MapGrid"
import MapPagination from "../MapGrid/MapPagination/MapPagination"
import MapFiltersLoader from "../Loaders/MapFiltersLoader"

interface ComponentProps {
  currentCategory?: GameCategory
}

interface PaginationRequiredProps {
  skip: number
  currentPage: number
  totalPages: number
}

interface PaginationOptionalProps {
  currentPage?: never
  totalPages?: never
  skip?: never
}

type FeaturedMapsProps = (PaginationRequiredProps | PaginationOptionalProps) & ComponentProps

export default function FeaturedMaps({ currentCategory, skip, currentPage, totalPages }: FeaturedMapsProps) {
  return (
    <section className="flex flex-col gap-8 justify-center w-full">
      <h2 className="font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
          Featured Maps
      </h2>
      <Suspense fallback={<MapFiltersLoader />}>
        <MapFilters currentCategory={ currentCategory }  />
      </Suspense>
      <Suspense fallback={<MapGridLoader />}>
        <MapGrid category={ currentCategory } skip={ skip } />
      </Suspense>
      { (currentPage && totalPages) ? <MapPagination currentPage={ currentPage } totalPages={ totalPages } /> : null }
    </section>
  )
}
