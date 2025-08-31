import { Suspense } from "react"
import GridLoader from "@/components/loaders/grid-loader"
import { getMapsWithQuest } from "@/data/maps"
import QuestGridClient from "./quest-grid.client"

export async function MainQuestGrid() {
	const mainQuests = await getMapsWithQuest()

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={mainQuests} />
		</Suspense>
	)
}
