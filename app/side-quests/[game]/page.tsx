import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import GridSection from "@/components/GridSection/GridSection"
import MapGridLoader from "@/components/Loaders/MapGridLoader"
import QuestFilterLoader from "@/components/Loaders/QuestFilterLoader"
import QuestPaginationLoader from "@/components/Loaders/QuestPaginationLoader"
import QuestFilters from "@/components/QuestGrid/QuestFilters/QuestFilters"
import QuestGrid from "@/components/QuestGrid/QuestGrid"
import QuestPagination from "@/components/QuestGrid/QuestPagination/QuestPagination"
import { getGameBySlug, getGames } from "@/data/games"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { capatilize } from "@/utils/functions"
import { SearchParams } from "@/utils/validationSchemas"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface ISideQuestCategoryPage {
  searchParams: Promise<SearchParams>
  params: Promise<{
    game: string
  }>
}

export const generateStaticParams = async () => {
  const games = await getGames(false)
  return games.map(g => ({
    game: g.slug
  }))
}

export const generateMetadata = async ({ params }: ISideQuestCategoryPage): Promise<Metadata> => {
  const [{ game: slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  const game = await getGameBySlug(isEnabled, slug)
  if (!game) notFound()
  const title = `${game.title} Side Quests`
  const description = `Explore our comprehensive guides to the hidden Side Quests and Easter Eggs beyond the Main Story in ${game.title}`
  return {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/side-quests/${game.slug}`,
      images: {
        url: `https:${game.image.url}?w=1260&h=630&q=75&fm=jpg`,
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

export default async function SideQuestCategoryPage({ searchParams, params }: ISideQuestCategoryPage) {
  const { game } = await params

  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <Breadcrumbs 
          links={[
            { title: 'Side Quests', href: '/side-quests' },
            { title: capatilize(game), href: `/side-quests/${game}` }
          ]}
        />
      <GridSection title={ `${capatilize(game)} Side Quests` }>
        <Suspense fallback={<QuestFilterLoader text={ capatilize(game) } />}>
          <QuestFilters currentFilter={ game } />
        </Suspense>
        <Suspense fallback={<MapGridLoader />}>
          <QuestGrid searchParams={ searchParams } category={ game } />
        </Suspense>
        <Suspense fallback={<QuestPaginationLoader game={ game } />}>
          <QuestPagination searchParams={ searchParams } params={ params } />
        </Suspense>
      </GridSection>
    </div>
  )
}