import type { Maps } from "./maps"

export interface SideQuest {
	/** The unique identifier for the side quest */
	id: string
	/** The title of the side quest */
	title: string
	/** The state of the side quest */
	state?: "Coming Soon" | "New"
	/** The last updated date of the side quest */
	lastUpdated: string
	/** The map of the side quest */
	map: Maps
	/** The description of the side quest */
	description: string
	/** The content of the side quest */
	content: () => Promise<typeof import("*.mdx")>
}
/**
 * Get a SideQuest by key
 * @param key The key of the side quest
 * @returns The side quest with the given key
 */
export const getSideQuestByKey = (key: SideQuestKey): SideQuest => sideQuestRegistry[key]
/**
 * Get all SideQuests
 * @returns An array of all side quests
 */
export const getSideQuests = (): SideQuest[] => Object.values(sideQuestRegistry)

const sideQuestRegistry = {} as const satisfies Record<string, SideQuest>
/** Union type of all side quests */
export type SideQuestKey = keyof typeof sideQuestRegistry
