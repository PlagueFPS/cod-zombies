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
	const types = Array.from(new Set(zombies.map(zombie => zombie.type)))
	const typeFilters = types.map(type => ({
		id: slugify(type),
		slug: slugify(type),
		title: type,
	}))

	return (
		<Suspense fallback={<BestiaryFiltersLoader />}>
			<BestiaryFiltersClient games={games} maps={maps} types={typeFilters} />
		</Suspense>
	)
}
