import type { Metadata } from "next"

export const IN_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const SITE_TITLE = 'Call of Duty: Zombies Guides'
export const SITE_DESCRIPTION = "Detailed COD Zombies main quest, side quest, and easter egg guides with easy step-by-step explanations to solve even the toughest quests."
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
export const MAP_LIMIT = 12
export const MAX_NEW_TIME = 14 * 24 * 60 * 60 * 1000 // 2 weeks in milliseconds
export const MAX_QUEST_NEW_TIME = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
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
  },
  FEATURED_MAPS: {
    /** Cache key for all map data */
    ALL: "featured-maps",
  },
  SIDE_QUESTS: {
    /** Cache key for all side quests data */
    ALL: 'side-quests'
  },
  ZOMBIES: {
    /** Cache key for all zombie data */
    ALL: 'zombies'
  },
  LEGAL: {
    /** Cache key for all legal data */
    ALL: 'legal',
    /** Cache key for privacy-policy data */
    POLICY: 'privacy-policy',
  }
} as const