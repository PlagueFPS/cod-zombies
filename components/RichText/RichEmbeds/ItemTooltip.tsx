"use client"
import { createItemTooltipDTO } from '@/utils/contentful-utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import IconImage from '@/components/IconImage/IconImage'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface ItemTooltipProps {
  item: ReturnType<typeof createItemTooltipDTO>
  className?: string
}

export default function ItemTooltip({ item, className }: ItemTooltipProps) {
  const isDesktop = useMediaQuery(640)
  const { title, image, rarity, type } = item

  return (
    <>
      { isDesktop ? (
          <div className='hidden sm:inline-block'>
            <TooltipProvider delayDuration={ 200 }>
              <Tooltip>
                <TooltipTrigger className={cn('relative inline-flex justify-center items-center gap-2 underline decoration-dotted underline-offset-4 hover:no-underline', className)}>
                  <IconImage 
                    featuredImage={ image }
                    alt={ title }
                    sizes='24px'
                    className='my-auto h-6 w-6'
                  />
                  <span className='text-center mr-1.5'>
                    { title }
                  </span>
                </TooltipTrigger>
                <TooltipContent className={cn('max-w-sm w-[384px] bg-[hsl(240,10%,6%)] border-orange-200/30 text-orange-200 p-0', {
                  'border-red-300': rarity === 'Ultra',
                  'border-orange-300': rarity === 'Legendary',
                  'border-purple-300': rarity === 'Epic',
                  'border-blue-300': rarity === 'Rare'
                }, {
                  'border-green-300': type === 'Time-Based',
                  'border-blue-300': type === 'Round-Based',
                  'border-yellow-300': type === 'Immediate',
                  'border-purple-300': type === 'Player-Activated'
                })}>
                  { <ItemTooltipContent item={ item } /> }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
      ) : (
        <div className='inline-block sm:hidden'>
          <ItemPopover item={ item } className={ className } />
        </div>
      )}
    </>
  )
}

const ItemPopover = ({ item, className }: ItemTooltipProps) => {
  const { title, image, rarity, type } = item

  return (
    <Popover>
      <PopoverTrigger className={cn('inline-flex justify-center items-center gap-2 group', className)}>
        <IconImage 
          featuredImage={ image }
          alt={ title }
          sizes='24px'
          className='my-auto h-6 w-6'
        />
          <span className={cn('text-center mr-1.5 underline decoration-dotted underline-offset-4 group-hover:no-underline', {
            'truncate': title.length > 18
          })}>
            { title }
          </span>
      </PopoverTrigger>
      <PopoverContent side='top' className={cn('max-w-sm w-[360px] bg-[hsl(240,10%,6%)] border-orange-200/30 text-orange-200 p-0', {
          'border-red-300': rarity === 'Ultra',
          'border-orange-300': rarity === 'Legendary',
          'border-purple-300': rarity === 'Epic',
          'border-blue-300': rarity === 'Rare'
        }, {
          'border-green-300': type === 'Time-Based',
          'border-blue-300': type === 'Round-Based',
          'border-yellow-300': type === 'Immediate',
          'border-purple-300': type === 'Player-Activated'
        })}>
        <ItemTooltipContent item={ item } />
      </PopoverContent>
    </Popover>
  )
}

const ItemTooltipContent = ({ item }: ItemTooltipProps) => {
  const { title, image, description, rarity, type } = item

  return (
    <div className={cn('relative flex flex-col w-full py-2 px-4 rounded-md', {
      'bg-gobblegum-ultra': rarity === 'Ultra',
      'bg-gobblegum-legendary': rarity === 'Legendary',
      'bg-gobblegum-epic': rarity === 'Epic',
      'bg-gobblegum-rare': rarity === 'Rare'
    }, {
      'bg-gobblegum-time-based': type === 'Time-Based',
      'bg-gobblegum-round-based': type === 'Round-Based',
      'bg-gobblegum-immediate': type === 'Immediate',
      'bg-gobblegum-player-activated': type === 'Player-Activated'
    })}>
      <div className='absolute top-4 left-4'>
        <div className={cn('text-sm', {
          'text-red-300': rarity === 'Ultra',
          'text-orange-300': rarity === 'Legendary',
          'text-purple-300': rarity === 'Epic',
          'text-blue-300': rarity === 'Rare'
        }, {
          'text-green-300': type === 'Time-Based',
          'text-blue-300': type === 'Round-Based',
          'text-yellow-300': type === 'Immediate',
          'text-purple-300': type === 'Player-Activated'
        })}>
          { rarity }
        </div>
      </div>
      <div className="relative flex justify-center items-center">
        <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto bg-black bg-opacity-25 w-20 rounded-full z-[9]" />
          <IconImage 
            featuredImage={ image }
            alt={ title }
            sizes='80px'
            className='relative z-10 size-20 p-2'
          />
      </div>
      <div className="relative -mt-5 z-10">
        <div className={cn('text-center text-lg font-semibold px-4', {
          'text-red-300': rarity === 'Ultra',
          'text-orange-300': rarity === 'Legendary', 
          'text-purple-300': rarity === 'Epic',
          'text-blue-300': rarity === 'Rare'
        }, {
          'text-green-300': type === 'Time-Based',
          'text-blue-300': type === 'Round-Based',
          'text-yellow-300': type === 'Immediate',
          'text-purple-300': type === 'Player-Activated'
        })}>
          { title }
        </div>
      </div>
      <div className="pb-8 mt-6">
        <div className={cn('text-sm text-orange-200/90 text-center', {
          'text-red-200': rarity === 'Ultra',
          'text-orange-200': rarity === 'Legendary', 
          'text-purple-200': rarity === 'Epic',
          'text-blue-200': rarity === 'Rare',
        }, {
          'text-green-200': type === 'Time-Based',
          'text-blue-200': type === 'Round-Based',
          'text-yellow-200': type === 'Immediate',
          'text-purple-200': type === 'Player-Activated'
        })}>
          { description }
        </div>
      </div>
    </div>
  )
}
