import type { MapConfig } from "@/map-configs"
import { perks, sharedMarkers, weapons } from "./markers"

const reckoning: MapConfig = {
	id: "reckoning",
	title: "Reckoning",
	isComingSoon: true,
	game: "Black Ops 6",
	description:
		"Explore Reckoning in BO6 Zombies. Find all Janus Crates, Loot Bins, C.A.S.T.E.R. Turrets, Intel, and more with our interactive map.",
	image: "/layers/reckoning.webp",
	markers: [
		{
			id: "t1-mutant-research-lab",
			type: "label",
			category: "general",
			title: "T1 Mutant Research Lab",
			description: "",
			icon: null,
			locations: [],
		},
		{
			id: "t1-mutant-research-test-area",
			type: "label",
			category: "general",
			title: "T1 Mutant Research Test Area",
			description: "",
			icon: null,
			locations: [],
		},
		{
			id: "t1-project-janus-reception",
			type: "label",
			category: "general",
			title: "T1 Project Janus Reception",
			description: "",
			icon: null,
			locations: [],
		},
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
			id: "t1-executive-suit",
			type: "label",
			category: "general",
			title: "T1 Executive Suit",
			description: "",
			icon: null,
			locations: [],
		},
		{
			id: "t1-quantum-computing-core",
			type: "label",
			category: "general",
			title: "T1 Quantum Computing Core",
			description: "",
			icon: null,
			locations: [],
		},
		{
			id: "t1-quantum-computing-lab",
			type: "label",
			category: "general",
			title: "T1 Quantum Computing Lab",
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
			id: "t1-director's-office",
			type: "label",
			category: "general",
			title: "T1 Director's Office",
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
			id: "t1-bioweapons-lab",
			type: "label",
			category: "general",
			title: "T1 Bioweapons Lab",
			description: "",
			icon: null,
			locations: [],
		},
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
			id: "loot-bin",
			category: "objectives",
			title: "Loot Bin",
			description:
				"Interacting with a loot bin has a chance to grant you any item, e.g. Perks, Aether Tools, Ray Guns, Aetherium Crystals.",
			icon: "/icons/objectives/loot-bin.webp",
			locations: [],
		},
		{
			id: "aetheric-flora",
			category: "objectives",
			title: "Aetheric Flora",
			description: "Aetheric Flora used to charge the Cyst for the Gorgofex",
			icon: "/icons/objectives/aetheric-flora.webp",
			locations: [],
		},
		{
			...perks["quick-revive"],
			locations: [],
		},
		{
			...perks["speed-cola"],
			locations: [],
		},
		{
			...perks.juggernog,
			locations: [],
		},
		{
			...perks["double-tap"],
			locations: [],
		},
		{
			...perks["phd-flopper"],
			locations: [],
		},
		{
			...perks["stamin-up"],
			locations: [],
		},
		{
			...perks["melee-macchiato"],
			locations: [],
		},
		{
			...perks["elemental-pop"],
			locations: [],
		},
		{
			...perks["deadshot-daiquiri"],
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
			...sharedMarkers.trap,
			locations: [],
		},
		{
			...sharedMarkers["rampage-inducer"],
			locations: [],
		},
		{
			...sharedMarkers["door-buy"],
			locations: [],
		},
		{
			...sharedMarkers.exfil,
			locations: [],
		},
		{
			...sharedMarkers.portal,
			locations: [],
		},
		{
			...sharedMarkers["pack-a-punch"],
			locations: [],
		},
		{
			...sharedMarkers["crafting-table"],
			locations: [],
		},
		{
			...sharedMarkers["audio-log"],
			locations: [],
		},
		{
			...sharedMarkers.document,
			locations: [],
		},
		{
			...sharedMarkers["fast-travel"],
			locations: [],
		},
		{
			...sharedMarkers.workbench,
			locations: [],
		},
		{
			...weapons.gs45,
			locations: [],
		},
		{
			...weapons["pp-919"],
			locations: [],
		},
		{
			...weapons["tsarkov-7.62"],
			locations: [],
		},
		{
			...weapons["ak-74"],
			locations: [],
		},
		{
			...weapons["marine-sp"],
			locations: [],
		},
		{
			...weapons.svd,
			locations: [],
		},
		{
			...weapons.xmg,
			locations: [],
		},
	],
}

export default reckoning
