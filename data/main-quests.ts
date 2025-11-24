import { Effect, Option } from "effect"
import { sortReleaseDateDesc } from "@/utils/functions.client"
import { getMapByKey, type Maps } from "./maps"
import { getAdjacentItems } from "./utils"

/** Union of all main quest difficulties */
export type MainQuestDifficulty = "Easy" | "Medium" | "Hard"

export interface MainQuest {
	/** The unique identifier of the main quest */
	id: string
	/** The state of the main quest */
	state: Option.Option<"New" | "Coming Soon">
	/** The difficulty of the main quest */
	difficulty: Option.Option<MainQuestDifficulty>
	/** The map of the main quest */
	map: Maps
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

const mainQuestRegistry = {
	casimirMechanism: {
		id: "casimir-mechanism",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("ascension"),
		content: Effect.promise(() => import("@/content/main-quests/casimir-mechanism.mdx")),
	},
	ensembleCast: {
		id: "ensemble-cast",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("callOfTheDead"),
		content: Effect.promise(() => import("@/content/main-quests/ensemble-cast.mdx")),
	},
	timeTravelWillTell: {
		id: "time-travel-will-tell",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shangriLa"),
		content: Effect.promise(() => import("@/content/main-quests/time-travel-will-tell.mdx")),
	},
	richtofensGrandScheme: {
		id: "richtofens-grand-scheme",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("moon"),
		content: Effect.promise(() => import("@/content/main-quests/richtofens-grand-scheme.mdx")),
	},
	towerOfBabble: {
		id: "tower-of-babble",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("tranzit"),
		content: Effect.promise(() => import("@/content/main-quests/tower-of-babble.mdx")),
	},
	highMaintenance: {
		id: "high-maintenance",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("dieRise"),
		content: Effect.promise(() => import("@/content/main-quests/high-maintenance.mdx")),
	},
	popGoesTheWeasel: {
		id: "pop-goes-the-weasel",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("mobOfTheDead"),
		content: Effect.promise(() => import("@/content/main-quests/pop-goes-the-weasel.mdx")),
	},
	minedGames: {
		id: "mined-games",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("buried"),
		content: Effect.promise(() => import("@/content/main-quests/mined-games.mdx")),
	},
	littleLostGirl: {
		id: "little-lost-girl",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("origins"),
		content: Effect.promise(() => import("@/content/main-quests/little-lost-girl.mdx")),
	},
	apocalypseAverted: {
		id: "apocalypse-averted",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shadowsOfEvil"),
		content: Effect.promise(() => import("@/content/main-quests/apocalypse-averted.mdx")),
	},
	paradoxicalProlouge: {
		id: "paradoxical-prolouge",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("theGiant"),
		content: Effect.promise(() => import("@/content/main-quests/paradoxical-prolouge.mdx")),
	},
	myBrothersKeeper: {
		id: "my-brothers-keeper",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("derEisendrache"),
		content: Effect.promise(() => import("@/content/main-quests/my-brothers-keeper.mdx")),
	},
	seedsOfDoubt: {
		id: "seeds-of-doubt",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("zetsubouNoShima"),
		content: Effect.promise(() => import("@/content/main-quests/seeds-of-doubt.mdx")),
	},
	loveAndWar: {
		id: "love-and-war",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("gorodKrovi"),
		content: Effect.promise(() => import("@/content/main-quests/love-and-war.mdx")),
	},
	forTheGoodOfAll: {
		id: "for-the-good-of-all",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("revelations"),
		content: Effect.promise(() => import("@/content/main-quests/for-the-good-of-all.mdx")),
	},
	abandonShip: {
		id: "abandon-ship",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("voyageOfDespair"),
		content: Effect.promise(() => import("@/content/main-quests/abandon-ship.mdx")),
	},
	veneratedWarrior: {
		id: "venerated-warrior",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ix"),
		content: Effect.promise(() => import("@/content/main-quests/venerated-warrior.mdx")),
	},
	mostEscapeAlive: {
		id: "most-escape-alive",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("bloodOfTheDead"),
		content: Effect.promise(() => import("@/content/main-quests/most-escape-alive.mdx")),
	},
	classifiedMainQuest: {
		id: "classified",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("classified"),
		content: Effect.promise(() => import("@/content/main-quests/classified.mdx")),
	},
	trialByOrdeal: {
		id: "trial-by-ordeal",
		state: Option.none(),
		difficulty: Option.some("Hard"),
		map: getMapByKey("deadOfTheNight"),
		content: Effect.promise(() => import("@/content/main-quests/trial-by-ordeal.mdx")),
	},
	greekTragedy: {
		id: "greek-tragedy",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ancientEvil"),
		content: Effect.promise(() => import("@/content/main-quests/greek-tragedy.mdx")),
	},
	electromagneticAwakeningParty: {
		id: "electromagnetic-awakening-party",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("alphaOmega"),
		content: Effect.promise(
			() => import("@/content/main-quests/electromagnetic-awakening-party.mdx"),
		),
	},
	salvationLiesAbove: {
		id: "salvation-lies-above",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("tagDerToten"),
		content: Effect.promise(() => import("@/content/main-quests/salvation-lies-above.mdx")),
	},
	sealTheDeal: {
		id: "seal-the-deal",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("dieMaschine"),
		content: Effect.promise(() => import("@/content/main-quests/seal-the-deal.mdx")),
	},
	maxisPotential: {
		id: "maxis-potential",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("firebaseZ"),
		content: Effect.promise(() => import("@/content/main-quests/maxis-potential.mdx")),
	},
	tinManHeart: {
		id: "tin-man-heart",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("mauerDerToten"),
		content: Effect.promise(() => import("@/content/main-quests/tin-man-heart.mdx")),
	},
	pyrrhicVictory: {
		id: "pyrrhic-victory",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("forsaken"),
		content: Effect.promise(() => import("@/content/main-quests/pyrrhic-victory.mdx")),
	},
	byeByeDarkAether: {
		id: "bye-bye-dark-aether",
		state: Option.none(),
		difficulty: Option.some("Easy"),
		map: getMapByKey("libertyFalls"),
		content: Effect.promise(() => import("@/content/main-quests/bye-bye-dark-aether.mdx")),
	},
	noMoModi: {
		id: "no-mo-modi",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("terminus"),
		content: Effect.promise(() => import("@/content/main-quests/no-mo-modi.mdx")),
	},
	citadellesDesMortsMainQuest: {
		id: "citadelles-des-morts",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("citadelleDesMorts"),
		content: Effect.promise(() => import("@/content/main-quests/citadelles-des-morts.mdx")),
	},
	theTombMainQuest: {
		id: "the-tomb",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("theTomb"),
		content: Effect.promise(() => import("@/content/main-quests/the-tomb.mdx")),
	},
	shatteredVeilMainQuest: {
		id: "shattered-veil",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("shatteredVeil"),
		content: Effect.promise(() => import("@/content/main-quests/shattered-veil.mdx")),
	},
	reckoningMainQuest: {
		id: "reckoning",
		state: Option.none(),
		difficulty: Option.some("Medium"),
		map: getMapByKey("reckoning"),
		content: Effect.promise(() => import("@/content/main-quests/reckoning.mdx")),
	},
	dustToDust: {
		id: "dust-to-dust",
		state: Option.some("New"),
		difficulty: Option.some("Medium"),
		map: getMapByKey("ashesOfTheDamned"),
		content: Effect.promise(() => import("@/content/main-quests/dust-to-dust.mdx")),
	},
} as const satisfies Record<string, MainQuest>

const mainQuestMap = new Map<string, MainQuest>()
const mainQuests: MainQuest[] = Object.values(mainQuestRegistry).sort((a, b) =>
	sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate),
)
for (const mainQuest of mainQuests) {
	mainQuestMap.set(mainQuest.map.id, mainQuest)
}
