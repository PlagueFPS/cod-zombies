/** All possible main quest difficulties (canonical ascending order for sorting). */
export const MAIN_QUEST_DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const

export type MainQuestDifficulty = (typeof MAIN_QUEST_DIFFICULTIES)[number]
