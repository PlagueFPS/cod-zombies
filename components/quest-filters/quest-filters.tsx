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

// export async function SideQuestFilters() {
// 	const mapsPromise = getMapSearchData()
// 	const questsPromise = getQuestSearchData()
// 	const gamesPromise = getGameSearchData()
// 	const [maps, quests, games] = await Promise.all([mapsPromise, questsPromise, gamesPromise])
// 	const questMaps = new Set(quests.map(q => q.map.slug))
// 	const questGames = new Set(quests.map(q => q.game.slug))
// 	const mapFilters = maps
// 		.filter(m => questMaps.has(m.slug))
// 		.map(map => ({
// 			id: map.id,
// 			title: map.title,
// 			slug: map.slug,
// 		}))
// 	const gameFilters = games.filter(g => questGames.has(g.slug))

// 	return (
// 		<Suspense fallback={<QuestFilterLoader filters={["Map", "Game"]} />}>
// 			<QuestFiltersClient type="side" maps={mapFilters} games={gameFilters} />
// 		</Suspense>
// 	)
// }
