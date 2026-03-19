"use client"
import type { AmmoModKey } from "@/data/ammo-mods"
import type { Zombie } from "@/data/zombies"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { Suspense, useEffect } from "react"
import { BestiaryCard } from "@/components/client/bestiary-card"
import { GridPagination } from "@/components/client/grid-pagination"
import { EmptyGrid } from "@/components/server/empty-grid"
import { GridPaginationLoader } from "@/components/server/grid-pagination-loader"
import { useFilterParams } from "@/hooks/use-filter-params"
import { CARD_LIMIT } from "@/utils/constants"
import {
	calculateSkip,
	sortReleaseDateAsc,
	sortReleaseDateDesc,
	sortZombieSpeeds,
	sortZombieTypes,
} from "@/utils/shared-functions"

type TransformedZombie = Omit<Zombie, "combatStrategy" | "state"> & { state: ContentState | null }

interface IBestiaryGrid {
	zombies: TransformedZombie[]
}

export function BestiaryGrid({ zombies }: IBestiaryGrid) {
	const { gameParams, mapParams, typeParams, weaknessParams, sortParam, page, validatePageParam } =
		useFilterParams()
	let filteredZombies = zombies.map(zombie => ({
		...zombie,
		state: Option.fromNullOr(zombie.state),
	}))

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

	if (weaknessParams.length > 0) {
		filteredZombies = filteredZombies.filter(z =>
			weaknessParams.some(weakness => z.elementalWeakness.includes(weakness as AmmoModKey)),
		)
	}

	const validSortParam = sortParam || "latest"
	const sortedZombies = [...filteredZombies]

	switch (validSortParam) {
		case "oldest":
			sortedZombies.sort((a, b) => sortReleaseDateAsc(a.releaseDate, b.releaseDate))
			break
		case "type-asc":
			sortedZombies.sort((a, b) => sortZombieTypes(a.type, b.type))
			break
		case "type-desc":
			sortedZombies.sort((a, b) => sortZombieTypes(b.type, a.type))
			break
		case "speed-asc":
			sortedZombies.sort((a, b) => sortZombieSpeeds(a.speed, b.speed))
			break
		case "speed-desc":
			sortedZombies.sort((a, b) => sortZombieSpeeds(b.speed, a.speed))
			break
		default:
			sortedZombies.sort((a, b) => sortReleaseDateDesc(a.releaseDate, b.releaseDate))
			break
	}

	const skip = calculateSkip(page, CARD_LIMIT)
	const paginatedZombies = sortedZombies.slice(skip, CARD_LIMIT * page)

	useEffect(() => {
		validatePageParam(sortedZombies.length)
	}, [sortedZombies.length, validatePageParam])

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
				<GridPagination data={sortedZombies} />
			</Suspense>
		</>
	)
}
