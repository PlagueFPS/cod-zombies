import { getMapSearchData } from '@/data/maps'
import { getGameSearchData } from '@/data/games'
import { draftMode } from 'next/headers'
import { Combobox } from '@/components/ui/combobox'
import { getQuestSearchData } from '@/data/sideQuests'

interface IQuestFilters {
  currentFilter?: string
}

export default async function QuestFilters({ currentFilter }: IQuestFilters) {
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
    category: map.category
  }))
  const gameFilters = games.filter(g => questGames.has(g.slug)).map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <Combobox 
      filters={ [...mapFilters, ...gameFilters] } 
      maps={ mapFilters } 
      games={ gameFilters }
      currentFilter={ currentFilter }
    />
  )
}
