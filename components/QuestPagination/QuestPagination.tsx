"use client"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { MAP_LIMIT } from "@/utils/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { FilteredQuests } from "@/types/FilteredQuests"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"

interface IQuestPagination {
  quests: FilteredQuests
}

export default function QuestPagination({ quests }: IQuestPagination) {
  const { page, updatePage } = useSiteSearchParams()
  const totalPages = Math.ceil(quests.length / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false

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
            <span>Previous</span>
          </Button>
        </PaginationItem>
        { Array.from({ length: totalPages }, (_, page) => (
          <PaginationItem key={ `quest-pagination-item-${page}` }>
            <Button
              size={"icon"}
              variant={ currentPage === page + 1 ? "outline" : "ghost" }
              aria-current={ currentPage === page + 1 ? "page" : undefined }
              onClick={ () => updatePage(page + 1) }
            >
              { page + 1 }
            </Button>
          </PaginationItem>
        ))}
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