"use client"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { SideQuest } from "@/types/SideQuest"
import { useSearchParams } from "next/navigation"
import { MAP_LIMIT } from "@/utils/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface IQuestPagination {
  quests: Omit<SideQuest, "content" | "updatedAt">[]
}

export default function QuestPagination({ quests }: IQuestPagination) {
  const searchParams = useSearchParams()
  const game = searchParams.getAll("game")
  const map = searchParams.getAll("map")
  const page = parseInt(searchParams.get("page") || "1")
  const totalPages = Math.ceil(quests.length / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false
 
  const updateURL = (page: number) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (game.length > 0) {
      game.forEach(g => params.append('game', g));
    }
    if (map.length > 0) {
      map.forEach(m => params.append('map', m));
    }
  
    window.history.pushState(null, '', `?${params.toString()}`);
  }


  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            aria-label="Go to previous page"
            variant={"ghost"}
            aria-current={ currentPage === 1 ? "page" : undefined }
            onClick={ () => updateURL(prevPage) }
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
              onClick={ () => updateURL(page + 1) }
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
            onClick={ () => updateURL(nextPage) }
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