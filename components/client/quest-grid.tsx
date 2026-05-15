"use client"
import { Option } from "effect"
import { Suspense, useEffect } from "react"
import { GridPagination } from "@/components/client/grid-pagination"
import { QuestPreviewCard } from "@/components/client/quest-preview-card"
import { EmptyGrid } from "@/components/server/empty-grid"
import { GridPaginationLoader } from "@/components/server/grid-pagination-loader"
import {
	getMapByKey,
	MAIN_QUEST_TIME_RANGE_FILTERS,
	compareMapReleaseDescending,
} from "@/data/maps"
import { compareSideQuestDescending } from "@/data/side-quests"
import { useFilterParams } from "@/hooks/use-filter-params"
import { CARD_LIMIT } from "@/utils/constants"
import {
	decodeMap,
	decodeSideQuest,
	type EncodedMapEntry,
	type EncodedSideQuest,
	isMapQuest,
	isSideQuest,
} from "@/utils/rsc-wire"
import {
	calculateSkip,
	compareByOptionalSome,
	getEstimatedTimeMidpoint,
	slugify,
	sortDifficulties,
	sortEstimatedTime,
} from "@/utils/shared-functions"

interface IQuestGrid {
	quests: EncodedMapEntry[] | EncodedSideQuest[]
}

export function QuestGrid({ quests }: IQuestGrid) {
	const {
		gameParams,
		mapParams,
		difficultyParams,
		timeParams,
		sortParam,
		page,
		validatePageParam,
	} = useFilterParams()
	let filteredQuests = quests.map(quest =>
		isMapQuest(quest) ? decodeMap(quest) : decodeSideQuest(quest),
	)

	if (gameParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (isSideQuest(quest)) {
				const map = getMapByKey(quest.map)
				return Option.isSome(map) && gameParams.includes(map.value.game)
			}

			return gameParams.includes(quest.game)
		})
	}

	if (difficultyParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (isMapQuest(quest) && Option.isSome(quest.difficulty)) {
				return difficultyParams.includes(slugify(quest.difficulty.value))
			}
			return false
		})
	}

	if (mapParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (isSideQuest(quest)) {
				const map = getMapByKey(quest.map)
				return Option.isSome(map) && mapParams.includes(map.value.id)
			}
			return false
		})
	}

	if (timeParams.length > 0) {
		filteredQuests = filteredQuests.filter(quest => {
			if (isSideQuest(quest) || Option.isNone(quest.estimatedTimeMins)) return false

			const midpoint = getEstimatedTimeMidpoint(quest.estimatedTimeMins.value)
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

	const validSortParam = sortParam || "latest"
	const sortedQuests = [...filteredQuests]

	switch (validSortParam) {
		case "oldest":
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareMapReleaseDescending(b, a)
				}

				if (isSideQuest(a) && isSideQuest(b)) {
					return compareSideQuestDescending(b, a)
				}

				return 0
			})
			break
		case "difficulty-asc":
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareByOptionalSome(a.difficulty, b.difficulty, sortDifficulties)
				}
				return 0
			})
			break
		case "difficulty-desc":
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareByOptionalSome(b.difficulty, a.difficulty, sortDifficulties)
				}
				return 0
			})
			break
		case "time-asc":
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareByOptionalSome(a.estimatedTimeMins, b.estimatedTimeMins, sortEstimatedTime)
				}
				return 0
			})
			break
		case "time-desc":
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareByOptionalSome(b.estimatedTimeMins, a.estimatedTimeMins, sortEstimatedTime)
				}
				return 0
			})
			break
		default: // latest
			sortedQuests.sort((a, b) => {
				if (isMapQuest(a) && isMapQuest(b)) {
					return compareMapReleaseDescending(a, b)
				}

				if (isSideQuest(a) && isSideQuest(b)) {
					return compareSideQuestDescending(a, b)
				}

				return 0
			})
			break
	}

	const skip = calculateSkip(page, CARD_LIMIT)
	const paginatedQuests = sortedQuests.slice(skip, CARD_LIMIT * page)

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
