import type { Filter } from "../filters-combobox/filters-combobox"
import { Suspense } from "react"
import { getGameSearchData } from "@/data/games"
import { getMapSearchData } from "@/data/maps"
import { getReferencedMaps, getZombieSearchData } from "@/data/zombies"
import BestiaryFiltersLoader from "../loaders/bestiary-filters-loader"
import BestiaryFiltersClient from "./bestiary-filters.client"

const types: Filter[] = [
	{
		id: "normal",
		slug: "normal",
		title: "Normal",
	},
	{
		id: "special",
		slug: "special",
		title: "Special",
	},
	{
		id: "elite",
		slug: "elite",
		title: "Elite",
	},
	{
		id: "boss",
		slug: "boss",
		title: "Boss",
	},
]

export default async function BestiaryFilters() {
	const zombiesPromise = getZombieSearchData()
	const gamesPromise = getGameSearchData()
	const mapsPromise = getMapSearchData()
	const referencedMapsPromise = getReferencedMaps()
	const [zombies, games, maps, referencedMaps] = await Promise.all([
		zombiesPromise,
		gamesPromise,
		mapsPromise,
		referencedMapsPromise,
	])
	const validGames = new Set(zombies.flatMap(z => z.games.map(g => g.slug)))
	const validMaps = new Set(zombies.flatMap(z => z.maps.map(m => m.slug)))
	const gameFilters = games.filter(g => validGames.has(g.slug))
	const mapFilters = [
		...referencedMaps.filter(m => validMaps.has(m.slug)),
		...maps
			.filter(m => validMaps.has(m.slug))
			.map(m => ({
				id: m.id,
				title: m.title,
				slug: m.slug,
			})),
	]

	return (
		<Suspense fallback={<BestiaryFiltersLoader />}>
			<BestiaryFiltersClient games={gameFilters} maps={mapFilters} types={types} />
		</Suspense>
	)
}
