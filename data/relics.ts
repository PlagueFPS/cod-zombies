import type { ContentState } from "@/types/data"
import type { RelicsImagePath } from "@/types/generated/image-paths.gen"
import { Effect } from "effect"
import { getMapByKey, type Maps } from "@/data/maps"
import { sortReleaseDateDesc } from "@/utils/functions.client"

/** The three types of relics */
export type RelicType = "Grim" | "Sinister" | "Wicked"
/** The unique identifier for each relic */
export type RelicKey = keyof typeof relicRegistry

export interface Relic {
	/** Unique identifier for the relic */
	id: string
	/** The state of the relic */
	state: ContentState | null
	/** The type of the relic */
	type: RelicType
	/** The image of the relic */
	image: RelicsImagePath
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

const relicRegistry = {
	lawyersPen: {
		id: "lawyers-pen",
		state: null,
		type: "Grim",
		image: "/relics/lawyers-pen-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/lawyers-pen.mdx")),
	},
	dragonWings: {
		id: "dragon-wings",
		state: null,
		type: "Grim",
		image: "/relics/dragon-wings-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/dragon-wings.mdx")),
	},
	teddyBear: {
		id: "teddy-bear",
		state: null,
		type: "Grim",
		image: "/relics/teddy-bear-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/teddy-bear.mdx")),
	},
	vrilSphere: {
		id: "vril-sphere",
		state: null,
		type: "Sinister",
		image: "/relics/vril-sphere-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/vril-sphere.mdx")),
	},
	focusingStone: {
		id: "focusing-stone",
		state: null,
		type: "Sinister",
		image: "/relics/focusing-stone-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/focusing-stone.mdx")),
	},
	bus: {
		id: "bus",
		state: null,
		type: "Wicked",
		image: "/relics/bus-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/bus.mdx")),
	},
	dragon: {
		id: "dragon",
		state: null,
		type: "Wicked",
		image: "/relics/dragon-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/dragon.mdx")),
	},
	bloodVials: {
		id: "blood-vials",
		state: null,
		type: "Wicked",
		image: "/relics/blood-vials-relic.webp",
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/relics/blood-vials.mdx")),
	},
	seed: {
		id: "seed",
		state: null,
		type: "Grim",
		image: "/relics/seed-relic.webp",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/seed.mdx")),
	},
	spiderFang: {
		id: "spider-fang",
		state: null,
		type: "Sinister",
		image: "/relics/spider-fang-relic.webp",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/spider-fang.mdx")),
	},
	civilProtectorHead: {
		id: "civil-protector-head",
		state: null,
		type: "Wicked",
		image: "/relics/civil-protector-head-relic.webp",
		map: getMapByKey("astraMalorum"),
		content: Effect.promise(() => import("@/content/relics/civil-protector-head.mdx")),
	},
} as const satisfies Record<string, Relic>

const relicMap = new Map<string, Relic>()
const relics = Object.values(relicRegistry).sort((a, b) =>
	sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate),
)

for (const relic of relics) {
	relicMap.set(relic.id, relic)
}
