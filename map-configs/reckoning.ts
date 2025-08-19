import type { MapConfig } from "@/map-configs"
import { perks, sharedMarkers, weapons } from "./markers"

const reckoning: MapConfig = {
	id: "reckoning",
	title: "Reckoning",
	isComingSoon: false,
	game: "Black Ops 6",
	description:
		"Explore Reckoning in BO6 Zombies. Find all Janus Crates, Loot Bins, C.A.S.T.E.R. Turrets, Intel, and more with our interactive map.",
	layers: [
		{
			id: "tower-1",
			title: "Tower 1",
			image: "/layers/reckoning/tower-1-layer.webp",
			markers: [
				{
					id: "t1-mutant-research-lab",
					type: "label",
					category: "general",
					title: "T1 Mutant Research Lab",
					description: "",
					icon: null,
					locations: [{ x: 0.746, y: 0.531 }],
				},
				{
					id: "t1-mutant-research-test-area",
					type: "label",
					category: "general",
					title: "T1 Mutant Research Test Area",
					description: "",
					icon: null,
					locations: [{ x: 0.651, y: 0.448 }],
				},
				{
					id: "t1-project-janus-reception",
					type: "label",
					category: "general",
					title: "T1 Project Janus Reception",
					description: "",
					icon: null,
					locations: [{ x: 0.475, y: 0.784 }],
				},
				{
					id: "t1-executive-suit",
					type: "label",
					category: "general",
					title: "T1 Executive Suit",
					description: "",
					icon: null,
					locations: [{ x: 0.521, y: 0.234 }],
				},
				{
					id: "t1-quantum-computing-core",
					type: "label",
					category: "general",
					title: "T1 Quantum Computing Core",
					description: "",
					icon: null,
					locations: [{ x: 0.218, y: 0.504 }],
				},
				{
					id: "t1-quantum-computing-lab",
					type: "label",
					category: "general",
					title: "T1 Quantum Computing Lab",
					description: "",
					icon: null,
					locations: [{ x: 0.11, y: 0.495 }],
				},
				{
					id: "t1-director's-office",
					type: "label",
					category: "general",
					title: "T1 Director's Office",
					description: "",
					icon: null,
					locations: [{ x: 0.631, y: 0.118 }],
				},
				{
					id: "t1-bioweapons-lab",
					type: "label",
					category: "general",
					title: "T1 Bioweapons Lab",
					description: "",
					icon: null,
					locations: [{ x: 0.624, y: 0.542 }],
				},
				{
					id: "loot-bin",
					category: "objectives",
					title: "Loot Bin",
					description:
						"Interacting with a loot bin has a chance to grant you any item, e.g. Perks, Aether Tools, Ray Guns, Aetherium Crystals.",
					icon: "/icons/objectives/loot-bin.webp",
					locations: [
						{ x: 0.566, y: 0.72 },
						{ x: 0.396, y: 0.722 },
						{
							x: 0.634,
							y: 0.818,
							title: "Golden Loot Bin",
							description: "Only lootable once you have interacted with all other loot bins.",
						},
						{ x: 0.409, y: 0.279 },
						{ x: 0.494, y: 0.305 },
						{ x: 0.429, y: 0.211 },
						{ x: 0.614, y: 0.271 },
						{ x: 0.467, y: 0.125 },
						{ x: 0.359, y: 0.171 },
					],
				},
				{
					id: "aetheric-flora",
					category: "objectives",
					title: "Aetheric Flora",
					description: "Aetheric Flora used to charge the Cyst for the Gorgofex",
					icon: "/icons/objectives/aetheric-flora.webp",
					locations: [
						{ x: 0.095, y: 0.502 },
						{ x: 0.138, y: 0.653 },
						{ x: 0.173, y: 0.606 },
					],
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [
						{ x: 0.576, y: 0.849 },
						{ x: 0.658, y: 0.439 },
						{ x: 0.104, y: 0.441 },
						{ x: 0.462, y: 0.121 },
					],
				},
				{
					...perks["quick-revive"],
					locations: [{ x: 0.355, y: 0.844 }],
				},
				{
					...perks["speed-cola"],
					locations: [{ x: 0.013, y: 0.482 }],
				},
				{
					...perks.juggernog,
					locations: [{ x: 0.499, y: 0.286 }],
				},
				{
					...perks["phd-flopper"],
					locations: [{ x: 0.65, y: 0.484 }],
				},
				{
					...perks["melee-macchiato"],
					locations: [{ x: 0.16, y: 0.524 }],
				},
				{
					...perks["elemental-pop"],
					locations: [{ x: 0.507, y: 0.041 }],
				},
				{
					...perks["deadshot-daiquiri"],
					locations: [{ x: 0.835, y: 0.588 }],
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [{ x: 0.614, y: 0.212 }],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.596, y: 0.29 },
						{ x: 0.406, y: 0.886 },
						{ x: 0.592, y: 0.557 },
						{ x: 0.238, y: 0.52 },
					],
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [
						{ x: 0.447, y: 0.78 },
						{ x: 0.559, y: 0.547 },
						{ x: 0.135, y: 0.398 },
						{ x: 0.471, y: 0.305 },
					],
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [{ x: 0.584, y: 0.821 }],
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [{ x: 0.457, y: 0.801 }],
				},
				{
					...sharedMarkers.arsenal,
					locations: [
						{ x: 0.659, y: 0.408 },
						{ x: 0.277, y: 0.438 },
						{ x: 0.463, y: 0.083 },
					],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [
						{ x: 0.824, y: 0.478 },
						{ x: 0.065, y: 0.476 },
						{ x: 0.614, y: 0.225 },
					],
				},
				{
					...sharedMarkers.trap,
					locations: [
						{ x: 0.206, y: 0.582, title: "C.A.S.T.E.R. Turret" },
						{ x: 0.166, y: 0.426, title: "C.A.S.T.E.R. Turret" },
					],
				},
				{
					...sharedMarkers["door-buy"],
					locations: [
						{ x: 0.46, y: 0.599 },
						{ x: 0.459, y: 0.962 },
						{ x: 0.666, y: 0.541 },
						{ x: 0.682, y: 0.61 },
						{ x: 0.697, y: 0.417 },
						{ x: 0.17, y: 0.614 },
						{ x: 0.157, y: 0.433 },
						{ x: 0.604, y: 0.145 },
						{ x: 0.396, y: 0.176 },
					],
				},
				{
					...sharedMarkers["power-door"],
					locations: [
						{ x: 0.571, y: 0.835 },
						{ x: 0.62, y: 0.823 },
						{ x: 0.352, y: 0.782 },
					],
				},
				{
					...sharedMarkers.exfil,
					locations: [{ x: 0.209, y: 0.524 }],
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.657, y: 0.846, title: "Portal to T2 Sublevel 10" },
						{ x: 0.338, y: 0.781, title: "Portal to T1 Director's Office" },
						{ x: 0.419, y: 0.051, title: "Portal to T1 Project Janus Reception" },
						{ x: 0.682, y: 0.152, title: "Portal to T2 Sublevel 10" },
					],
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.377, y: 0.362, title: "Launcher to T2 Dark Entity Containment" },
						{ x: 0.751, y: 0.384, title: "Aether Elevator to T1 Project Janus Reception" },
						{ x: 0.61, y: 0.683, title: "Launcher to T2 Android Assembly" },
						{ x: 0.22, y: 0.65, title: "Aether Elevator to T1 Project Janus Reception" },
						{ x: 0.096, y: 0.624, title: "Launcher to T2 Android Assembly" },
					],
				},
				{
					...sharedMarkers["rampage-inducer"],
					locations: [{ x: 0.577, y: 0.751 }],
				},
				{
					...sharedMarkers.document,
					locations: [],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.472, y: 0.757 }],
				},
				{
					...weapons.gs45,
					locations: [{ x: 0.457, y: 0.764 }],
				},
				{
					...weapons["asg-89"],
					locations: [{ x: 0.112, y: 0.476 }],
				},
				{
					...weapons["pp-919"],
					locations: [{ x: 0.772, y: 0.444 }],
				},
				{
					...weapons["marine-sp"],
					locations: [{ x: 0.65, y: 0.495 }],
				},
				{
					...weapons["tanto.22"],
					locations: [{ x: 0.2, y: 0.518 }],
				},
				{
					...weapons.svd,
					locations: [{ x: 0.557, y: 0.124 }],
				},
			],
		},
		{
			id: "tower-2",
			title: "Tower 2",
			image: "/layers/reckoning/tower-2-layer.webp",
			markers: [
				{
					id: "t2-android-assembly",
					type: "label",
					category: "general",
					title: "T2 Android Assembly",
					description: "",
					icon: null,
					locations: [],
				},
				{
					id: "t2-dark-entity-containment",
					type: "label",
					category: "general",
					title: "T2 Dark Entity Containment",
					description: "",
					icon: null,
					locations: [],
				},
				{
					id: "t2-teleportation-lab",
					type: "label",
					category: "general",
					title: "T2 Teleportation Lab",
					description: "",
					icon: null,
					locations: [],
				},
				{
					id: "t2-sublevel-10",
					type: "label",
					category: "general",
					title: "T2 Sublevel 10",
					description: "",
					icon: null,
					locations: [],
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [],
				},
				{
					...perks["double-tap"],
					locations: [],
				},
				{
					...perks["stamin-up"],
					locations: [],
				},
				{
					...perks["vulture-aid"],
					locations: [],
				},
				{
					...perks["der-wunderfizz"],
					locations: [],
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [],
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [],
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [],
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [],
				},
				{
					...sharedMarkers.arsenal,
					locations: [],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [],
				},
				{
					...sharedMarkers.trap,
					locations: [],
				},
				{
					...sharedMarkers["door-buy"],
					locations: [],
				},
				{
					...sharedMarkers.portal,
					locations: [],
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [],
				},
				{
					...sharedMarkers["pack-a-punch"],
					locations: [],
				},
				{
					...sharedMarkers.document,
					locations: [],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [],
				},
			],
		},
		{
			id: "tower-3",
			title: "Tower 3",
			image: "/layers/reckoning/tower-3-layer.webp",
			markers: [
				{
					id: "t3-rooftop",
					type: "label",
					category: "general",
					title: "T3 Rooftop",
					description: "",
					icon: null,
					locations: [],
				},
				{
					id: "t3-dark-aether-elements-vault-2",
					type: "label",
					category: "general",
					title: "T3 Dark Aether Elements Vault 2",
					description: "",
					icon: null,
					locations: [],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [],
				},
				{
					...perks["der-wunderfizz"],
					locations: [],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [],
				},
				{
					...sharedMarkers.arsenal,
					locations: [],
				},
			],
		},
	],
}

export default reckoning
