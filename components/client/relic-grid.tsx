"use client"
import type { Relic } from "@/data/relics"
import { RelicCard } from "@/components/client/relic-card"
import { EmptyGrid } from "@/components/server/empty-grid"
import { useFilterParams } from "@/hooks/use-filter-params"
import { sortEstimatedTimeAsc, sortEstimatedTimeDesc, sortReleaseDateAsc, sortReleaseDateDesc, sortRelicTypes } from "@/utils/shared-functions"

interface RelicGridProps {
	relics: Omit<Relic, "content">[]
}

export function RelicGrid({ relics }: RelicGridProps) {
	const { mapParams, typeParams, sortParam } = useFilterParams()
	let filteredRelics = [...relics]

	if (mapParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => mapParams.includes(relic.map.id))
	}

	if (typeParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => typeParams.includes(relic.type.toLowerCase()))
	}

	// Apply sorting
	const validSortParam = sortParam || "discovered-desc"
	const sortedRelics = [...filteredRelics]

	switch (validSortParam) {
		case "discovered-asc":
			sortedRelics.sort((a, b) => sortReleaseDateAsc(a.discoveredDate, b.discoveredDate))
			break
		case "type-asc":
			sortedRelics.sort((a, b) => sortRelicTypes(a.type, b.type))
			break
		case "type-desc":
			sortedRelics.sort((a, b) => sortRelicTypes(b.type, a.type))
			break
		case "time-asc":
			sortedRelics.sort((a, b) => sortEstimatedTimeAsc(a.estimatedTimeMins, b.estimatedTimeMins))
			break
		case "time-desc":
			sortedRelics.sort((a, b) => sortEstimatedTimeDesc(a.estimatedTimeMins, b.estimatedTimeMins))
			break
		default:
			sortedRelics.sort((a, b) => sortReleaseDateDesc(a.discoveredDate, b.discoveredDate))
			break
	}

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{sortedRelics.length > 0 ? (
				sortedRelics.map((relic, index) => (
					<RelicCard key={relic.id} relic={relic} relicIndex={index} />
				))
			) : (
				<EmptyGrid className="col-span-4" type="Relic" />
			)}
		</div>
	)
}
