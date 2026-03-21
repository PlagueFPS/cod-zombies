"use client"
import { Suspense, useEffect } from "react"
import { GridPagination } from "@/components/client/grid-pagination"
import { RelicCard } from "@/components/client/relic-card"
import { EmptyGrid } from "@/components/server/empty-grid"
import { GridPaginationLoader } from "@/components/server/grid-pagination-loader"
import { useFilterParams } from "@/hooks/use-filter-params"
import { CARD_LIMIT } from "@/utils/constants"
import { decodeRelic, type EncodedRelic } from "@/utils/rsc-wire"
import {
	calculateSkip,
	sortEstimatedTime,
	sortReleaseDate,
	sortRelicTypes,
} from "@/utils/shared-functions"

interface RelicGridProps {
	relics: EncodedRelic[]
}

export function RelicGrid({ relics }: RelicGridProps) {
	const { page, validatePageParam, mapParams, typeParams, sortParam } = useFilterParams()
	let filteredRelics = relics.map(decodeRelic)

	if (mapParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => mapParams.includes(relic.map))
	}

	if (typeParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => typeParams.includes(relic.type.toLowerCase()))
	}

	// Apply sorting
	const validSortParam = sortParam || "discovered-desc"
	const sortedRelics = [...filteredRelics]

	switch (validSortParam) {
		case "discovered-asc":
			sortedRelics.sort((a, b) => sortReleaseDate(a.discoveredDate, b.discoveredDate))
			break
		case "type-asc":
			sortedRelics.sort((a, b) => sortRelicTypes(a.type, b.type))
			break
		case "type-desc":
			sortedRelics.sort((a, b) => sortRelicTypes(b.type, a.type))
			break
		case "time-asc":
			sortedRelics.sort((a, b) => sortEstimatedTime(a.estimatedTimeMins, b.estimatedTimeMins))
			break
		case "time-desc":
			sortedRelics.sort((a, b) => sortEstimatedTime(b.estimatedTimeMins, a.estimatedTimeMins))
			break
		default:
			sortedRelics.sort((a, b) => sortReleaseDate(b.discoveredDate, a.discoveredDate))
			break
	}

	const skip = calculateSkip(page, CARD_LIMIT)
	const paginatedRelics = sortedRelics.slice(skip, CARD_LIMIT * page)

	useEffect(() => {
		validatePageParam(sortedRelics.length)
	}, [sortedRelics.length, validatePageParam])

	return (
		<>
			<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{paginatedRelics.length ? (
					paginatedRelics.map((relic, index) => (
						<RelicCard key={relic.id} relic={relic} relicIndex={index} />
					))
				) : (
					<EmptyGrid className="col-span-4" type="Relic" />
				)}
			</div>
			<Suspense fallback={<GridPaginationLoader />}>
				<GridPagination data={sortedRelics} />
			</Suspense>
		</>
	)
}
