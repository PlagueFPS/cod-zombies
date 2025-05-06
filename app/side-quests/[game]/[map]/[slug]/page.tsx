import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { ChangedBadge, DraftBadge, NewBadge } from "@/components/CustomBadges/CustomBadges"
import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"
import RichTextRenderer from "@/components/RichText/RichTextRenderer/RichTextRenderer"
import ShareButton from "@/components/ShareButton/ShareButton"
import TableOfContents from "@/components/TableOfContents/TableOfContents"
import { Badge } from "@/components/ui/badge"
import { getQuestBySlug, getQuests } from "@/data/sideQuests"
import { env } from "@/env"
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { SideQuest } from "@/types/SideQuest"
import { ChevronRight, Clock } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import PreviousOrNextMapLoader from "@/components/Loaders/PreviousOrNextMapLoader"
import { CustomLink } from "@/components/CustomLink/CustomLink"
import GuideFeedback from "@/components/GuideFeedback/GuideFeedback"

interface ISideQuestSlugPage {
  params: Promise<{ 
    slug: string
    map: string
    game: string
  }>
}

export const generateStaticParams = async () => {
  const quests = await getQuests(false)
  return quests.map(q => ({
    game: q.game.slug,
    map: q.map.slug,
    slug: q.slug,
  }))
}

export const generateMetadata = async ({ params }: ISideQuestSlugPage): Promise<Metadata> => {
  const [{ slug, game, map }, { isEnabled }] = await Promise.all([params, draftMode()])
  const q = await getQuestBySlug(isEnabled, slug)
  if (!q) notFound()
  return {
    title: q.title,
    description: q.description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title: q.title,
      description: q.description,
      url: `/side-quests/${game}/${map}/${slug}`,
      images: {
        url: `https:${q.image.url}?w=1200&h=630&q=75&fm=jpg`,
        width: 1200,
        height: 630
      },
    },
    twitter: {
      title: q.title,
      description: q.description,
      card: 'summary_large_image'
    }
  }
}

