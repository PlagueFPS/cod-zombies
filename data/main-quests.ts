import { getLastUpdated } from "@/utils/functions"
import {
	alphaOmega,
	ancientEvil,
	ascension,
	bloodOfTheDead,
	buried,
	callOfTheDead,
	citadelleDesMorts,
	classified,
	deadOfTheNight,
	derEisendrache,
	dieMaschine,
	dieRise,
	firebaseZ,
	forsaken,
	gorodKrovi,
	ix,
	libertyFalls,
	type Maps,
	mauerDerToten,
	mobOfTheDead,
	moon,
	origins,
	reckoning,
	revelations,
	shadowsOfEvil,
	shangriLa,
	shatteredVeil,
	tagDerToten,
	terminus,
	theGiant,
	theTomb,
	tranzit,
	voyageOfDespair,
	zetsubouNoShima,
} from "./maps"

interface MainQuestComingSoon {
	/** The unique identifier of the main quest */
	id: string
	/** The title of the main quest */
	title: string
	/** The last updated date of the main quest */
	lastUpdated: string
	/** The state of the main quest */
	state: "Coming Soon"
	/** The difficulty of the main quest */
	difficulty?: never
	/** The map of the main quest */
	map: Maps
}

interface MainQuestReleased {
	/** The unique identifier of the main quest */
	id: string
	/** The last updated date of the main quest */
	lastUpdated: string
	/** The state of the main quest */
	state?: "New"
	/** The difficulty of the main quest */
	difficulty: "Easy" | "Medium" | "Hard"
	/** The map of the main quest */
	map: Maps
	/** The content of the main quest */
	content: () => Promise<typeof import("*.mdx")>
}

type MainQuest = MainQuestComingSoon | MainQuestReleased

/**
 * Gets a main quest by its key.
 * @param key The key of the main quest.
 * @returns The main quest.
 */
export const getMainQuestByKey = (key: MainQuestKey): MainQuest => mainQuestRegistry[key]
/**
 * Gets all main quests.
 * @returns An array of main quests.
 */
export const getMainQuests = (): MainQuest[] => Object.values(mainQuestRegistry)

