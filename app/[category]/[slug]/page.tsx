import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT, WEBSITE_URL } from "@/utils/constants"
import { extractHeadings, resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import { getMapBySlug, getMaps } from '@/data/data'
import { Metadata } from "next"
import { notFound } from "next/navigation"
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import MobileTableOfContents from '@/components/TableOfContents/MobileTableOfContents'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import NavLink from '@/components/NavLink/NavLink'
import type { Entry } from 'contentful'
import { TypeFeaturedMapsSkeleton } from '@/contentful/Types/contentful-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BackToTopButton from '@/components/BackToTopButton/BackToTopButton'
import { Badge } from '@/components/ui/badge'
import ShareButton from '@/components/ShareButton/ShareButton'
import { draftMode } from 'next/headers'
import RichTextRenderer from '@/components/RichText/RichTextRenderer/RichTextRenderer'
import { cn } from '@/lib/utils'

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
  const { isEnabled } = draftMode()
  const map = await getMapBySlug(params.slug, isEnabled)
  if (!map) notFound()
  const { title, description, image } = map.fields
  const mapImage = resolveAsset(image)
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${params.category}/${params.slug}`,
      images: {
        url: `https:${mapImage?.fields?.file?.url}?q=75`,
        width: mapImage?.fields?.file?.details.image?.width,
        height: mapImage?.fields?.file?.details.image?.height
      }
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }

  return metadata
}

export default async function MapPage({ params }: MapPageProps) {
  const { isEnabled } = draftMode()
  const { maps } = await getMaps(isEnabled)
  const map = maps.find(map => map.fields.slug === params.slug)
  if (!map) notFound()
  const { title, image, gameCategory, body } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  const headings = extractHeadings(map)
  const mapIndex = maps.indexOf(map)
  const prevMap = maps[mapIndex + 1]
  const nextMap = maps[mapIndex - 1]

  return (
    <div className='relative flex justify-center xl:gap-4'>
      <div className='container px-0 flex flex-col-reverse gap-4 -mt-10 xl:mt-0 xl:gap-8 xl:flex-row justify-center'>
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
                  <NavLink exact href={ `/${category?.fields.slug}` }>{ category?.fields.title }</NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <NavLink exact active href={ `/${category?.fields.slug}/${params.slug}` } className='font-medium'>{ title }</NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='relative w-full'>
            <div className='absolute top-0 right-0 left-0 z-10 mx-auto w-full max-w-screen-2xl opacity-35 blur-2xl overflow-hidden'>
              <FeaturedImage
                featuredImage={ mapImage } 
                sizes='(max-width: 1280px) 100vw, 1111.58px'
                priority 
                quality={ 1 } 
                className='xl:rounded-lg'
              />
            </div>
            <div className='relative z-20 mt-8 w-full max-w-screen-xl xl:mx-4'>
              <FeaturedImage 
                featuredImage={ mapImage }
                sizes='(max-width: 1280px) 100vw, 1200px'
                priority 
                className='xl:rounded-lg overflow-hidden' 
              />
            </div>
          </div>
          <div className='relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-12 w-full max-w-screen-xl border-b-2'>
            <div className='flex w-full justify-between items-center'>
              <h2 className='font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2'>
                { title }
              </h2>
              <div className='flex items-center justify-center gap-4 w-fit'>
                { (isEnabled || IN_DEVELOPMENT) && map.isUnpublished ? <Badge className='bg-purple-600 border-purple-800 hover:bg-purple-600'>Draft</Badge> : null }
                { (isEnabled || IN_DEVELOPMENT) && map.hasChanged ? <Badge className='bg-blue-600 border-blue-800 hover:bg-blue-600'>Changed</Badge> : null }
                <Badge className='bg-orange-700 border-primary hover:bg-orange-700'>{ category?.fields.title }</Badge>
              </div>
            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-8 pb-4 md:gap-0 md:pb-0 md:justify-between'>
              <div className='flex items-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
                <div>Last Updated: { new Date(map.sys.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
              </div>
              <div className='flex items-center justify-center'>
                <ShareButton title={ title } url={ `${WEBSITE_URL}/${category?.fields.slug}/${params.slug}` } />
              </div>
            </div>
          </div>
          <div className={ richStyles.body }>
            <RichTextRenderer body={ body } slug={ params.slug } />
          </div>
          <div className='flex flex-col xl:flex-row xl:justify-between items-center w-full mt-8 gap-8 px-4 xl:px-8'>
            { prevMap && <PreviousOrNextMap map={ prevMap } prev /> }
            { nextMap && <PreviousOrNextMap map={ nextMap } /> }
          </div>
        </article>
        <MobileTableOfContents headings={ headings } />
        <BackToTopButton type='button' mobile />
      </div>
      <TableOfContents headings={ headings } />
    </div>
  )
}

 const PreviousOrNextMap = ({ map, prev }: { map: Entry<TypeFeaturedMapsSkeleton, undefined, string>, prev?: boolean }) => {
  const { title, description, gameCategory, image, slug } = map.fields
  const category = resolveEntry(gameCategory)
  const featuredImage = resolveAsset(image)

  return (
      <Link href={ `/${category?.fields.slug}/${slug}` } className='group hover:border-primary border-2 rounded-lg overflow-hidden max-w-xl transition-all'>
        <article className={cn('relative h-full flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
          <div className={cn('absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full opacity-35 blur-2xl')}>
            <FeaturedImage 
              featuredImage={ featuredImage }
              sizes='(max-width: 1280px) 320px, 270px'
              quality={ 1 }
              className='object-cover scale-[2]'
            />
          </div>
          <div className='relative z-20 w-full max-w-80 overflow-hidden rounded-lg'>
            <FeaturedImage
              featuredImage={ featuredImage }
              alt={ `${title} map image` }
              sizes='(max-width: 1280px) 320px, 270px'
              className='object-cover'
            />
          </div>
          <div className='relative z-20 flex flex-col justify-center w-full gap-2 px-4 pt-4 mb-auto'>
            <h2 className='font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]'>
              { title }
            </h2>
            <p className='text-sm line-clamp-3 text-ellipsis'>{ description }</p>
            <div className={cn('flex items-center mt-4 pb-4 transition-all group-hover:text-primary', { 'xl:-ml-2': prev, 'xl:-mr-2': !prev })}>
              { prev ? (
                <>
                  <ChevronLeft />
                  <span>Previous Map</span>
                </>
              ) : (
                <>
                  <span className='ml-auto'>Next Map</span>
                  <ChevronRight />
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
  )
 }
