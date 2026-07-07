import { EmptyGrid } from "@/components/empty-grid"
import { MapPreviewCard } from "@/components/map-preview-card"
import { useIsMobile } from "@/hooks/use-mobile"
import { decodeInteractiveMap, type EncodedInteractiveMap } from "@/utils/rsc-wire"

interface IMapsGrid {
	maps: EncodedInteractiveMap[]
}

export function MapsGrid({ maps }: IMapsGrid) {
	const isMobile = useIsMobile()

	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{maps.length > 0 ? (
				maps.map((map, index) => (
					<MapPreviewCard
						key={map.id}
						map={decodeInteractiveMap(map)}
						priority={!isMobile ? index <= 2 : index === 0}
					/>
				))
			) : (
				<EmptyGrid className="col-span-4" type="Map" />
			)}
		</div>
	)
}
