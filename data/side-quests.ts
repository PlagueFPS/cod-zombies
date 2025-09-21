import type { Maps } from "./maps"

interface SideQuest {
	id: string
	title: string
	state?: "Coming Soon" | "New"
	lastUpdated: string
	map: Maps
	description: string
	content: () => Promise<typeof import("*.mdx")>
}

const sideQuestRegistry = {} as const satisfies Record<string, SideQuest>

export type SideQuestKey = keyof typeof sideQuestRegistry