export default async function SideQuestPage({ params }: ISideQuestSlugPage) {
  const [{ slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const q = await getQuestBySlug(isEnabled, slug)
  if (!q) notFound()
  const headings = extractHeadings(q.content)

  return (
    <section className='flex justify-center w-full -mt-10 xl:mt-0'>
      <div className='flex flex-col justify-start items-center max-w-(--desktop) mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='hidden sm:dark:block absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-7xl'>
                  <FeaturedImage
                    featuredImage={ q.image } 
                    sizes='32px'
                    priority 
                    quality={ 1 }
                  />
              </div>
              <div className='relative z-20 max-w-7xl mx-auto'>
                  <FeaturedImage 
                    featuredImage={ q.image }
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    quality={ 100 }
                    priority
                    className='xl:rounded-lg overflow-hidden' 
                  />
                <div className='absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center'>
                  <Breadcrumbs links={[
                      { title: 'Side Quests', href: `/side-quests` },
                      { title: q.game.title, href: `/side-quests?game=${q.game.slug}` },
                      { title: q.map.title, href: `/side-quests?map=${q.map.slug}` },
                      { title: q.title, href: `/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}` }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className='relative z-20 flex flex-col justify-center gap-2 md:gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-6 w-full max-w-7xl border-b-2'>
              <div className='flex flex-col-reverse md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-0'>
                <h2 className='font-extrabold text-3xl md:text-4xl lg:text-5xl text-gradient dark:dark-text-gradient pb-2'>
                  { q.title }
                </h2>
                <div className='flex items-center justify-center gap-4 w-fit'>
                  { (isEnabled || IN_DEVELOPMENT) && q.isDraft ? <DraftBadge /> : null }
                  { (isEnabled || IN_DEVELOPMENT) && q.isChanged ? <ChangedBadge /> : null }
                  { q.isNew ? <NewBadge /> : null }
                  <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>{ q.game.title }</Badge>
                  <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>{ q.map.title }</Badge>
                </div>
              </div>
              <div className='flex justify-between items-center text-muted-foreground text-sm'>
                <div className="flex flex-col-reverse items-start justify-center gap-2 pb-6 xl:flex-row xl:pb-0">
                  <div>Last Updated: { new Date(q.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
                  <span className='hidden md:inline'>&bull;</span>
                  <div className='flex gap-1 items-center'>
                    <Clock className='size-4' />
                    { q.timeToRead } min read
                  </div>
                </div>
                <ShareButton 
                  title={ q.title } 
                  url={ `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${slug}` } 
                  className="ml-auto text-muted-foreground mb-2 md:mb-0"
                  />
              </div>
            </div>
            <RichTextRenderer body={ q.content } slug={ slug } />
            <div className='flex justify-center items-center w-full'>
              <GuideFeedback guideTitle={ q.title } />
            </div>
            <div className='flex flex-row justify-center items-center w-full mt-8'>
              <div className='flex flex-col lg:flex-row justify-center items-center max-w-7xl px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
                <Suspense fallback={<PreviousOrNextMapLoader />}> 
                  <PrevOrNextQuest quest={ q } />
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

const PrevOrNextQuest = async ({ quest }: { quest: SideQuest }) => {
  const { isEnabled } = await draftMode()
  const quests = await getQuests(isEnabled)
  const questIndex = quests.findIndex(q => q.slug === quest.slug)
  const prevQuest = quests[questIndex + 1]
  const nextQuest = quests[questIndex - 1]
  return (
    <>
      { prevQuest && <PrevOrNextQuestCard quest={ prevQuest } isEnabled={ isEnabled } prev /> }
      { nextQuest && <PrevOrNextQuestCard quest={ nextQuest } isEnabled={ isEnabled } />}
    </>
  )
}

const PrevOrNextQuestCard = ({ quest, isEnabled, prev }: { quest: Omit<SideQuest, "content">, isEnabled: boolean, prev?: boolean }) => {
  const alt = `${quest.map.title} map image`

  return (
    <CustomLink 
      href={ `/side-quests/${quest.game.slug}/${quest.map.slug}/${quest.slug}` } 
      className='group hover:border-primary hover:scale-105 border-2 rounded-lg w-full max-w-sm xl:max-w-full shadow-sm dark:shadow-none overflow-hidden transition-transform'
    >
      <article className={cn('relative h-full xl:h-48 flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
        <div className={cn('absolute top-2 right-2 z-50 w-fit flex items-center justify-center gap-1')}>
          { quest.isNew ? <NewBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && quest.isDraft ? <DraftBadge /> : null }
          { (isEnabled || IN_DEVELOPMENT) && quest.isChanged ? <ChangedBadge /> : null }
          <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
            { quest.map.title }
          </Badge>
          <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
            { quest.game.title }
          </Badge>
        </div>
        <div className={cn('hidden absolute top-0 left-0 right-0 bottom-0 z-10 dark:flex items-center w-full h-full opacity-35 blur-2xl')}>
            <FeaturedImage 
              featuredImage={ quest.image }
              sizes='32px'
              quality={ 1 }
              className='scale-110'
            />
        </div>
        <div className='relative flex items-center justify-center z-20 max-w-sm h-full w-full rounded-lg overflow-hidden'>
            <FeaturedImage
              featuredImage={ quest.image }
              alt={ alt }
              sizes='(max-width: 1280px) 320px, 384px'
              className='object-cover rounded-lg h-full'
            />
        </div>
        <div className='relative z-20 h-full flex flex-col justify-center w-full gap-2 px-4 pt-4 xl:pt-6'>
          <h2 className='text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-b text-gradient dark:dark-text-gradient'>
            { quest.title }
          </h2>
          <p className='text-sm line-clamp-3 text-ellipsis'>{ quest.description }</p>
          <div className={cn('flex items-center pb-4 transition-all group-hover:text-primary mt-auto', { 'xl:-ml-2': prev, 'xl:-mr-2': !prev })}>
            { prev ? (
              <>
                <ChevronLeft />
                <span>Previous Quest</span>
              </>
            ) : (
              <>
                <span className='ml-auto'>Next Quest</span>
                <ChevronRight />
              </>
            )}
          </div>
        </div>
      </article>
    </CustomLink>
  )
}