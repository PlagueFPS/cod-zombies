import { getGameCategories, getGameCategoryBySlug } from "@/data/gameCategory"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { draftMode } from "next/headers"
import HeroSection from "@/components/HeroSection/HeroSection"
import FeaturedMaps from "@/components/FeaturedMaps/FeaturedMaps"
import { use } from "react"
import { capatilize } from "@/utils/functions"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export const generateStaticParams = async () => {
  const categories = await getGameCategories(IN_DEVELOPMENT)
  return categories.map(category => ({
    category: category.slug
  }))
}

export const generateMetadata = async ({ params }: CategoryPageProps) => {
  const [{ category: slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const category = await getGameCategoryBySlug(isEnabled, slug)
  if (!category) notFound()
  const title = category.title
  const description = `Explore our comprehensive guides to the most challenging and rewarding main quests in ${category.title}`
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${category.slug}`,
      images: {
        url: `https:${category.image.url}?q=75`,
        width: category.image.width,
        height: category.image.height,
      }
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    }
  }

  return metadata
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params)

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection text={ capatilize(category) } />
      <FeaturedMaps currentCategory={ category } />
    </div>
  )
}
