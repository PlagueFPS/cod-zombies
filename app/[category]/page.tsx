import { getGameCategories } from "@/data/data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import HeroSection from "@/components/HeroSection/HeroSection"
import FeaturedMaps from "@/components/FeaturedMaps/FeaturedMaps"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export const generateStaticParams = async () => {
  const categories = await getGameCategories()
  return categories.map(category => ({
    category: category.slug
  }))
}

export const generateMetadata = async ({ params }: CategoryPageProps) => {
  const categories = await getGameCategories()
  const category = categories.find(category => category.slug === params.category)
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
        url: `https:${category.image?.fields.file?.url}?q=75`,
        width: category.image?.fields.file?.details.image?.width,
        height: category.image?.fields.file?.details.image?.height,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getGameCategories()
  const category = categories.find(category => category.slug === params.category)
  if (!category) notFound()

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection text={ category.title } />
      <FeaturedMaps currentCategory={ category.slug } />
    </div>
  )
}
