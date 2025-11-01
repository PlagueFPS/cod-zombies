import type { AugmentTuple } from "./augments"
import type { GameKey } from "./games"

type FieldUpgradeVariant = Omit<Partial<FieldUpgrade>, "id" | "title" | "variants">

export interface FieldUpgrade {
	/** The unique identifier of the field upgrade */
	id: string
	/** The title of the field upgrade */
	title: string
	/** The description of the field upgrade */
	description: string
	/** The image of the field upgrade */
	image: string
	/** The augments of the field upgrade */
	augments?: AugmentTuple
	/** The game variants of the field upgrade */
	variants?: Partial<Record<GameKey, FieldUpgradeVariant>>
}

/** Union type of all field upgrade keys */
export type FieldUpgradeKey = keyof typeof fieldUpgradeRegistry

/** Gets a field upgrade by its key.
 * @param key The key of the field upgrade.
 * @param game The game to get the field upgrade variant for.
 */
export const getFieldUpgradeByKey = (key: FieldUpgradeKey, game?: GameKey): FieldUpgrade => {
	const fieldUpgrade: FieldUpgrade = fieldUpgradeRegistry[key]

	if (!game || !fieldUpgrade.variants?.[game]) return fieldUpgrade

	const variant = fieldUpgrade.variants?.[game]
	return { ...fieldUpgrade, ...variant }
}

/**
 * Gets all field upgrades.
 * @param game The game to get the field upgrade variants for.
 */
export const getFieldUpgrades = (game?: GameKey): FieldUpgrade[] => {
	return Object.values(fieldUpgradeRegistry).map((fieldUpgrade: FieldUpgrade) => {
		if (!game || !fieldUpgrade.variants?.[game]) return fieldUpgrade

		const variant = fieldUpgrade.variants[game]
		return {
			...fieldUpgrade,
			...variant,
		}
	})
}

const fieldUpgradeRegistry = {
	ringOfFire: {
		id: "ring-of-fire",
		title: "Ring of Fire",
		description:
			"Create a ring of ethereal fire that boosts damage for you and allies. Normal enemies who enter gain a burning effect that deals fire damage. Last 15 seconds.",
		image: "/field-upgrades/ring-of-fire.webp",
	},
	aetherShroud: {
		id: "aether-shroud",
		title: "Aether Shroud",
		description: "Phase into the Dark Aether and become temporarily hidden from enemy detection.",
		image: "/field-upgrades/aether-shroud.webp",
		variants: {
			blackOps6: {
				augments: [
					"groupShroud",
					"burstDash",
					"voidSheath",
					"instantReload",
					"extraCharge",
					"extensionAetherShroud",
				],
			},
			blackOps7: {
				augments: [
					"groupShroud",
					"burstDash",
					"voidSheath",
					"afterimage",
					"instantReload",
					"extraCharge",
					"extensionAetherShroud",
					"impulse",
				],
			},
		},
	},
	frenziedGuard: {
		id: "frenzied-guard",
		title: "Frenzied Guard",
		description:
			"Repair armor to full and force all enemies in the area to temporarily target you. Armor takes all damage during this time, and is repaired on every kill.",
		image: "/field-upgrades/frenzied-guard.webp",
		variants: {
			blackOps6: {
				augments: [
					"phalanx",
					"retribution",
					"frenzyFire",
					"repairBoost",
					"extensionFrenziedGuard",
					"rally",
				],
			},
			blackOps7: {
				augments: [
					"phalanx",
					"retribution",
					"frenzyFire",
					"fistsOfFrenzy",
					"repairBoost",
					"extensionFrenziedGuard",
					"rally",
					"dualLayer",
				],
			},
		},
	},
	darkFlare: {
		id: "dark-flare",
		title: "Dark Flare",
		description:
			"Generate an energy beam that deals lethal shadow damage and penetrates everything in its path.",
		image: "/field-upgrades/dark-flare.webp",
		augments: [
			"extensionDarkFlare",
			"supernova",
			"darkPact",
			"broadBeam",
			"heavyShadow",
			"extraCharge",
		],
		variants: {
			blackOps7: {
				augments: [
					"extensionDarkFlare",
					"supernova",
					"darkPact",
					"muzzleBlast",
					"broadBeam",
					"heavyShadow",
					"extraCharge",
					"duskFlame",
				],
			},
		},
	},
	energyMine: {
		id: "energy-mine",
		title: "Energy Mine",
		description: "Create a mine of pure energy that detonates 3 times, dealing lethal damage.",
		image: "/field-upgrades/energy-mine.webp",
		variants: {
			blackOps6: {
				augments: ["scatter", "turret", "carousel", "frequencyBoost", "extraCharge", "siren"],
			},
			blackOps7: {
				augments: [
					"scatter",
					"turret",
					"carousel",
					"smartMine",
					"frequencyBoost",
					"extraCharge",
					"siren",
					"recycle",
				],
			},
		},
	},
	teslaStorm: {
		id: "tesla-storm",
		title: "Tesla Storm",
		description:
			"For 10 seconds lightning connects to other players, stunning and damaging normal enemies.",
		image: "/field-upgrades/tesla-storm.webp",
		variants: {
			blackOps6: {
				augments: [
					"transformer",
					"shockwave",
					"staticDischarge",
					"powerGrid",
					"overclocked",
					"lithiumCharged",
				],
			},
		},
	},
	misterPeeks: {
		id: "mister-peeks",
		title: "Mister Peeks",
		description: "Summon Mister Peeks to our reality to create chaos.",
		image: "/field-upgrades/mister-peeks.webp",
		augments: [
			"danceParty",
			"arcaneFury",
			"apexHunter",
			"socialButterfly",
			"peeksFavor",
			"partyAnimal",
		],
	},
} as const satisfies Record<string, FieldUpgrade>
