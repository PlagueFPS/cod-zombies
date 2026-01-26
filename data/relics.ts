import type { ContentState } from "@/types/data"
import type { RelicsImagePath } from "@/types/generated/image-paths.gen"
import { Effect } from "effect"
import { getMapByKey, type Maps } from "@/data/maps"
import { sortReleaseDateAsc, sortRelicTypes } from "@/utils/functions.client"
import { getAdjacentItems } from "./utils"

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
	image: RelicsImagePath
	/** The description of the relic */
	description: string
	/** The map where the relic can be obtained */
	map: Maps
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
	return getAdjacentItems(relics, id)
}

const relicRegistry = {
	lawyersPen: {
		id: "lawyers-pen",
		title: "Lawyer's Pen",
		state: null,
		type: "Grim",
		image: "/relics/lawyers-pen-relic.webp",
		description: "Mimic props have infiltrated the map.",
		map: getMapByKey("ashesOfTheDamned"),
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
		content: Effect.promise(() => import("@/content/relics/blood-vials.mdx")),
	},
	seed: {
		id: "seed",
		title: "Seed",
		state: null,
		type: "Grim",
		image: "/relics/seed-relic.webp",
		description: "Mystery Box is disabled.",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/seed.mdx")),
	},
	gong: {
		id: "gong",
		title: "Gong",
		state: "New",
		type: "Grim",
		image: "/relics/gong-relic.webp",
		description: "Field Upgrade starts charged, but can only be charged by Full Power.",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/gong.mdx")),
	},
	spiderFang: {
		id: "spider-fang",
		title: "Spider Fang",
		state: null,
		type: "Sinister",
		image: "/relics/spider-fang-relic.webp",
		description: "Perk costs at machines never decrease.",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/spider-fang.mdx")),
	},
	civilProtectorHead: {
		id: "civil-protector-head",
		title: "Civil Protector Head",
		state: null,
		type: "Wicked",
		image: "/relics/civil-protector-head-relic.webp",
		description: "Every 100 kills, you lose a perk.",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/civil-protector-head.mdx")),
	},
} as const satisfies Record<string, Relic>

const relicMap = new Map<string, Relic>()
const relics = Object.values(relicRegistry).sort((a, b) => {
	const typeComparison = sortRelicTypes(a.type, b.type)
	if (typeComparison !== 0) return typeComparison
	return sortReleaseDateAsc(a.map.releaseDate, b.map.releaseDate)
})

for (const relic of relics) {
	relicMap.set(relic.id, relic)
}
