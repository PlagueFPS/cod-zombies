import React from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'

export default function MapPaginationLoader() {
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
          <PaginationItem key={ `pagination-loader-item-${page + 1}` }>
            <PaginationLink href={`/?page=${page + 1}`}>{ page + 1 }</PaginationLink>
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