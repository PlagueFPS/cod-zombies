"use client"
import type { Relic } from "@/data/relics"
import { useFilterParams } from "@/hooks/use-filter-params"
import EmptyGrid from "../empty/empty-grid"
import RelicCard from "../relic-card/relic-card"

interface RelicGridProps {
	relics: Omit<Relic, "content">[]
}

export default function RelicGrid({ relics }: RelicGridProps) {
	const { mapParams, typeParams } = useFilterParams()
	let filteredRelics = relics

	if (mapParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => mapParams.includes(relic.map.id))
	}

	if (typeParams.length > 0) {
		filteredRelics = filteredRelics.filter(relic => typeParams.includes(relic.type.toLowerCase()))
	}

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{filteredRelics.length > 0 ? (
				filteredRelics.map((relic, index) => (
					<RelicCard key={relic.id} relic={relic} relicIndex={index} />
				))
			) : (
				<EmptyGrid className="col-span-4" type="Relic" />
			)}
		</div>
	)
}
