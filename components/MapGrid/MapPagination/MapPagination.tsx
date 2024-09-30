import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { getFeaturedMaps } from "@/data/featuredMaps"
import { draftMode } from "next/headers"

interface MapPaginationProps {
  searchParams?: Promise<SearchParams>
}

export default async function MapPagination({ searchParams }: MapPaginationProps) {
  const [{ isEnabled }, { page }] = await Promise.all([draftMode(), validateSearchParams(searchParams)])
  const { currentPage, totalPages, prevPage, nextPage } = await getFeaturedMaps(isEnabled, page)
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={`/?page=${prevPage}`} 
            aria-disabled={ previousDisabled }
            className={ previousDisabled ? 'opacity-25 pointer-events-none' : '' }
          />
        </PaginationItem>
        { [...Array(totalPages).keys()].map(page => (
          <PaginationItem key={ `pagination-item-${page}` }>
            <PaginationLink href={`/?page=${page + 1}`} isActive={ currentPage === page + 1 }>{ page + 1 }</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
            href={`/?page=${nextPage}`} 
            aria-disabled={ nextDisabled }
            className={ nextDisabled ? 'opacity-25 pointer-events-none' : '' }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}