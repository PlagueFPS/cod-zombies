import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import GridSection from "@/components/GridSection/GridSection"
import MapGridLoader from "@/components/Loaders/MapGridLoader"
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader"
import QuestPaginationLoader from "@/components/Loaders/QuestPaginationLoader"
import QuestFilters from "@/components/QuestGrid/QuestFilters/QuestFilters"
import QuestGrid from "@/components/QuestGrid/QuestGrid"
import QuestPagination from "@/components/QuestGrid/QuestPagination/QuestPagination"
import { getMapBySlug } from "@/data/maps"
import { getQuestSearchData } from "@/data/sideQuests"
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
  const quests = await getQuestSearchData(false)
  return quests.map(q => ({
    game: q.game.slug,
    map: q.map.slug
  }))
}

export const generateMetadata = async ({ params }: ISideQuestMapPage): Promise<Metadata> => {
  const [{ map: slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const map = await getMapBySlug(isEnabled, slug)
  if (!map) notFound()
  const title = `${map.title} Side Quests`
  const description = `Explore our comprehensive guides to the hidden Side Quests and Easter Eggs beyond the Main Story in ${map.title}`
  return {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/side-quests/${map.game.slug}/${map.slug}`,
      images: {
        url: `https:${map.image.url}?w=1260&h=630&q=75&fm=jpg`,
        width: 1260,
        height: 630
      },
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function SideQuestMapPage({ searchParams, params }: ISideQuestMapPage) {
  const { map, game } = await params

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <Breadcrumbs 
          links={[
            { title: 'Side Quests', href: '/side-quests' },
            { title: capatilize(game), href: `/side-quests/${game}` },
            { title: capatilize(map), href: `/side-quests/${game}/${map}` }
          ]}
        />
      <GridSection title={ `${capatilize(map)} Side Quests` }>
        <Suspense fallback={<QuestFilterLoader text={ capatilize(map) } />}>
          <QuestFilters currentFilter={ map } />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <QuestGrid searchParams={ searchParams } category={ map } />
        </Suspense>
        <Suspense fallback={<QuestPaginationLoader map={ map } game={ game } />}>
          <QuestPagination searchParams={ searchParams } params={ params } />
        </Suspense>
      </GridSection>
    </div>
  )
}