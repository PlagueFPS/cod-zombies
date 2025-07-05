"use client"
import type { MinifiedFeaturedMap } from "@/data/maps"
import type { MinifiedSideQuest } from "@/data/side-quests"
import { Predicate } from "effect"
import { Suspense, useEffect, useMemo } from "react"
import GridPagination from "@/components/grid-pagination/grid-pagination"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import QuestPreviewCard from "@/components/quest-preview-card/quest-preview-card"
import { useQuestSearchParams } from "@/hooks/use-quest-search-params"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"

interface IQuestGridClient {
	quests: (MinifiedSideQuest | MinifiedFeaturedMap)[]
	draftMode: boolean
}

export default function QuestGridClient({ quests, draftMode }: IQuestGridClient) {
	const { gameParams, mapParams, difficultyParams, page, validatePageParam } =
		useQuestSearchParams()
	const filteredQuests = useMemo(() => {
		let filtered = quests

		if (gameParams.length > 0) {
			filtered = filtered.filter(quest => gameParams.includes(quest.game.slug))
		}

		if (difficultyParams.length > 0) {
			filtered = filtered.filter(quest => {
				if (Predicate.hasProperty(quest, "difficulty") && quest.difficulty) {
					return difficultyParams.includes(quest.difficulty.toLowerCase())
				}
				return false
			})
		}

		if (mapParams.length > 0) {
			filtered = filtered.filter(quest => {
				if (Predicate.hasProperty(quest, "map")) {
					return mapParams.includes(quest.map.slug)
				}
				return false
			})
		}

		return filtered
	}, [difficultyParams, gameParams, mapParams, quests])

	const skip = calculateSkip(page, MAP_LIMIT)
	const paginatedQuests = filteredQuests.slice(skip, MAP_LIMIT * page)

	useEffect(() => {
		validatePageParam(filteredQuests.length)
	}, [filteredQuests, validatePageParam])

	return (
		<>
			<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{paginatedQuests.length > 0 ? (
					paginatedQuests.map((quest, index) => (
						<QuestPreviewCard
							key={quest.id}
							quest={quest}
							questIndex={index}
							draftMode={draftMode}
						/>
					))
				) : (
					<p className="col-span-4 text-center text-muted-foreground">
						No quests found with the selected filters.
					</p>
				)}
			</div>
			<Suspense fallback={<GridPaginationLoader />}>
				<GridPagination data={filteredQuests} />
			</Suspense>
		</>
	)
}
