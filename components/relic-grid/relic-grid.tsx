"use client"
import type { Relic } from "@/data/relics"
import { useFilterParams } from "@/hooks/use-filter-params"
import { sortReleaseDateAsc, sortReleaseDateDesc, sortRelicTypes } from "@/utils/functions.client"
import EmptyGrid from "../empty/empty-grid"
import RelicCard from "../relic-card/relic-card"

interface RelicGridProps {
	relics: Omit<Relic, "content">[]
}

export default function RelicGrid({ relics }: RelicGridProps) {
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
