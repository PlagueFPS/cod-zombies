import type { MapConfig } from "@/data/interactive-map"

export const config: MapConfig = {
	layers: [
		{
			id: "eidskallen",
			title: "Eidskallen",
			image: "/layers/totenreich/totenreich-eidskallen-layer.webp",
			markers: [],
		},
		{
			id: "boss-fight-arena",
			title: "Boss Fight Arena",
			image: "/layers/totenreich/totenreich-boss-fight-arena-layer.webp",
			markers: [],
		},
	],
}
