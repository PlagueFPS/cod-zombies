import type { FeaturedMapWithoutBody } from '@/types/FeaturedMap'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IN_DEVELOPMENT } from '@/utils/constants'
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge, DifficultyBadge } from '@/components/CustomBadges/CustomBadges'
import { cn } from '@/lib/utils'
import { CustomLink } from '@/components/CustomLink/CustomLink'

interface MapCardProps {
  map: Omit<FeaturedMapWithoutBody, "updatedAt">
  mapIndex: number
  draftMode: boolean
}

export default function MapCard({ map, mapIndex, draftMode }: MapCardProps) {
  const priority = mapIndex === 0
  const alt = `${map.title} map image`
  const href =  map.isComingSoon ? '#' : `/${map.game.slug}/${map.slug}`

  return (
    <CustomLink 
      href={ href } 
      className={cn("max-h-[450px] h-full group outline-none", { 'pointer-events-none opacity-50': map.isComingSoon })}
      aria-label={ `View Guide for ${map.title}` } 
      aria-disabled={ map.isComingSoon }
    >
      <div className='sr-only'>View Guide for { map.title }</div>
      <Card className="relative h-full group-hover:border-primary group-hover:scale-105 group-focus-visible:scale-105 group-focus-visible:border-primary cursor-pointer transition-transform overflow-hidden animate-fade-in">
        <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
          {/* This technically can be true at the same time so we check for coming soon first */}
          { map.isComingSoon ? <ComingSoonBadge /> : map.isNew ? <NewBadge /> : null }
          { (draftMode || IN_DEVELOPMENT) && map.isDraft ? <DraftBadge /> : null }
          { (draftMode || IN_DEVELOPMENT) && map.isChanged ? <ChangedBadge /> : null }
          <DifficultyBadge difficulty={ map.difficulty } />
          <Badge className='badge-primary-gradient'>
            { map.game.title }
          </Badge>
        </div>
        <div className="absolute inset-0 z-10 flex items-center w-full h-full opacity-25 blur-2xl">
            <FeaturedImage 
              featuredImage={ map.image } 
              priority={ priority } 
              quality={ 1 }
              sizes='32px'
              className='aspect-square scale-150'
            />
        </div>
        <CardHeader className="flex gap-2 flex-grow">
          <div className='relative overflow-hidden h-full w-full rounded-md'>
              <FeaturedImage 
                featuredImage={ map.image }
                alt={ alt }
                sizes='272px'
                className='h-44 object-cover' 
              />
          </div>
          <div className='space-y-2'>
            <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ map.title }</CardTitle>
            <CardDescription className='text-foreground/85'>{ map.description }</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </CustomLink>
  )
}
