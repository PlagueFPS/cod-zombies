import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'

interface IQuestPaginationLoader {
  map?: string
  game?: string
}

export default function QuestPaginationLoader({ map, game }: IQuestPaginationLoader) {
  let href = `/side-quests`

  if (map && game) href = `/side-quests/${game}/${map}`
  else if (game) href = `/side-quests/${game}`

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={`#`} 
            aria-disabled
            className={ 'opacity-25 pointer-events-none' }
          />
        </PaginationItem>
        { Array.from({ length: 3 }, (_, page) => (
          <PaginationItem key={ `quest-pagination-loader-item-${page + 1}` }>
            <PaginationLink href={`${href}?page=${page + 1}`}>{ page + 1 }</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
            href={`#`} 
            aria-disabled
            className={ 'opacity-25 pointer-events-none' }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}