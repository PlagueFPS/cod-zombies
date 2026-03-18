import type { SortOption } from "@/components/client/grid-sort"
import type { ContentState, TimeRange } from "@/types/data"
import { Effect, Option } from "effect"
import { getMapByKey, type Maps } from "@/data/maps"
import { getAdjacentItems, sortReleaseDateDesc } from "@/utils/shared-functions"

/** Union of all main quest difficulties */
export type MainQuestDifficulty = "Easy" | "Medium" | "Hard"

export interface MainQuest {
	/** Internal tag to discriminate against for type-narrowing */
	_tag: "MainQuest"
	/** The unique identifier of the main quest */
	id: string
	/** The state of the main quest */
	state: Option.Option<ContentState>
	/** The difficulty of the main quest */
	difficulty: Option.Option<MainQuestDifficulty>
	/** The map of the main quest */
	map: Maps
	/** The estimated min/max time to completion */
	estimatedTimeMins: TimeRange
	/** The content of the main quest */
	content: Effect.Effect<typeof import("*.mdx"), never, never>
}

/** Union type of all main quest keys */
export type MainQuestKey = keyof typeof mainQuestRegistry

/**
 * Gets all main quests.
 * @returns An array of main quests.
 */
export const getMainQuests = (): MainQuest[] => mainQuests

/**
 * Gets a main quest by its map id.
 * @param mapId The id of the map.
 * @returns The main quest.
 */
export const getMainQuestByMap = (mapId: string) => mainQuestMap.get(mapId)

/**
 * Gets the previous and next main quests by their map id.
 * @param mapId The id of the map.
 * @returns The previous and next main quests.
 */
export const getAdjacentMainQuests = (mapId: string) => {
	return getAdjacentItems(mainQuests, mapId)
}

/**
 * Gets the sort options for main quests.
 * @returns An array of sort options.
 */
