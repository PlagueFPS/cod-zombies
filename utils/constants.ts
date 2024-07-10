import type { GameCategory } from "@/types/GameCategory"
import { getGameCategories } from "./contentful-utils"

export const SITE_TITLE = 'Call of Duty: Zombies'
export const SITE_DESCRIPTION = `Unlock the secrets of Call of Duty Zombies and 
explore our comprehensive guides to the most challenging and rewarding easter eggs
in the Call of Duty Zombies universe`
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

export const validateSearchParams = async (rawCategory: string | string[] | undefined) => {
  const gameCategories = await getGameCategories()
  let category: GameCategory | undefined

  gameCategories.forEach(game => {
    if (rawCategory === game.slug) return category = game.slug
  })

  return { category, gameCategories }
}