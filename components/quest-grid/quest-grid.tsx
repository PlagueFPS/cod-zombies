import { draftMode } from "next/headers"
import { Suspense } from "react"
import GridLoader from "@/components/loaders/grid-loader"
import { getMaps } from "@/data/maps"
import { getQuests } from "@/data/side-quests"
import QuestGridClient from "./quest-grid.client"

export async function MainQuestGrid() {
	const { isEnabled } = await draftMode()
	const maps = await getMaps(isEnabled)

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={maps} draftMode={isEnabled} />
		</Suspense>
	)
}

export async function SideQuestGrid() {
	const { isEnabled } = await draftMode()
	const quests = await getQuests(isEnabled)

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={quests} draftMode={isEnabled} />
		</Suspense>
	)
}
