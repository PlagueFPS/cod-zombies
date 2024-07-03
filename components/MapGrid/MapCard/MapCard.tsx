import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { DATE_OPTIONS } from '@/utils/constants'
import { resolveAsset, resolveEntry } from '@/utils/contentful-utils'
import type { Entry } from 'contentful'
import Image from 'next/image'
import Link from 'next/link'

interface MapCardProps {
  map: Entry<TypeFeaturedMapsSkeleton, undefined, string>
}

export default function MapCard({ map }: MapCardProps) {
  const { title, description, date, image, gameCategory, slug } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)

  return (
    <Link key={ map.sys.id } href={ `/maps/${slug}` } className="max-h-[450px] h-full">
      <Card className="relative h-full group hover:border-primary cursor-pointer transition-all overflow-hidden">
        <Badge className="absolute top-2 right-2 z-20">{ category?.fields.title }</Badge>
        <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full rotate-[55deg] scale-150 opacity-25 blur-2xl">
          <picture className="w-full h-full">
            <Image 
              src={ `https:${mapImage?.fields?.file?.url}` }
              alt=""
              fill
              className="object-cover"
              />
          </picture>
        </div>
        <CardHeader className="flex flex-grow">
          <picture className="relative overflow-hidden h-44 w-full rounded-md">
            <Image 
              src={ `https:${mapImage?.fields?.file?.url}` }
              alt=""
              fill
              sizes="384px"
              className="object-cover"
            />
          </picture>
          <CardTitle className="group-hover:text-primary transition-all">{ title }</CardTitle>
          <CardDescription>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</CardDescription>
        </CardHeader>
        <CardContent className="-mt-4">
          <p>{ description }</p>
        </CardContent>
      </Card>
    </Link>
  )
}