const mainQuestRegistry = {
	casimirMechanism: {
		id: "casimir-mechanism",
		lastUpdated: await getLastUpdated("../content/main-quests/casimir-mechanism.mdx"),
		difficulty: "Easy",
		map: ascension,
		content: () => import("@/content/main-quests/casimir-mechanism.mdx"),
	},
	ensembleCast: {
		id: "ensemble-cast",
		lastUpdated: await getLastUpdated("../content/main-quests/ensemble-cast.mdx"),
		difficulty: "Easy",
		map: callOfTheDead,
		content: () => import("@/content/main-quests/ensemble-cast.mdx"),
	},
	timeTravelWillTell: {
		id: "time-travel-will-tell",
		lastUpdated: await getLastUpdated("../content/main-quests/time-travel-will-tell.mdx"),
		difficulty: "Medium",
		map: shangriLa,
		content: () => import("@/content/main-quests/time-travel-will-tell.mdx"),
	},
	richtofensGrandScheme: {
		id: "richtofens-grand-scheme",
		lastUpdated: await getLastUpdated("../content/main-quests/richtofens-grand-scheme.mdx"),
		difficulty: "Easy",
		map: moon,
		content: () => import("@/content/main-quests/richtofens-grand-scheme.mdx"),
	},
	towerOfBabble: {
		id: "tower-of-babble",
		lastUpdated: await getLastUpdated("../content/main-quests/tower-of-babble.mdx"),
		difficulty: "Easy",
		map: tranzit,
		content: () => import("@/content/main-quests/tower-of-babble.mdx"),
	},
	highMaintenance: {
		id: "high-maintenance",
		lastUpdated: await getLastUpdated("../content/main-quests/high-maintenance.mdx"),
		difficulty: "Medium",
		map: dieRise,
		content: () => import("@/content/main-quests/high-maintenance.mdx"),
	},
	popGoesTheWeasel: {
		id: "pop-goes-the-weasel",
		lastUpdated: await getLastUpdated("../content/main-quests/pop-goes-the-weasel.mdx"),
		difficulty: "Easy",
		map: mobOfTheDead,
		content: () => import("@/content/main-quests/pop-goes-the-weasel.mdx"),
	},
	minedGames: {
		id: "mined-games",
		lastUpdated: await getLastUpdated("../content/main-quests/mined-games.mdx"),
		difficulty: "Hard",
		map: buried,
		content: () => import("@/content/main-quests/mined-games.mdx"),
	},
	littleLostGirl: {
		id: "little-lost-girl",
		lastUpdated: await getLastUpdated("../content/main-quests/little-lost-girl.mdx"),
		difficulty: "Hard",
		map: origins,
		content: () => import("@/content/main-quests/little-lost-girl.mdx"),
	},
	apocalypseAverted: {
		id: "apocalypse-averted",
		lastUpdated: await getLastUpdated("../content/main-quests/apocalypse-averted.mdx"),
		difficulty: "Medium",
		map: shadowsOfEvil,
		content: () => import("@/content/main-quests/apocalypse-averted.mdx"),
	},
	paradoxicalProlouge: {
		id: "paradoxical-prolouge",
		lastUpdated: await getLastUpdated("../content/main-quests/paradoxical-prolouge.mdx"),
		difficulty: "Easy",
		map: theGiant,
		content: () => import("@/content/main-quests/paradoxical-prolouge.mdx"),
	},
	myBrothersKeeper: {
		id: "my-brothers-keeper",
		lastUpdated: await getLastUpdated("../content/main-quests/my-brothers-keeper.mdx"),
		difficulty: "Medium",
		map: derEisendrache,
		content: () => import("@/content/main-quests/my-brothers-keeper.mdx"),
	},
	seedsOfDoubt: {
		id: "seeds-of-doubt",
		lastUpdated: await getLastUpdated("../content/main-quests/seeds-of-doubt.mdx"),
		difficulty: "Medium",
		map: zetsubouNoShima,
		content: () => import("@/content/main-quests/seeds-of-doubt.mdx"),
	},
	loveAndWar: {
		id: "love-and-war",
		lastUpdated: await getLastUpdated("../content/main-quests/love-and-war.mdx"),
		difficulty: "Hard",
		map: gorodKrovi,
		content: () => import("@/content/main-quests/love-and-war.mdx"),
	},
	forTheGoodOfAll: {
		id: "for-the-good-of-all",
		lastUpdated: await getLastUpdated("../content/main-quests/for-the-good-of-all.mdx"),
		difficulty: "Medium",
		map: revelations,
		content: () => import("@/content/main-quests/for-the-good-of-all.mdx"),
	},
	abandonShip: {
		id: "abandon-ship",
		lastUpdated: await getLastUpdated("../content/main-quests/abandon-ship.mdx"),
		difficulty: "Hard",
		map: voyageOfDespair,
		content: () => import("@/content/main-quests/abandon-ship.mdx"),
	},
	veneratedWarrior: {
		id: "venerated-warrior",
		lastUpdated: await getLastUpdated("../content/main-quests/venerated-warrior.mdx"),
		difficulty: "Medium",
		map: ix,
		content: () => import("@/content/main-quests/venerated-warrior.mdx"),
	},
	mostEscapeAlive: {
		id: "most-escape-alive",
		lastUpdated: await getLastUpdated("../content/main-quests/most-escape-alive.mdx"),
		difficulty: "Hard",
		map: bloodOfTheDead,
		content: () => import("@/content/main-quests/most-escape-alive.mdx"),
	},
	classifiedMainQuest: {
		id: "classified-main-quest",
		lastUpdated: await getLastUpdated("../content/main-quests/classified.mdx"),
		difficulty: "Medium",
		map: classified,
		content: () => import("@/content/main-quests/classified.mdx"),
	},
	trialByOrdeal: {
		id: "trial-by-ordeal",
		lastUpdated: await getLastUpdated("../content/main-quests/trial-by-ordeal.mdx"),
		difficulty: "Hard",
		map: deadOfTheNight,
		content: () => import("@/content/main-quests/trial-by-ordeal.mdx"),
	},
	greekTragedy: {
		id: "greek-tragedy",
		lastUpdated: await getLastUpdated("../content/main-quests/greek-tragedy.mdx"),
		difficulty: "Medium",
		map: ancientEvil,
		content: () => import("@/content/main-quests/greek-tragedy.mdx"),
	},
	electromagneticAwakeningParty: {
		id: "electromagnetic-awakening-party",
		lastUpdated: await getLastUpdated("../content/main-quests/electromagnetic-awakening-party.mdx"),
		difficulty: "Medium",
		map: alphaOmega,
		content: () => import("@/content/main-quests/electromagnetic-awakening-party.mdx"),
	},
	salvationLiesAbove: {
		id: "salvation-lies-above",
		lastUpdated: await getLastUpdated("../content/main-quests/salvation-lies-above.mdx"),
		difficulty: "Medium",
		map: tagDerToten,
		content: () => import("@/content/main-quests/salvation-lies-above.mdx"),
	},
	sealTheDeal: {
		id: "seal-the-deal",
		lastUpdated: await getLastUpdated("../content/main-quests/seal-the-deal.mdx"),
		difficulty: "Easy",
		map: dieMaschine,
		content: () => import("@/content/main-quests/seal-the-deal.mdx"),
	},
	maxisPotential: {
		id: "maxis-potential",
		lastUpdated: await getLastUpdated("../content/main-quests/maxis-potential.mdx"),
		difficulty: "Easy",
		map: firebaseZ,
		content: () => import("@/content/main-quests/maxis-potential.mdx"),
	},
	tinManHeart: {
		id: "tin-man-heart",
		lastUpdated: await getLastUpdated("../content/main-quests/tin-man-heart.mdx"),
		difficulty: "Medium",
		map: mauerDerToten,
		content: () => import("@/content/main-quests/tin-man-heart.mdx"),
	},
	pyrrhicVictory: {
		id: "pyrrhic-victory",
		lastUpdated: await getLastUpdated("../content/main-quests/pyrrhic-victory.mdx"),
		difficulty: "Easy",
		map: forsaken,
		content: () => import("@/content/main-quests/pyrrhic-victory.mdx"),
	},
	byeByeDarkAether: {
		id: "bye-bye-dark-aether",
		lastUpdated: await getLastUpdated("../content/main-quests/bye-bye-dark-aether.mdx"),
		difficulty: "Easy",
		map: libertyFalls,
		content: () => import("@/content/main-quests/bye-bye-dark-aether.mdx"),
	},
	noMoModi: {
		id: "no-mo-modi",
		lastUpdated: await getLastUpdated("../content/main-quests/no-mo-modi.mdx"),
		difficulty: "Medium",
		map: terminus,
		content: () => import("@/content/main-quests/no-mo-modi.mdx"),
	},
	citadellesDesMortsMainQuest: {
		id: "citadelles-des-morts-main-quest",
		lastUpdated: await getLastUpdated("../content/main-quests/citadelles-des-morts.mdx"),
		difficulty: "Medium",
		map: citadelleDesMorts,
		content: () => import("@/content/main-quests/citadelles-des-morts.mdx"),
	},
	theTombMainQuest: {
		id: "the-tomb-main-quest",
		lastUpdated: await getLastUpdated("../content/main-quests/the-tomb.mdx"),
		difficulty: "Medium",
		map: theTomb,
		content: () => import("@/content/main-quests/the-tomb.mdx"),
	},
	shatteredVeilMainQuest: {
		id: "shattered-veil-main-quest",
		lastUpdated: await getLastUpdated("../content/main-quests/shattered-veil.mdx"),
		difficulty: "Medium",
		map: shatteredVeil,
		content: () => import("@/content/main-quests/shattered-veil.mdx"),
	},
	reckoningMainQuest: {
		id: "reckoning-main-quest",
		lastUpdated: await getLastUpdated("../content/main-quests/reckoning.mdx"),
		difficulty: "Medium",
		map: reckoning,
		content: () => import("@/content/main-quests/reckoning.mdx"),
	},
} as const satisfies Record<string, MainQuest>

export type MainQuestKey = keyof typeof mainQuestRegistry

export const {
	casimirMechanism,
	ensembleCast,
	abandonShip,
	apocalypseAverted,
	byeByeDarkAether,
	citadellesDesMortsMainQuest,
	classifiedMainQuest,
	electromagneticAwakeningParty,
	forTheGoodOfAll,
	greekTragedy,
	highMaintenance,
	littleLostGirl,
	loveAndWar,
	maxisPotential,
	minedGames,
	mostEscapeAlive,
	noMoModi,
	pyrrhicVictory,
	myBrothersKeeper,
	seedsOfDoubt,
	paradoxicalProlouge,
	popGoesTheWeasel,
	reckoningMainQuest,
	richtofensGrandScheme,
	salvationLiesAbove,
	sealTheDeal,
	shatteredVeilMainQuest,
	theTombMainQuest,
	timeTravelWillTell,
	tinManHeart,
	towerOfBabble,
	trialByOrdeal,
	veneratedWarrior,
} = mainQuestRegistry
