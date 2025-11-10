import type { Option } from "effect"
import type { MapId } from "@/data/interactive-map"
import type { LayersImagePath, PreviewsImagePath } from "@/types/generated/image-paths.gen"
import type { MapMarker } from "./markers"

export interface MapLayer {
	/** Unique identifier for the map layer */
	id: string
	/** Title of the map layer */
	title: string
	/** path of the image for the map layer */
	image: LayersImagePath
	/** Array of markers associated with the map layer */
	markers: MapMarker[]
}

export interface MapConfigMetadata {
	/** Unique identifier for the map configuration */
	id: MapId
	/** Title of the map configuration */
	title: string
	/** Preview image for the map configuration */
	image: PreviewsImagePath
	/** State of the map configuration */
	state: Option.Option<"Coming Soon" | "New">
	/** Description of the map configuration */
	description: string
	/** Game associated with the map configuration */
	game: string
}

export interface MapConfig {
	/** Unique identifier for the map configuration */
	id: MapId
	/** Array of layers associated with the map configuration */
	layers: MapLayer[]
}
