import { Suspense } from "react"
import { GridFilters } from "@/components/client/grid-filters"
import { FilterLoader } from "@/components/server/filter-loader"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getSideQuests } from "@/data/side-quests"

export function SideQuestFilters() {
	const maps = getMaps()
	const quests = getSideQuests()
	const games = getGames()
	const questMaps = new Set(quests.map(q => q.map.id))
	const questGames = new Set(quests.map(q => q.map.game.id))
	const mapFilters = maps.flatMap(map => {
		if (!questMaps.has(map.id)) return []
		return [
			{
				value: map.id,
				label: map.title,
			},
		]
	})
	const gameFilters = games.flatMap(game => {
		if (!questGames.has(game.id)) return []
		return [
			{
				value: game.id,
				label: game.title,
			},
		]
	})

	return (
		<Suspense fallback={<FilterLoader placeholder="Game or Map" />}>
			<GridFilters
				type="side"
				games={gameFilters}
				maps={mapFilters}
				placeholder="Game or Map"
			/>
		</Suspense>
	)
}
