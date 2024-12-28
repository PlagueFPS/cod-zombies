import type { Metadata } from "next"

export const IN_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const SITE_TITLE = 'Call of Duty: Zombies Guides'
export const SITE_DESCRIPTION = "Unlock the secrets of Call of Duty: Zombies and explore our comprehensive guides to the most challenging and rewarding Main Quests and Easter Eggs in Call of Duty: Zombies."
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
export const MAP_LIMIT = 12
export const MAX_NEW_TIME = 14 * 24 * 60 * 60 * 1000 // 2 weeks in milliseconds
export const GLOBAL_OG_PROPS = {
  openGraph: {
    siteName: SITE_TITLE,
    locale: 'en_US',
    type: 'website',
  }
} satisfies Metadata
export const CACHE_KEYS = {
  /** Cache key for all game data */
  GAME_CATEGORIES: { 
    /** Cache key for all category data */
    ALL: 'game-categories',
    /** Cache key for all category ids */
    IDS: 'game-categories-ids'
  },
  FEATURED_MAPS: {
    /** Cache key for all map data */
    ALL: "featured-maps",
    /** Cache key for a specific pagination page */
    PAGINATION: (page: number) => `featured-maps-pagination-${page}`,
    /** Cache key for all new map ids */
    IDS: "featured-maps-ids"
  },
  SIDE_QUESTS: {
    /** Cache key for all side quests data */
    ALL: 'side-quests'
  }
} as const
export const MAP_ORDER: { [x: string]: number } = {
  "ascension": 0,
  "call-of-the-dead": 1,
  "shangri-la": 2,
  "moon": 3,
  "tranzit": 4,
  "die-rise": 5,
  "mob-of-the-dead": 6,
  "buried": 7,
  "origins": 8
}