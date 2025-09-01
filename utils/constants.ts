import type { Metadata } from "next"
import { Duration } from "effect"
import { Book, Brain, MapIcon } from "lucide-react"

// navigator.platform is deprecated and should be replaced with navigator.userAgentData.platform once stable
export const IS_MAC_OS =
	typeof window !== "undefined" && window.navigator.platform.startsWith("Mac")
export const IN_DEVELOPMENT = process.env.NODE_ENV === "development"
export const SITE_TITLE = "Call of Duty: Zombies Guides"
export const SITE_DESCRIPTION =
	"Detailed main and side quests step-by-step guides, fully interactive maps, a complete bestiary, and more to give you all the resources you'll need for zombies."
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
}
export const MAP_LIMIT = 12
/** 2 weeks in milliseconds */
export const MAX_NEW_TIME = Duration.toMillis("2 weeks")
/** 1 week in milliseconds */
export const MAX_QUEST_NEW_TIME = Duration.toMillis("1 week")
export const GLOBAL_OG_PROPS: Partial<Metadata> = {
	openGraph: {
		siteName: SITE_TITLE,
		locale: "en_US",
		type: "website",
		emails: ["codzombiesguidesteam@gmail.com"],
	},
}
export const CACHE_KEYS = {
	/** Cache key for all game data */
	games: {
		/** Cache key for all category data */
		all: "games",
	},
	maps: {
		/** Cache key for all map data */
		all: "maps",
	},
	mainQuests: {
		/** Cache key for all main quest data */
		all: "main-quests",
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
	weapons: {
		/** Cache key for all weapon data */
		all: "weapons",
	},
	ammoMods: {
		/** Cache key for all ammo mod data */
		all: "ammo-mods",
	},
	gobblegum: {
		/** Cache key for all gobblegum data */
		all: "gobblegum",
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
