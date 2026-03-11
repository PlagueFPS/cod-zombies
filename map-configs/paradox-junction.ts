import type { MapConfig, MapConfigMetadata } from "@/map-configs"
import { Option } from "effect"

export const metadata: MapConfigMetadata = {
	id: "paradox-junction",
	title: "Paradox Junction",
	state: Option.some("Coming Soon"),
	image: "/previews/paradox-junction-preview.webp",
	game: "blackOps7",
	description:
		"Explore Paradox Junction in Black Ops 7 Zombies. Find all locations for all weapons, intel, and more with our interactive map.",
}

export const config: MapConfig = {
	id: "paradox-junction",
	layers: [],
}
