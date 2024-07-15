import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface MapPaginationProps {
  currentPage: number
  totalPages: number
}

export default function MapPagination({ currentPage, totalPages }: MapPaginationProps) {
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
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
          <PaginationItem key={ page }>
            <PaginationLink href={`/?page=${page + 1}`}>{ page + 1 }</PaginationLink>
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
