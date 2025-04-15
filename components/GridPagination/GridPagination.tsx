"use client"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { MAP_LIMIT } from "@/utils/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface IGridPagination {
  data: unknown[]
}

export default function GridPagination({ data }: IGridPagination) {
  const { page, updatePage } = useSiteSearchParams()
  const isDesktop = useMediaQuery(640)
  const totalPages = Math.ceil(data.length / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false

  const renderPaginationItems = () => {
    const items = []
    const THRESHOLD = isDesktop ? 7 : 5
    const SIBLINGS = isDesktop ? 2 : 1

    // Helper function to add page button
    const addPageButton = (pageNum: number) => (
      <PaginationItem key={`quest-pagination-item-${pageNum}`}>
        <Button
          size={"icon"}
          variant={currentPage === pageNum ? "outline" : "ghost"}
          aria-current={currentPage === pageNum ? "page" : undefined}
          onClick={() => updatePage(pageNum)}
        >
          {pageNum}
        </Button>
      </PaginationItem>
    )

    // Always add first 5 pages
    items.push(addPageButton(1))

    // If total pages is less than or equal to threshold, show all pages
    if (totalPages <= THRESHOLD) {
      for (let i = 2; i < totalPages; i++) {
        items.push(addPageButton(i))
      }
    } else {
      // Show pages with ellipsis
      const leftSibling = Math.max(currentPage - SIBLINGS, 2)
      const rightSibling = Math.min(currentPage + SIBLINGS, totalPages - 1)

      // Add pages between left and right siblings
      for (let i = leftSibling; i <= rightSibling; i++) {
        items.push(addPageButton(i))
      }
    }

    // Always add last page if it's not the first page
    if (totalPages > 1) {
      items.push(addPageButton(totalPages))
    }

    return items
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            aria-label="Go to previous page"
            variant={"ghost"}
            aria-current={ currentPage === 1 ? "page" : undefined }
            onClick={ () => updatePage(prevPage) }
            aria-disabled={ previousDisabled }
            className={ previousDisabled ? 'opacity-25 pointer-events-none' : 'gap-1 pl-2.5' }
          >
            <ChevronLeft className="size-4" />
            <span>Prev</span>
          </Button>
        </PaginationItem>
        { renderPaginationItems() }
        <PaginationItem>
          <Button
            aria-label="Go to next page"
            variant={"ghost"}
            aria-current={ currentPage === totalPages ? "page" : undefined }
            onClick={ () => updatePage(nextPage) }
            aria-disabled={ nextDisabled }
            className={ nextDisabled ? 'opacity-25 pointer-events-none' : 'gap-1 pr-2.5' }
          >
            <span>Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}