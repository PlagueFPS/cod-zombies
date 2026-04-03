import type { SortOption } from "@/components/client/grid-sort"
import type { MapKey } from "@/data/maps"
import type { ContentState, TimeRange } from "@/types/data"
import type { RelicsPaths } from "@/types/generated/content-paths.gen"
import type { RelicsImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"
import { getAdjacentItems, sortReleaseDate } from "@/utils/shared-functions"

/** The three types of relics */
export type RelicType = "Grim" | "Sinister" | "Wicked"
/** The unique identifier for each relic */
export type RelicKey = HashMap.HashMap.Key<typeof relicHashMap>

export interface Relic {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Relic"
	/** Unique identifier for the relic */
	readonly id: string
	/** The title of the relic */
	readonly title: string
	/** The state of the relic */
	readonly state: Option.Option<ContentState>
	/** The type of the relic */
	readonly type: RelicType
	/** The image of the relic */
	readonly image: RelicsImagePath
	/** The description of the relic */
	readonly description: string
	/** The map where the relic can be obtained */
	readonly map: MapKey
	/** The date when the relic was discovered */
	readonly discoveredDate: Date
	/** The estimated min/max time to unlock */
	readonly estimatedTimeMins: TimeRange
	/** The content of the relic */
	readonly content: RelicsPaths
}

/**
 * Gets all relics sorted by discovered date in descending order
 */
export const getRelics = () =>
	HashMap.toValues(relicHashMap).sort((a, b) => sortReleaseDate(b.discoveredDate, a.discoveredDate))

/**
 * Gets a specific relic by its key
 */
export const getRelicByKey = (key: RelicKey) => HashMap.get(relicHashMap, key)

/**
 * Gets the adjacent relics of a given relic.
 * @param current The current relic key.
 */
export const getAdjacentRelics = (current: RelicKey) => {
	return getAdjacentItems(getRelics(), current)
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

const makeRelic = <T extends string>(
	identifier: T,
	relic: Omit<Relic, "_tag" | "id">,
): [T, Relic] => [
	identifier,
	{
		_tag: "Relic" as const,
		id: identifier,
		...relic,
	},
]

const relicHashMap = HashMap.make(
	makeRelic("lawyers-pen", {
		title: "Lawyer's Pen",
		state: Option.none(),
		type: "Grim",
		image: "/relics/lawyers-pen-relic.webp",
		description: "Mimic props have infiltrated the map.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 16, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/lawyers-pen",
	}),
	makeRelic("dragon-wings", {
		title: "Dragon Wings",
		state: Option.none(),
		type: "Grim",
		image: "/relics/dragon-wings-relic.webp",
		description: "Normal Power-Up spawns are disabled.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 16, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/dragon-wings",
	}),
	makeRelic("teddy-bear", {
		title: "Teddy Bear",
		state: Option.none(),
		type: "Grim",
		image: "/relics/teddy-bear-relic.webp",
		description: "Round start delay is cut down by 75%.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 19, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 45,
			reason: "Time varies slightly based on party size, gobblegum use, and/or selected augments.",
		},
		content: "content/relics/teddy-bear",
	}),
	makeRelic("vril-sphere", {
		title: "Vril Sphere",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/vril-sphere-relic.webp",
		description: "Players can only carry 4 Perk-a-Colas.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 19, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/vril-sphere",
	}),
	makeRelic("samanthas-drawing", {
		title: "Samantha's Drawing",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/samanthas-drawing-relic.webp",
		description:
			"Every weapon the player has will swap each round, but retain the Pack-a-Punch and rarity level.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("January 14, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/samanthas-drawing",
	}),
	makeRelic("focusing-stone", {
		title: "Focusing Stone",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/focusing-stone-relic.webp",
		description: "No Self-Revive kits.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 19, 2025 2:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/focusing-stone",
	}),
	makeRelic("bus", {
		title: "Bus",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/bus-relic.webp",
		description: "Enemy health regenerates.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 21, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		content: "content/relics/bus",
	}),
	makeRelic("dragon", {
		title: "Dragon",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/dragon-relic.webp",
		description: "All Ammo Crates are disabled.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 21, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason:
				"Time varies slightly based on party size, gobblegum use, and knowledge of the main quest steps.",
		},
		content: "content/relics/dragon",
	}),
	makeRelic("blood-vials", {
		title: "Blood Vials",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/blood-vials-relic.webp",
		description: "All Augments are turned off.",
		map: "ashes-of-the-damned",
		discoveredDate: new Date("November 20, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies slightly based on party size, and gobblegum use.",
		},
		content: "content/relics/blood-vials",
	}),
	makeRelic("gong", {
		title: "Gong",
		state: Option.none(),
		type: "Grim",
		image: "/relics/gong-relic.webp",
		description: "Field Upgrade starts charged, but can only be charged by Full Power.",
		map: "astra-malorum",
		discoveredDate: new Date("January 25, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 60,
			reason: "Time varies slightly based on party size, and knowledge of the steps.",
		},
		content: "content/relics/gong",
	}),
	makeRelic("seed", {
		title: "Seed",
		state: Option.none(),
		type: "Grim",
		image: "/relics/seed-relic.webp",
		description: "Mystery Box is disabled.",
		map: "astra-malorum",
		discoveredDate: new Date("December 7, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 25,
			max: 60,
			reason: "Time varies slightly based on party size, and knowledge of the steps.",
		},
		content: "content/relics/seed",
	}),
	makeRelic("spider-fang", {
		title: "Spider Fang",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/spider-fang-relic.webp",
		description: "Perk costs at machines never decrease.",
		map: "astra-malorum",
		discoveredDate: new Date("December 11, 2025 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies significantly based on wisp tea luck, augments, and party size.",
		},
		content: "content/relics/spider-fang",
	}),
	makeRelic("matroyshka-dolls", {
		title: "Matroyshka Dolls",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/matroyshka-dolls-relic.webp",
		description: "Salvage drop rate halved.",
		map: "astra-malorum",
		discoveredDate: new Date("January 30, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies slightly based on party size and knowledge of the main quest steps.",
		},
		content: "content/relics/matroyshka-dolls",
	}),
	makeRelic("golden-spork", {
		title: "Golden Spork",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/golden-spork-relic.webp",
		description: "Enemies deal double damage.",
		map: "astra-malorum",
		discoveredDate: new Date("January 30, 2026 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason:
				"Time varies significantly based on party size, and knowledge of the main quest steps.",
		},
		content: "content/relics/golden-spork",
	}),
	makeRelic("civil-protector-head", {
		title: "Civil Protector Head",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/civil-protector-head-relic.webp",
		description: "Every 100 kills, you lose a perk.",
		map: "astra-malorum",
		discoveredDate: new Date("December 11, 2025 1:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size, and knowledge of the steps.",
		},
		content: "content/relics/civil-protector-head",
	}),
	makeRelic("rocket", {
		title: "Rocket",
		state: Option.none(),
		type: "Grim",
		image: "/relics/rocket-relic-v1.webp",
		description: "No Score Streaks.",
		map: "paradox-junction",
		discoveredDate: new Date("March 13, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 20,
			max: 40,
			reason: "Time varies slightly based on knowledge of the steps.",
		},
		content: "content/relics/rocket",
	}),
	makeRelic("summoning-key", {
		title: "Summoning Key",
		state: Option.none(),
		type: "Sinister",
		image: "/relics/summoning-key-relic-v2.webp",
		description: "Zombies explode on death, dealing damage to nearby players.",
		map: "paradox-junction",
		discoveredDate: new Date("March 15, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason: "Time varies slightly based on knowledge of the steps.",
		},
		content: "content/relics/summoning-key",
	}),
	makeRelic("mangler-helmet", {
		title: "Mangler Helmet",
		state: Option.none(),
		type: "Wicked",
		image: "/relics/mangler-helmet-relic-v1.webp",
		description: "No Arsenal.",
		map: "paradox-junction",
		discoveredDate: new Date("March 17, 2026 12:00 AM"),
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size and knowledge of the steps.",
		},
		content: "content/relics/mangler-helmet",
	}),
)
