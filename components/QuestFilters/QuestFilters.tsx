import { getMapSearchData } from '@/data/maps'
import { getGames } from '@/data/games'
import { draftMode } from 'next/headers'
import { Combobox } from '../ui/combobox'

export default async function QuestFilters() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getMapSearchData(isEnabled)
  const gamesPromise = getGames(isEnabled)
  const [maps, games] = await Promise.all([mapsPromise, gamesPromise])
  const mapFilters = maps.map(map => ({
    id: map.id,
    title: map.title,
    slug: map.slug
  }))
  const gameFilters = games.map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <Combobox 
      filters={ [...mapFilters, ...gameFilters] } 
      maps={ maps } 
      games={ gameFilters } 
    />
  )
}
