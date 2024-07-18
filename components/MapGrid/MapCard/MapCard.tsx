import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { isPriority } from '@/utils/functions'
import { DATE_OPTIONS } from '@/utils/constants'
import { resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import type { Entry } from 'contentful'
import Link from 'next/link'

interface MapCardProps {
  map: Entry<TypeFeaturedMapsSkeleton, undefined, string>
  mapIndex: number
  totalMaps: number
}

export default function MapCard({ map, mapIndex, totalMaps }: MapCardProps) {
  const { title, description, date, image, gameCategory, slug } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  const priority = isPriority(mapIndex, totalMaps)

  return (
    <Link key={ map.sys.id } href={ `/${category?.fields.slug}/${slug}` } className="max-h-[450px] h-full">
      <Card className="relative h-full group hover:border-primary cursor-pointer transition-all overflow-hidden">
        <Badge className="absolute top-2 right-2 z-20">{ category?.fields.title }</Badge>
        <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full scale-[2.5] opacity-25 blur-2xl">
          <FeaturedImage featuredImage={ mapImage } priority={ priority } quality={ 1 } />
        </div>
        <CardHeader className="flex flex-grow">
          <div className='relative overflow-hidden h-full w-full rounded-md'>
            <FeaturedImage featuredImage={ mapImage } className='h-44 object-cover' priority={ priority } />
          </div>
          <CardTitle className="group-hover:text-primary transition-all">{ title }</CardTitle>
          <CardDescription>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</CardDescription>
        </CardHeader>
        <CardContent className="-mt-4">
          <p className='text-sm'>{ description }</p>
        </CardContent>
      </Card>
    </Link>
  )
}
