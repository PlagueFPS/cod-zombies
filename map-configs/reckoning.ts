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
		},
		{
			id: "t1-mutant-research-lab-layer",
			title: "T1 Mutant Research Lab",
			image: "/layers/reckoning/t1-mutant-research-lab.webp",
			markers: [
				{
					id: "t1-mutant-research-lab",
					title: "T1 Mutant Research Lab",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.503, y: 0.480 }]
				},
				{
					id: "t1-bioweapons-lab",
					title: "T1 Bioweapons Lab",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.234, y: 0.501 }]
				},
				{
					id: "t1-mutant-research-test-area",
					title: "T1 Mutant Research Test Area",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.296, y: 0.316 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.178, y: 0.549 }]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.326, y: 0.217 }],
				},
				{
					...sharedMarkers["audio-log"],
					locations: [
						{ x: 0.176, y: 0.474, title: "Whistleblower", description: "You must be playing as Weaver, and reach Round 13 without entering the T1 Mutant Research Lab, then enter the lab to claim this audio log." },
						{ x: 0.318, y: 0.598, title: "Momgenes" },
						{ x: 0.381, y: 0.797, title: "The Things I've Seen Pt. 1" },
					]
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.663, y: 0.373 }],
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.647, y: 0.357, title: "Mangler Matrix" }]
				},
				{
					...sharedMarkers["door-buy"],
					locations: [
						{ x: 0.368, y: 0.646 },
						{ x: 0.331, y: 0.499 },
						{ x: 0.396, y: 0.240 },
					]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.508, y: 0.213, title: "Aether Elevator", description: "Travel to T1 Project Janus Reception" },
						{ x: 0.217, y: 0.793, title: "Aether Launcher", description: "Travel to T2 Android Assembly" },
					]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.112, y: 0.518 }]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.316, y: 0.298 }]
				},
				{
					...perks["deadshot-daiquiri"],
					locations: [{ x: 0.683, y: 0.600 }]
				},
				{
					...perks["phd-flopper"],
					locations: [{ x: 0.300, y: 0.388 }]
				},
				{
					...weapons["pp-919"],
					locations: [{ x: 0.553, y: 0.304 }]
				},
				{
					...weapons["marine-sp"],
					locations: [{ x: 0.300, y: 0.412 }]
				}
			]
		},
		{
			id: "t1-quantum-computing-core-layer",
			title: "T1 Quantum Computing Core",
			image: "/layers/reckoning/t1-quantum-computing-core.webp",
			markers: [
				{
					id: "t1-quantum-computing-core",
					title: "T1 Quantum Computing Core",
					description: "",
					icon: null,
					category: "general",
					type: "label",
					locations: [{ x: 0.504, y: 0.500 }]
				},
				{
					id: "t1-quantum-computing-lab",
					title: "T1 Quantum Computing Lab",
					description: "",
					icon: null,
					category: "general",
					type: "label",
					locations: [{ x: 0.270, y: 0.482 }]
				},
				{
					id: "aetheric-flora",
					title: "Aetheric Flora",
					description: "Aetheric Flora used to charge the Cyst for the Gorgofex.",
					icon: "/icons/objectives/aetheric-flora.webp",
					category: "objectives",
					locations: [
						{ x: 0.402, y: 0.722 },
						{ x: 0.335, y: 0.828 },
						{ x: 0.235, y: 0.505 },
					]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.542, y: 0.549 }]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.633, y: 0.357 }]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.312, y: 0.597, title: "Play to Win"}]
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.173, y: 0.457 }]
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.604, y: 0.356, title: "Department Head", description: "Parachute down from T1 Mutant Research Lab to obtain this document." }]
				},
				{
					...sharedMarkers["door-buy"],
					locations: [{ x: 0.363, y: 0.359 }, { x: 0.397, y: 0.746 }]
				},
				{
					...sharedMarkers.exfil,
					locations: [{ x: 0.483, y: 0.555 }]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [{ x: 0.504, y: 0.817, title: "Aether Elevator", description: "Travel to T1 Project Janus Reception" }, {
						x: 0.237, y: 0.764, title: "Aether Launcher", description: "Travel to T2 Android Assembly"
					}]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.320, y: 0.281 }]
				},
				{
					...sharedMarkers.trap,
					locations: [
						{ x: 0.468, y: 0.678, title: "C.A.S.T.E.R Turret" },
						{ x: 0.379, y: 0.354, title: "C.A.S.T.E.R Turret" },
					]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.259, y: 0.370 }]
				},
				{
					...perks["melee-macchiato"],
					locations: [{ x: 0.371, y: 0.548 }]
				},
				{
					...perks["speed-cola"],
					locations: [{ x: 0.063, y: 0.453 }]
				},
				{
					...weapons["tanto.22"],
					locations: [{ x: 0.466, y: 0.542 }]
				},
				{
					...weapons["asg-89"],
					locations: [{ x: 0.275, y: 0.453 }]
				},
			]
		},
		{
			id: "t1-executive-suite-layer",
			title: "T1 Executive Suite",
			image: "/layers/reckoning/t1-executive-suites.webp",
			markers: [
				{
					id: "t1-executive-suite",
					title: "T1 Executive Suite",
					description: "",
					icon: null,
					category: "general",
					type: "label",
					locations: [{ x: 0.503, y: 0.507 }]
				},
				{
					id: "t1-directors-office",
					title: "T1 Director's Office",
					description: "",
					icon: null,
					category: "general",
					type: "label",
					locations: [{ x: 0.708, y: 0.324 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.638, y: 0.650 },
						{ x: 0.365, y: 0.197 }
					]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.395, y: 0.265 }]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [
						{ x: 0.204, y: 0.657, title: "Reactive Pt. 1" },
						{ x: 0.630, y: 0.337, title: "The Things I've Seen Pt. 2" },
						{ x: 0.751, y: 0.405, title: "Misdirection Pt.1", description: "You must complete the 'Aether Blade' side quest to obtain this audio log." },
					]
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.677, y: 0.529 }]
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.757, y: 0.416, title: "Brainiac", description: "You must complete the 'Aether Blade' side quest to obtain this document." }]
				},
				{
					...sharedMarkers["door-buy"],
					locations: [
						{ x: 0.270, y: 0.429 },
						{ x: 0.659, y: 0.370 }
					]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.236, y: 0.776, title: "Aether Launcher", description: "Travel to T2 Dark Entity Containment" }
					]
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [{ x: 0.677, y: 0.495 }]
				},
				{
					...sharedMarkers["loot-bin"],
					locations: [
						{ x: 0.454, y: 0.672 },
						{ x: 0.291, y: 0.618 },
						{ x: 0.329, y: 0.493 },
						{ x: 0.677, y: 0.609 },
						{ x: 0.400, y: 0.334 },
						{ x: 0.199, y: 0.426 },
					]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.411, y: 0.672 }]
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.795, y: 0.382, description: "Teleport to T2 Sublevel 10" },
						{ x: 0.312, y: 0.197, description: "Teleport to T1 Project Janus Reception" }
					]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.394, y: 0.320 }]
				},
				{
					...perks.juggernog,
					locations: [{ x: 0.473, y: 0.636 }]
				},
				{
					...perks["elemental-pop"],
					locations: [{ x: 0.472, y: 0.175 }]
				},
				{
					...weapons["tsarkov-7.62"],
					locations: [{ x: 0.185, y: 0.654 }]
				},
				{
					...weapons.svd,
					locations: [{ x: 0.555, y: 0.333 }]
				}
			]
		},
		{
			id: "t2-android-assembly-layer",
			title: "T2 Android Assembly",
			image: "/layers/reckoning/t2-android-assembly.webp",
			markers: [
				{
					id: "t2-android-assembly",
					title: "T2 Android Assembly",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.493, y: 0.411 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.375, y: 0.407 },
						{ x: 0.531, y: 0.676 }
					]
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [{ x: 0.572, y: 0.161, title: "Tier II Armor Wall Buy" }]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.671, y: 0.428 }]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.735, y: 0.718, title: "Reactive Pt. 3"}]
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.655, y: 0.138, title: "Saftey Measures", description: "Shoot the briefcase one of the Klauses is holding to obtain the document." }]
				},
				{
					...sharedMarkers["door-buy"],
					locations: [{ x: 0.216, y: 0.495 }]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.192, y: 0.493, title: "Aether Elevator", description: "Travel to T2 Dark Entity Containment" },
						{ x: 0.767, y: 0.218, title: "Aether Launcher", description: "Top Launcher to T1 Mutant Research Lab; Bottom Launcher to T1 Quantum Computing Core" },
					]
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [{ x: 0.631, y: 0.308 }]
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [{ x: 0.356, y: 0.437 }]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.221, y: 0.430 }]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.382, y: 0.796 }]
				},
				{
					...perks["double-tap"],
					locations: [{ x: 0.458, y: 0.491 }]
				},
				{
					...perks["der-wunderfizz"],
					locations: [{ x: 0.439, y: 0.731 }]
				},
				{
					...weapons["ak-74"],
					locations: [{ x: 0.307, y: 0.593 }]
				}
			]
		},
		{
			id: "t2-dark-entity-containment-layer",
			title: "T2 Dark Entity Containment",
			image: "/layers/reckoning/t2-dark-entity-containment.webp",
			markers: [
				{
					id: "t2-dark-entity-containment",
					title: "T2 Dark Entity Containment",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.492, y: 0.492 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.391, y: 0.515 },
						{ x: 0.588, y: 0.397 }
					]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.575, y: 0.676 }]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.395, y: 0.356, title: "The Forespoken" }]
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.648, y: 0.714 }]
				},
				{
					...sharedMarkers["fast-travel"],
					locations: [
						{ x: 0.216, y: 0.501, title: "Aether Elevator", description: "Travel to T2 Android Assembly" },
						{ x: 0.740, y: 0.252, title: "Aether Launcher", description: "Travel to T1 Executive Suite" },
					]
				},
				{
					...sharedMarkers["gobblegum-machine"],
					locations: [{ x: 0.354, y: 0.427 }]
				},
				{
					...sharedMarkers["janus-crate"],
					locations: [{ x: 0.602, y: 0.230 }]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.593, y: 0.604 }]
				},
				{
					...sharedMarkers.portal,
					locations: [{ x: 0.691, y: 0.693, description: "Travel to T2 Teleportation Lab" }]
				},
				{
					...sharedMarkers.trap,
					locations: [
						{ x: 0.748, y: 0.370, title: "C.A.S.T.E.R. Turret" },
						{ x: 0.620, y: 0.244, title: "C.A.S.T.E.R. Turret" },
					]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.285, y: 0.595 }]
				},
				{
					...perks["stamin-up"],
					locations: [{ x: 0.586, y: 0.230 }]
				},
				{
					...weapons.xm4,
					locations: [{ x: 0.723, y: 0.579 }]
				},
			]
		},
		{
			id: "t2-teleportation-lab-layer",
			title: "T2 Teleportation Lab",
			image: "/layers/reckoning/t2-teleportation-lab.webp",
			markers: [
				{
					id: "t2-teleportation-lab",
					title: "T2 Teleportation Lab",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.560, y: 0.493 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.497, y: 0.589 }]
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.346, y: 0.490, description: "Travel to T2 Dark Entity Containment" },
						{ x: 0.659, y: 0.493, description: "Travel to Tower 3" }
					]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.618, y: 0.551, title: "Dysphoria" }]
				},
				{
					...sharedMarkers["vaccum-seal-device"],
					locations: [{ x: 0.496, y: 0.440 }]
				}
			]
		},
		{
			id: "t2-sublevel-10-layer",
			title: "T2 Sublevel 10",
			image: "/layers/reckoning/t2-sublevel-10.webp",
			markers: [
				{
					id: "t2-sublevel-10",
					title: "T2 Sublevel 10",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.480, y: 0.502 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.633, y: 0.417 }]
				},
				{
					...sharedMarkers.portal,
					locations: [
						{ x: 0.195, y: 0.492, description: "Travel to T1 Director's Office" },
						{ x: 0.829, y: 0.500, description: "Travel to T1 Project Janus Reception" }
					]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.321, y: 0.337, title: "Reactive Pt. 2" }]
				},
				{
					...sharedMarkers["armor-wall-buy"],
					locations: [{ x: 0.684, y: 0.393, title: "Tier III Armor Wall Buy" }]
				},
				{
					...sharedMarkers["crafting-table"],
					locations: [{ x: 0.690, y: 0.525 }]
				},
				{
					...sharedMarkers["mystery-box"],
					locations: [{ x: 0.345, y: 0.350 }]
				},
				{
					...sharedMarkers["pack-a-punch"],
					locations: [
						{ x: 0.422, y: 0.419 },
						{ x: 0.551, y: 0.424 },
						{ x: 0.419, y: 0.585 },
						{ x: 0.552, y: 0.585 }
					]
				},
				{
					...perks["vulture-aid"],
					locations: [{ x: 0.646, y: 0.623 }]
				},
				{
					...weapons.xmg,
					locations: [{ x: 0.319, y: 0.640 }]
				}
			]
		},
		{
			id: "t3-dark-aether-elements-vault-1-layer",
			title: "T3 Dark Aether Elements Vault 1",
			image: "/layers/reckoning/t3-dark-aether-elements-vault-1.webp",
			markers: [
				{
					id: "t3-dark-aether-elements-vault-1",
					title: "T3 Dark Aether Elements Vault 1",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.509, y: 0.253 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.501, y: 0.477 }, { x: 0.230, y: 0.510 }]
				},
				{
					...sharedMarkers.arsenal,
					locations: [{ x: 0.656, y: 0.406 }]
				}
			]
		},
		{
			id: "t3-dark-aether-elements-vault-2-layer",
			title: "T3 Dark Aether Elements Vault 2",
			image: "/layers/reckoning/t3-dark-aether-elements-vault-2.webp",
			markers: [
				{
					id: "t3-dark-aether-elements-vault-2",
					title: "T3 Dark Aether Elements Vault 2",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.498, y: 0.325 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [{ x: 0.501, y: 0.477 }, { x: 0.762, y: 0.631 }]
				},
				{
					...sharedMarkers.document,
					locations: [{ x: 0.448, y: 0.254, title: "Misdirection Pt. 2" }]
				},
				{
					...perks["der-wunderfizz"],
					locations: [{ x: 0.291, y: 0.506 }]
				}
			]
		},
		{
			id: "t3-rooftop-layer",
			title: "T3 Rooftop",
			image: "/layers/reckoning/t3-rooftop.webp",
			markers: [
				{
					id: "t3-rooftop",
					title: "T3 Rooftop",
					type: "label",
					category: "general",
					description: "",
					icon: null,
					locations: [{ x: 0.519, y: 0.451 }]
				},
				{
					...sharedMarkers["ammo-cache"],
					locations: [
						{ x: 0.518, y: 0.365 },
						{ x: 0.367, y: 0.714 },
						{ x: 0.710, y: 0.567 },
						{ x: 0.709, y: 0.183 },
						{ x: 0.306, y: 0.214 },
					]
				},
				{
					...sharedMarkers["audio-log"],
					locations: [{ x: 0.243, y: 0.340, title: "The Great Voice From Beyond" }]
				}
			]
		}
	],
}

export default reckoning
