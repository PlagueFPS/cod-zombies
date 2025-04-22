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
          <span className='hidden sm:inline-block'>
            <TooltipProvider delayDuration={ 200 }>
              <Tooltip>
                <TooltipTrigger className={cn('relative inline-flex justify-center items-center gap-2 group', className)}>
                  <IconImage 
                    featuredImage={ image }
                    alt={ `${title} Image` }
                    sizes='24px'
                    className='my-auto h-6 w-auto'
                  />
                  <span className={cn('text-center mr-1.5 underline text-orange-800 dark:text-orange-200 decoration-dotted underline-offset-4 group-hover:no-underline', {
                    'text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300': rarity === 'Ultra',
                    'text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300': rarity === 'Legendary',
                    'text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300': rarity === 'Epic',
                    'text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300': rarity === 'Rare'
                  }, {
                    'text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300': type === 'Time-Based',
                    'text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300': type === 'Round-Based',
                    'text-yellow-600 decoration-yellow-600 dark:text-yellow-300 dark:decoration-yellow-300': type === 'Immediate',
                    'text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300': type === 'Player-Activated'
                  })}>
                    { title }
                  </span>
                </TooltipTrigger>
                <TooltipContent className={cn('max-w-sm w-[384px] bg-background border border-orange-800/30 dark:border-orange-200/30 text-orange-800 dark:text-orange-200 p-0', {
                  'border-red-600 dark:border-red-300': rarity === 'Ultra',
                  'border-orange-600 dark:border-orange-300': rarity === 'Legendary',
                  'border-purple-600 dark:border-purple-300': rarity === 'Epic',
                  'border-blue-600 dark:border-blue-300': rarity === 'Rare'
                }, {
                  'border-green-600 dark:border-green-300': type === 'Time-Based',
                  'border-blue-600 dark:border-blue-300': type === 'Round-Based',
                  'border-yellow-600 dark:border-yellow-300': type === 'Immediate',
                  'border-purple-600 dark:border-purple-300': type === 'Player-Activated'
                })}>
                  { <ItemTooltipContent item={ item } /> }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
      ) : (
        <span className='inline-block sm:hidden'>
          <ItemPopover item={ item } className={ className } />
        </span>
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
          alt={ `${title} Image` }
          sizes='24px'
          className='my-auto h-6 w-auto'
        />
          <span className={cn('text-center mr-1.5 underline decoration-dotted underline-offset-4 group-hover:no-underline', {
            'truncate': title.length > 18
          })}>
            { title }
          </span>
      </PopoverTrigger>
      <PopoverContent side='top' className={cn('max-w-sm bg-background border border-orange-800/30 dark:border-orange-200/30 text-orange-800 dark:text-orange-200 p-0', {
        'border-red-600 dark:border-red-300': rarity === 'Ultra',
        'border-orange-600 dark:border-orange-300': rarity === 'Legendary',
        'border-purple-600 dark:border-purple-300': rarity === 'Epic',
        'border-blue-600 dark:border-blue-300': rarity === 'Rare'
      }, {
        'border-green-600 dark:border-green-300': type === 'Time-Based',
        'border-blue-600 dark:border-blue-300': type === 'Round-Based',
        'border-yellow-600 dark:border-yellow-300': type === 'Immediate',
        'border-purple-600 dark:border-purple-300': type === 'Player-Activated'
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
      'bg-gobblegum-light-ultra dark:bg-gobblegum-ultra': rarity === 'Ultra',
      'bg-gobblegum-light-legendary dark:bg-gobblegum-legendary': rarity === 'Legendary',
      'bg-gobblegum-light-epic dark:bg-gobblegum-epic': rarity === 'Epic',
      'bg-gobblegum-light-rare dark:bg-gobblegum-rare': rarity === 'Rare'
    }, {
      'bg-gobblegum-light-time-based dark:bg-gobblegum-time-based': type === 'Time-Based',
      'bg-gobblegum-light-round-based dark:bg-gobblegum-round-based': type === 'Round-Based',
      'bg-gobblegum-light-immediate dark:bg-gobblegum-immediate': type === 'Immediate',
      'bg-gobblegum-light-player-activated dark:bg-gobblegum-player-activated': type === 'Player-Activated'
    })}>
      <div className='absolute top-4 left-4'>
        <div className={cn('text-sm', {
          'text-red-600 dark:text-red-300': rarity === 'Ultra',
          'text-orange-600 dark:text-orange-300': rarity === 'Legendary',
          'text-purple-600 dark:text-purple-300': rarity === 'Epic',
          'text-blue-600 dark:text-blue-300': rarity === 'Rare'
        }, {
          'text-green-600 dark:text-green-300': type === 'Time-Based',
          'text-blue-600 dark:text-blue-300': type === 'Round-Based',
          'text-yellow-600 dark:text-yellow-300': type === 'Immediate',
          'text-purple-600 dark:text-purple-300': type === 'Player-Activated'
        })}>
          { rarity }
        </div>
      </div>
      <div className="relative flex justify-center items-center">
        <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto bg-opacity-25 w-20 rounded-full z-9" />
          <IconImage 
            featuredImage={ image }
            alt={ `${title} Image` }
            sizes='80px'
            className='relative z-10 h-20 w-auto p-2'
          />
      </div>
      <div className="relative -mt-3 z-10">
        <div className={cn('text-center text-lg text-orange-700 dark:text-orange-200 font-bold px-4', {
          'text-red-600 dark:text-red-300': rarity === 'Ultra',
          'text-orange-600 dark:text-orange-300': rarity === 'Legendary', 
          'text-purple-600 dark:text-purple-300': rarity === 'Epic',
          'text-blue-600 dark:text-blue-300': rarity === 'Rare'
        }, {
          'text-green-600 dark:text-green-300': type === 'Time-Based',
          'text-blue-600 dark:text-blue-300': type === 'Round-Based',
          'text-yellow-600 dark:text-yellow-300': type === 'Immediate',
          'text-purple-600 dark:text-purple-300': type === 'Player-Activated'
        })}>
          { title }
        </div>
      </div>
      <div className="pb-8 mt-6">
        <div className={cn('text-sm text-orange-800 dark:text-orange-200/90 text-center', {
          'text-red-600 dark:text-red-300': rarity === 'Ultra',
          'text-orange-600 dark:text-orange-300': rarity === 'Legendary', 
          'text-purple-600 dark:text-purple-300': rarity === 'Epic',
          'text-blue-600 dark:text-blue-300': rarity === 'Rare',
        }, {
          'text-green-600 dark:text-green-300': type === 'Time-Based',
          'text-blue-600 dark:text-blue-300': type === 'Round-Based',
          'text-yellow-600 dark:text-yellow-300': type === 'Immediate',
          'text-purple-600 dark:text-purple-300': type === 'Player-Activated'
        })}>
          { description }
        </div>
      </div>
    </div>
  )
}
