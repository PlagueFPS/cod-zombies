import { getGameCategories, getGameCategoryBySlug } from "@/data/gameCategory"
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT } from "@/utils/constants"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import HeroSection from "@/components/HeroSection/HeroSection"
import { capatilize } from "@/utils/functions"
import { Suspense, use } from "react"
import MapSection from "@/components/MapSection/MapSection"
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader"
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters"
import MapGridLoader from "@/components/Loaders/MapGridLoader"
import CategoryMapGrid from "@/components/MapGrid/CategoryMapGrid"
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
      <MapSection category={ capatilize(category) }>
        <Suspense fallback={<MapFiltersLoader />}>
          <MapFilters currentCategory={ category } />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <CategoryMapGrid category={ category } />
        </Suspense>
      </MapSection>
    </div>
  )
}
