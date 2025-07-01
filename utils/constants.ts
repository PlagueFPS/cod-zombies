import { Book, Brain, MapIcon } from "lucide-react"
import type { Metadata } from "next"

export const IN_DEVELOPMENT = process.env.NODE_ENV === "development"
export const SITE_TITLE = "Call of Duty: Zombies Guides"
export const SITE_DESCRIPTION =
	"Detailed COD Zombies main quest, side quest, and easter egg guides with easy step-by-step explanations to solve even the toughest quests."
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
export const MAP_LIMIT = 12
export const MAX_NEW_TIME = 14 * 24 * 60 * 60 * 1000 // 2 weeks in milliseconds
export const MAX_QUEST_NEW_TIME = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
export const GLOBAL_OG_PROPS = {
	openGraph: {
		siteName: SITE_TITLE,
		locale: "en_US",
		type: "website",
		emails: ["codzombiesguidesteam@gmail.com"],
	},
} satisfies Metadata
export const CACHE_KEYS = {
	/** Cache key for all game data */
	gameCategories: {
		/** Cache key for all category data */
		all: "game-categories",
	},
	featuredMaps: {
		/** Cache key for all map data */
		all: "featured-maps",
	},
	sideQuests: {
		/** Cache key for all side quests data */
		all: "side-quests",
	},
	zombies: {
		/** Cache key for all zombie data */
		all: "zombies",
	},
	legal: {
		/** Cache key for all legal data */
		all: "legal",
	},
} as const
export const ROUTES = [
	{
		id: "side-quests",
		title: "Side Quests",
		href: "/side-quests",
		icon: Book,
	},
	{
		id: "bestiary",
		title: "Bestiary",
		href: "/bestiary",
		icon: Brain,
	},
	{
		id: "maps",
		title: "Maps",
		href: "/maps",
		icon: MapIcon,
	},
] as const
export const PROTECTED_ROUTES = [
	{
		path: "/",
		method: "POST",
	},
	{
		path: "/side-quests",
		method: "POST",
	},
	{
		path: "/bestiary",
		method: "POST",
	},
	{
		path: "/maps",
		method: "POST",
	},
	{
		path: "/privacy-policy",
		method: "POST",
	},
] as const
