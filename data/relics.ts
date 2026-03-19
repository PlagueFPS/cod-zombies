import type { SortOption } from "@/components/client/grid-sort"
import type { ContentState, TimeRange } from "@/types/data"
import type { RelicsImagePath, RootImagePath } from "@/types/generated/image-paths.gen"
import { Effect } from "effect"
import { getMapByKey, type Maps } from "@/data/maps"
import { getAdjacentItems } from "@/utils/shared-functions"

/** The three types of relics */
export type RelicType = "Grim" | "Sinister" | "Wicked"
/** The unique identifier for each relic */
export type RelicKey = keyof typeof relicRegistry

export interface Relic {
	/** Unique identifier for the relic */
	id: string
	/** The title of the relic */
	title: string
	/** The state of the relic */
	state: ContentState | null
	/** The type of the relic */
	type: RelicType
	/** The image of the relic */
	image: RelicsImagePath | RootImagePath
	/** The description of the relic */
	description: string
	/** The map where the relic can be obtained */
	map: Maps
	/** The date when the relic was discovered */
	discoveredDate: Date
	/** The estimated min/max time to unlock */
	estimatedTimeMins: TimeRange
	/** The content of the relic */
	content: Effect.Effect<typeof import("*.mdx"), never, never>
}

/**
 * Gets all relics.
 * @returns An array of all relics.
 */
export const getRelics = (): Relic[] => relics

/**
 * Gets a specific relic by its key
 * @param key The key of the relic
 * @returns The relic object
 */
export const getRelicByKey = (key: RelicKey): Relic => relicRegistry[key]

/**
 * Gets a relic by its id.
 * @param id The id of the relic.
 * @returns The relic object if it exists
 */
export const getRelicById = (id: string) => relicMap.get(id)

/**
 * Gets the adjacent relics of a given relic.
 * @param id The id of the relic.
 * @returns previous and next relics.
 */
export const getAdjacentRelics = (id: string) => {
	const sortedRelics = [...relics].reverse()
	return getAdjacentItems(sortedRelics, id)
}

/**
 * Gets the sort options for relics.
 * @returns An array of sort options.
 */
export const getRelicSortOptions = (): SortOption[] => [
	{ value: "discovered-desc", label: "Newest Discovered" },
	{ value: "discovered-asc", label: "Oldest Discovered" },
	{ value: "type-asc", label: "Type: Grim to Wicked" },
	{ value: "type-desc", label: "Type: Wicked to Grim" },
	{ value: "time-asc", label: "Unlock Time: Shortest to Longest" },
	{ value: "time-desc", label: "Unlock Time: Longest to Shortest" },
]

