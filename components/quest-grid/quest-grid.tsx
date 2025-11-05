"use client"
import type { MainQuest } from "@/data/main-quests"
import type { SideQuest } from "@/data/side-quests"
import { Option, Predicate } from "effect"
import { Suspense, useEffect } from "react"
import GridPagination from "@/components/grid-pagination/grid-pagination"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import QuestPreviewCard from "@/components/quest-preview-card/quest-preview-card"
import { useFilterParams } from "@/hooks/use-filter-params"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/functions.client"
import EmptyGrid from "../empty/empty-grid"

interface IQuestGridClient {
	quests: (Omit<MainQuest, "content"> | Omit<SideQuest, "content">)[]
}

export default function QuestGridClient({ quests }: IQuestGridClient) {
	const { gameParams, mapParams, difficultyParams, page, validatePageParam } = useFilterParams()
	let filteredQuests = quests

	if (gameParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => gameParams.includes(quest.map.game.id))
	}

	if (difficultyParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (!Predicate.hasProperty(quest, "title") && Option.isSome(quest.difficulty)) {
				return difficultyParams.includes(quest.difficulty.value.toLowerCase())
			}
			return false
		})
	}

	if (mapParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (Predicate.hasProperty(quest, "map")) {
				return mapParams.includes(quest.map.id)
			}
			return false
		})
	}

	const skip = calculateSkip(page, MAP_LIMIT)
	const paginatedQuests = filteredQuests.slice(skip, MAP_LIMIT * page)

	useEffect(() => {
		validatePageParam(filteredQuests.length)
	}, [filteredQuests.length, validatePageParam])

	return (
		<>
			<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{paginatedQuests.length > 0 ? (
					paginatedQuests.map((quest, index) => (
						<QuestPreviewCard key={quest.id} quest={quest} questIndex={index} />
					))
				) : (
					<EmptyGrid type="Quest" className="col-span-4" />
				)}
			</div>
			<Suspense fallback={<GridPaginationLoader />}>
				<GridPagination data={filteredQuests} />
			</Suspense>
		</>
	)
}
