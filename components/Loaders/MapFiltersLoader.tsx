import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ScrollBar } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export default function MapFiltersLoader() {
  return (
    <ScrollArea className="-mt-4 relative overflow-hidden">
      <div className="flex w-max gap-3 text-foreground/80">
        { [...Array(6).keys()].map(i => (
          <Button 
            key={ `map-filter-${i}` } 
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
  )
}
