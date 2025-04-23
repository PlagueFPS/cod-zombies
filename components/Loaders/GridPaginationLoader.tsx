"use client"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'

interface IGridPaginationLoader {
  pages?: number
}

export default function GridPaginationLoader({ pages = 3 }: IGridPaginationLoader) {
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
        { Array.from({ length: pages }, (_, page) => (
          <PaginationItem key={ `pagination-loader-item-${page + 1}` }>
            <PaginationLink href={`?page=${page + 1}`}>{ page + 1 }</PaginationLink>
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