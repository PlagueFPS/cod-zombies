import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"
import { getFeaturedMapBySlug, getFeaturedMaps } from "@/data/featuredMaps"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import NavLink from '@/components/NavLink/NavLink'
import { ChevronLeft, ChevronRight, Slash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ShareButton from '@/components/ShareButton/ShareButton'
import { draftMode } from 'next/headers'
import RichTextRenderer from '@/components/RichText/RichTextRenderer/RichTextRenderer'
import { cn } from '@/lib/utils'
import { env } from '@/env'
import type { FeaturedMap } from '@/types/FeaturedMap'
import { ChangedBadge, DraftBadge, NewBadge } from '@/components/CustomBadges/CustomBadges'
import { Suspense } from 'react'
import ImageLoader from '@/components/Loaders/ImageLoader'
import PreviousOrNextMapLoader from '@/components/Loaders/PreviousOrNextMapLoader'
import ContentfulImage from '@/components/ContentfulImage/ContentfulImage'

interface MapPageProps {
  params: Promise<{ 
    category: string | undefined
    slug: string
  }>
}

export const generateStaticParams = async () => {
  const featuredMaps = await getFeaturedMaps(IN_DEVELOPMENT)

  return featuredMaps.map(map => ({
    category: map.category.slug,
    slug: map.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const [{ slug, category }, { isEnabled }] = await Promise.all([params, draftMode()])
  const map = await getFeaturedMapBySlug(isEnabled, slug)
  if (!map) notFound()
  const { title, description, image } = map
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${category}/${slug}`,
      images: {
        url: `https:${image.url}?q=75`,
        width: image.width,
        height: image.height
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
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const map = await getFeaturedMapBySlug(isEnabled, slug)
  if (!map) notFound()
  const { title, image, category, updatedAt, isDraft, isChanged, isNew, body } = map
  const headings = extractHeadings(body)

  return (
    <section className='flex justify-center w-full -mt-10 xl:mt-0'>
      <div className='flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row flex-grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-screen-xl overflow-hidden'>
                  <FeaturedImage
                    featuredImage={ image } 
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    priority 
                    className='xl:rounded-lg scale-[2]'
                  >
                    <Suspense fallback={<ImageLoader />}>
                      <ContentfulImage 
                        featuredImage={ image }
                        sizes='(max-width: 1280px) 100vw, 1280px'
                        priority
                        className='xl:rounded-lg scale-[2]'
                      />
                    </Suspense>
                  </FeaturedImage>
              </div>
              <div className='relative z-20 max-w-screen-xl mx-auto'>
                  <FeaturedImage 
                    featuredImage={ image }
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    priority 
                    className='xl:rounded-lg overflow-hidden' 
                  >
                    <Suspense fallback={<ImageLoader className={`relative border h-[calc(50vw)] xl:h-[720px]`} />}>
                      <ContentfulImage 
                        featuredImage={ image }
                        sizes='(max-width: 1280px) 100vw, 1280px'
                        priority
                        className='xl:rounded-lg overflow-hidden'
                      />
                    </Suspense>
                  </FeaturedImage>
                <div className='absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center'>
                  <Breadcrumb className='mr-auto'>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <NavLink exact href='/'>Home</NavLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <NavLink exact href={ `/${category.slug}` }>{ category.title }</NavLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <NavLink exact active href={ `/${category.slug}/${slug}` } className='font-medium'>{ title }</NavLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
            </div>
            <div className='relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-12 w-full max-w-screen-xl border-b-2'>
              <div className='flex w-full justify-between items-center'>
                <h2 className='font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2'>
                  { title }
                </h2>
                <div className='flex items-center justify-center gap-4 w-fit'>
                  { (isEnabled || IN_DEVELOPMENT) && isDraft ? <DraftBadge /> : null }
                  { (isEnabled || IN_DEVELOPMENT) && isChanged ? <ChangedBadge /> : null }
                  { isNew ? <NewBadge /> : null }
                  <Badge className='badge-primary-gradient'>{ category.title }</Badge>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-start md:items-center gap-8 pb-4 md:gap-0 md:pb-0 md:justify-between'>
                <div className='flex items-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
                  <div>Last Updated: { new Date(updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
                </div>
                <div className='flex items-center justify-center'>
                  <ShareButton title={ title } url={ `${env.NEXT_PUBLIC_WEBSITE_URL}/${category.slug}/${slug}` } />
                </div>
              </div>
            </div>
            <div className={ richStyles.body }>
              <RichTextRenderer body={ body } slug={ slug } />
            </div>
            <div className='flex flex-row justify-center items-center w-full mt-8'>
              <div className='flex flex-col lg:flex-row justify-center items-center max-w-screen-xl px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
                <Suspense fallback={<PreviousOrNextMapLoader />}> 
                  <PreviousOrNextMap map={ map } />
                </Suspense>
              </div>
            </div>
          </article>
          <TableOfContents headings={ headings } />
        </div>
      </div>
    </section>
  )
}

 const PreviousOrNextMap = async ({ map }: { map: FeaturedMap }) => {
  const { isEnabled } = await draftMode()
  const featuredMaps = await getFeaturedMaps(isEnabled)
  const mapIndex = featuredMaps.findIndex(m => m.slug === map.slug)
  const prevMap = featuredMaps[mapIndex + 1]
  const nextMap = featuredMaps[mapIndex - 1]

  return (
    <>
      { prevMap && <PrevOrNextMapCard map={ prevMap } prev /> }
      { nextMap && <PrevOrNextMapCard map={ nextMap } /> }
    </>
  )
 }

 const PrevOrNextMapCard = ({ map, prev }: { map: FeaturedMap, prev?: boolean }) => {
  const { title, description, category, image, slug } = map
  const alt = `${title} map image`

  return (
    <Link href={ `/${category.slug}/${slug}` } className='group hover:border-primary hover:scale-105 border-2 rounded-lg w-full max-w-sm xl:max-w-full overflow-hidden transition-transform'>
        <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
          <div className={cn('absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full opacity-35 blur-2xl')}>
              <FeaturedImage 
                featuredImage={ image }
                sizes='32px'
                className='object-cover scale-[2]'
              >
                <Suspense fallback={<ImageLoader />}>
                  <ContentfulImage 
                    featuredImage={ image }
                    sizes='32px'
                    className='object-cover scale-[2]'
                  />
                </Suspense>
              </FeaturedImage>
          </div>
          <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full overflow-hidden'>
              <FeaturedImage
                featuredImage={ image }
                alt={ alt }
                sizes='(max-width: 1280px) 320px, 364px'
                className='object-cover rounded-lg h-full'
              >
                <Suspense fallback={<ImageLoader />}>
                  <ContentfulImage 
                    featuredImage={ image }
                    alt={ alt }
                    sizes='(max-width: 1280px) 320px, 364px'
                    className='object-cover rounded-lg h-full'
                  />
                </Suspense>
              </FeaturedImage>
          </div>
          <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4'>
            <h2 className='font-extrabold text-transparent bg-clip-text bg-gradient-to-b text-gradient'>
              { title }
            </h2>
            <p className='text-sm line-clamp-3 text-ellipsis'>{ description }</p>
            <div className={cn('flex items-center pb-4 transition-all group-hover:text-primary mt-auto', { 'xl:-ml-2': prev, 'xl:-mr-2': !prev })}>
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
