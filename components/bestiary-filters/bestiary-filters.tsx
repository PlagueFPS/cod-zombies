import { Suspense } from "react"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getZombies } from "@/data/zombies"
import { slugify, sortZombieTypes } from "@/utils/functions.client"
import BestiaryFiltersLoader from "../loaders/bestiary-filters-loader"
import BestiaryFiltersClient from "./bestiary-filters.client"

export default function BestiaryFilters() {
	const zombies = getZombies()
	const games = getGames().map(game => ({
		id: game.id,
		slug: game.id,
		title: game.title,
	}))
	const maps = getMaps().map(map => ({
		id: map.id,
		slug: map.id,
		title: map.title,
	}))
	const types = Array.from(new Set(zombies.map(zombie => zombie.type).sort(sortZombieTypes)))
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
