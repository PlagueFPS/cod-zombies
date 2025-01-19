import richStyles from "@/components/RichText/RichText.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { ChangedBadge, DraftBadge } from "@/components/CustomBadges/CustomBadges"
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
        url: `https:${q.image.url}?w=1260&h=630&q=75&fm=jpg`,
        width: 1260,
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
      <div className='flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row flex-grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-screen-xl'>
                  <FeaturedImage
                    featuredImage={ q.image } 
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    priority 
                    className='xl:rounded-lg'
                    quality={ 1 }
                  />
              </div>
              <div className='relative z-20 max-w-screen-xl mx-auto'>
                  <FeaturedImage 
                    featuredImage={ q.image }
                    sizes='(max-width: 1280px) 100vw, 1280px'
                    quality={ 100 }
                    className='xl:rounded-lg overflow-hidden' 
                  />
                <div className='absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center'>
                  <Breadcrumbs links={[
                      { title: 'Side Quests', href: `/side-quests` },
                      { title: q.game.title, href: `/side-quests/${q.game.slug}` },
                      { title: q.map.title, href: `/side-quests/${q.game.slug}/${q.map.slug}` },
                      { title: q.title, href: `/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}` }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className='relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 md:pb-12 w-full max-w-screen-xl border-b-2'>
              <div className='flex w-full justify-between items-center'>
                <h2 className='font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2'>
                  { q.title }
                </h2>
                <div className='flex items-center justify-center gap-4 w-fit'>
                  { (isEnabled || IN_DEVELOPMENT) && q.isDraft ? <DraftBadge /> : null }
                  { (isEnabled || IN_DEVELOPMENT) && q.isChanged ? <ChangedBadge /> : null }
                  {/* { q.isNew ? <NewBadge /> : null } */}
                  <Badge className='badge-primary-gradient'>{ q.game.title }</Badge>
                  <Badge className='badge-primary-gradient'>{ q.map.title }</Badge>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-start md:items-center gap-8 pb-4 md:gap-0 md:pb-0 md:justify-between'>
                <div className='flex flex-col items-center justify-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
                  <div>Last Updated: { new Date(q.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
                </div>
                <div className='flex items-center justify-center'>
                  <ShareButton title={ q.title } url={ `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${slug}` } />
                </div>
              </div>
            </div>
            <div className={ richStyles.body }>
              <RichTextRenderer body={ q.content } slug={ slug } />
            </div>
          </article>
          <TableOfContents headings={ headings } />
        </div>
      </div>
    </section>
  )
}