const relicRegistry = {
	lawyersPen: {
		id: "lawyers-pen",
		title: "Lawyer's Pen",
		state: null,
		type: "Grim",
		image: "/relics/lawyers-pen-relic.webp",
		description: "Mimic props have infiltrated the map.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 16, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/lawyers-pen.mdx")),
	},
	dragonWings: {
		id: "dragon-wings",
		title: "Dragon Wings",
		state: null,
		type: "Grim",
		image: "/relics/dragon-wings-relic.webp",
		description: "Normal Power-Up spawns are disabled.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 16, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/dragon-wings.mdx")),
	},
	teddyBear: {
		id: "teddy-bear",
		title: "Teddy Bear",
		state: null,
		type: "Grim",
		image: "/relics/teddy-bear-relic.webp",
		description: "Round start delay is cut down by 75%.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 19, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 45,
			reason: "Time varies slightly based on party size, gobblegum use, and/or selected augments.",
		},
		content: Effect.promise(() => import("@/content/relics/teddy-bear.mdx")),
	},
	vrilSphere: {
		id: "vril-sphere",
		title: "Vril Sphere",
		state: null,
		type: "Sinister",
		image: "/relics/vril-sphere-relic.webp",
		description: "Players can only carry 4 Perk-a-Colas.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 19, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/vril-sphere.mdx")),
	},
	samanthasDrawing: {
		id: "samanthas-drawing",
		title: "Samantha's Drawing",
		state: null,
		type: "Sinister",
		image: "/relics/samanthas-drawing-relic.webp",
		description:
			"Every weapon the player has will swap each round, but retain the Pack-a-Punch and rarity level.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("January 14, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/samanthas-drawing.mdx")),
	},
	focusingStone: {
		id: "focusing-stone",
		title: "Focusing Stone",
		state: null,
		type: "Sinister",
		image: "/relics/focusing-stone-relic.webp",
		description: "No Self-Revive kits.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 19, 2025 2:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/focusing-stone.mdx")),
	},
	bus: {
		id: "bus",
		title: "Bus",
		state: null,
		type: "Wicked",
		image: "/relics/bus-relic.webp",
		description: "Enemy health regenerates.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 21, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/bus.mdx")),
	},
	dragon: {
		id: "dragon",
		title: "Dragon",
		state: null,
		type: "Wicked",
		image: "/relics/dragon-relic.webp",
		description: "All Ammo Crates are disabled.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 21, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason:
				"Time varies slightly based on party size, gobblegum use, and knowledge of the main quest steps.",
		},
		content: Effect.promise(() => import("@/content/relics/dragon.mdx")),
	},
	bloodVials: {
		id: "blood-vials",
		title: "Blood Vials",
		state: null,
		type: "Wicked",
		image: "/relics/blood-vials-relic.webp",
		description: "All Augments are turned off.",
		map: getMapByKey("ashesOfTheDamned"),
		discoveredDate: new Date("November 20, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies slightly based on party size, and gobblegum use.",
		},
		content: Effect.promise(() => import("@/content/relics/blood-vials.mdx")),
	},
	gong: {
		id: "gong",
		title: "Gong",
		state: null,
		type: "Grim",
		image: "/relics/gong-relic.webp",
		description: "Field Upgrade starts charged, but can only be charged by Full Power.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("January 25, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 60,
			reason: "Time varies slightly based on party size, and knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/gong.mdx")),
	},
	seed: {
		id: "seed",
		title: "Seed",
		state: null,
		type: "Grim",
		image: "/relics/seed-relic.webp",
		description: "Mystery Box is disabled.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("December 7, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 60,
			reason: "Time varies slightly based on party size, and knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/seed.mdx")),
	},
	spiderFang: {
		id: "spider-fang",
		title: "Spider Fang",
		state: null,
		type: "Sinister",
		image: "/relics/spider-fang-relic.webp",
		description: "Perk costs at machines never decrease.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("December 11, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies significantly based on wisp tea luck, augments, and party size.",
		},
		content: Effect.promise(() => import("@/content/relics/spider-fang.mdx")),
	},
	matroyshkaDolls: {
		id: "matroyshka-dolls",
		title: "Matroyshka Dolls",
		state: null,
		type: "Sinister",
		image: "/relics/matroyshka-dolls-relic.webp",
		description: "Salvage drop rate halved.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("January 30, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and knowledge of the main quest steps.",
		},
		content: Effect.promise(() => import("@/content/relics/matroyshka-dolls.mdx")),
	},
	goldenSpork: {
		id: "golden-spork",
		title: "Golden Spork",
		state: null,
		type: "Wicked",
		image: "/relics/golden-spork-relic.webp",
		description: "Enemies deal double damage.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("January 30, 2026 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason:
				"Time varies significantly based on party size, and knowledge of the main quest steps.",
		},
		content: Effect.promise(() => import("@/content/relics/golden-spork.mdx")),
	},
	civilProtectorHead: {
		id: "civil-protector-head",
		title: "Civil Protector Head",
		state: null,
		type: "Wicked",
		image: "/relics/civil-protector-head-relic.webp",
		description: "Every 100 kills, you lose a perk.",
		map: getMapByKey("astraMalorum"),
		discoveredDate: new Date("December 11, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size, and knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/civil-protector-head.mdx")),
	},
	rocket: {
		id: "rocket",
		title: "Rocket",
		state: "New",
		type: "Grim",
		// TODO: update with rocket relic image once obtained
		image: "/relics/rocket-relic-placeholder.webp",
		description: "No Score Streaks.",
		map: getMapByKey("paradoxJunction"),
		discoveredDate: new Date("March 13, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 20,
			max: 40,
			reason: "Time varies slightly based on knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/rocket.mdx")),
	},
	summoningKey: {
		id: "summoning-key",
		title: "Summoning Key",
		state: "New",
		type: "Sinister",
		image: "/relics/summoning-key-relic.webp",
		description: "Zombies explode on death, dealing damage to nearby players.",
		map: getMapByKey("paradoxJunction"),
		discoveredDate: new Date("March 15, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason: "Time varies slightly based on knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/summoning-key.mdx")),
	},
	manglerHelmet: {
		id: "mangler-helmet",
		title: "Mangler Helmet",
		state: "New",
		type: "Wicked",
		image: "/relics/mangler-helmet-relic.webp",
		description: "No Arsenal.",
		map: getMapByKey("paradoxJunction"),
		discoveredDate: new Date("March 17, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size and knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/relics/mangler-helmet.mdx")),
	},
} as const satisfies Record<string, Relic>

const relicMap = new Map<string, Relic>()
const relics = Object.values(relicRegistry)

for (const relic of relics) {
	relicMap.set(relic.id, relic)
}
