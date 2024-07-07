import styles from './MapPage.module.css'
import richStyles from '@/components/RichText/RichText.module.css'
import { DATE_OPTIONS } from "@/utils/constants"
import { getMaps, resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { renderOptions } from '@/contentful/renderOptions'
import revalidateMaps from '@/utils/actions'
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage'
import { cn } from '@/lib/utils'

interface MapPageProps {
  params: { 
    slug: string
  }
}

export const generateStaticParams = async () => {
  const posts = await getMaps()
  const maps = posts.items

  return maps.map(map => ({
    slug: map.fields.slug
  }))
}

export const generateMetadata = async ({ params }: MapPageProps) => {
  const posts = await getMaps()
  const maps = posts.items
  const map = maps.find(map => map.fields.slug === params.slug)
  if (!map) notFound()
  const { title, description, image } = map.fields
  const mapImage = resolveAsset(image)
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/maps/${params.slug}`,
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
  const posts = await getMaps()
  const maps = posts.items
  const map = maps.find(map => map.fields.slug === params.slug)
  if (!map) notFound()
  const { title, image, gameCategory, date, body } = map.fields
  const mapImage = resolveAsset(image)
  const category = resolveEntry(gameCategory)
  revalidateMaps() // REMOVE THIS BEFORE PRODUCTION

  return (
    <article className='flex flex-col justify-center items-center'>
      <div className='relative w-full'>
        <div className='absolute top-0 right-0 left-0 z-10 mx-auto w-full max-w-screen-2xl opacity-35 blur-3xl overflow-hidden'>
          <FeaturedImage featuredImage={ mapImage } />
        </div>
        <div className='relative z-20 mt-8 mx-auto w-full max-w-screen-xl'>
          <FeaturedImage featuredImage={ mapImage } className='xl:rounded-lg overflow-hidden' />
        </div>
      </div>
      <div className='relative z-20 flex flex-col justify-center gap-4 mt-16 mb-4 px-8 pb-12 w-full max-w-screen-xl border-b-2 border-border'>
        <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
          { title }
        </h1>
        <div className='flex items-center flex-wrap gap-y-2 gap-x-4 text-muted-foreground'>
          <div>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</div>
          <div>•</div>
          <div>{ category?.fields.title }</div>
        </div>
      </div>
      <div className={ cn(styles.body, richStyles.body) }>
        { documentToReactComponents(body, renderOptions) }
      </div>
    </article>
  )
}
