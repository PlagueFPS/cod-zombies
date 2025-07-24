"use client"
import type { MinifiedZombie } from "@/data/zombies"
import { Suspense, useEffect } from "react"
import { useFilterParams } from "@/hooks/use-filter-params"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import BestiaryCard from "../bestiary-card/bestiary-card"
import GridPagination from "../grid-pagination/grid-pagination"
import GridPaginationLoader from "../loaders/grid-pagination-loader"

interface IBestiaryGridClient {
	zombies: MinifiedZombie[]
	draftMode: boolean
}

export default function BestiaryGridClient({ zombies, draftMode }: IBestiaryGridClient) {
	const { gameParams, mapParams, typeParams, page, validatePageParam } = useFilterParams()
	let filteredZombies = zombies

	if (gameParams.length > 0) {
		filteredZombies = filteredZombies.filter(
			z => z.games.some(game => gameParams.includes(game.slug)) || z.slug === "zombie",
		)
	}

	if (mapParams.length > 0) {
		filteredZombies = filteredZombies.filter(
			z => z.maps.some(map => mapParams.includes(map.slug)) || z.slug === "zombie",
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
						<BestiaryCard
							key={zombie.id}
							zombie={zombie}
							zombieIndex={index}
							draftMode={draftMode}
						/>
					))
				) : (
					<p className="col-span-4 text-center text-muted-foreground">
						No zombies found with the selected filters.
					</p>
				)}
			</div>
			<Suspense fallback={<GridPaginationLoader />}>
				<GridPagination data={filteredZombies} />
			</Suspense>
		</>
	)
}
