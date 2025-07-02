import type { MapId } from "@/map-configs"
import { getMapConfig } from "@/data/interactive-map"
import { CustomLink } from "../custom-link/custom-link"
import { Badge } from "../ui/badge"
import PreviewCardImage from "./preview-card-image"

interface IPreviewCard {
	mapId: MapId
	index: number
}

export default async function PreviewCard({ mapId, index }: IPreviewCard) {
	const config = await getMapConfig(mapId)
	if (!config) return null

	return (
		<CustomLink href={`/maps/${config.id}`} aria-label={`View ${config.title} interactive map`} className="group">
			<div className="flex flex-col items-start justify-center gap-4">
				<div className="flex w-full items-center justify-center overflow-hidden rounded-md shadow-xl dark:shadow-none">
					<PreviewCardImage mapId={mapId} title={config.title} priority={index === 0} />
				</div>
				<div className="flex flex-col items-start justify-center">
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{config.game}</Badge>
					<h3 className="font-bold text-xl transition-colors group-hover:text-orange-600 group-hover:dark:text-orange-400">
						{config.title}
					</h3>
				</div>
			</div>
		</CustomLink>
	)
}
