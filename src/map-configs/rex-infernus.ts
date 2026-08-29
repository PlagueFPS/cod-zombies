import type { MapConfig } from "@/data/interactive-map"
import { Option } from "effect"
import { perks, sharedMarkers, weapons } from "@/map-configs/markers"

export const config: MapConfig = {
	layers: [
		{
			id: "main",
			title: "Main",
			image: "/layers/rex-infernus/rex-infernus-main-layer.webp",
			markers: []
}
