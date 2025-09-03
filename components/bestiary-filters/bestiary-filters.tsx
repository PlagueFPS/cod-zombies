import { Suspense } from "react"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getZombieTypes } from "@/data/zombies"
import { slugify } from "@/utils/functions.client"
import BestiaryFiltersLoader from "../loaders/bestiary-filters-loader"
import BestiaryFiltersClient from "./bestiary-filters.client"

export default async function BestiaryFilters() {
	const typesPromise = getZombieTypes()
	const gamesPromise = getGames()
	const mapsPromise = getMaps()
	const [types, games, maps] = await Promise.all([typesPromise, gamesPromise, mapsPromise])
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
