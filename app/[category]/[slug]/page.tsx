import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS, SITE_TITLE } from "@/utils/constants"
import { extractHeadings, resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import { getMaps } from '@/data/data'
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { renderOptions } from '@/contentful/renderOptions'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import NavLink from '@/components/Navbar/NavLink/NavLink'
import type { Entry } from 'contentful'
import { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BackToTopButton from '@/components/BackToTopButton/BackToTopButton'
import { Badge } from '@/components/ui/badge'

interface MapPageProps {
  params: { 
    category: string | undefined
    slug: string
  }
}

export const generateStaticParams = async () => {
  const { maps } = await getMaps()

  return maps.map(map => ({
    category: resolveEntry(map.fields.gameCategory)?.fields.slug,
    slug: map.fields.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const { maps } = await getMaps()
  const map = maps.find(map => map.fields.slug === params.slug)
  if (!map) notFound()
  const { title, description, image } = map.fields
  const mapImage = resolveAsset(image)
  const pageTitle = `${title} - ${SITE_TITLE}`
  const metadata: Metadata = {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${params.category}/${params.slug}`,
      images: {
        url: `https:${mapImage?.fields?.file?.url}?q=75`,
        width: mapImage?.fields?.file?.details.image?.width,
        height: mapImage?.fields?.file?.details.image?.height
      }
    },
    twitter: {
      title: pageTitle,
      description,
      card: 'summary_large_image'
    }
  }

  return metadata
}

export default async function MapPage({ params }: MapPageProps) {
  const { maps } = await getMaps()
  const map = maps.find(map => map.fields.slug === params.slug)
  if (!map) notFound()
  const { title, image, gameCategory, date, body } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  const headings = extractHeadings(map)
  const mapIndex = maps.indexOf(map)
  const prevMap = maps[mapIndex + 1]
  const nextMap = maps[mapIndex - 1]

  return (
    <div className='container px-0 flex justify-center mx-auto'>
      <article className='flex flex-col flex-grow justify-center items-center'>
        <Breadcrumb className='mr-auto ml-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink exact href='/'>Home</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink exact href={ `/${params.category}` }>{ category?.fields.title }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink exact href={ `/${params.category}/${params.slug}` }>{ title }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='relative w-full'>
          <div className='absolute top-1/4 xl:top-16 right-0 left-0 z-10 mx-auto w-full max-w-screen-2xl opacity-35 blur-3xl overflow-hidden'>
            <FeaturedImage featuredImage={ mapImage } priority quality={ 1 } />
          </div>
          <div className='relative z-20 mt-8 mx-auto w-full max-w-screen-xl'>
            <FeaturedImage featuredImage={ mapImage } priority className='xl:rounded-lg overflow-hidden' />
          </div>
        </div>
        <div className='relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 pb-12 w-full max-w-screen-xl border-b-2'>
          <div className='flex w-full justify-between items-center'>
            <h2 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
              { title }
            </h2>
            <Badge className='bg-orange-700 border-primary hover:bg-orange-800'>{ category?.fields.title }</Badge>
          </div>
          <div className='flex items-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
            <div>Published: { new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
            <div>•</div>
            <div>Updated: { new Date(map.sys.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
          </div>
        </div>
        <div className={ richStyles.body }>
          { documentToReactComponents(body, renderOptions) }
        </div>
        <div className='flex justify-between items-center w-full px-8'>
          { prevMap && <PreviousOrNextMap map={ prevMap } prev /> }
          { nextMap && <PreviousOrNextMap map={ nextMap } /> }
        </div>
      </article>
      <aside className='hidden xl:block sticky top-4 pl-8 h-full'>
        <TableOfContents headings={ headings } />
      </aside>
      <BackToTopButton mobile />
    </div>
  )
}

 const PreviousOrNextMap = ({ map, prev }: { map: Entry<TypeFeaturedMapsSkeleton, undefined, string>, prev?: boolean }) => {
  const { title, gameCategory, slug } = map.fields
  const category = resolveEntry(gameCategory)

  return (
    <Button variant="outline" asChild className={ prev ? '' : 'ml-auto' }>
      <Link href={ `/${category?.fields.slug}/${slug}` } className='flex gap-2'>
        { prev ? (
          <>
            <ChevronLeft className='h-4 w-4' />
            <span>{ title }</span>
          </>
        ) : (
          <>
            <span>{ title }</span>
            <ChevronRight className='h-4 w-4' />
          </>
        )}
      </Link>
    </Button>
  )
 }
