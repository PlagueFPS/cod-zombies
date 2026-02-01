"use client"
import type { SideQuest } from "@/data/side-quests"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { Suspense, useEffect } from "react"
import GridPagination from "@/components/grid-pagination/grid-pagination"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import QuestPreviewCard from "@/components/quest-preview-card/quest-preview-card"
import {
	MAIN_QUEST_TIME_RANGE_FILTERS,
	type MainQuest,
	type MainQuestDifficulty,
} from "@/data/main-quests"
import { useFilterParams } from "@/hooks/use-filter-params"
import { MAP_LIMIT } from "@/utils/constants"
import {
	calculateSkip,
	getEstimatedTimeMidpoint,
	sortDifficulties,
	sortEstimatedTimeAsc,
	sortEstimatedTimeDesc,
	sortReleaseDateAsc,
	sortReleaseDateDesc,
} from "@/utils/functions.client"
import EmptyGrid from "../empty/empty-grid"

type TransformedMainQuest = Omit<MainQuest, "content" | "state" | "difficulty"> & {
	difficulty: MainQuestDifficulty | null
	state: ContentState | null
}
type TransformedSideQuest = Omit<SideQuest, "content" | "state"> & { state: ContentState | null }

interface IQuestGridClient {
	quests: TransformedMainQuest[] | TransformedSideQuest[]
}

export default function QuestGridClient({ quests }: IQuestGridClient) {
	const {
		gameParams,
		mapParams,
		difficultyParams,
		timeParams,
		sortParam,
		page,
		validatePageParam,
	} = useFilterParams()
	let filteredQuests = quests.map(quest => {
		if (quest._tag === "MainQuest") {
			return {
				...quest,
				difficulty: Option.fromNullable(quest.difficulty),
				state: Option.fromNullable(quest.state),
			}
		}

		return {
			...quest,
			state: Option.fromNullable(quest.state),
		}
	})

	if (gameParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => gameParams.includes(quest.map.game.id))
	}

	if (difficultyParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (quest._tag === "MainQuest" && Option.isSome(quest.difficulty)) {
				return difficultyParams.includes(quest.difficulty.value.toLowerCase())
			}
			return false
		})
	}

	if (mapParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (quest._tag === "SideQuest") {
				return mapParams.includes(quest.map.id)
			}
			return false
		})
	}

	if (timeParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (quest._tag !== "MainQuest") return false
			const midpoint = getEstimatedTimeMidpoint(quest.estimatedTimeMins)
			return timeParams.some(slug => {
				const range = MAIN_QUEST_TIME_RANGE_FILTERS.find(r => r.slug === slug)
				if (!range) return false
				// Last range "120-plus" is inclusive on both ends; others: minMins <= midpoint < maxMins
				if (range.slug === "120-plus") {
					return midpoint >= range.minMins && midpoint <= range.maxMins
				}
				return midpoint >= range.minMins && midpoint < range.maxMins
			})
		})
	}

	// Apply sorting
	const isMainQuest = filteredQuests.length > 0 && filteredQuests[0]?._tag === "MainQuest"
	const validSortParam = sortParam || "latest"
	const sortedQuests = [...filteredQuests]

	if (isMainQuest) {
		// Main quest sorting
		switch (validSortParam) {
			case "oldest":
				sortedQuests.sort((a, b) => sortReleaseDateAsc(a.map.releaseDate, b.map.releaseDate))
				break
			case "difficulty-asc":
				sortedQuests.sort((a, b) => {
					if (a._tag === "MainQuest" && b._tag === "MainQuest") {
						const aDiff = Option.isSome(a.difficulty) ? a.difficulty.value : null
						const bDiff = Option.isSome(b.difficulty) ? b.difficulty.value : null
						if (aDiff && bDiff) {
							return sortDifficulties(aDiff, bDiff)
						}
						if (aDiff) return -1
						if (bDiff) return 1
						return 0
					}
					return 0
				})
				break
			case "difficulty-desc":
				sortedQuests.sort((a, b) => {
					if (a._tag === "MainQuest" && b._tag === "MainQuest") {
						const aDiff = Option.isSome(a.difficulty) ? a.difficulty.value : null
						const bDiff = Option.isSome(b.difficulty) ? b.difficulty.value : null
						if (aDiff && bDiff) {
							return sortDifficulties(bDiff, aDiff)
						}
						if (aDiff) return -1
						if (bDiff) return 1
						return 0
					}
					return 0
				})
				break
			case "time-asc":
				sortedQuests.sort((a, b) => {
					if (a._tag === "MainQuest" && b._tag === "MainQuest") {
						return sortEstimatedTimeAsc(a.estimatedTimeMins, b.estimatedTimeMins)
					}
					return 0
				})
				break
			case "time-desc":
				sortedQuests.sort((a, b) => {
					if (a._tag === "MainQuest" && b._tag === "MainQuest") {
						return sortEstimatedTimeDesc(a.estimatedTimeMins, b.estimatedTimeMins)
					}
					return 0
				})
				break
			default:
				sortedQuests.sort((a, b) => sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate))
				break
		}
	} else {
		// Side quest sorting
		if (validSortParam === "oldest") {
			sortedQuests.sort((a, b) => sortReleaseDateAsc(a.map.releaseDate, b.map.releaseDate))
		} else {
			// Default: latest (descending by map release date)
			sortedQuests.sort((a, b) => sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate))
		}
	}

	const skip = calculateSkip(page, MAP_LIMIT)
	const paginatedQuests = sortedQuests.slice(skip, MAP_LIMIT * page)

	useEffect(() => {
		validatePageParam(sortedQuests.length)
	}, [sortedQuests.length, validatePageParam])

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
				<GridPagination data={sortedQuests} />
			</Suspense>
		</>
	)
}
