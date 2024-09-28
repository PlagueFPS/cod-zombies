import type { FeaturedMap } from '@/types/FeaturedMap'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isPriority } from '@/utils/functions'
import { IN_DEVELOPMENT } from '@/utils/constants'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { ChangedBadge, DraftBadge, NewBadge } from '@/components/CustomBadges/CustomBadges'

interface MapCardProps {
  map: FeaturedMap
  mapIndex: number
  totalMaps: number
}

export default async function MapCard({ map, mapIndex, totalMaps }: MapCardProps) {
  const { isEnabled } = await draftMode()
  const { title, description, image, gameCategory: category, slug, isDraft, isChanged, isNew } = map
  const priority = isPriority(mapIndex, totalMaps)
  
  return (
    <Link href={ `/${category?.fields.slug}/${slug}` } className="max-h-[450px] h-full group outline-none" aria-label={ `View Guide for ${title}` }>
      <div className='sr-only'>View Guide for { title }</div>
      <Card className="relative h-full group-hover:border-primary group-hover:scale-105 group-focus-visible:scale-105 group-focus-visible:border-primary cursor-pointer transition-transform overflow-hidden">
        <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
          { (isEnabled || IN_DEVELOPMENT) && isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && isChanged ? <ChangedBadge /> : null }
          { isNew ? <NewBadge /> : null }
          <Badge className='badge-primary-gradient'>
            { category?.fields.title }
          </Badge>
        </div>
        <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full scale-[2.5] opacity-25 blur-2xl">
          <FeaturedImage featuredImage={ image } priority={ priority } sizes='322px' quality={ 1 } />
        </div>
        <CardHeader className="flex gap-2 flex-grow">
          <div className='relative overflow-hidden h-full w-full rounded-md'>
            <FeaturedImage 
              featuredImage={ image }
              alt={ `${title} map image` }
              sizes='272px'
              className='h-44 object-cover' 
              priority={ priority }
            />
          </div>
          <div className='space-y-2'>
            <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ title }</CardTitle>
            <CardDescription className='text-foreground/85'>{ description }</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
