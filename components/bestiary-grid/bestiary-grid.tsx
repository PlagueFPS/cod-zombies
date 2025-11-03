"use client"
import type { Zombie } from "@/data/zombies"
import { Suspense, useEffect } from "react"
import { useFilterParams } from "@/hooks/use-filter-params"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/functions.client"
import BestiaryCard from "../bestiary-card/bestiary-card"
import EmptyGrid from "../empty/empty-grid"
import GridPagination from "../grid-pagination/grid-pagination"
import GridPaginationLoader from "../loaders/grid-pagination-loader"

interface IBestiaryGridClient {
	zombies: Omit<Zombie, "combatStrategy">[]
}

export default function BestiaryGridClient({ zombies }: IBestiaryGridClient) {
	const { gameParams, mapParams, typeParams, page, validatePageParam } = useFilterParams()
	let filteredZombies = zombies

	if (gameParams.length > 0) {
		filteredZombies = filteredZombies.filter(
			z => z.games.some(game => gameParams.includes(game.id)) || z.id === "zombie",
		)
	}

	if (mapParams.length > 0) {
		filteredZombies = filteredZombies.filter(
			z => z.maps.some(map => mapParams.includes(map.id)) || z.id === "zombie",
		)
	}

	if (typeParams.length > 0) {
		filteredZombies = filteredZombies.filter(z => typeParams.includes(z.type.toLowerCase()))
	}

	const skip = calculateSkip(page, MAP_LIMIT)
	const paginatedZombies = filteredZombies.slice(skip, MAP_LIMIT * page)

	useEffect(() => {
		validatePageParam(filteredZombies.length)
	}, [filteredZombies.length, validatePageParam])

	return (
		<>
			<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{paginatedZombies.length > 0 ? (
					paginatedZombies.map((zombie, index) => (
						<BestiaryCard key={zombie.id} zombie={zombie} zombieIndex={index} />
					))
				) : (
					<EmptyGrid className="col-span-4" type="Zombie" />
				)}
			</div>
			<Suspense fallback={<GridPaginationLoader />}>
				<GridPagination data={filteredZombies} />
			</Suspense>
		</>
	)
}
