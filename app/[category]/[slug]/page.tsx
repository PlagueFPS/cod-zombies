import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS, SITE_TITLE } from "@/utils/constants"
import { extractHeadings, getMaps, resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { renderOptions } from '@/contentful/renderOptions'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import TableOfContents from '@/components/TableOfContents/TableOfContents'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import NavLink from '@/components/Navbar/NavLink/NavLink'

interface MapPageProps {
  params: { 
    category: string | undefined
    slug: string
  }
}

export const generateStaticParams = async () => {
  const maps = await getMaps()

  return maps.items.map(map => ({
    category: resolveEntry(map.fields.gameCategory)?.fields.slug,
    slug: map.fields.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const maps = await getMaps()
  const map = maps.items.find(map => map.fields.slug === params.slug)
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
  const maps = await getMaps()
  const map = maps.items.find(map => map.fields.slug === params.slug)
  if (!map) notFound()

  const { title, image, gameCategory, date, body } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  const headings = extractHeadings(map)

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
          <div className='absolute top-0 right-0 left-0 z-10 mx-auto w-full max-w-screen-2xl opacity-35 blur-3xl overflow-hidden'>
            <FeaturedImage featuredImage={ mapImage } priority />
          </div>
          <div className='relative z-20 mt-8 mx-auto w-full max-w-screen-xl'>
            <FeaturedImage featuredImage={ mapImage } priority className='xl:rounded-lg overflow-hidden' />
          </div>
        </div>
        <div className='relative z-20 flex flex-col justify-center gap-4 mt-8 px-4 md:mt-16 mb-4 md:px-8 pb-12 w-full max-w-screen-xl border-b-2'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
            { title }
          </h1>
          <div className='flex items-center flex-wrap gap-y-2 gap-x-2 text-muted-foreground text-sm'>
            <div>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
            <div>•</div>
            <div>
              <Link href={ `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${params.category}` } className='hover:text-primary transition-all'>
                { category?.fields.title }
              </Link>
            </div>
          </div>
        </div>
        <div className={ richStyles.body }>
          { documentToReactComponents(body, renderOptions) }
        </div>
      </article>
      <aside className='hidden xl:block sticky top-4 pl-8 h-full'>
        <TableOfContents headings={ headings } />
      </aside>
    </div>
  )
}
