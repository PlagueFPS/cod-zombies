import { MAP_LIMIT } from "@/utils/constants"
import GridCardLoader from "./grid-card-loader"

export default function GridLoader() {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: MAP_LIMIT }, (_, i) => (
				<GridCardLoader key={`map-card-loader-${i + 1}`} />
			))}
		</div>
	)
}
