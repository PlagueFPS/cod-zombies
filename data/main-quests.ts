import { sortReleaseDateDesc } from "@/utils/functions.client"
import {
  alphaOmega,
  ancientEvil,
  ascension,
  ashesOfTheDamned,
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
  /** The state of the main quest */
  state: "Coming Soon"
  /** The difficulty of the main quest */
  difficulty?: never
  /** The map of the main quest */
  map: Maps
  /** The content of the main quest */
  content: () => Promise<typeof import("*.mdx")>
}

interface MainQuestReleased {
  /** The unique identifier of the main quest */
  id: string
  /** The state of the main quest */
  state?: "New"
  /** The difficulty of the main quest */
  difficulty: "Easy" | "Medium" | "Hard"
  /** The map of the main quest */
  map: Maps
  /** The content of the main quest */
  content: () => Promise<typeof import("*.mdx")>
}

export type MainQuest = MainQuestComingSoon | MainQuestReleased
export type MainQuestDifficulty = MainQuestReleased["difficulty"]
export type MainQuestKey = keyof typeof mainQuestRegistry

const mainQuestRegistry = {
  casimirMechanism: {
    id: "casimir-mechanism",
    difficulty: "Easy",
    map: ascension,
    content: () => import("@/content/main-quests/casimir-mechanism.mdx"),
  },
  ensembleCast: {
    id: "ensemble-cast",
    difficulty: "Easy",
    map: callOfTheDead,
    content: () => import("@/content/main-quests/ensemble-cast.mdx"),
  },
  timeTravelWillTell: {
    id: "time-travel-will-tell",
    difficulty: "Medium",
    map: shangriLa,
    content: () => import("@/content/main-quests/time-travel-will-tell.mdx"),
  },
  richtofensGrandScheme: {
    id: "richtofens-grand-scheme",
    difficulty: "Easy",
    map: moon,
    content: () => import("@/content/main-quests/richtofens-grand-scheme.mdx"),
  },
  towerOfBabble: {
    id: "tower-of-babble",
    difficulty: "Easy",
    map: tranzit,
    content: () => import("@/content/main-quests/tower-of-babble.mdx"),
  },
  highMaintenance: {
    id: "high-maintenance",
    difficulty: "Medium",
    map: dieRise,
    content: () => import("@/content/main-quests/high-maintenance.mdx"),
  },
  popGoesTheWeasel: {
    id: "pop-goes-the-weasel",
    difficulty: "Easy",
    map: mobOfTheDead,
    content: () => import("@/content/main-quests/pop-goes-the-weasel.mdx"),
  },
  minedGames: {
    id: "mined-games",
    difficulty: "Hard",
    map: buried,
    content: () => import("@/content/main-quests/mined-games.mdx"),
  },
  littleLostGirl: {
    id: "little-lost-girl",
    difficulty: "Hard",
    map: origins,
    content: () => import("@/content/main-quests/little-lost-girl.mdx"),
  },
  apocalypseAverted: {
    id: "apocalypse-averted",
    difficulty: "Medium",
    map: shadowsOfEvil,
    content: () => import("@/content/main-quests/apocalypse-averted.mdx"),
  },
  paradoxicalProlouge: {
    id: "paradoxical-prolouge",
    difficulty: "Easy",
    map: theGiant,
    content: () => import("@/content/main-quests/paradoxical-prolouge.mdx"),
  },
  myBrothersKeeper: {
    id: "my-brothers-keeper",
    difficulty: "Medium",
    map: derEisendrache,
    content: () => import("@/content/main-quests/my-brothers-keeper.mdx"),
  },
  seedsOfDoubt: {
    id: "seeds-of-doubt",
    difficulty: "Medium",
    map: zetsubouNoShima,
    content: () => import("@/content/main-quests/seeds-of-doubt.mdx"),
  },
  loveAndWar: {
    id: "love-and-war",
    difficulty: "Hard",
    map: gorodKrovi,
    content: () => import("@/content/main-quests/love-and-war.mdx"),
  },
  forTheGoodOfAll: {
    id: "for-the-good-of-all",
    difficulty: "Medium",
    map: revelations,
    content: () => import("@/content/main-quests/for-the-good-of-all.mdx"),
  },
  abandonShip: {
    id: "abandon-ship",
    difficulty: "Hard",
    map: voyageOfDespair,
    content: () => import("@/content/main-quests/abandon-ship.mdx"),
  },
  veneratedWarrior: {
    id: "venerated-warrior",
    difficulty: "Medium",
    map: ix,
    content: () => import("@/content/main-quests/venerated-warrior.mdx"),
  },
  mostEscapeAlive: {
    id: "most-escape-alive",
    difficulty: "Hard",
    map: bloodOfTheDead,
    content: () => import("@/content/main-quests/most-escape-alive.mdx"),
  },
  classifiedMainQuest: {
    id: "classified",
    difficulty: "Medium",
    map: classified,
    content: () => import("@/content/main-quests/classified.mdx"),
  },
  trialByOrdeal: {
    id: "trial-by-ordeal",
    difficulty: "Hard",
    map: deadOfTheNight,
    content: () => import("@/content/main-quests/trial-by-ordeal.mdx"),
  },
  greekTragedy: {
    id: "greek-tragedy",
    difficulty: "Medium",
    map: ancientEvil,
    content: () => import("@/content/main-quests/greek-tragedy.mdx"),
  },
  electromagneticAwakeningParty: {
    id: "electromagnetic-awakening-party",
    difficulty: "Medium",
    map: alphaOmega,
    content: () => import("@/content/main-quests/electromagnetic-awakening-party.mdx"),
  },
  salvationLiesAbove: {
    id: "salvation-lies-above",
    difficulty: "Medium",
    map: tagDerToten,
    content: () => import("@/content/main-quests/salvation-lies-above.mdx"),
  },
  sealTheDeal: {
    id: "seal-the-deal",
    difficulty: "Easy",
    map: dieMaschine,
    content: () => import("@/content/main-quests/seal-the-deal.mdx"),
  },
  maxisPotential: {
    id: "maxis-potential",
    difficulty: "Easy",
    map: firebaseZ,
    content: () => import("@/content/main-quests/maxis-potential.mdx"),
  },
  tinManHeart: {
    id: "tin-man-heart",
    difficulty: "Medium",
    map: mauerDerToten,
    content: () => import("@/content/main-quests/tin-man-heart.mdx"),
  },
  pyrrhicVictory: {
    id: "pyrrhic-victory",
    difficulty: "Easy",
    map: forsaken,
    content: () => import("@/content/main-quests/pyrrhic-victory.mdx"),
  },
  byeByeDarkAether: {
    id: "bye-bye-dark-aether",
    difficulty: "Easy",
    map: libertyFalls,
    content: () => import("@/content/main-quests/bye-bye-dark-aether.mdx"),
  },
  noMoModi: {
    id: "no-mo-modi",
    difficulty: "Medium",
    map: terminus,
    content: () => import("@/content/main-quests/no-mo-modi.mdx"),
  },
  citadellesDesMortsMainQuest: {
    id: "citadelles-des-morts",
    difficulty: "Medium",
    map: citadelleDesMorts,
    content: () => import("@/content/main-quests/citadelles-des-morts.mdx"),
  },
  theTombMainQuest: {
    id: "the-tomb",
    difficulty: "Medium",
    map: theTomb,
    content: () => import("@/content/main-quests/the-tomb.mdx"),
  },
  shatteredVeilMainQuest: {
    id: "shattered-veil",
    difficulty: "Medium",
    map: shatteredVeil,
    content: () => import("@/content/main-quests/shattered-veil.mdx"),
  },
  reckoningMainQuest: {
    id: "reckoning",
    difficulty: "Medium",
    map: reckoning,
    content: () => import("@/content/main-quests/reckoning.mdx"),
  },
  ashesOfTheDamnedMainQuest: {
    id: "ashes-of-the-damned",
    state: "Coming Soon",
    map: ashesOfTheDamned,
    content: () => import("@/content/main-quests/ashes-of-the-damned.mdx"),
  }
} as const satisfies Record<string, MainQuest>

const mainQuestMap = new Map<string, MainQuest>()
const mainQuests: MainQuest[] = Object.values(mainQuestRegistry).sort((a, b) =>
  sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate),
)
for (const mainQuest of mainQuests) {
  mainQuestMap.set(mainQuest.map.id, mainQuest)
}

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
  const index = mainQuests.findIndex(quest => quest.map.id === mapId)
  return {
    prev: index < mainQuests.length - 1 ? mainQuests[index + 1] : null,
    next: index > 0 ? mainQuests[index - 1] : null,
  }
}
