import { Suspense } from "react"
import { getSideQuests } from "@/data/side-quests"
import GridLoader from "../loaders/grid-loader"
import QuestGridClient from "../quest-grid/quest-grid.client"

export async function SideQuestGrid() {
	const quests = await getSideQuests()

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={quests} />
		</Suspense>
	)
}
