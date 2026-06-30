import type { SortOption } from "@/components/client/grid-sort"
import type { MapKey } from "@/data/maps"
import type { ContentState, TimeRange } from "@/types/data"
import type { RelicsPaths } from "@/types/generated/content-paths.gen"
import type { RelicsImagePath } from "@/types/generated/image-paths.gen"
import { Option } from "effect"
import { resolveNewContentState } from "@/utils/content-state"
import { getAdjacentItems, sortDates } from "@/utils/shared-functions"

/** The three types of relics */
export type RelicType = "Grim" | "Sinister" | "Wicked"
/** The unique identifier for each relic */
export type RelicKey = Parameters<(typeof RELICS)["get"]>[0]

export interface Relic {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Relic"
	/** Unique identifier for the relic */
	readonly id: string
	/** The title of the relic */
	readonly title: string
	/** The state of the relic. A stored value of `"New"` is time-limited after `discoveredDate` (see `resolveNewContentState` in `@/utils/content-state`). */
	readonly state: Option.Option<ContentState>
	/** The type of the relic */
	readonly type: RelicType
	/** The image of the relic */
	readonly image: RelicsImagePath
	/** The description of the relic */
	readonly description: string
	/** The map where the relic can be obtained */
	readonly map: MapKey
	/**
	 * Discovery calendar day as an ISO 8601 date-only string (`YYYY-MM-DD`).
	 * Same calendar day: higher {@link RELICS} insertion index sorts first when descending.
	 */
	readonly discoveredDate: string
	/** The estimated min/max time to unlock */
	readonly estimatedTimeMins: TimeRange
	/** The content of the relic */
	readonly content: RelicsPaths
}

function withResolvedRelicState(relic: Relic): Relic {
	const nowMs = Date.now()
	return {
		...relic,
		state: resolveNewContentState(relic.state, relic.discoveredDate, nowMs),
	}
}

/**
 * Newest-first: {@link sortDates}, then higher {@link RELICS} insertion index when calendar days tie.
 */
export function compareRelicReleaseDescending(
	a: Pick<Relic, "id" | "discoveredDate">,
	b: Pick<Relic, "id" | "discoveredDate">,
): number {
	const byDate = sortDates(b.discoveredDate, a.discoveredDate)
	if (byDate !== 0) return byDate

	// Use inseration index as a tiebreaker (higher index = later insertion = newer Relic)
	return (
		RELIC_INSERATION_INDEX_BY_ID.get(b.id as RelicKey)! -
		RELIC_INSERATION_INDEX_BY_ID.get(a.id as RelicKey)!
	)
}

/**
 * Gets all relics sorted by discovered date in descending order
 */
export const getRelics = () =>
	[...RELICS.values()].map(withResolvedRelicState).sort(compareRelicReleaseDescending)

/**
 * Gets a specific relic by its key
 */
export const getRelicByKey = (key: RelicKey) =>
	Option.fromUndefinedOr(RELICS.get(key)).pipe(Option.map(withResolvedRelicState))

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

const RELICS = new Map([
	makeRelic("lawyers-pen", {
		title: "Lawyer's Pen",
		state: Option.none(),
		type: "Grim",
		image: "/relics/lawyers-pen-relic.webp",
		description: "Mimic props have infiltrated the map.",
		map: "ashes-of-the-damned",
		discoveredDate: "2025-11-16",
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
		discoveredDate: "2025-11-16",
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
		discoveredDate: "2025-11-19",
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
		discoveredDate: "2025-11-19",
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
		discoveredDate: "2026-01-14",
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
		discoveredDate: "2025-11-19",
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
		discoveredDate: "2025-11-21",
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
		discoveredDate: "2025-11-21",
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
		discoveredDate: "2025-11-20",
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
		discoveredDate: "2026-01-25",
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
		discoveredDate: "2025-12-07",
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
		discoveredDate: "2025-12-11",
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
		discoveredDate: "2026-01-30",
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
		discoveredDate: "2026-01-30",
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
		discoveredDate: "2025-12-11",
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
		discoveredDate: "2026-03-13",
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
		discoveredDate: "2026-03-15",
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
		discoveredDate: "2026-03-17",
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size and knowledge of the steps.",
		},
		content: "content/relics/mangler-helmet",
	}),
	makeRelic("agarthan-device", {
		title: "Agarthan Device",
		state: Option.some("New"),
		type: "Wicked",
		image: "/relics/agarthan-device-relic-v1.webp",
		description: "Each round, a different type of zombie will spawn",
		map: "totenreich",
		discoveredDate: "2026-05-01",
		estimatedTimeMins: {
			min: 15,
			max: 240,
			reason: "Time varies significantly based on RNG and round progression speed.",
		},
		content: "content/relics/agarthan-device",
	}),
	makeRelic("dancing-arnie", {
		title: "Dancing Arnie",
		state: Option.some("New"),
		type: "Sinister",
		image: "/relics/dancing-arnie-relic.webp",
		description: "All Perk-a-Cola machines have been cursed and now give out random Perk-a-Colas.",
		map: "totenreich",
		discoveredDate: "2026-05-02",
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies significantly based on party size.",
		},
		content: "content/relics/dancing-arnie",
	}),
	makeRelic("music-box", {
		title: "Music Box",
		state: Option.some("New"),
		type: "Wicked",
		image: "/relics/music-box-relic.webp",
		description: "Headshots only.",
		map: "totenreich",
		discoveredDate: "2026-05-03",
		estimatedTimeMins: {
			min: 90,
			max: 240,
			reason: "Time varies significantly based on party size and round progression speed.",
		},
		content: "content/relics/music-box",
	}),
	makeRelic("stuffed-elephant", {
		title: "Stuffed Elephant",
		state: Option.some("New"),
		type: "Sinister",
		image: "/relics/stuffed-elephant-relic.webp",
		description: "Increased Health Regen Delay.",
		map: "totenreich",
		discoveredDate: "2026-05-06",
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason: "Time varies significantly based on party size and round progression speed.",
		},
		content: "content/relics/stuffed-elephant",
	}),
	makeRelic("power-switch", {
		title: "Power Switch",
		state: Option.some("New"),
		type: "Grim",
		image: "/relics/power-switch-relic.webp",
		description: "Tactical and lethal equipment randomizes each round.",
		map: "totenreich",
		discoveredDate: "2026-05-09",
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on how quickly you open up the map.",
		},
		content: "content/relics/power-switch",
	}),
	makeRelic("gramaphone", {
		title: "Gramaphone",
		state: Option.some("New"),
		type: "Grim",
		image: "/relics/gramaphone-relic.webp",
		description: "Bullets deal increased damage but each shot consumes 2 bullets.",
		map: "kowakujo",
		discoveredDate: "2026-06-29",
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on how quickly you open up the map.",
		},
		content: "content/relics/gramaphone",
	}),
	makeRelic("film-reel", {
		title: "Film Reel",
		state: Option.some("New"),
		type: "Sinister",
		image: "/relics/agarthan-device-relic-v1.webp",
		description: "Player can only carry one Pack-a-Punch weapon.",
		map: "kowakujo",
		discoveredDate: "2026-06-29",
		estimatedTimeMins: {
			min: 20,
			max: 35,
			reason: "Time varies slightly based on how quickly you pack-a-punch your weapon.",
		},
		content: "content/relics/film-reel",
	}),
])

const RELIC_INSERATION_INDEX_BY_ID = new Map<RelicKey, number>(
	[...RELICS.keys()].map((id, i) => [id, i]),
)
