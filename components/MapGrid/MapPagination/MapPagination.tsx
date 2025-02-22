"use client"
import { type SearchParams, validateSearchParams } from "@/utils/validationSchemas"
// import { draftMode } from "next/headers"
// import { getPaginatedMaps } from "@/data/maps"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { CustomLink } from "@/components/CustomLink/CustomLink"
import { useSearchParams } from "next/navigation"
import { use } from "react"
import type { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { MAP_LIMIT } from "@/utils/constants"

// interface MapPaginationProps {
//   searchParams?: Promise<SearchParams>
// }

interface IMapPagination {
  maps: Omit<FeaturedMapWithoutBody, "updatedAt">[]
}

export default function MapPagination({ maps }: IMapPagination) {
  const searchParams = useSearchParams()
  const { page, game, difficulty } = use(validateSearchParams(searchParams))
  const totalPages = Math.ceil(maps.length / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  const previousDisabled = prevPage === currentPage ? true : false
  const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false
  
  const updateURL = (page: number) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (game) {
      (Array.isArray(game) ? game : [game]).forEach(g => params.append('game', g));
    }
    if (difficulty) {
      (Array.isArray(difficulty) ? difficulty : [difficulty]).forEach(d => params.append('difficulty', d));
    }

    window.history.pushState(null, '', `?${params.toString()}`);
  }

  return (
    <>
      { totalPages > 0 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={ `#` } 
                onClick={ () => updateURL(prevPage) }
                aria-disabled={ previousDisabled }
                className={ previousDisabled ? 'opacity-25 pointer-events-none' : '' }
              />
            </PaginationItem>
            { Array.from({ length: totalPages }, (_, page) => (
              <PaginationItem key={ `pagination-item-${page}` }>
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
              <PaginationNext 
                href={ `#` } 
                onClick={ () => updateURL(nextPage) }
                aria-disabled={ nextDisabled }
                className={ nextDisabled ? 'opacity-25 pointer-events-none' : '' }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null }
    </>
  )
}

// export default async function MapPagination({ searchParams }: MapPaginationProps) {
//   const [{ isEnabled }, { page, game, difficulty }] = await Promise.all([draftMode(), validateSearchParams(searchParams)])
//   const { currentPage, totalPages, prevPage, nextPage } = await getPaginatedMaps(isEnabled, page, game, difficulty)
//   const previousDisabled = prevPage === currentPage ? true : false
//   const nextDisabled = nextPage === currentPage ? true : currentPage === totalPages ? true : false
  
//   const generateHref = (page: number) => {
//     const params = new URLSearchParams({ page: page.toString() });
//     if (game) {
//       (Array.isArray(game) ? game : [game]).forEach(g => params.append('game', g));
//     }
//     if (difficulty) {
//       (Array.isArray(difficulty) ? difficulty : [difficulty]).forEach(d => params.append('difficulty', d));
//     }

//     return `?${params.toString()}`;
//   }

//   return (
//     <>
//       { totalPages > 0 ? (
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious 
//                 href={ generateHref(prevPage) } 
//                 aria-disabled={ previousDisabled }
//                 className={ previousDisabled ? 'opacity-25 pointer-events-none' : '' }
//               />
//             </PaginationItem>
//             { Array.from({ length: totalPages }, (_, page) => (
//               <PaginationItem key={ `pagination-item-${page}` }>
//                 <Button asChild size={"icon"} variant={ currentPage === page + 1 ? "outline" : "ghost" }>
//                   <CustomLink aria-current={ currentPage === page + 1 ? "page" : undefined } href={ generateHref(page + 1) }>
//                     { page + 1 }
//                   </CustomLink>
//                 </Button>
//               </PaginationItem>
//             ))}
//             <PaginationItem>
//               <PaginationNext 
//                 href={ generateHref(nextPage) } 
//                 aria-disabled={ nextDisabled }
//                 className={ nextDisabled ? 'opacity-25 pointer-events-none' : '' }
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       ) : null }
//     </>
//   )
// }