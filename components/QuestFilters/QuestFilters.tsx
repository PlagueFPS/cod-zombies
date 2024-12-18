import { getFeaturedMapFilters } from '@/data/featuredMaps'
import { getGameCategories } from '@/data/gameCategory'
import { draftMode } from 'next/headers'
import { Combobox } from '../ui/combobox'

export default async function QuestFilters() {
  const { isEnabled } = await draftMode()
  const mapsPromise = getFeaturedMapFilters(isEnabled)
  const gamesPromise = getGameCategories(isEnabled)
  const [maps, games] = await Promise.all([mapsPromise, gamesPromise])
  const gameFilters = games.map(game => ({
    id: game.id,
    title: game.title,
    slug: game.slug
  }))

  return (
    <Combobox 
      filters={ [...maps, ...gameFilters] } 
      maps={ maps } 
      games={ gameFilters } 
    />
  )
}
