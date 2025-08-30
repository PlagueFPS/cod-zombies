import { Suspense } from "react"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"
import { getGames } from "@/data/games"
import { getMainQuestMetadata } from "@/data/main-quests"
import { slugify } from "@/utils/functions.client"
import QuestFiltersClient from "./quest-filters.client"

export async function MainQuestFilters() {
	const mainQuestsPromise = getMainQuestMetadata()
	const gamesPromise = getGames()
	const [mainQuests, games] = await Promise.all([mainQuestsPromise, gamesPromise])
	const questGames = new Set(mainQuests.map(q => q.game.slug))
	const questDifficulties = new Set(
		mainQuests
			.map(q => q.difficulty)
			.filter(difficulty => difficulty !== null && difficulty !== undefined),
	)
	const gameFilters = games.filter(g => questGames.has(g.slug))
	const difficultyFilters = Array.from(questDifficulties).map(difficulty => ({
		id: slugify(difficulty),
		slug: slugify(difficulty),
		title: difficulty,
	}))

	return (
		<Suspense fallback={<QuestFilterLoader filters={["Game", "Difficulty"]} />}>
			<QuestFiltersClient type="main" games={gameFilters} difficulties={difficultyFilters} />
		</Suspense>
	)
}
