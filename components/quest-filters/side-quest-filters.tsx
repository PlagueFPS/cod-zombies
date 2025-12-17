import { Suspense } from "react"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getSideQuests } from "@/data/side-quests"
import FilterLoader from "../loaders/filter-loader"
import QuestFiltersClient from "./quest-filters.client"

export function SideQuestFilters() {
	const maps = getMaps()
	const quests = getSideQuests()
	const games = getGames()
	const questMaps = new Set(quests.map(q => q.map.id))
	const questGames = new Set(quests.map(q => q.map.game.id))
	const mapFilters = maps
		.filter(m => questMaps.has(m.id))
		.map(map => ({
			id: map.id,
			slug: map.id,
			title: map.title,
		}))
	const gameFilters = games
		.filter(g => questGames.has(g.id))
		.map(g => ({
			id: g.id,
			slug: g.id,
			title: g.title,
		}))

	return (
		<Suspense fallback={<FilterLoader filters={["Map", "Game"]} />}>
			<QuestFiltersClient type="side" maps={mapFilters} games={gameFilters} />
		</Suspense>
	)
}
