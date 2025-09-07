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
		all: "games:all",
		/** Cache key for a specific game by ID */
		byId: (id: string) => `games:${String(id).trim()}` as const,
	},
	maps: {
		/** Cache key for all map data */
		all: "maps:all",
		/** Cache key for a specific map by ID */
		byId: (id: string) => `maps:${String(id).trim()}` as const,
	},
	mainQuests: {
		/** Cache key for all main quest data */
		all: "main-quests:all",
		/** Cache key for a specific main quest by ID */
		byId: (id: string) => `main-quests:${String(id).trim()}` as const,
	},
	sideQuests: {
		/** Cache key for all side quests data */
		all: "side-quests:all",
		/** Cache key for a specific side quest by ID */
		byId: (id: string) => `side-quests:${String(id).trim()}` as const,
	},
	zombies: {
		/** Cache key for all zombie data */
		all: "zombies:all",
		/** Cache key for a specific zombie by ID */
		byId: (id: string) => `zombies:${String(id).trim()}` as const,
	},
	legal: {
		/** Cache key for all legal data */
		all: "legal:all",
		/** Cache key for a specific legal by ID */
		byId: (id: string) => `legal:${String(id).trim()}` as const,
	},
	ammoMods: {
		/** Cache key for all ammo mod data */
		all: "ammo-mods:all",
		/** Cache key for a specific ammo mod by ID */
		byId: (id: string) => `ammo-mods:${String(id).trim()}` as const,
	},
	gobblegum: {
		/** Cache key for all gobblegum data */
		all: "gobblegum:all",
		/** Cache key for a specific gobblegum by ID */
		byId: (id: string) => `gobblegum:${String(id).trim()}` as const,
	},
	perks: {
		/** Cache key for all perk data */
		all: "perks:all",
		/** Cache key for a specific perk by ID */
		byId: (id: string) => `perks:${String(id).trim()}` as const,
	},
	weaponBuilds: {
		/** Cache key for all weapon build data */
		all: "weapon-builds:all",
		/** Cache key for a specific weapon build by ID */
		byId: (id: string) => `weapon-builds:${String(id).trim()}` as const,
	},
	fieldUpgrades: {
		/** Cache key for all field upgrade data */
		all: "field-upgrades:all",
		/** Cache key for a specific field upgrade by ID */
		byId: (id: string) => `field-upgrades:${String(id).trim()}` as const,
	},
	augments: {
		/** Cache key for all augment data */
		all: "augments:all",
		/** Cache key for a specific augment by ID */
		byId: (id: string) => `augments:${String(id).trim()}` as const,
	},
	media: {
		/** Cache key for all media data */
		all: "media:all",
		/** Cache key for a specific media by ID */
		byId: (id: string) => `media:${String(id).trim()}` as const,
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
