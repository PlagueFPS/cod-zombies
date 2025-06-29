import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import ImageLoader from "./image-loader"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface IPrevOrNextCardLoader {
  prev?: boolean
  type: string
}

export default function PrevOrNextCardLoader({ prev, type }: IPrevOrNextCardLoader) {
  return (
    <div className='group hover:border-primary hover:-translate-y-2 border rounded-lg w-full max-w-sm xl:max-w-full overflow-hidden transition-all'>
      <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2 overflow-hidden dark:shadow-none', { 'xl:flex-row-reverse': prev })}>
        <div className={cn('absolute top-2 right-2 z-50 w-fit flex items-center justify-center gap-1')}>
          <Skeleton className="h-6 w-24 badge-medium-gradient dark:dark-badge-medium-gradient" />
          <Skeleton className="h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient" />
        </div>
        <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full rounded-lg overflow-hidden'>
          <ImageLoader className="h-full w-full border" />
        </div>
        <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4 xl:pt-6'>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className={cn('flex items-center pb-4 transition-all group-hover:text-primary mt-auto', { 'xl:-ml-2': prev, 'xl:-mr-2': !prev })}>
            { prev ? (
              <>
                <ChevronLeft />
                <span>Previous { type }</span>
              </>
            ) : (
              <>
                <span className='ml-auto'>Next { type }</span>
                <ChevronRight />
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
