"use client"

import type { MapConfigMetadata } from "@/map-configs"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { MapPreviewCard } from "@/components/client/map-preview-card"
import { getGameByKey } from "@/data/games"
import { useFilterParams } from "@/hooks/use-filter-params"

type TransformedMetadata = Omit<MapConfigMetadata, "state"> & { state: ContentState | null }

interface IMapsGrid {
	maps: TransformedMetadata[]
}

export function MapsGrid({ maps }: IMapsGrid) {
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
				<MapPreviewCard key={map.id} map={map} index={index} />
			))}
		</div>
	)
}
