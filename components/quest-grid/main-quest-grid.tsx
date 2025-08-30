import { Suspense } from "react"
import GridLoader from "@/components/loaders/grid-loader"
import { getMainQuests } from "@/data/main-quests"
import QuestGridClient from "./quest-grid.client"

export async function MainQuestGrid() {
	const mainQuests = await getMainQuests()

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={mainQuests} />
		</Suspense>
	)
}
