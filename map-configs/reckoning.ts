import type { MapConfig } from "@/map-configs"
import { perks, sharedMarkers, weapons } from "./markers"

const reckoning: MapConfig = {
	id: "reckoning",
	title: "Reckoning",
	isNew: true,
	game: "Black Ops 6",
	description:
		"Find all Janus Crates, Loot Bins, C.A.S.T.E.R. Turrets, Intel, and more with our Reckoning interactive map in Black Ops 6 Zombies.",
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
						{ x: 0.44, y: 0.052 },
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
					locations: [{ x: 0.584, y: 0.821, title: "Tier II Armor Wall Buy" }],
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
						{
							x: 0.657,
							y: 0.846,
							description: "Teleport to T2 Sublevel 10.",
						},
						{
							x: 0.338,
							y: 0.781,
							description: "Teleport to T1 Director's Office.",
						},
						{
							x: 0.419,
							y: 0.051,
							description: "Teleport to T1 Project Janus Reception.",
						},
						{
							x: 0.682,
							y: 0.152,
							description: "Teleport to T2 Sublevel 10.",
						},
					],
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{
							x: 0.461,
							y: 0.586,
							title: "Aether Elevator",
							description: "Travel to T1 Mutant Research Lab.",
						},
						{
							x: 0.461,
							y: 0.978,
							title: "Aether Elevator",
							description: "Travel to T1 Quantum Computing Core.",
						},
						{
							x: 0.377,
							y: 0.362,
							title: "Launcher",
							description: "Travel to T2 Dark Entity Containment.",
						},
						{
							x: 0.751,
							y: 0.384,
							title: "Aether Elevator",
							description: "Travel to T1 Project Janus Reception.",
						},
						{ x: 0.61, y: 0.683, title: "Launcher", description: "Travel to T2 Android Assembly." },
						{
							x: 0.22,
							y: 0.65,
							title: "Aether Elevator",
							description: "Travel to T1 Project Janus Reception.",
						},
						{
							x: 0.096,
							y: 0.624,
							title: "Launcher",
							description: "Travel to T2 Android Assembly.",
						},
					],
				},
				{
					...sharedMarkers["rampage-inducer"],
					locations: [{ x: 0.577, y: 0.751 }],
				},
				{
					...sharedMarkers.document,
					locations: [
						{
							x: 0.657,
							y: 0.166,
							title: "Brainiac",
							description:
								"You must complete the 'Aether Blade' side quest to obtain this document.",
						},
						{
							x: 0.634,
							y: 0.813,
							title: "I'm a Real Girl",
							description:
								"You must complete the 'Golden Loot Bin' side quest to obtain this document.",
						},
						{
							x: 0.5,
							y: 0.076,
							title: "Employee of the Month",
							description: "Interact with the projector on the ceiling to obtain this document.",
						},
						{
							x: 0.266,
							y: 0.432,
							title: "Department Head",
							description: "Parachute down from T1 Mutant Research Lab to obtain this document.",
						},
						{
							x: 0.82,
							y: 0.474,
							title: "Mangler Matrix",
							description: "Shoot the pile of papers to obtain this document.",
						},
					],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [
						{ x: 0.472, y: 0.757, title: "Miracle Worker" },
						{ x: 0.658, y: 0.585, title: "Momgenes" },
						{ x: 0.128, y: 0.543, title: "Play to Win" },
						{ x: 0.689, y: 0.684, title: "The Things I've Seen Pt. 1" },
						{ x: 0.59, y: 0.125, title: "The Things I've Seen Pt. 2" },
						{ x: 0.366, y: 0.296, title: "Reactive Pt. 1" },
						{
							x: 0.591,
							y: 0.524,
							title: "Whistleblower",
							description:
								"You must be playing as Weaver, and reach round 13 without entering the T1 Mutant Research Lab, and then enter the lab to claim this audio log.",
						},
						{
							x: 0.656,
							y: 0.16,
							title: "Misdirection Pt. 1",
							description:
								"You must complete the 'Aether Blade' side quest to obtain this audio log.",
						},
					],
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
				{
					...weapons["tsarkov-7.62"],
					locations: [{ x: 0.354, y: 0.291 }],
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
					locations: [{ x: 0.248, y: 0.45 }],
				},
				{
					id: "t2-dark-entity-containment",
					type: "label",
					category: "general",
					title: "T2 Dark Entity Containment",
					description: "",
					icon: null,
					locations: [{ x: 0.75, y: 0.486 }],
				},
				{
					id: "t2-teleportation-lab",
					type: "label",
					category: "general",
					title: "T2 Teleportation Lab",
					description: "",
					icon: null,
					locations: [{ x: 0.506, y: 0.143 }],
				},
				{
					id: "t2-sublevel-10",
					type: "label",
					category: "general",
					title: "T2 Sublevel 10",
					description: "",
					icon: null,
					locations: [{ x: 0.483, y: 0.848 }],
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [
						{ x: 0.615, y: 0.553 },
						{ x: 0.188, y: 0.648 },
						{ x: 0.452, y: 0.099 },
					],
				},
				{
					...perks["double-tap"],
					locations: [{ x: 0.226, y: 0.481 }],
				},
				{
					...perks["stamin-up"],
					locations: [{ x: 0.803, y: 0.325 }],
				},
				{
					...perks["vulture-aid"],
					locations: [{ x: 0.602, y: 0.936 }],
				},
				{
					...perks["der-wunderfizz"],
					locations: [{ x: 0.217, y: 0.613 }],
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [{ x: 0.168, y: 0.449 }],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.683, y: 0.501 },
						{ x: 0.182, y: 0.428 },
						{ x: 0.469, y: 0.231 },
						{ x: 0.268, y: 0.583 },
						{ x: 0.601, y: 0.775 },
						{ x: 0.806, y: 0.425 },
					],
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [
						{ x: 0.364, y: 0.726 },
						{ x: 0.097, y: 0.451 },
						{ x: 0.815, y: 0.558 },
					],
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [
						{ x: 0.638, y: 0.767, title: "Tier III Armor Wall Buy" },
						{ x: 0.286, y: 0.299, title: "Tier II Armor Wall Buy" },
					],
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [
						{ x: 0.33, y: 0.772 },
						{ x: 0.327, y: 0.368 },
						{ x: 0.656, y: 0.447 },
					],
				},
				{
					...sharedMarkers.arsenal,
					locations: [
						{ x: 0.344, y: 0.446 },
						{ x: 0.8, y: 0.605 },
					],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [
						{ x: 0.644, y: 0.86 },
						{ x: 0.845, y: 0.628 },
					],
				},
				{
					...sharedMarkers.trap,
					locations: [
						{ x: 0.911, y: 0.416, title: "C.A.S.T.E.R. Turret" },
						{ x: 0.831, y: 0.329, title: "C.A.S.T.E.R. Turret" },
					],
				},
				{
					...sharedMarkers["door-buy"],
					locations: [{ x: 0.092, y: 0.483 }],
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.877, y: 0.621, description: "Travel to T2 Teleportation Lab" },
						{ x: 0.318, y: 0.144, description: "Travel to T2 Dark Entity Containment" },
						{ x: 0.756, y: 0.842, description: "Travel to T1 Project Janus Reception" },
						{ x: 0.26, y: 0.84, description: "Travel to T1 Director's Office" },
						{ x: 0.597, y: 0.14, description: "Travel to Tower 3" },
					],
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{
							x: 0.078,
							y: 0.482,
							title: "Aether Elevator",
							description: "Travel to T2 Dark Entity Containment.",
						},
						{
							x: 0.401,
							y: 0.327,
							title: "Launcher",
							description:
								"Top Launcher to T1 Mutant Research Lab and Bottom Launcher to T1 Quantum Computing Core",
						},
						{
							x: 0.553,
							y: 0.493,
							title: "Aether Elevator",
							description: "Travel to T2 Android Assembly.",
						},
						{
							x: 0.905,
							y: 0.334,
							title: "Launcher",
							description: "Travel to T1 Executive Suite.",
						},
					],
				},
				{
					...sharedMarkers["pack-a-punch"],
					locations: [
						{ x: 0.534, y: 0.904 },
						{ x: 0.421, y: 0.783 },
						{ x: 0.533, y: 0.784 },
						{ x: 0.426, y: 0.901 },
					],
				},
				{
					...sharedMarkers.document,
					locations: [
						{
							x: 0.337,
							y: 0.289,
							title: "Saftey Measures",
							description:
								"Shoot the briefcase one of the Klauses is holding to obtain this document.",
						},
					],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [
						{ x: 0.352, y: 0.715, title: "Reactive Pt. 2" },
						{ x: 0.375, y: 0.603, title: "Reactive Pt. 3" },
						{ x: 0.684, y: 0.401, title: "The Forespoken" },
						{ x: 0.563, y: 0.195, title: "Dysphoria" },
					],
				},
				{
					...weapons["ak-74"],
					locations: [{ x: 0.145, y: 0.543 }],
				},
				{
					...weapons.xm4,
					locations: [{ x: 0.895, y: 0.539 }],
				},
				{
					...weapons.xmg,
					locations: [{ x: 0.357, y: 0.95 }],
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
					locations: [{ x: 0.484, y: 0.273 }],
				},
				{
					id: "t3-dark-aether-elements-vault-1",
					type: "label",
					category: "general",
					title: "T3 Dark Aether Elements Vault 1",
					description: "",
					icon: null,
					locations: [{ x: 0.745, y: 0.569 }],
				},
				{
					id: "t3-dark-aether-elements-vault-2",
					type: "label",
					category: "general",
					title: "T3 Dark Aether Elements Vault 2",
					description: "",
					icon: null,
					locations: [{ x: 0.22, y: 0.638 }],
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.214, y: 0.749 },
						{ x: 0.718, y: 0.72 },
						{ x: 0.483, y: 0.225 },
						{ x: 0.605, y: 0.114 },
						{ x: 0.607, y: 0.361 },
						{ x: 0.342, y: 0.131 },
						{ x: 0.371, y: 0.439 },
						{ x: 0.386, y: 0.854 },
						{ x: 0.515, y: 0.778 },
					],
				},
				{
					...perks["der-wunderfizz"],
					locations: [{ x: 0.07, y: 0.765 }],
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.089, y: 0.663 }],
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.851, y: 0.671 }],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.31, y: 0.215, title: "The Great Voice From Beyond" }],
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.183, y: 0.593, title: "Misdirection Pt. 2" }],
				},
			],
		},
	],
}

export default reckoning
