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
		<CustomLink
			href={`/maps/${config.id}`}
			aria-label={`View ${config.title} interactive map`}
			className="group outline-none"
		>
			<div className="flex flex-col items-start justify-center gap-4">
				<div className="flex w-full items-center justify-center overflow-hidden rounded-md shadow-xl group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none">
					<PreviewCardImage
						mapId={mapId}
						title={config.title}
						priority={index === 0}
						className="transition-transform duration-300 will-change-transform group-focus-visible:scale-105"
					/>
				</div>
				<div className="flex flex-col items-start justify-center">
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{config.game}
					</Badge>
					<h3 className="font-bold text-xl transition-colors group-hover:text-primary group-focus-visible:text-primary">
						{config.title}
					</h3>
				</div>
			</div>
		</CustomLink>
	)
}
