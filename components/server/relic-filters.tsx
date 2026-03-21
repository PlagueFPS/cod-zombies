import { Suspense } from "react"
import { GridFilters } from "@/components/client/grid-filters"
import { FilterLoader } from "@/components/server/filter-loader"
import { getMaps } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { slugify } from "@/utils/shared-functions"

export function RelicFilters() {
	const maps = getMaps()
	const relics = getRelics()
	const relicMaps = new Set<string>(relics.map(r => r.map))
	const relicTypes = [...new Set(relics.map(r => r.type))].map(type => {
		const typeId = slugify(type)
		return {
			value: typeId,
			label: type,
		}
	})
	const mapFilters = maps.flatMap(m => {
		if (!relicMaps.has(m.id)) return []
		return [
			{
				value: m.id,
				label: m.title,
			},
		]
	})

	return (
		<Suspense fallback={<FilterLoader placeholder="Map, Type" />}>
			<GridFilters type="relic" maps={mapFilters} types={relicTypes} placeholder="Map, Type" />
		</Suspense>
	)
}
