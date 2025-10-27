import type { MapConfig } from "@/map-configs"
import { perks, sharedMarkers, weapons } from "./markers"

const reckoning: MapConfig = {
	id: "reckoning",
	title: "Reckoning",
	state: null,
	game: "Black Ops 6",
	description:
		"Find all Janus Crates, Loot Bins, C.A.S.T.E.R. Turrets, Intel, and more with our Reckoning interactive map in Black Ops 6 Zombies.",
	layers: [
		{
			id: "t1-project-janus-reception-layer",
			title: "T1 Project Janus Reception",
			image: "/layers/reckoning/t1-project-janus-reception.webp",
			markers: [
				{
					id: "t1-project-janus-reception",
					title: "T1 Project Janus Reception",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.550, y: 0.500 }]
				},
				{
					...sharedMarkers["loot-bin"],
					locations: [
						{ x: 0.784, y: 0.561, title: "Golden Loot Bin", description: "Only lootable once you have interacted with all other loot bins." },
						{ x: 0.677, y: 0.396 },
						{ x: 0.402, y: 0.402 },
					],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.419, y: 0.670 }]
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [
						{ x: 0.694, y: 0.562, title: "Tier II Armor Wall Buy" },
					]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.523, y: 0.460, title: "Miracle Worker" }]
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.784, y: 0.553, title: "I'm a Real Girl", description: "You must complete the 'Golden Loot Bin' side quest to obtain this document." }]
				},
				{
					...sharedMarkers["door-buy"],
					locations: [{ x: 0.507, y: 0.213 }, { x: 0.504, y: 0.790 }]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.505, y: 0.813, title: "Aether Elevator", description: "Travel to T1 Quantum Computing Core" },
						{ x: 0.505, y: 0.186, title: "Aether Elevator", description: "Travel to T1 Mutant Research Lab" }
					]
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [{ x: 0.499, y: 0.538 }]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.485, y: 0.501 }]
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.312, y: 0.500, description: "Teleport to T1 Director's Office." },
						{ x: 0.822, y: 0.607, description: "Teleport to T2 Sublevel 10." },
					]
				},
				{
					...sharedMarkers["power-door"],
					locations: [
						{ x: 0.325, y: 0.501 },
						{ x: 0.682, y: 0.587 },
						{ x: 0.763, y: 0.565 },
					]
				},
				{
					...sharedMarkers["rampage-inducer"],
					locations: [
						{ x: 0.686, y: 0.454 },
					]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [
						{ x: 0.688, y: 0.608 }
					]
				},
				{
					...perks["quick-revive"],
					locations: [{ x: 0.335, y: 0.600 }],
				},
				{
					...weapons.gs45,
					locations: [{ x: 0.497, y: 0.469 }]
				}
			],
		}
	],
}

export default reckoning
