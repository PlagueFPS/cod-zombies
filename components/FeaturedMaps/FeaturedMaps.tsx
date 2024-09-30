import type { SearchParams } from "@/utils/validationSchemas"
import { Suspense } from "react"
import MapFilters from "../MapGrid/MapFilters/MapFilters"
import MapGrid from "../MapGrid/MapGrid"
import MapPagination from "../MapGrid/MapPagination/MapPagination"
import MapFiltersLoader from "../Loaders/MapFiltersLoader"
import MapPaginationLoader from "../Loaders/MapPaginationLoader"
import MapGridLoader from "../Loaders/MapGridLoader"

interface FeaturedMapsProps {
  searchParams?: Promise<SearchParams>
  currentCategory?: string
}

export default function FeaturedMaps({ searchParams, currentCategory }: FeaturedMapsProps) {
  return (
    <section className="flex flex-col gap-8 justify-center w-full">
      <h2 className="font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gradient">
          Featured Maps
      </h2>
      <Suspense fallback={<MapFiltersLoader />}>
        <MapFilters currentCategory={ currentCategory }  />
      </Suspense>
      <Suspense fallback={<MapGridLoader />}>
        <MapGrid searchParams={ searchParams } category={ currentCategory } />
      </Suspense>
      { !currentCategory ? (
        <Suspense fallback={<MapPaginationLoader />}>
          <MapPagination searchParams={ searchParams } />
        </Suspense>
      ) : null}
    </section>
  )
}