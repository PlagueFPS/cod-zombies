import type { Map } from '@/types/Map'
import type { EntryProps, KeyValueMap } from 'contentful-management'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isPriority } from '@/utils/functions'
import { DATE_OPTIONS, IN_DEVELOPMENT } from '@/utils/constants'
import { resolveAsset, resolveEntry, resolveMap } from '@/utils/contentful-utils'
import Link from 'next/link'
import { draftMode } from 'next/headers'

interface MapCardProps {
  map: Map | EntryProps<KeyValueMap>
  mapIndex: number
  totalMaps: number
}

export default function MapCard({ map: mapEntry, mapIndex, totalMaps }: MapCardProps) {
  const { isEnabled } = draftMode()
  const map = resolveMap(mapEntry)
  const { title, description, image, gameCategory, slug } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  const priority = isPriority(mapIndex, totalMaps)

  return (
    <Link key={ map.sys.id } href={ `/${category?.fields.slug}/${slug}` } className="max-h-[450px] h-full">
      <Card className="relative h-full group hover:border-primary cursor-pointer transition-all overflow-hidden">
        <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
          { (isEnabled || IN_DEVELOPMENT) && map.isUnpublished ? <Badge className='bg-purple-600 border-purple-800 hover:bg-purple-600'>Draft</Badge> : null }
          { (isEnabled || IN_DEVELOPMENT) && map.hasChanged ? <Badge className='bg-blue-600 border-blue-800 hover:bg-blue-600'>Changed</Badge> : null }
          <Badge className="bg-orange-700 border-primary hover:bg-orange-700">
            { category?.fields.title }
          </Badge>
        </div>
        <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full scale-[2.5] opacity-25 blur-2xl">
          <FeaturedImage featuredImage={ mapImage } priority={ priority } sizes='322px' quality={ 1 } />
        </div>
        <CardHeader className="flex flex-grow">
          <div className='relative overflow-hidden h-full w-full rounded-md'>
            <FeaturedImage 
              featuredImage={ mapImage }
              sizes='600px'
              className='h-44 object-cover' 
              priority={ priority } 
              quality={ 50 } 
            />
          </div>
          <CardTitle className="group-hover:text-primary transition-all">{ title }</CardTitle>
          <CardDescription>{ new Date(map.sys.createdAt).toLocaleDateString(undefined, DATE_OPTIONS) }</CardDescription>
        </CardHeader>
        <CardContent className="-mt-4">
          <p className='text-sm'>{ description }</p>
        </CardContent>
      </Card>
    </Link>
  )
}
