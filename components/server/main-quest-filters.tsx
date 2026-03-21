import { Option } from "effect"
import { Suspense } from "react"

import { GridFilters } from "@/components/client/grid-filters"
import { FilterLoader } from "@/components/server/filter-loader"
import { getGames } from "@/data/games"
import {
	getMapsWithMainQuest,
	MAIN_QUEST_TIME_RANGE_FILTERS,
	type MainQuestDifficulty,
} from "@/data/maps"
import { slugify, sortDifficulties } from "@/utils/shared-functions"

export function MainQuestFilters() {
	const mainQuests = getMapsWithMainQuest()
	const games = getGames()
	const questGames = new Set<string>(mainQuests.map(q => q.game))
	const questDifficulties = new Set<MainQuestDifficulty>()

	for (const quest of mainQuests) {
		if (Option.isSome(quest.difficulty)) {
			questDifficulties.add(quest.difficulty.value)
		}
	}

	const gameFilters = games.flatMap(game => {
		if (!questGames.has(game.id)) return []
		return [
			{
				value: game.id,
				label: game.title,
			},
		]
	})

	const difficultyFilters = Array.from(questDifficulties)
		.sort(sortDifficulties)
		.map(difficulty => ({
			value: slugify(difficulty),
			label: difficulty,
		}))
	const timeFilters = MAIN_QUEST_TIME_RANGE_FILTERS.map(range => ({
		value: range.id,
		label: range.title,
	}))

	return (
		<Suspense fallback={<FilterLoader placeholder="Game, Difficulty, Completion Time" />}>
			<GridFilters
				type="main"
				games={gameFilters}
				difficulties={difficultyFilters}
				timeRanges={timeFilters}
				placeholder="Game, Difficulty, Completion Time"
			/>
		</Suspense>
	)
}
