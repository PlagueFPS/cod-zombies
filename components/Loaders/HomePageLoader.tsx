import HeroSection from '@/components/HeroSection/HeroSection'
import MapCardLoader from '@/components/Loaders/MapCardLoader'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MAP_LIMIT } from '@/utils/constants'
import GridSection from '@/components/GridSection/GridSection'

export default function HomeLoader() {
  return (
    <div className='container flex flex-col gap-16 justify-center items-center'>
      <HeroSection text='Call of Duty: Zombies' />
      <GridSection title='Main Quests'>
        <ScrollArea className="-mt-4 relative overflow-hidden">
          <div className="flex w-max gap-3 text-foreground/80">
            { Array.from({ length: 6 }, (_, i) => (
              <Button 
                key={ `map-home-filter-${i}` } 
                size="sm" 
                variant={ "outline" }
                disabled
                aria-disabled
                className={cn('animate-pulse bg-muted h-9 w-[105px]', {
                  'w-[157px]': i === 4
                })}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          { Array.from({ length: MAP_LIMIT }, (_, i) => (
            <MapCardLoader key={ `map-card-home-loader-${i}` } />
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
              <PaginationItem key={ `pagination-home-loader-item-${page + 1}` }>
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
      </GridSection>
    </div>
  )
}
