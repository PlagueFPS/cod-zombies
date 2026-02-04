import GridCardLoader from "@/components/server/grid-card-loader"
import { CARD_LIMIT } from "@/utils/constants"

interface IGridLoader {
	limit?: number
}

export function GridLoader({ limit = CARD_LIMIT }: IGridLoader) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: limit }, (_, i) => (
				<GridCardLoader key={`map-card-loader-${i + 1}`} />
			))}
		</div>
	)
}
