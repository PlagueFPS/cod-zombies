"use client"

import type { MapConfigMetadata } from "@/map-configs"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { getGameByKey } from "@/data/games"
import { useFilterParams } from "@/hooks/use-filter-params"
import PreviewCard from "./preview-card"

type TransformedMetadata = Omit<MapConfigMetadata, "state"> & { state: ContentState | null }

interface IMapsGrid {
	maps: TransformedMetadata[]
}

export default function MapsGrid({ maps }: IMapsGrid) {
	const { gameParams } = useFilterParams()
	let filteredMaps = maps.map(map => ({
		...map,
		state: Option.fromNullable(map.state),
	}))

	if (gameParams.length > 0) {
		filteredMaps = filteredMaps.filter(m => gameParams.includes(getGameByKey(m.game).id))
	}

	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{filteredMaps.map((map, index) => (
				<PreviewCard key={map.id} map={map} index={index} />
			))}
		</div>
	)
}
