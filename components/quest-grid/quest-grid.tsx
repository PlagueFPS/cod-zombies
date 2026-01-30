"use client"
import type { MainQuest, MainQuestDifficulty } from "@/data/main-quests"
import type { SideQuest } from "@/data/side-quests"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { Suspense, useEffect } from "react"
import GridPagination from "@/components/grid-pagination/grid-pagination"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import QuestPreviewCard from "@/components/quest-preview-card/quest-preview-card"
import { useFilterParams } from "@/hooks/use-filter-params"
import { MAP_LIMIT } from "@/utils/constants"
import {
	calculateSkip,
	sortDifficulties,
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
	const { gameParams, mapParams, difficultyParams, sortParam, page, validatePageParam } =
		useFilterParams()
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

	// Apply sorting
	const isMainQuest = filteredQuests.length > 0 && filteredQuests[0]?._tag === "MainQuest"
	const validSortParam = sortParam || "latest"

	if (isMainQuest) {
		// Main quest sorting
		switch (validSortParam) {
			case "oldest":
				filteredQuests.sort((a, b) => sortReleaseDateAsc(a.map.releaseDate, b.map.releaseDate))
				break
			case "difficulty-asc":
				filteredQuests.sort((a, b) => {
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
				filteredQuests.sort((a, b) => {
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
			default:
				filteredQuests.sort((a, b) => sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate))
				break
		}
	} else {
		// Side quest sorting
		if (validSortParam === "oldest") {
			filteredQuests.sort((a, b) => sortReleaseDateAsc(a.map.releaseDate, b.map.releaseDate))
		} else {
			// Default: latest (descending by map release date)
			filteredQuests.sort((a, b) => sortReleaseDateDesc(a.map.releaseDate, b.map.releaseDate))
		}
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
