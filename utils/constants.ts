import type { Metadata } from "next"

export const SITE_TITLE = 'Call of Duty: Zombies Guides'
export const SITE_DESCRIPTION = "Unlock the secrets of Call of Duty: Zombies and explore our comprehensive guides to the most challenging and rewarding main quests in the Call of Duty: Zombies universe"
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
export const MAP_LIMIT = 12
export const GLOBAL_OG_PROPS = {
  openGraph: {
    siteName: SITE_TITLE,
    locale: 'en_US',
    type: 'website',
  }
} satisfies Metadata