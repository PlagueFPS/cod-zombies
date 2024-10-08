import HeroSection from '@/components/HeroSection/HeroSection'
import MapCardLoader from '@/components/Loaders/MapCardLoader'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MAP_LIMIT } from '@/utils/constants'

export default function HomeLoading() {
  return (
    <div className='container flex flex-col gap-16 justify-center items-center'>
      <HeroSection text='Call of Duty: Zombies' />
      <section className='flex flex-col gap-8 justify-center w-full'>
        <h2 className='font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gradient'>Featured Maps</h2>
        <ScrollArea className="-mt-4 relative overflow-hidden">
          <div className="flex w-max gap-3 text-foreground/80">
            { [...Array(6).keys()].map(i => (
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
          {[...Array(MAP_LIMIT).keys()].map(i => (
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
            { [...Array(3).keys()].map(page => (
              <PaginationItem key={ `pagination-home-loader-item-${page}` }>
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
      </section>
    </div>
  )
}
