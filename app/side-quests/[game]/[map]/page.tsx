import GridSection from "@/components/GridSection/GridSection"
import MapGridLoader from "@/components/Loaders/MapGridLoader"
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader"
import QuestFilters from "@/components/QuestFilters/QuestFilters"
import QuestGrid from "@/components/QuestGrid/QuestGrid"
import { getMapBySlug, getMapSearchData } from "@/data/maps"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { capatilize } from "@/utils/functions"
import { SearchParams } from "@/utils/validationSchemas"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface ISideQuestMapPage {
  searchParams: Promise<SearchParams>
  params: Promise<{
    game: string,
    map: string
  }>
}

export const generateStaticParams = async () => {
  const maps = await getMapSearchData(false)
  return maps.map(m => ({
    game: m.category.slug,
    map: m.slug
  }))
}

export const generateMetadata = async ({ params }: ISideQuestMapPage): Promise<Metadata> => {
  const [{ map: slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const map = await getMapBySlug(isEnabled, slug)
  if (!map) notFound()
  const description = `Explore our comprehensive guides to the hidden Side Quests beyond the Main Story in ${map.title}`
  return {
    title: map.title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title: map.title,
      description,
      url: `/side-quests/${map.category.slug}/${map.slug}`,
      images: {
        url: `https:${map.image.url}?q=75&fm=jpg`,
        width: map.image.width,
        height: map.image.height
      },
    },
    twitter: {
      title: map.title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function SideQuestMapPage({ searchParams, params }: ISideQuestMapPage) {
  const { map } = await params

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <GridSection title={ `${capatilize(map)} Side Quests` }>
        <Suspense fallback={<QuestFilterLoader />}>
          <QuestFilters currentFilter={ map } />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <QuestGrid searchParams={ searchParams } category={ map } />
        </Suspense>
      </GridSection>
    </div>
  )
}