export const getMainQuestSortOptions = (): SortOption[] => [
	{ value: "latest", label: "Latest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "difficulty-asc", label: "Difficulty: Easy to Hard" },
	{ value: "difficulty-desc", label: "Difficulty: Hard to Easy" },
	{ value: "time-asc", label: "Completion Time: Shortest to Longest" },
	{ value: "time-desc", label: "Completion Time: Longest to Shortest" },
]

export interface MainQuestTimeRangeFilter {
	id: string
	slug: string
	title: string
	minMins: number
	maxMins: number
}

/** Time range options for filtering main quests by completion time (midpoint). */
export const MAIN_QUEST_TIME_RANGE_FILTERS: MainQuestTimeRangeFilter[] = [
	{ id: "under-30", slug: "under-30", title: "Under 30 min", minMins: 0, maxMins: 30 },
	{ id: "30-60", slug: "30-60", title: "30 min–1 hr", minMins: 30, maxMins: 60 },
	{ id: "60-120", slug: "60-120", title: "1–2 hrs", minMins: 60, maxMins: 120 },
	{ id: "120-plus", slug: "120-plus", title: "2+ hrs", minMins: 120, maxMins: Infinity },
]

const mainQuestRegistry = {
	casimirMechanism: {
		id: "casimir-mechanism",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("ascension"),
		estimatedTimeMins: {
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on the game (BO1/BO3), box luck, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/casimir-mechanism.mdx")),
	},
	ensembleCast: {
		id: "ensemble-cast",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("callOfTheDead"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason:
				"Time assumes Co-op version which takes longer and can vary based on box luck for the Wonder Weapon, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/ensemble-cast.mdx")),
	},
	timeTravelWillTell: {
		id: "time-travel-will-tell",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shangriLa"),
		estimatedTimeMins: {
			min: 90,
			max: 120,
			reason:
				"Time varies significantly based on the game (BO1/BO3), box luck, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/time-travel-will-tell.mdx")),
	},
	richtofensGrandScheme: {
		id: "richtofens-grand-scheme",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("moon"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason:
				"Time varies significantly based on the game (BO1/BO3), extreme RNG, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/richtofens-grand-scheme.mdx")),
	},
	towerOfBabble: {
		id: "tower-of-babble",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("tranzit"),
		estimatedTimeMins: {
			min: 60,
			max: 150,
			reason:
				"Time varies significantly based on the chosen path, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/tower-of-babble.mdx")),
	},
	highMaintenance: {
		id: "high-maintenance",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("dieRise"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason:
				"Time varies significantly based on the chosen path, and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/high-maintenance.mdx")),
	},
	popGoesTheWeasel: {
		id: "pop-goes-the-weasel",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("mobOfTheDead"),
		estimatedTimeMins: {
			min: 45,
			max: 90,
			reason: "Time varies mainly based on the player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/pop-goes-the-weasel.mdx")),
	},
	minedGames: {
		id: "mined-games",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("buried"),
		estimatedTimeMins: {
			min: 45,
			max: 120,
			reason:
				"Time varies significantly based on the player coordination and knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/mined-games.mdx")),
	},
	littleLostGirl: {
		id: "little-lost-girl",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("origins"),
		estimatedTimeMins: {
			min: 90,
			max: 180,
			reason:
				"Time varies significantly based on the game (BO2/BO3), player knowledge of steps, and slight RNG.",
		},
		content: Effect.promise(() => import("@/content/main-quests/little-lost-girl.mdx")),
	},
	apocalypseAverted: {
		id: "apocalypse-averted",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shadowsOfEvil"),
		estimatedTimeMins: {
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player coordination and knowledge of steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/apocalypse-averted.mdx")),
	},
	paradoxicalProlouge: {
		id: "paradoxical-prolouge",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("theGiant"),
		estimatedTimeMins: {
			min: 5,
			max: 10,
			reason: "Time varies slightly based on use of Gobblegums.",
		},
		content: Effect.promise(() => import("@/content/main-quests/paradoxical-prolouge.mdx")),
	},
	myBrothersKeeper: {
		id: "my-brothers-keeper",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("derEisendrache"),
		estimatedTimeMins: {
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on if Solo or Co-op and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/my-brothers-keeper.mdx")),
	},
	seedsOfDoubt: {
		id: "seeds-of-doubt",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("zetsubouNoShima"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason: "Time varies significantly based on plant RNG and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/seeds-of-doubt.mdx")),
	},
	loveAndWar: {
		id: "love-and-war",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("gorodKrovi"),
		estimatedTimeMins: {
			min: 90,
			max: 180,
			reason:
				"Time varies significantly based on if Solo or Co-op and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/love-and-war.mdx")),
	},
	forTheGoodOfAll: {
		id: "for-the-good-of-all",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("revelations"),
		estimatedTimeMins: {
			min: 60,
			max: 105,
			reason:
				"Time varies significantly based on box luck, use of Gobblegums, and player knowledge of steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/for-the-good-of-all.mdx")),
	},
	abandonShip: {
		id: "abandon-ship",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("voyageOfDespair"),
		estimatedTimeMins: {
			min: 75,
			max: 150,
			reason:
				"Time varies significantly based on if Solo or Co-op, use of Elixirs, and player knowledge of steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/abandon-ship.mdx")),
	},
	veneratedWarrior: {
		id: "venerated-warrior",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ix"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason: "Time varies significantly based on use of Elixirs, and player knowledge of steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/venerated-warrior.mdx")),
	},
	mostEscapeAlive: {
		id: "most-escape-alive",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("bloodOfTheDead"),
		estimatedTimeMins: {
			min: 105,
			max: 180,
			reason:
				"Time varies significantly based on if Solo or Co-op, use of Elixirs, bird step RNG, and player knowledge of steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/most-escape-alive.mdx")),
	},
	classifiedMainQuest: {
		id: "classified",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("classified"),
		estimatedTimeMins: {
			min: 600,
			max: 720,
			reason:
				"Time varies significantly based on use of Elixirs and how many players are in the game. Solo is faster.",
		},
		content: Effect.promise(() => import("@/content/main-quests/classified.mdx")),
	},
	trialByOrdeal: {
		id: "trial-by-ordeal",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("deadOfTheNight"),
		estimatedTimeMins: {
			min: 60,
			max: 150,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the part spawns/steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/trial-by-ordeal.mdx")),
	},
	greekTragedy: {
		id: "greek-tragedy",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ancientEvil"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/greek-tragedy.mdx")),
	},
	electromagneticAwakeningParty: {
		id: "electromagnetic-awakening-party",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("alphaOmega"),
		estimatedTimeMins: {
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		},
		content: Effect.promise(
			() => import("@/content/main-quests/electromagnetic-awakening-party.mdx"),
		),
	},
	salvationLiesAbove: {
		id: "salvation-lies-above",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("tagDerToten"),
		estimatedTimeMins: {
			min: 75,
			max: 112.5,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/salvation-lies-above.mdx")),
	},
	sealTheDeal: {
		id: "seal-the-deal",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("dieMaschine"),
		estimatedTimeMins: {
			min: 40,
			max: 60,
			reason: "Time varies mainly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/seal-the-deal.mdx")),
	},
	maxisPotential: {
		id: "maxis-potential",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("firebaseZ"),
		estimatedTimeMins: {
			min: 40,
			max: 60,
			reason: "Time varies mainly based on slight RNG and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/maxis-potential.mdx")),
	},
	tinManHeart: {
		id: "tin-man-heart",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("mauerDerToten"),
		estimatedTimeMins: {
			min: 60,
			max: 90,
			reason: "Time varies mainly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/tin-man-heart.mdx")),
	},
	pyrrhicVictory: {
		id: "pyrrhic-victory",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("forsaken"),
		estimatedTimeMins: {
			min: 40,
			max: 60,
			reason: "Time varies mainly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/pyrrhic-victory.mdx")),
	},
	byeByeDarkAether: {
		id: "bye-bye-dark-aether",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("libertyFalls"),
		estimatedTimeMins: {
			min: 30,
			max: 45,
			reason: "Time varies slightly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/bye-bye-dark-aether.mdx")),
	},
	noMoModi: {
		id: "no-mo-modi",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("terminus"),
		estimatedTimeMins: {
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/no-mo-modi.mdx")),
	},
	citadellesDesMortsMainQuest: {
		id: "citadelles-des-morts",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("citadelleDesMorts"),
		estimatedTimeMins: {
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/citadelles-des-morts.mdx")),
	},
	theTombMainQuest: {
		id: "the-tomb",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("theTomb"),
		estimatedTimeMins: {
			min: 45,
			max: 60,
			reason: "Time varies slightly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/the-tomb.mdx")),
	},
	shatteredVeilMainQuest: {
		id: "shattered-veil",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shatteredVeil"),
		estimatedTimeMins: {
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/shattered-veil.mdx")),
	},
	reckoningMainQuest: {
		id: "reckoning",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("reckoning"),
		estimatedTimeMins: {
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps and boss fight path.",
		},
		content: Effect.promise(() => import("@/content/main-quests/reckoning.mdx")),
	},
	dustToDust: {
		id: "dust-to-dust",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ashesOfTheDamned"),
		estimatedTimeMins: {
			min: 75,
			max: 120,
			reason: "Time varies significantly based on player knowledge of the steps and map.",
		},
		content: Effect.promise(() => import("@/content/main-quests/dust-to-dust.mdx")),
	},
	astraMalorumMainQuest: {
		id: "astra-malorum",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("astraMalorum"),
		estimatedTimeMins: {
			min: 60,
			max: 90,
			reason:
				"Time varies slightly based on O.S.C.A.R. movement and player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/astra-malorum.mdx")),
	},
	paradoxJunctionMainQuest: {
		id: "paradox-junction",
		state: Option.some("New"),
		difficulty: Option.some("Medium"),
		map: getMapByKey("paradoxJunction"),
		estimatedTimeMins: {
			min: 60,
			max: 120,
			reason: "Time varies significantly based on player knowledge of the steps.",
		},
		content: Effect.promise(() => import("@/content/main-quests/paradox-junction.mdx")),
	},
} as const satisfies Record<string, Omit<MainQuest, "_tag">>

const mainQuestMap = new Map<string, MainQuest>()
const mainQuests: MainQuest[] = Object.values(mainQuestRegistry)
	.sort((a, b) => sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate))
	.map(mainQuest => {
		const taggedQuest: MainQuest = { ...mainQuest, _tag: "MainQuest" }
		mainQuestMap.set(mainQuest.map.id, taggedQuest)
		return taggedQuest
	})
