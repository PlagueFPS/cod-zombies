import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS, GLOBAL_OG_PROPS, IN_DEVELOPMENT, WEBSITE_URL } from "@/utils/constants"
import { extractHeadings } from "@/utils/contentful-utils"
import { getMapBySlug, getMaps } from '@/data/data'
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
import type { Map } from '@/types/Map'

interface MapPageProps {
  params: { 
    category: string | undefined
    slug: string
  }
}

export const generateStaticParams = async () => {
  const { maps } = await getMaps()

  return maps.map(map => ({
    category: map.fields.gameCategory?.fields.slug,
    slug: map.fields.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const { isEnabled } = draftMode()
  const map = await getMapBySlug(params.slug, isEnabled)
  if (!map) notFound()
  const { title, description, image } = map.fields
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${params.category}/${params.slug}`,
      images: {
        url: `https:${image?.fields?.file?.url}?q=75`,
        width: image?.fields?.file?.details.image?.width,
        height: image?.fields?.file?.details.image?.height
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
  const { title, image, gameCategory: category, slug, body } = map.fields
  const headings = extractHeadings(map)
  const mapIndex = maps.indexOf(map)
  const prevMap = maps[mapIndex + 1]
  const nextMap = maps[mapIndex - 1]

  return (
    <section className='flex justify-center w-full -mt-10 xl:mt-0'>
      <div className='flex flex-col justify-start items-center max-w-[1920px] mx-auto xl:mx-4 w-full'>
        <div className='flex flex-col-reverse xl:flex-row flex-grow w-full'>
          <article className='flex flex-col items-center justify-center w-full'>
            <div className='relative w-full mt-16 xl:mt-8'>
              <div className='absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl max-w-screen-xl overflow-hidden'>
                <FeaturedImage
                  featuredImage={ image } 
                  sizes='(max-width: 1280px) 100vw, 1111.58px'
                  priority 
                  quality={ 1 } 
                  className='xl:rounded-lg scale-[2]'
                />
              </div>
              <div className='relative z-20 max-w-screen-xl mx-auto'>
                <FeaturedImage 
                  featuredImage={ image }
                  sizes='(max-width: 1280px) 100vw, 1280px'
                  priority 
                  className='xl:rounded-lg overflow-hidden' 
                />
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
                          <NavLink exact href={ `/${category?.fields.slug}` }>{ category?.fields.title }</NavLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <NavLink exact active href={ `/${category?.fields.slug}/${slug}` } className='font-medium'>{ title }</NavLink>
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
                  { (isEnabled || IN_DEVELOPMENT) && map.isDraft ? <Badge className='badge-draft-gradient'>Draft</Badge> : null }
                  { (isEnabled || IN_DEVELOPMENT) && map.isChanged ? <Badge className='badge-changed-gradient'>Changed</Badge> : null }
                  <Badge className='badge-primary-gradient'>{ category?.fields.title }</Badge>
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
              <RichTextRenderer body={ body } slug={ slug } />
            </div>
            <div className='flex flex-row justify-center items-center w-full mt-8'>
              <div className='flex flex-col lg:flex-row justify-center items-center max-w-screen-xl px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
                { prevMap && (
                  <PreviousOrNextMap map={ prevMap } prev />
                )}
                { nextMap && (
                  <PreviousOrNextMap map={ nextMap } />
                )}
              </div>
            </div>
          </article>
          <TableOfContents headings={ headings } />
        </div>
      </div>
    </section>
  )
}

 const PreviousOrNextMap = ({ map, prev }: { map: Map, prev?: boolean }) => {
  const { title, description, gameCategory: category, image, slug } = map.fields

  return (
      <Link href={ `/${category?.fields.slug}/${slug}` } className='group hover:border-primary hover:scale-105 border-2 rounded-lg w-full max-w-sm xl:max-w-full overflow-hidden transition-transform'>
        <article className={cn('relative h-full flex flex-col xl:flex-row items-center p-2 overflow-hidden', { 'xl:flex-row-reverse': prev })}>
          <div className={cn('absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full opacity-35 blur-2xl')}>
            <FeaturedImage 
              featuredImage={ image }
              sizes='(max-width: 1280px) 320px, 234px'
              quality={ 1 }
              className='object-cover scale-[2]'
            />
          </div>
          <div className='relative z-20 max-w-sm w-full overflow-hidden rounded-lg'>
            <FeaturedImage
              featuredImage={ image }
              alt={ `${title} map image` }
              sizes='(max-width: 1280px) 320px, 364px'
              className='object-cover'
            />
          </div>
          <div className='relative z-20 flex flex-col justify-center w-fit gap-2 px-4 pt-4 mb-auto'>
            <h2 className='font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]'>
              { title }
            </h2>
            <p className='flex-shrink-0 text-sm line-clamp-3 text-ellipsis'>{ description }</p>
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
