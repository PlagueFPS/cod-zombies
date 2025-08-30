import { Suspense } from "react"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getZombies } from "@/data/zombies"
import { slugify } from "@/utils/functions.client"
import BestiaryFiltersLoader from "../loaders/bestiary-filters-loader"
import BestiaryFiltersClient from "./bestiary-filters.client"

export default async function BestiaryFilters() {
	const zombiesPromise = getZombies()
	const gamesPromise = getGames()
	const mapsPromise = getMaps()
	const [zombies, games, maps] = await Promise.all([zombiesPromise, gamesPromise, mapsPromise])
	const validGames = new Set(zombies.flatMap(z => z.games.map(g => g.slug)))
	const validMaps = new Set(zombies.flatMap(z => z.maps.map(m => m.slug)))
	const gameFilters = games.filter(g => validGames.has(g.slug))
	const mapFilters = maps
		.filter(m => validMaps.has(m.slug))
		.map(m => ({
			id: m.id,
			title: m.title,
			slug: m.slug,
		}))
	const types = Array.from(new Set(zombies.map(z => z.type))).map(type => ({
		id: slugify(type),
		slug: slugify(type),
		title: type,
	}))

	return (
		<Suspense fallback={<BestiaryFiltersLoader />}>
			<BestiaryFiltersClient games={gameFilters} maps={mapFilters} types={types} />
		</Suspense>
	)
}
