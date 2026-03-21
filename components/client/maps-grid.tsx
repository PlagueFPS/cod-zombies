"use client"

import { MapPreviewCard } from "@/components/client/map-preview-card"
import { getGameByKey } from "@/data/games"
import { useFilterParams } from "@/hooks/use-filter-params"
import { decodeInteractiveMap, type EncodedInteractiveMap } from "@/utils/rsc-wire"

interface IMapsGrid {
	maps: EncodedInteractiveMap[]
}

export function MapsGrid({ maps }: IMapsGrid) {
	const { gameParams } = useFilterParams()
	let filteredMaps = maps.map(decodeInteractiveMap)

	if (gameParams.length > 0) {
		filteredMaps = filteredMaps.filter(m => gameParams.includes(getGameByKey(m.game).valueOrUndefined?.id ?? ""))
	}

	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{filteredMaps.map((map, index) => (
				<MapPreviewCard key={map.id} map={map} index={index} />
			))}
		</div>
	)
}
