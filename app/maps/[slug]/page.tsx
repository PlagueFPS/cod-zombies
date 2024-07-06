import styles from './MapPage.module.css'
import { DATE_OPTIONS } from "@/utils/constants"
import { getMaps, resolveAsset, resolveEntry } from "@/utils/contentful-utils"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { renderOptions } from '@/contentful/renderOptions'

interface MapPageProps {
  params: { slug: string }
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
  const { title, description, image, gameCategory, date, body } = map.fields
  const mapImage = resolveAsset(image)
  const mapCategory = resolveEntry(gameCategory)

  return (
    <div className="container flex justify-center px-16 items-center">
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-primary flex flex-col font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          { title } <span className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Main Quest Guide</span>
        </h1>
        <div className="flex gap-2 w-full max-w-4xl text-foreground/80 text-xs md:text-sm lg:text-base -mb-2">
          <span>{ new Date(date).toLocaleDateString(undefined, DATE_OPTIONS) }</span>
          <span>•</span>
          <span>{ mapCategory?.fields.title }</span>
        </div>
        <picture className="relative overflow-hidden h-full w-full max-w-4xl rounded-lg">
          <Image 
            src={ `https:${mapImage?.fields?.file?.url}` }
            alt=""
            width={ mapImage?.fields.file?.details.image?.width }
            height={ mapImage?.fields.file?.details.image?.height }
            className="object-cover"
          />
        </picture>
        <p className="text-foreground/80 text-sm md:text-base lg:text-lg max-w-[80ch]">
          { description }
        </p>
        <div className={ styles.body }>
          { documentToReactComponents(body, renderOptions) }
        </div>
      </section>
    </div>
  )
}
