import type { MapConfig, MapConfigMetadata } from "."
import { Option } from "effect"

export const metadata: MapConfigMetadata = {
	id: "astra-malorum",
	title: "Astra Malorum",
	state: Option.some("Coming Soon"),
	image: "/previews/astra-malorum-preview.webp",
	game: "blackOps7",
	description: "Explore Astra Malorum in Black Ops 7 Zombies.",
}

export const config: MapConfig = {
	id: "astra-malorum",
	layers: [],
}
