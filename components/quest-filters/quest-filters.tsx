import { draftMode } from "next/headers"
import { Suspense } from "react"
import MapFiltersLoader from "@/components/loaders/map-filters-loader"
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
	const { isEnabled } = await draftMode()
	const gamesPromise = getGameSearchData(isEnabled)
	const mapsPromise = getMapSearchData(isEnabled)
	const [games, maps] = await Promise.all([gamesPromise, mapsPromise])
	const mapGames = new Set(maps.map(m => m.game.slug))
	const gameFilters = games.filter(g => mapGames.has(g.slug))

	return (
		<Suspense fallback={<MapFiltersLoader />}>
			<QuestFiltersClient
				games={gameFilters}
				maps={[]} // passing empty array to avoid sending unnecessary data
				difficulties={difficulties}
			/>
		</Suspense>
	)
}

export async function SideQuestFilters() {
	const { isEnabled } = await draftMode()
	const mapsPromise = getMapSearchData(isEnabled)
	const questsPromise = getQuestSearchData(isEnabled)
	const [maps, quests] = await Promise.all([mapsPromise, questsPromise])
	const questMaps = new Set(quests.map(q => q.map.slug))
	const mapFilters = maps
		.filter(m => questMaps.has(m.slug))
		.map(map => ({
			id: map.id,
			title: map.title,
			slug: map.slug,
		}))

	return (
		<Suspense fallback={<QuestFilterLoader />}>
			<QuestFiltersClient
				maps={mapFilters}
				games={[]} // passing empty array to avoid sending unnecessary data
				difficulties={[]} // passing empty array to avoid sending unnecessary data
			/>
		</Suspense>
	)
}
