import { Option } from "effect"
import { Suspense } from "react"
import FilterLoader from "@/components/loaders/filter-loader"
import { getGames } from "@/data/games"
import { getMainQuests, type MainQuestDifficulty } from "@/data/main-quests"
import { slugify, sortDifficulties } from "@/utils/functions.client"
import QuestFiltersClient from "./quest-filters.client"

export default function MainQuestFilters() {
	const mainQuests = getMainQuests()
	const games = getGames()
	const questGames = new Set(mainQuests.map(q => q.map.game.id))
	const questDifficulties = new Set<MainQuestDifficulty>()

	for (const quest of mainQuests) {
		if (Option.isSome(quest.difficulty)) {
			questDifficulties.add(quest.difficulty.value)
		}
	}

	const gameFilters = games
		.filter(g => questGames.has(g.id))
		.map(g => ({
			id: g.id,
			slug: g.id,
			title: g.title,
		}))
	const difficultyFilters = Array.from(questDifficulties)
		.sort(sortDifficulties)
		.map(difficulty => ({
			id: slugify(difficulty),
			slug: slugify(difficulty),
			title: difficulty,
		}))

	return (
		<Suspense fallback={<FilterLoader filters={["Game", "Difficulty"]} />}>
			<QuestFiltersClient type="main" games={gameFilters} difficulties={difficultyFilters} />
		</Suspense>
	)
}
