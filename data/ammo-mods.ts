import {
	type AugmentTuple,
	antibiotic,
	bigGameBrainRot,
	bigGameCryoFreeze,
	bigGameDeadWire,
	bigGameLightMend,
	bigGameNapalmBurst,
	bigGameShadowRift,
	chainLightning,
	contactBurn,
	dualAction,
	explosive,
	explosiveRain,
	expressRemedy,
	extensionBrainRot,
	extensionCryoFreeze,
	extensionDeadWire,
	extensionNapalmBurst,
	extraStrength,
	firebomb,
	freezerBurn,
	frozenStiff,
	hasteBrainRot,
	hasteDeadWire,
	hasteShadowRift,
	highVoltage,
	iceCloud,
	incendiary,
	lightningStrike,
	liquidNitrogen,
	longerLife,
	pheromone,
	plague,
	supermassive,
	targeted,
	thermite,
	toppleDanger,
} from "./augments"
import { blackOps4, blackOps6, type Game } from "./games"

export const getAmmoModByKey = (key: AmmoModKey): AmmoMod => ammoModRegistry[key]

export interface AmmoMod {
	id: string
	title: string
	game: Game
	description: string
	image: string
	augments?: AugmentTuple
}

const ammoModRegistry = {
	fireBomb: {
		id: "fire-bomb",
		title: "Fire Bomb",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite many zombies at once.",
		game: blackOps4,
		image: "/ammo-mods/fire-bomb.avif",
	},
	brainRot: {
		id: "brain-rot",
		title: "Brain Rot",
		description:
			"Bullet deal toxic damage. Each bullet has a chance to infect a zombie, becoming an ally for short duration.",
		game: blackOps4,
		image: "/ammo-mods/brain-rot.avif",
	},
	killOWatt: {
		id: "kill-o-watt",
		title: "Kill-O-Watt",
		description:
			"Bullets deal electric damage. Each bullet has a chance to create an area-of-effect stun, immobilizing zombies and eventually killing them.",
		game: blackOps4,
		image: "/ammo-mods/dead-wire.avif",
	},
	lightMend: {
		id: "light-mend",
		title: "Light Mend",
		description:
			"Bullets deal light damage. Each bullet has a change to transform a normal or special enemy's health into a healing glyph that moves to nearby injured allies.",
		game: blackOps6,
		image: "/ammo-mods/light-mend.avif",
		augments: [antibiotic, bigGameLightMend, dualAction, longerLife, extraStrength, expressRemedy],
	},
	deadWire: {
		id: "dead-wire",
		title: "Dead Wire",
		description:
			"Bullets deal electrical damage. Each bullet has a chance to stun any Normal and Special enemy, generating a field that deals electric damage to nearby enemies.",
		game: blackOps6,
		image: "/ammo-mods/dead-wire-bo6.avif",
		augments: [
			chainLightning,
			bigGameDeadWire,
			lightningStrike,
			highVoltage,
			hasteDeadWire,
			extensionDeadWire,
		],
	},
	brainRotBO6: {
		id: "brain-rot-bo6",
		title: "Brain Rot",
		description:
			"Bullets deal toxic damage. Each bullet has the chance to turn a Normal or Special enemy into an ally for short duration.",
		game: blackOps6,
		image: "/ammo-mods/brain-rot-bo6.avif",
		augments: [plague, pheromone, bigGameBrainRot, extensionBrainRot, hasteBrainRot, explosive],
	},
	cryoFreeze: {
		id: "cryo-freeze",
		title: "Cryo Freeze",
		description:
			"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
		game: blackOps6,
		image: "/ammo-mods/cryo-freeze.avif",
		augments: [
			bigGameCryoFreeze,
			iceCloud,
			frozenStiff,
			extensionCryoFreeze,
			freezerBurn,
			liquidNitrogen,
		],
	},
	napalmBurst: {
		id: "napalm-burst",
		title: "Napalm Burst",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite Normal and Special enemies.",
		game: blackOps6,
		image: "/ammo-mods/napalm-burst.avif",
		augments: [
			bigGameNapalmBurst,
			thermite,
			firebomb,
			extensionNapalmBurst,
			incendiary,
			contactBurn,
		],
	},
	shadowRift: {
		id: "shadow-rift",
		title: "Shadow Rift",
		description:
			"Bullets deal shadow damage. Each bullet has a chance to spawn a black hole if striking Normal or Special enemies, warping nearby zombies away and dropping some from the air at high speed.",
		game: blackOps6,
		image: "/ammo-mods/shadow-rift.avif",
		augments: [
			bigGameShadowRift,
			toppleDanger,
			explosiveRain,
			hasteShadowRift,
			targeted,
			supermassive,
		],
	},
} satisfies Record<string, AmmoMod>

export type AmmoModKey = keyof typeof ammoModRegistry
export const {
	fireBomb,
	brainRot,
	killOWatt,
	lightMend,
	deadWire,
	brainRotBO6,
	cryoFreeze,
	napalmBurst,
	shadowRift,
} = ammoModRegistry
