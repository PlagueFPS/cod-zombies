import { Option } from "effect"
import { Suspense } from "react"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"
import { getGames } from "@/data/games"
import { getMainQuests } from "@/data/main-quests"
import { slugify, sortDifficulties } from "@/utils/functions.client"
import QuestFiltersClient from "./quest-filters.client"

export default function MainQuestFilters() {
	const mainQuests = getMainQuests()
	const games = getGames()
	const questGames = new Set(mainQuests.map(q => q.map.game.id))
	const questDifficulties = new Set(
		mainQuests
			.map(q => q.difficulty)
			.filter(difficulty => Option.isSome(difficulty))
			.sort((a, b) => sortDifficulties(a.value, b.value)),
	)
	const gameFilters = games
		.filter(g => questGames.has(g.id))
		.map(g => ({
			id: g.id,
			slug: g.id,
			title: g.title,
		}))
	const difficultyFilters = Array.from(questDifficulties).map(difficulty => ({
		id: slugify(difficulty.value),
		slug: slugify(difficulty.value),
		title: difficulty.value,
	}))

	return (
		<Suspense fallback={<QuestFilterLoader filters={["Game", "Difficulty"]} />}>
			<QuestFiltersClient type="main" games={gameFilters} difficulties={difficultyFilters} />
		</Suspense>
	)
}
