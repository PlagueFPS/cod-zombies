import { getMaps, getMapBySlug, getMapSearchData } from '@/data/maps'
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import { CustomLink, HashLinkHandler } from '@/components/CustomLink/CustomLink'
import { ChevronLeft, ChevronRight, Clock, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ShareButton from '@/components/ShareButton/ShareButton'
import { draftMode } from 'next/headers'
import RichTextRenderer from '@/components/RichText/RichTextRenderer/RichTextRenderer'
import { cn } from '@/lib/utils'
import { env } from '@/env'
import type { FeaturedMapWithoutBody } from '@/types/FeaturedMap'
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge, DifficultyBadge } from '@/components/CustomBadges/CustomBadges'
import { cache } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import GuideFeedback from '@/components/GuideFeedback/GuideFeedback'

interface MapPageProps {
  params: Promise<{ 
    game: string | undefined
    slug: string
  }>
}

const getPageData = cache(async (draftMode: boolean, slug: string) => {
  const map = await getMapBySlug(draftMode, slug, true)
  if (!map) {
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
  const featuredMaps = await getMapSearchData(false)

  return featuredMaps.map(map => ({
    game: map.game.slug,
    slug: map.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const [{ slug, game }, { isEnabled }] = await Promise.all([params, draftMode()])
  const { map } = await getPageData(isEnabled, slug)
  const { title, image, game: mapGame } = map
  const description = `Complete the main quest/easter egg for the ${mapGame.title} zombies map ${title} with our detailed step-by-step guide!`
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${game}/${slug}`,
      images: {
        url: `https:${image.url}?w=1200&h=630&q=75&fm=jpg`,
        width: 1200,
        height: 630
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
  const { map, nextMap, prevMap } = await getPageData(isEnabled, slug)
  const headings = extractHeadings(map.body)

  return (
    <section className='flex justify-center w-full -mt-10 xl:mt-0'>
      <div className='flex flex-col justify-start items-center max-w-(--desktop) mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='hidden sm:dark:block absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-7xl'>
                <FeaturedImage
                  featuredImage={ map.image } 
                  sizes='32px'
                  priority 
                  quality={ 1 }
                />
              </div>
              <div className='relative z-20 max-w-7xl mx-auto'>
                <FeaturedImage 
                  featuredImage={ map.image }
                  sizes='(max-width: 1280px) 100vw, 1280px'
                  quality={ 100 }
                  priority
                  className='xl:rounded-lg overflow-hidden' 
                />
                <div className='absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center'>
                  <Breadcrumbs links={[
                      { title: map.game.title, href: `/?game=${map.game.slug}` },
                      { title: map.title, href: `/${map.game.slug}/${slug}` }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className='relative z-20 flex flex-col justify-center gap-2 md:gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-6 w-full max-w-7xl border-b-2'>
              <div className='flex flex-col-reverse md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-0'>
                <h2 className='font-extrabold text-3xl md:text-4xl lg:text-5xl text-gradient dark:dark-text-gradient pb-2'>
                  { map.title }
                </h2>
                <div className='flex items-center justify-center gap-4 w-fit'>
                  { (isEnabled || IN_DEVELOPMENT) && map.isDraft ? <DraftBadge /> : null }
                  { (isEnabled || IN_DEVELOPMENT) && map.isChanged ? <ChangedBadge /> : null }
                  { (isEnabled || IN_DEVELOPMENT) && map.isComingSoon ? <ComingSoonBadge /> : map.isNew ? <NewBadge /> : null }
                  { map.difficulty && <DifficultyBadge difficulty={ map.difficulty } /> }
                  <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>{ map.game.title }</Badge>
                </div>
              </div>
              <div className='flex justify-between items-center text-muted-foreground text-sm'>
                <div className='flex flex-col-reverse items-start justify-center gap-2 pb-6 xl:flex-row xl:pb-0'>
                  <div>Last Updated: { new Date(map.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
                  <span className='hidden md:inline'>&bull;</span>
                  <div className='flex gap-1 items-center'>
                    <Clock className='size-4' />
                    { map.timeToRead } min read
                  </div>
                </div>
                <ShareButton 
                  title={ map.title } 
                  url={ `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game.slug}/${slug}` } 
                  className='ml-auto text-muted-foreground mb-2 md:mb-0' 
                />
              </div>
            </div>
            { map.isComingSoon ? (
              <div className='relative max-w-[80ch] px-4 mx-auto text-center space-y-2 my-20'>
                <p className='text-xl font-bold'>This article is currently being written and will take some time before being ready.</p>
                <p className='text-foreground/90'>Check back soon or subscribe to our newsletter at the bottom of this page to be notified when this guide is ready!</p>
              </div>
            ) : <RichTextRenderer body={ map.body } slug={ slug } /> }
            <div className='flex justify-center items-center w-full'>
              <GuideFeedback guideTitle={ map.title } />
            </div>
            <div className='flex flex-row justify-center items-center w-full mt-8'>
              <div className='flex flex-col lg:flex-row justify-center items-center max-w-7xl px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
                { prevMap && <PrevOrNextMapCard map={ prevMap } isEnabled={ isEnabled } prev /> }
                { nextMap && <PrevOrNextMapCard map={ nextMap } isEnabled={ isEnabled } /> }
              </div>
            </div>
          </article>
          <TableOfContents headings={ map.isComingSoon ? [] : headings } />
        </div>
      </div>
      <HashLinkHandler />
    </section>
  )
}

 const PrevOrNextMapCard = ({ map, isEnabled, prev }: { map: FeaturedMapWithoutBody, isEnabled: boolean, prev?: boolean }) => {
  const alt = `${map.title} map image`
  const href = map.isComingSoon ? '#' : `/${map.game.slug}/${map.slug}`

  return (
    <CustomLink 
      href={ href }
      className={cn('group hover:border-primary hover:-translate-y-2 border rounded-lg w-full max-w-sm xl:max-w-full shadow-sm dark:shadow-none overflow-hidden transition-all', {
        'pointer-events-none opacity-50': map.isComingSoon,
      })}
    >
      <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
        <div className={cn('absolute top-2 right-2 z-50 w-fit flex items-center justify-center gap-1')}>
          { map.isComingSoon ? <ComingSoonBadge /> : map.isNew ? <NewBadge /> : null } 
          { (isEnabled || IN_DEVELOPMENT) && map.isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && map.isChanged ? <ChangedBadge /> : null }
          { map.difficulty && <DifficultyBadge difficulty={ map.difficulty } /> }
          <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
            { map.game.title }
          </Badge>
        </div>
        <div className='hidden dark:flex absolute inset-0 z-10 items-center w-full h-full opacity-35 blur-2xl'>
            <FeaturedImage 
              featuredImage={ map.image }
              sizes='32px'
              quality={ 1 }
              className='scale-110'
            />
        </div>
        <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full rounded-lg overflow-hidden'>
            <FeaturedImage
              featuredImage={ map.image }
              alt={ alt }
              sizes='(max-width: 1280px) 320px, 384px'
              className='object-cover rounded-lg h-full'
            />
        </div>
        <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4 xl:pt-6'>
          <h3 className='text-xl font-semibold group-hover:text-primary-gradient'>
            { map.title }
          </h3>
          <p className='text-sm line-clamp-3 text-ellipsis'>{ map.description }</p>
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
