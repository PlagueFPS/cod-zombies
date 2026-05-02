import type { MapConfig } from "@/data/interactive-map"
import { Option } from "effect"

export const config: MapConfig = {
	layers: [
		{
			id: "eidskallen",
			title: "Eidskallen",
			image: "/layers/totenreich/totenreich-eidskallen-layer.webp",
			markers: [
				{
					id: "fishing-spot",
					title: "Fishing Spot",
					icon: Option.some("/icons/objectives/fish.webp"),
					category: "objectives",
					description:
						"Location where you can fish for items to get rewards, and potentially get a green fish spawn for the main quest.",
					locations: [
						{ x: 0.529, y: 0.838 },
						{ x: 0.621, y: 0.75 },
						{ x: 0.71, y: 0.771 },
					],
				},
			],
		},
		{
			id: "boss-fight-arena",
			title: "Boss Fight Arena",
			image: "/layers/totenreich/totenreich-boss-fight-arena-layer.webp",
			markers: [],
		},
	],
}
