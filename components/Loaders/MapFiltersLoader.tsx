import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ScrollBar } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export default function MapFiltersLoader() {
  return (
    <ScrollArea className="-mt-6 relative overflow-hidden">
      <div className='inline-block pt-3'>
        <div className="inline-flex w-max gap-2">
          { Array.from({ length: 6 }, (_, i) => (
            <Button 
              key={ `map-filter-${i}` } 
              size="sm" 
              variant={ "outline" }
              disabled
              aria-disabled
              className={cn('animate-pulse bg-muted h-9 w-[138px]')}
            />
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
