import richStyles from '@/components/RichText/RichText.module.css'
import { getMaps, getMapBySlug } from '@/data/maps'
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
// import Link from 'next/link'
import { CustomLink } from '@/components/CustomLink/CustomLink'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ShareButton from '@/components/ShareButton/ShareButton'
import { draftMode } from 'next/headers'
import RichTextRenderer from '@/components/RichText/RichTextRenderer/RichTextRenderer'
import { cn } from '@/lib/utils'
import { env } from '@/env'
import type { FeaturedMapWithoutBody } from '@/types/FeaturedMap'
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge } from '@/components/CustomBadges/CustomBadges'
import { cache } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'

interface MapPageProps {
  params: Promise<{ 
    category: string | undefined
    slug: string
  }>
}

const getPageData = cache(async (draftMode: boolean, slug: string) => {
  const map = await getMapBySlug(draftMode, slug, true)
  if (!map || (map.isComingSoon && !draftMode && !IN_DEVELOPMENT)) {
    notFound()
  }
  const maps = await getMaps(draftMode)
  const mapIndex = maps.findIndex(m => m.slug === map.slug)

  return {
    map,
    prevMap: maps[mapIndex + 1],
    nextMap: maps[mapIndex - 1]
  }
})

export const generateStaticParams = async () => {
  const featuredMaps = await getMaps(false)

  return featuredMaps.filter(map => !map.isComingSoon).map(map => ({
    category: map.category.slug,
    slug: map.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const [{ slug, category }, { isEnabled }] = await Promise.all([params, draftMode()])
  const { map } = await getPageData(isEnabled, slug)
  const { title, description, image } = map
  const seoTitle = `${title} Main Quest`
  const metadata: Metadata = {
    title: seoTitle,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title: seoTitle,
      description,
      url: `/${category}/${slug}`,
      images: {
        url: `https:${image.url}?q=75&fm=jpg`,
        width: image.width,
        height: image.height
      }
    },
    twitter: {
      title: seoTitle,
      description,
      card: 'summary_large_image'
    }
  }

  return metadata
}

export default async function MapPage({ params }: MapPageProps) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const { map, nextMap, prevMap } = await getPageData(isEnabled, slug)
  const { title, image, category, updatedAt, isDraft, isChanged, isNew, isComingSoon, body } = map
  const headings = extractHeadings(body)

  return (
    <section className='flex justify-center w-full -mt-10 xl:mt-0'>
      <div className='flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row flex-grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-screen-xl'>
                  <FeaturedImage
                    featuredImage={ image } 
                    sizes='32px'
                    priority 
                    className='xl:rounded-lg'
                    quality={ 1 }
                  />
              </div>
              <div className='relative z-20 max-w-screen-xl mx-auto'>
                  <FeaturedImage 
                    featuredImage={ image }
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    quality={ 100 }
                    priority
                    className='xl:rounded-lg overflow-hidden' 
                  />
                <div className='absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center'>
                  <Breadcrumbs links={[
                      { title: category.title, href: `/${category.slug}` },
                      { title: title, href: `/${category.slug}/${slug}` }
                    ]}
                  />
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
                  { (isEnabled || IN_DEVELOPMENT) && isComingSoon ? <ComingSoonBadge /> : isNew ? <NewBadge /> : null }
                  <Badge className='badge-primary-gradient'>{ category.title }</Badge>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-start md:items-center gap-8 pb-4 md:gap-0 md:pb-0 md:justify-between'>
                <div className='flex flex-col items-center justify-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
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
                { prevMap && <PrevOrNextMapCard map={ prevMap } isEnabled={ isEnabled } prev /> }
                { nextMap && <PrevOrNextMapCard map={ nextMap } isEnabled={ isEnabled } /> }
              </div>
            </div>
          </article>
          <TableOfContents headings={ headings } />
        </div>
      </div>
    </section>
  )
}

 const PrevOrNextMapCard = ({ map, isEnabled, prev }: { map: FeaturedMapWithoutBody, isEnabled: boolean, prev?: boolean }) => {
  const { title, description, category, image, slug, isChanged, isDraft, isNew, isComingSoon } = map
  const alt = `${title} map image`
  const href = isComingSoon ? '#' : `/${category.slug}/${slug}`

  return (
    <CustomLink 
      href={ href }
      className={cn('group hover:border-primary hover:scale-105 border-2 rounded-lg w-full max-w-sm xl:max-w-full overflow-hidden transition-transform', {
        'pointer-events-none opacity-50': isComingSoon,
      })}
    >
      <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
        <div className={cn('absolute top-2 right-2 z-50 w-fit flex items-center justify-center gap-1')}>
          { isComingSoon ? <ComingSoonBadge /> : isNew ? <NewBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && isChanged ? <ChangedBadge /> : null }
          <Badge className='badge-primary-gradient'>
            { category.title }
          </Badge>
        </div>
        <div className={cn('absolute inset-0 z-10 flex items-center w-full h-full opacity-35 blur-2xl')}>
            <FeaturedImage 
              featuredImage={ image }
              sizes='32px'
              quality={ 1 }
              className='scale-110'
            />
        </div>
        <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full rounded-lg overflow-hidden'>
            <FeaturedImage
              featuredImage={ image }
              alt={ alt }
              sizes='(max-width: 1280px) 320px, 384px'
              className='object-cover rounded-lg h-full'
            />
        </div>
        <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4 xl:pt-6'>
          <h2 className='text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b text-gradient'>
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
    </CustomLink>
  )
 }
