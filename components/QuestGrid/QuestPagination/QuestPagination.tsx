import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
import { draftMode } from "next/headers"
import { getPaginatedSideQuests } from "@/data/sideQuests"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface IQuestPagination {
  searchParams: Promise<SearchParams>
  params?: Promise<{
    game?: string
    map?: string
  }>
}

export default async function QuestPagination({ searchParams, params }: IQuestPagination) {
  const [{ isEnabled }, { page }, questParams] = await Promise.all([draftMode(), validateSearchParams(searchParams), params])
  const category = questParams?.map ? questParams.map : questParams?.game ? questParams.game : undefined
  const { currentPage, totalPages, prevPage, nextPage } = await getPaginatedSideQuests(isEnabled, page, category)
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false
  let href = '/side-quests'

  if (questParams) {
    const { game, map } = questParams
    if (map && game) href = `/side-quests/${game}/${map}`
    else if (game) href = `/side-quests/${game}`
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={`${href}?page=${prevPage}`} 
            aria-disabled={ previousDisabled }
            className={ previousDisabled ? 'opacity-25 pointer-events-none' : '' }
          />
        </PaginationItem>
        { [...Array(totalPages).keys()].map(page => (
          <PaginationItem key={ `pagination-item-${page}` }>
            <PaginationLink prefetch={ false } href={`${href}?page=${page + 1}`} isActive={ currentPage === page + 1 }>{ page + 1 }</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
            href={`${href}?page=${nextPage}`} 
            aria-disabled={ nextDisabled }
            className={ nextDisabled ? 'opacity-25 pointer-events-none' : '' }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}