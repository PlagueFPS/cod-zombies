import type { FeaturedMapWithoutBody } from '@/types/FeaturedMap'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IN_DEVELOPMENT } from '@/utils/constants'
// import Link from 'next/link'
import { draftMode } from 'next/headers'
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge } from '@/components/CustomBadges/CustomBadges'
import { cn } from '@/lib/utils'
import { CustomLink } from '@/components/CustomLink/CustomLink'

interface MapCardProps {
  map: Omit<FeaturedMapWithoutBody, "updatedAt">
  mapIndex: number
}

export default async function MapCard({ map, mapIndex }: MapCardProps) {
  const { isEnabled } = await draftMode()
  const { title, description, image, category, slug, isDraft, isChanged, isNew, isComingSoon } = map
  const priority = mapIndex === 0
  const alt = `${title} map image`
  const href =  isComingSoon ? '#' : `/${category.slug}/${slug}`
  
  return (
    <CustomLink 
      href={ href } 
      className={cn("max-h-[450px] h-full group outline-none", { 'pointer-events-none opacity-50': isComingSoon })}
      aria-label={ `View Guide for ${title}` } 
      aria-disabled={ isComingSoon }
    >
      <div className='sr-only'>View Guide for { title }</div>
      <Card className="relative h-full group-hover:border-primary group-hover:scale-105 group-focus-visible:scale-105 group-focus-visible:border-primary cursor-pointer transition-transform overflow-hidden animate-fade-in">
        <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
          {/* This technically can be true at the same time so we check for coming soon first */}
          { isComingSoon ? <ComingSoonBadge /> : isNew ? <NewBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && isChanged ? <ChangedBadge /> : null }
          <Badge className='badge-primary-gradient'>
            { category.title }
          </Badge>
        </div>
        <div className="absolute inset-0 z-10 flex items-center w-full h-full opacity-25 blur-2xl">
            <FeaturedImage 
              featuredImage={ image } 
              priority={ priority } 
              quality={ 1 }
              sizes='32px'
              className='aspect-square scale-150'
            />
        </div>
        <CardHeader className="flex gap-2 flex-grow">
          <div className='relative overflow-hidden h-full w-full rounded-md'>
              <FeaturedImage 
                featuredImage={ image }
                alt={ alt }
                sizes='272px'
                className='h-44 object-cover' 
              />
          </div>
          <div className='space-y-2'>
            <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ title }</CardTitle>
            <CardDescription className='text-foreground/85'>{ description }</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </CustomLink>
  )
}
