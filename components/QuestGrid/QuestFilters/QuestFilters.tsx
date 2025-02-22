import { getMapSearchData } from '@/data/maps'
import { getGameSearchData } from '@/data/games'
import { draftMode } from 'next/headers'
import { getQuestSearchData } from '@/data/sideQuests'
import { Suspense } from 'react'
import QuestFiltersClient from './QuestFilters.client'
import QuestFilterLoader from '@/components/Loaders/QuestFilterLoader'

export default async function QuestFilters() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGameSearchData(isEnabled)
  const questsPromise = getQuestSearchData(isEnabled)
  const [maps, games, quests] = await Promise.all([mapsPromise, gamesPromise, questsPromise])
  const questMaps = new Set(quests.map(q => q.map.slug))
  const questGames = new Set(quests.map(q => q.game.slug))
  const mapFilters = maps.filter(m => questMaps.has(m.slug)).map(map => ({
    id: map.id,
    title: map.title,
    slug: map.slug,
  }))
  const gameFilters = games.filter(g => questGames.has(g.slug)).map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <Suspense fallback={<QuestFilterLoader />}>
      <QuestFiltersClient 
        games={ gameFilters }
        maps={ mapFilters }
      />
    </Suspense>
  )
}
