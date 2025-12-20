import { Suspense } from "react"
import { getMaps } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { slugify } from "@/utils/functions.client"
import FilterLoader from "../loaders/filter-loader"
import RelicFiltersClient from "./relic-filters.client"

export default function RelicFilters() {
	const maps = getMaps()
	const relics = getRelics()
	const relicMaps = new Set(relics.map(r => r.map.id))
	const relicTypes = [...new Set(relics.map(r => r.type))].map(type => {
		const typeId = slugify(type)
		return {
			id: typeId,
			slug: typeId,
			title: type,
		}
	})
	const mapFilters = maps
		.filter(m => relicMaps.has(m.id))
		.map(m => ({
			id: m.id,
			slug: m.id,
			title: m.title,
		}))

	return (
		<Suspense fallback={<FilterLoader filters={["Map", "Type"]} />}>
			<RelicFiltersClient maps={mapFilters} types={relicTypes} />
		</Suspense>
	)
}
