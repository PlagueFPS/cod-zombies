import type { AugmentTuple } from "./augments"
import type { GameKey } from "./games"

type AmmoModVariant = Omit<Partial<AmmoMod>, "id" | "title" | "variants">

export interface AmmoMod {
	/** The unique identifier of the ammo mod */
	id: string
	/** The title of the ammo mod */
	title: string
	/** The game of the ammo mod */
	/** The description of the ammo mod */
	description: string
	/** The image of the ammo mod */
	image: string
	/** The augments of the ammo mod */
	augments?: AugmentTuple
	/** The game variants of the ammo mod */
	variants?: Partial<Record<GameKey, AmmoModVariant>>
}

/** Union type of all ammo mod keys */
export type AmmoModKey = keyof typeof ammoModRegistry

/**
 * Gets an ammo mod by its key.
 * @param key The key of the ammo mod.
 * @param game The game to get the ammo mod variant for.
 */
export const getAmmoModByKey = (key: AmmoModKey, game?: GameKey): AmmoMod => {
	const ammoMod: AmmoMod = ammoModRegistry[key]

	if (!game || !ammoMod.variants?.[game]) return ammoMod

	const variant = ammoMod.variants?.[game]
	return { ...ammoMod, ...variant }
}

/**
 * Gets all ammo mods.
 * @param game The game to get the ammo mod variants for.
 */
export const getAmmoMods = (game?: GameKey): AmmoMod[] => {
	return Object.values(ammoModRegistry).map((ammoMod: AmmoMod) => {
		if (!game || !ammoMod.variants?.[game]) return ammoMod

		const variant = ammoMod.variants[game]
		return {
			...ammoMod,
			...variant,
		}
	})
}

const ammoModRegistry = {
	fireWorks: {
		id: "fire-works",
		title: "Fire Works",
		description:
			"Each bullet that hits a Normal or Special Enemy has a chance to launch fireworks that target enemies.",
		image: "/ammo-mods/fireworks.webp",
	},
	fireBomb: {
		id: "fire-bomb",
		title: "Fire Bomb",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite many zombies at once.",
		image: "/ammo-mods/fire-bomb.webp",
	},
	brainRot: {
		id: "brain-rot",
		title: "Brain Rot",
		description:
			"Bullet deal toxic damage. Each bullet has a chance to infect a zombie, becoming an ally for short duration.",
		image: "/ammo-mods/brain-rot.webp",
		variants: {
			blackOpsColdWar: {
				description:
					"Bullets deal toxic damage. Each bullet has a chance to turn a normal enemy into an ally for 15 seconds before dying (40 second cooldown).",
				image: "/ammo-mods/brain-rot-bo6.webp",
			},
			blackOps6: {
				description:
					"Bullets deal toxic damage. Each bullet has the chance to turn a Normal or Special enemy into an ally for short duration.",
				image: "/ammo-mods/brain-rot-bo6.webp",
				augments: [
					"plague",
					"pheromone",
					"bigGameBrainRot",
					"extensionBrainRot",
					"hasteBrainRot",
					"explosive",
				],
			},
			blackOps7: {
				description:
					"Bullets deal toxic damage. Each bullet has the chance to turn a Normal or Special enemy into an ally for short duration.",
				image: "/ammo-mods/brain-rot-bo6.webp",
				augments: [
					"plague",
					"pheromone",
					"bigGameBrainRot",
					"causticFumes",
					"extensionBrainRot",
					"hasteBrainRot",
					"explosive",
					"superSerum",
				],
			},
		},
	},
	killOWatt: {
		id: "kill-o-watt",
		title: "Kill-O-Watt",
		description:
			"Bullets deal electric damage. Each bullet has a chance to create an area-of-effect stun, immobilizing zombies and eventually killing them.",
		image: "/ammo-mods/dead-wire.webp",
	},
	lightMend: {
		id: "light-mend",
		title: "Light Mend",
		description:
			"Bullets deal light damage. Each bullet has a change to transform a normal or special enemy's health into a healing glyph that moves to nearby injured allies.",
		image: "/ammo-mods/light-mend.webp",
		augments: [
			"antibiotic",
			"bigGameLightMend",
			"dualAction",
			"longerLife",
			"extraStrength",
			"expressRemedy",
		],
	},
	deadWire: {
		id: "dead-wire",
		title: "Dead Wire",
		description: "Each bullet has a chance to stun any Normal and Special enemy.",
		image: "/ammo-mods/dead-wire.webp",
		variants: {
			blackOpsColdWar: {
				description:
					"Bullets deal electrical damage. Each bullet has a chance to stun any Normal and Special enemy, generating a field that deals electric damage to nearby enemies.",
				image: "/ammo-mods/dead-wire-bo6.webp",
			},
			blackOps6: {
				augments: [
					"chainLightning",
					"bigGameDeadWire",
					"lightningStrike",
					"highVoltage",
					"hasteDeadWire",
					"extensionDeadWire",
				],
			},
			blackOps7: {
				augments: [
					"chainLightning",
					"bigGameDeadWire",
					"lightningStrike",
					"ballLightning",
					"highVoltage",
					"hasteDeadWire",
					"extensionDeadWire",
					"aftershock",
				],
			},
		},
	},
	cryoFreeze: {
		id: "cryo-freeze",
		title: "Cryo Freeze",
		description:
			"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
		image: "/ammo-mods/cryo-freeze.webp",
		variants: {
			blackOps6: {
				description:
					"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
				image: "/ammo-mods/cryo-freeze.webp",
				augments: [
					"bigGameCryoFreeze",
					"iceCloud",
					"frozenStiff",
					"extensionCryoFreeze",
					"freezerBurn",
					"liquidNitrogen",
				],
			},
			blackOps7: {
				description:
					"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
				image: "/ammo-mods/cryo-freeze.webp",
				augments: [
					"bigGameCryoFreeze",
					"iceCloud",
					"frozenStiff",
					"coldCompany",
					"extensionCryoFreeze",
					"freezerBurn",
					"liquidNitrogen",
					"thermalShock",
				],
			},
		},
	},
	napalmBurst: {
		id: "napalm-burst",
		title: "Napalm Burst",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite Normal and Special enemies.",
		image: "/ammo-mods/napalm-burst.webp",
		augments: [
			"bigGameNapalmBurst",
			"thermite",
			"firebomb",
			"extensionNapalmBurst",
			"incendiary",
			"contactBurn",
		],
		variants: {
			blackOps7: {
				description:
					"Bullets deal fire damage. Each bullet has a chance to ignite Normal and Special enemies, dealing damage over time.",
				image: "/ammo-mods/napalm-burst.webp",
				augments: [
					"bigGameNapalmBurst",
					"thermite",
					"firebomb",
					"petroleum",
					"extensionNapalmBurst",
					"incendiary",
					"contactBurn",
					"backdraft",
				],
			},
		},
	},
	shadowRift: {
		id: "shadow-rift",
		title: "Shadow Rift",
		description:
			"Bullets deal shadow damage. Each bullet has a chance to spawn a black hole if striking Normal or Special enemies, warping nearby zombies away and dropping some from the air at high speed.",
		image: "/ammo-mods/shadow-rift.webp",
		augments: [
			"bigGameShadowRift",
			"toppleDanger",
			"explosiveRain",
			"hasteShadowRift",
			"targeted",
			"supermassive",
		],
	},
} as const satisfies Record<string, AmmoMod>
