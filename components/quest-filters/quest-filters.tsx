import { Suspense } from "react"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"
import { getGameSearchData } from "@/data/games"
import { getMapSearchData } from "@/data/maps"
import { getQuestSearchData } from "@/data/side-quests"
import QuestFiltersClient from "./quest-filters.client"

const difficulties = [
	{
		id: "easy",
		slug: "easy",
		title: "Easy",
	},
	{
		id: "medium",
		slug: "medium",
		title: "Medium",
	},
	{
		id: "hard",
		slug: "hard",
		title: "Hard",
	},
]

export async function MainQuestFilters() {
	const gamesPromise = getGameSearchData()
	const mapsPromise = getMapSearchData()
	const [games, maps] = await Promise.all([gamesPromise, mapsPromise])
	const mapGames = new Set(maps.map(m => m.game.slug))
	const gameFilters = games.filter(g => mapGames.has(g.slug))

	return (
		<Suspense fallback={<QuestFilterLoader filters={["Game", "Difficulty"]} />}>
			<QuestFiltersClient type="main" games={gameFilters} difficulties={difficulties} />
		</Suspense>
	)
}

export async function SideQuestFilters() {
	const mapsPromise = getMapSearchData()
	const questsPromise = getQuestSearchData()
	const gamesPromise = getGameSearchData()
	const [maps, quests, games] = await Promise.all([mapsPromise, questsPromise, gamesPromise])
	const questMaps = new Set(quests.map(q => q.map.slug))
	const questGames = new Set(quests.map(q => q.game.slug))
	const mapFilters = maps
		.filter(m => questMaps.has(m.slug))
		.map(map => ({
			id: map.id,
			title: map.title,
			slug: map.slug,
		}))
	const gameFilters = games.filter(g => questGames.has(g.slug))

	return (
		<Suspense fallback={<QuestFilterLoader filters={["Map", "Game"]} />}>
			<QuestFiltersClient type="side" maps={mapFilters} games={gameFilters} />
		</Suspense>
	)
}
