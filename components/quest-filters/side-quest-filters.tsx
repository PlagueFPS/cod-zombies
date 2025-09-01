import { Suspense } from "react"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getSideQuestsMetadata } from "@/data/side-quests"
import QuestFilterLoader from "../loaders/quest-filter-loader"
import QuestFiltersClient from "./quest-filters.client"

export async function SideQuestFilters() {
	const mapsPromise = getMaps()
	const questsPromise = getSideQuestsMetadata()
	const gamesPromise = getGames()
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
