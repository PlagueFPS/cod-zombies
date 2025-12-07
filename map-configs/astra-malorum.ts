import type { MapConfig, MapConfigMetadata } from "."
import { Option } from "effect"
import { sharedMarkers } from "./markers"

export const metadata: MapConfigMetadata = {
	id: "astra-malorum",
	title: "Astra Malorum",
	state: Option.some("New"),
	image: "/previews/astra-malorum-preview.webp",
	game: "blackOps7",
	description: "Explore Astra Malorum in Black Ops 7 Zombies.",
}

export const config: MapConfig = {
	id: "astra-malorum",
	layers: [
		{
			id: "main-map",
			title: "Main Map",
			image: "/layers/astra-malorum/astra-malorum-layer.webp",
			markers: [
				{
					id: "crash-site",
					title: "Crash Site",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.504, y: 0.709 }],
				},
				{
					id: "the-luminarium",
					title: "The Luminarium",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.413, y: 0.508 }],
				},
				{
					id: "museum-infinitum",
					title: "Museum Infinitum",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.515, y: 0.586 }],
				},
				{
					id: "machina-astralis",
					title: "Machina Astralis",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.68, y: 0.498 }],
				},
				{
					id: "the-veilwalk",
					title: "The Veilwalk",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.662, y: 0.357 }],
				},
				{
					id: "abyssal-rim",
					title: "Abyssal Rim",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.457, y: 0.313 }],
				},
				{
					id: "observatory-dome",
					title: "Observatory Dome",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.581, y: 0.284 }],
				},
				{
					id: "stargazers-courtyard",
					title: "Stargazer's Courtyard",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.531, y: 0.447 }],
				},
				{
					id: "scholars-way",
					title: "Scholar's Way",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.588, y: 0.574 }],
				},
				{
					...sharedMarkers["ammo-cache"],
					icon: "/icons/equipment/ammo-cache-bo7.webp",
					locations: [
						{ x: 0.516, y: 0.678 },
						{ x: 0.521, y: 0.559 },
						{ x: 0.436, y: 0.503 },
						{ x: 0.524, y: 0.494 },
						{ x: 0.412, y: 0.336 },
						{ x: 0.645, y: 0.468 },
						{ x: 0.685, y: 0.353 },
						{ x: 0.586, y: 0.238 },
					],
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [
						{ x: 0.528, y: 0.391 },
						{ x: 0.477, y: 0.276 },
						{ x: 0.7, y: 0.499 },
					],
				},
				{
					...sharedMarkers.arsenal,
					locations: [
						{ x: 0.348, y: 0.493 },
						{ x: 0.624, y: 0.505 },
					],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [
						{ x: 0.498, y: 0.543 },
						{ x: 0.531, y: 0.277 },
					],
				},
				{
					...sharedMarkers["door-buy"],
					locations: [
						{ x: 0.52, y: 0.632 },
						{ x: 0.431, y: 0.623 },
						{ x: 0.565, y: 0.575 },
						{ x: 0.41, y: 0.455 },
						{ x: 0.682, y: 0.466 },
						{ x: 0.701, y: 0.426 },
						{ x: 0.644, y: 0.296 },
						{ x: 0.541, y: 0.258 },
					],
				},
				{
					...sharedMarkers["power-door"],
					locations: [
						{ x: 0.51, y: 0.538 },
						{ x: 0.465, y: 0.517 },
						{ x: 0.612, y: 0.494 },
						{ x: 0.576, y: 0.33 },
					],
				},
				{
					...sharedMarkers.exfil,
					icon: "/icons/equipment/exfil-bo7.webp",
					locations: [
						{ x: 0.496, y: 0.424 },
						{ x: 0.628, y: 0.297 },
					],
				},
			],
		},
		{
			id: "mars",
			title: "Mars",
			image: "/layers/astra-malorum/astra-malorum-mars-layer.webp",
			markers: [],
		},
	],
}
