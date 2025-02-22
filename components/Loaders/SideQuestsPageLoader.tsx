import { PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"
import { MAP_LIMIT } from "@/utils/constants"
import MapCardLoader from "./MapCardLoader"
import { Pagination } from "../ui/pagination"
import QuestFilterLoader from "./QuestFilterLoader";
import GridSection from "../GridSection/GridSection";

export default function SideQuestsPageLoader() {
  const links: { title: string, href: string }[] = [
    { title: 'Side Quests', href: `/side-quests` },
  ]

  return (
    <div className="flex flex-col gap-16 justify-center items-center w-full">
      <div className='container flex flex-col gap-16 justify-center items-center'>
        <Breadcrumbs links={ links } />
        <GridSection title="Side Quests">
          <QuestFilterLoader />  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
            { Array.from({ length: MAP_LIMIT }, (_, i) => (
              <MapCardLoader key={ `quest-card-loader-${i}` } />
            ))}
          </div>
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
                <PaginationItem key={ `pagination-quest-loader-item-${page + 1}` }>
                  <PaginationLink href={`${links.at(-1)?.href}?page=${page + 1}`}>{ page + 1 }</PaginationLink>
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
        </GridSection>
      </div>
    </div>
  )
}
