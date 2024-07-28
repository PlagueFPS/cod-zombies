import { getGameCategories } from "@/data/data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { Suspense } from "react"
import MapGridLoader from "@/components/Loaders/MapGridLoader"
import MapFilters from "@/components/MapGrid/MapFilters/MapFilters"
import MapGrid from "@/components/MapGrid/MapGrid"
import TempButton from "@/components/TempButton"

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
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock the Secrets of Call of Duty: <span className="text-primary">Zombies</span>
        </h2>
        <p className="text-foreground/90 text-sm md:text-base lg:text-lg">
          Explore our comprehensive guides to the most challenging and rewarding main quests in { category.title }
        </p>
        { process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && <TempButton /> }
      </section>
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">Featured Maps</h2>
        <MapFilters currentCategory={ category.slug } gameCategories={ categories } />
        <Suspense fallback={<MapGridLoader />}>
          <MapGrid category={ category.slug } />
        </Suspense>
      </section>
    </div>
  )
}
