import type { MapConfig, MapConfigMetadata } from "."
import { Option } from "effect"

export const metadata: MapConfigMetadata = {
	id: "ashes-of-the-damned",
	title: "Ashes of the Damned",
	image: "/previews/ashes-of-the-damned-preview.webp",
	state: Option.some("New"),
	game: "Black Ops 7",
	description:
		"Explore Ashes of the Damned in Black Ops 7 Zombies. Find locations for all perks, weapons, fast travels, intel, and more with our interactive map.",
}

export const config: MapConfig = {
	id: "ashes-of-the-damned",
	layers: [
		{
			id: "ashes-of-the-damned-layer",
			title: "Ashes of the Damned Layer",
			image: "/layers/ashes-of-the-damned/ashes-of-the-damned-layer.webp",
			markers: [],
		},
	],
}
