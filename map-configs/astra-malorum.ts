import type { MapConfig, MapConfigMetadata } from "."
import { Option } from "effect"
import { perks, sharedMarkers, weapons } from "./markers"

export const metadata: MapConfigMetadata = {
	id: "astra-malorum",
	title: "Astra Malorum",
	state: Option.none(),
	image: "/previews/astra-malorum-preview.webp",
	game: "blackOps7",
	description:
		"Explore Astra Malorum in Black Ops 7 Zombies. Find locations for all Aether Crystals, weapons, intel, and more with our interactive map.",
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
					locations: [{ x: 0.39, y: 0.508 }],
				},
				{
					id: "museum-infinitum",
					title: "Museum Infinitum",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.515, y: 0.6 }],
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
					id: "aether-crystal",
					title: "Aether Crystal",
					category: "objectives",
					description: "Dark Aether Crystal that can be destroyed for a variety of loot.",
					icon: "/icons/objectives/aether-crystal.webp",
					locations: [
						{ x: 0.49, y: 0.719 },
						{ x: 0.485, y: 0.617 },
						{ x: 0.438, y: 0.563 },
						{ x: 0.476, y: 0.528 },
						{ x: 0.6, y: 0.562 },
						{ x: 0.536, y: 0.47 },
						{ x: 0.506, y: 0.403 },
						{ x: 0.561, y: 0.469 },
						{ x: 0.568, y: 0.391 },
						{ x: 0.569, y: 0.337 },
						{ x: 0.427, y: 0.355 },
						{ x: 0.676, y: 0.329 },
					],
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
						{ x: 0.642, y: 0.535 },
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
						{ x: 0.494, y: 0.632 },
					],
				},
				{
					...sharedMarkers.portal,
					locations: [
						{
							x: 0.453,
							y: 0.696,
							title: "Observatory Dome Portal",
							description: "Travel to Observatory Dome",
						},
						{
							x: 0.636,
							y: 0.276,
							title: "Crash Site Portal",
							description: "Travel to Crash Site",
						},
						{
							x: 0.68,
							y: 0.496,
							title: "Mars Portal",
							description: "Teleport to Mars after completing most of the main quest.",
						},
					],
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [
						{ x: 0.445, y: 0.622 },
						{ x: 0.583, y: 0.354 },
					],
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [
						{ x: 0.428, y: 0.65 },
						{ x: 0.396, y: 0.478 },
						{ x: 0.662, y: 0.531 },
						{ x: 0.559, y: 0.48 },
						{ x: 0.495, y: 0.314 },
						{ x: 0.508, y: 0.585 },
					],
				},
				{
					...sharedMarkers["pack-a-punch"],
					locations: [{ x: 0.582, y: 0.271 }],
				},
				{
					...sharedMarkers["rampage-inducer"],
					locations: [{ x: 0.454, y: 0.667 }],
				},
				{
					...sharedMarkers.trap,
					locations: [
						{
							x: 0.391,
							y: 0.524,
							title: "Stellar Dissector",
							description: "Cut up zombies with fatal laser beams.",
						},
						{
							x: 0.534,
							y: 0.403,
							title: "Apogee Annihilator",
							description: "Bomb zombies with Astronomer Rockets.",
						},
					],
				},
				{
					...sharedMarkers.document,
					locations: [
						{
							x: 0.436,
							y: 0.515,
							title: "Immense Power",
							description:
								"Obtained by shooting the hanging planets in the correct order from the sun.",
						},
						{
							x: 0.439,
							y: 0.301,
							title: "Their Town",
						},
						{
							x: 0.679,
							y: 0.439,
							title: "Eventful",
							description: "Obtained by shooting the stack of papers on the table.",
						},
					],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [
						{ x: 0.394, y: 0.551, title: "Fools" },
						{ x: 0.546, y: 0.234, title: "Planets" },
						{ x: 0.67, y: 0.317, title: "Dual Functions" },
						{ x: 0.727, y: 0.501, title: "Robotics" },
					],
				},
				{
					...perks["der-wunderfizz"],
					locations: [{ x: 0.511, y: 0.458 }],
				},
				{
					...perks.juggernog,
					locations: [{ x: 0.418, y: 0.519 }],
				},
				{
					...perks["quick-revive"],
					locations: [{ x: 0.489, y: 0.65 }],
				},
				{
					...perks["speed-cola"],
					locations: [{ x: 0.528, y: 0.582 }],
				},
				{
					...perks["stamin-up"],
					locations: [{ x: 0.713, y: 0.436 }],
				},
				{
					...perks["wisp-tea"],
					locations: [{ x: 0.462, y: 0.265 }],
				},
				{
					...perks["mule-kick"],
					locations: [{ x: 0.652, y: 0.345 }],
				},
				{
					...weapons.akita,
					locations: [{ x: 0.714, y: 0.53 }],
				},
				{
					...weapons["m34-novaline"],
					locations: [{ x: 0.433, y: 0.534 }],
				},
				{
					...weapons["shadow-sk"],
					locations: [{ x: 0.456, y: 0.363 }],
				},
				{
					...weapons["x9-maverick"],
					locations: [{ x: 0.598, y: 0.323 }],
				},
				{
					...weapons.xm325,
					locations: [{ x: 0.566, y: 0.442 }],
				},
				{
					...weapons["jaeger-45"],
					locations: [{ x: 0.473, y: 0.67 }],
				},
				{
					...weapons["carbon-57"],
					locations: [{ x: 0.511, y: 0.585 }],
				},
			],
		},
		{
			id: "mars",
			title: "Mars",
			image: "/layers/astra-malorum/astra-malorum-mars-layer.webp",
			markers: [
				{
					id: "mars",
					title: "Mars",
					type: "label",
					description: "",
					icon: null,
					category: "general",
					locations: [{ x: 0.5, y: 0.5 }],
				},
				{
					...sharedMarkers["ammo-cache"],
					icon: "/icons/equipment/ammo-cache-bo7.webp",
					locations: [{ x: 0.531, y: 0.399 }],
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [{ x: 0.317, y: 0.546 }],
				},
				{
					...sharedMarkers.portal,
					locations: [
						{
							x: 0.273,
							y: 0.5,
							title: "Machina Astralis Portal",
							description: "Travel to Machina Astralis",
						},
					],
				},
			],
		},
	],
}
