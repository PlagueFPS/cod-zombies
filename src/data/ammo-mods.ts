import type { GameKey } from "@/data/games"
import type { AmmoModsImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"
import { type AugmentTuple, makeAugmentTuple } from "@/data/augments"
import { mapWithGameVariant, resolveGameVariantOption } from "@/data/registry-helpers"

type AmmoModVariant = Omit<Partial<AmmoMod>, "_tag" | "id" | "title" | "variants">

export interface AmmoMod {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "AmmoMod"
	/** The unique identifier of the ammo mod */
	readonly id: string
	/** The title of the ammo mod */
	readonly title: string
	/** The game of the ammo mod */
	/** The description of the ammo mod */
	readonly description: string
	/** The image of the ammo mod */
	readonly image: AmmoModsImagePath
	/** The augments of the ammo mod */
	readonly augments: Option.Option<AugmentTuple>
	/** The game variant overrides of the ammo mod */
	readonly variants: Option.Option<Partial<Record<GameKey, AmmoModVariant>>>
}

/** Union type of all ammo mod keys */
export type AmmoModKey = HashMap.HashMap.Key<typeof ammoModHashMap>

/**
 * Gets an ammo mod by its key.
 * @param key The key of the ammo mod.
 * @param game The game to get the ammo mod variant for.
 */
export const getAmmoModByKey = (key: AmmoModKey, game?: GameKey): Option.Option<AmmoMod> =>
	resolveGameVariantOption(HashMap.get(ammoModHashMap, key), game)

/**
 * Gets all ammo mods.
 * @param game The game to get the ammo mod variants for.
 */
export const getAmmoMods = (game?: GameKey): AmmoMod[] =>
	mapWithGameVariant(HashMap.toValues(ammoModHashMap), game)

const makeAmmoMod = <T extends string>(
	identifier: T,
	ammoMod: Omit<AmmoMod, "_tag" | "id">,
): [T, AmmoMod] => [
	identifier,
	{
		_tag: "AmmoMod",
		id: identifier,
		...ammoMod,
	},
]

const ammoModHashMap = HashMap.make(
	makeAmmoMod("fire-bomb", {
		title: "Fire Bomb",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite many zombies at once.",
		image: "/ammo-mods/fire-bomb.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makeAmmoMod("brain-rot", {
		title: "Brain Rot",
		description:
			"Bullets deal toxic damage. Each bullet has a chance to infect a zombie, becoming an ally for short duration.",
		image: "/ammo-mods/brain-rot.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				description:
					"Bullets deal toxic damage. Each bullet has a chance to turn a normal enemy into an ally for 15 seconds before dying (40 second cooldown).",
				image: "/ammo-mods/brain-rot-bo6.webp",
			},
			"black-ops-6": {
				description:
					"Bullets deal toxic damage. Each bullet has the chance to turn a Normal or Special enemy into an ally for short duration.",
				image: "/ammo-mods/brain-rot-bo6.webp",
				augments: makeAugmentTuple([
					"plague",
					"pheromone",
					"big-game-brain-rot",
					"extension-brain-rot",
					"haste-brain-rot",
					"explosive",
				]),
			},
			"black-ops-7": {
				description:
					"Bullets deal toxic damage. Each bullet has the chance to turn a Normal or Special enemy into an ally for short duration.",
				image: "/ammo-mods/brain-rot-bo6.webp",
				augments: makeAugmentTuple([
					"plague",
					"pheromone",
					"big-game-brain-rot",
					"caustic-fumes",
					"extension-brain-rot",
					"haste-brain-rot",
					"explosive",
					"super-serum",
				]),
			},
		}),
	}),
	makeAmmoMod("kill-o-watt", {
		title: "Kill-O-Watt",
		description:
			"Bullets deal electric damage. Each bullet has a chance to create an area-of-effect stun, immobilizing zombies and eventually killing them.",
		image: "/ammo-mods/dead-wire.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makeAmmoMod("light-mend", {
		title: "Light Mend",
		description:
			"Bullets deal light damage. Each bullet has a change to transform a normal or special enemy's health into a healing glyph that moves to nearby injured allies.",
		image: "/ammo-mods/light-mend.webp",
		augments: makeAugmentTuple([
			"antibiotic",
			"big-game-light-mend",
			"dual-action",
			"longer-life",
			"extra-strength",
			"express-remedy",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"antibiotic",
					"big-game-light-mend",
					"dual-action",
					"booster-shot",
					"longer-life",
					"extra-strength",
					"express-remedy",
					"mitosis",
				]),
			},
		}),
	}),
	makeAmmoMod("dead-wire", {
		title: "Dead Wire",
		description: "Each bullet has a chance to stun any Normal and Special enemy.",
		image: "/ammo-mods/dead-wire.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				description:
					"Bullets deal electrical damage. Each bullet has a chance to stun any Normal and Special enemy, generating a field that deals electric damage to nearby enemies.",
				image: "/ammo-mods/dead-wire-bo6.webp",
			},
			"black-ops-6": {
				image: "/ammo-mods/dead-wire-bo6.webp",
				augments: makeAugmentTuple([
					"chain-lightning",
					"big-game-dead-wire",
					"lightning-strike",
					"high-voltage",
					"haste-dead-wire",
					"extension-dead-wire",
				]),
			},
			"black-ops-7": {
				image: "/ammo-mods/dead-wire-bo6.webp",
				augments: makeAugmentTuple([
					"chain-lightning",
					"big-game-dead-wire",
					"lightning-strike",
					"ball-lightning",
					"high-voltage",
					"haste-dead-wire",
					"extension-dead-wire",
					"aftershock",
				]),
			},
		}),
	}),
	makeAmmoMod("cryo-freeze", {
		title: "Cryo Freeze",
		description:
			"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
		image: "/ammo-mods/cryo-freeze.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description:
					"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
				image: "/ammo-mods/cryo-freeze.webp",
				augments: makeAugmentTuple([
					"big-game-cryo-freeze",
					"ice-cloud",
					"frozen-stiff",
					"extension-cryo-freeze",
					"freezer-burn",
					"liquid-nitrogen",
				]),
			},
			"black-ops-7": {
				description:
					"Bullets deal frost damage. Each bullet has a chance to slow Normal or Special enemies.",
				image: "/ammo-mods/cryo-freeze.webp",
				augments: makeAugmentTuple([
					"big-game-cryo-freeze",
					"ice-cloud",
					"frozen-stiff",
					"cold-company",
					"extension-cryo-freeze",
					"freezer-burn",
					"liquid-nitrogen",
					"thermal-shock",
				]),
			},
		}),
	}),
	makeAmmoMod("napalm-burst", {
		title: "Napalm Burst",
		description:
			"Bullets deal fire damage. Each bullet has a chance to ignite Normal and Special enemies.",
		image: "/ammo-mods/napalm-burst.webp",
		augments: makeAugmentTuple([
			"big-game-napalm-burst",
			"thermite",
			"firebomb",
			"extension-napalm-burst",
			"incendiary",
			"contact-burn",
		]),
		variants: Option.some({
			"black-ops-7": {
				description:
					"Bullets deal fire damage. Each bullet has a chance to ignite Normal and Special enemies, dealing damage over time.",
				image: "/ammo-mods/napalm-burst.webp",
				augments: makeAugmentTuple([
					"big-game-napalm-burst",
					"thermite",
					"firebomb",
					"petroleum",
					"extension-napalm-burst",
					"incendiary",
					"contact-burn",
					"backdraft",
				]),
			},
		}),
	}),
	makeAmmoMod("shadow-rift", {
		title: "Shadow Rift",
		description:
			"Bullets deal shadow damage. Each bullet has a chance to spawn a black hole if striking Normal or Special enemies, warping nearby zombies away and dropping some from the air at high speed.",
		image: "/ammo-mods/shadow-rift.webp",
		augments: makeAugmentTuple([
			"big-game-shadow-rift",
			"topple-danger",
			"explosive-rain",
			"haste-shadow-rift",
			"targeted",
			"supermassive",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"big-game-shadow-rift",
					"topple-danger",
					"explosive-rain",
					"gravity-well",
					"haste-shadow-rift",
					"targeted",
					"supermassive",
					"ammo-theorem",
				]),
			},
		}),
	}),
	makeAmmoMod("fire-works", {
		title: "Fire Works",
		description:
			"Each bullet that hits a Normal or Special Enemy has a chance to launch fireworks that target enemies.",
		image: "/ammo-mods/fire-works.webp",
		augments: makeAugmentTuple([
			"big-game-fire-works",
			"starburst",
			"weeping-willow",
			"fire-wheel",
			"starlight",
			"big-bang",
			"high-yield",
			"short-fuse",
		]),
		variants: Option.none(),
	}),
)
