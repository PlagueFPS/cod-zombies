import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
import { draftMode } from "next/headers"
import { getPaginatedMaps } from "@/data/maps"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CustomLink } from "@/components/CustomLink/CustomLink"

interface MapPaginationProps {
  searchParams?: Promise<SearchParams>
}

export default async function MapPagination({ searchParams }: MapPaginationProps) {
  const [{ isEnabled }, { page, game, difficulty }] = await Promise.all([draftMode(), validateSearchParams(searchParams)])
  const { currentPage, totalPages, prevPage, nextPage } = await getPaginatedMaps(isEnabled, page, game, difficulty)
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
        { Array.from({ length: totalPages }, (_, page) => (
          <PaginationItem key={ `pagination-item-${page}` }>
            {/* <PaginationLink href={`/?page=${page + 1}`} isActive={ currentPage === page + 1 }>{ page + 1 }</PaginationLink> */}
            <Button asChild size={"icon"} variant={ currentPage === page + 1 ? "outline" : "ghost" }>
              <CustomLink aria-current={ currentPage === page + 1 ? "page" : undefined } href={`/?page=${page + 1}`}>{ page + 1 }</CustomLink>
            </Button>
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