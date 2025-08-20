import { Suspense } from "react"
import GridLoader from "@/components/loaders/grid-loader"
import { getMaps } from "@/data/maps"
import { getQuests } from "@/data/side-quests"
import QuestGridClient from "./quest-grid.client"

export async function MainQuestGrid() {
	const maps = await getMaps()

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={maps} />
		</Suspense>
	)
}

export async function SideQuestGrid() {
	const quests = await getQuests()

	return (
		<Suspense fallback={<GridLoader />}>
			<QuestGridClient quests={quests} />
		</Suspense>
	)
}
