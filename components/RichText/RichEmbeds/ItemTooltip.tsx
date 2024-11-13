import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import IconImage from '@/components/IconImage/IconImage'
import { Suspense } from 'react'
import ContentfulImage from '@/components/ContentfulImage/ContentfulImage'
import { cn } from '@/lib/utils'

interface ItemTooltipProps {
  item: {
    title: string;
    image: {
      url: string | undefined;
      width: number | undefined;
      height: number | undefined;
    }
    description: string
  }
  className?: string
}

export default function ItemTooltip({ item, className }: ItemTooltipProps) {
  const { title, image, description } = item

  return (
    <TooltipProvider delayDuration={ 200 }>
      <Tooltip>
        <TooltipTrigger className={cn('relative inline-flex items-center gap-2 underline decoration-dotted underline-offset-4 hover:no-underline', className)}>
          <IconImage featuredImage={ image } alt={ title } sizes='24px' className='absolute left-0 top-0 bottom-0 h-6 w-6'>
            <Suspense>
              <ContentfulImage featuredImage={ image } sizes='24px' className='h-5 w-5' />
            </Suspense>
          </IconImage>
          <span className='ml-7 mr-1'>
            { title }
          </span>
        </TooltipTrigger>
        <TooltipContent className='max-w-[80ch] bg-[hsl(240,10%,6%)] border-orange-200/30 text-orange-200'>
          { description }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
