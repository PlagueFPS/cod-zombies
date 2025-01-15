import { getMapSearchData } from '@/data/maps'
import { getGames } from '@/data/games'
import { draftMode } from 'next/headers'
import { Combobox } from '@/components/ui/combobox'

interface IQuestFilters {
  currentFilter?: string
}

export default async function QuestFilters({ currentFilter }: IQuestFilters) {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const [maps, games] = await Promise.all([mapsPromise, gamesPromise])
  const mapFilters = maps.map(map => ({
    id: map.id,
    title: map.title,
    slug: map.slug,
    category: map.category
  }))
  const gameFilters = games.map(game => ({
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
