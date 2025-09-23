import {
	type AugmentTuple,
	apexHunter,
	arcaneFury,
	broadBeam,
	burstDash,
	carousel,
	danceParty,
	darkPact,
	extensionAetherShroud,
	extensionDarkFlare,
	extensionFrenziedGuard,
	extraCharge,
	frenzyFire,
	frequencyBoost,
	groupShroud,
	heavyShadow,
	instantReload,
	lithiumCharged,
	overclocked,
	partyAnimal,
	peeksFavor,
	phalanx,
	powerGrid,
	rally,
	repairBoost,
	retribution,
	scatter,
	shockwave,
	siren,
	socialButterfly,
	staticDischarge,
	supernova,
	transformer,
	turret,
	voidSheath,
} from "./augments"

/** Gets a field upgrade by its key.
 * @param key The key of the field upgrade.
 * @returns The field upgrade.
 */
export const getFieldUpgradeByKey = (key: FieldUpgradeKey): FieldUpgrade =>
	fieldUpgradeRegistry[key]
export const getFieldUpgrades = (): FieldUpgrade[] => Object.values(fieldUpgradeRegistry)

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
}

const fieldUpgradeRegistry = {
	ringOfFire: {
		id: "ring-of-fire",
		title: "Ring of Fire",
		description:
			"Create a ring of ethereal fire that boosts damage for you and allies. Normal enemies who enter gain a burning effect that deals fire damage. Last 15 seconds.",
		image: "/field-upgrades/ring-of-fire.avif",
	},
	aetherShroud: {
		id: "aether-shroud",
		title: "Aether Shroud",
		description: "Phase into the Dark Aether and become temporarily hidden from enemy detection.",
		image: "/field-upgrades/aether-shroud.avif",
		augments: [
			groupShroud,
			burstDash,
			voidSheath,
			instantReload,
			extraCharge,
			extensionAetherShroud,
		],
	},
	frenziedGuard: {
		id: "frenzied-guard",
		title: "Frenzied Guard",
		description:
			"Repair armor to full and force all enemies in the area to temporarily target you. Armor takes all damage during this time, and is repaired on every kill.",
		image: "/field-upgrades/frenzied-guard.avif",
		augments: [phalanx, retribution, frenzyFire, repairBoost, extensionFrenziedGuard, rally],
	},
	darkFlare: {
		id: "dark-flare",
		title: "Dark Flare",
		description:
			"Generate an energy beam that deals lethal shadow damage and penetrates everything in its path.",
		image: "/field-upgrades/dark-flare.avif",
		augments: [extensionDarkFlare, supernova, darkPact, broadBeam, heavyShadow, extraCharge],
	},
	energyMine: {
		id: "energy-mine",
		title: "Energy Mine",
		description: "Create a mine of pure energy that detonates 3 times, dealing lethal damage.",
		image: "/field-upgrades/energy-mine.avif",
		augments: [scatter, turret, carousel, frequencyBoost, extraCharge, siren],
	},
	teslaStorm: {
		id: "tesla-storm",
		title: "Tesla Storm",
		description:
			"For 10 seconds lightning connects to other players, stunning and damaging normal enemies.",
		image: "/field-upgrades/tesla-storm.avif",
		augments: [transformer, shockwave, staticDischarge, powerGrid, overclocked, lithiumCharged],
	},
	misterPeeks: {
		id: "mister-peeks",
		title: "Mister Peeks",
		description: "Summon Mister Peeks to our reality to create chaos.",
		image: "/field-upgrades/mister-peeks.avif",
		augments: [danceParty, arcaneFury, apexHunter, socialButterfly, peeksFavor, partyAnimal],
	},
} as const satisfies Record<string, FieldUpgrade>

export type FieldUpgradeKey = keyof typeof fieldUpgradeRegistry
export const {
	ringOfFire,
	aetherShroud,
	frenziedGuard,
	darkFlare,
	energyMine,
	teslaStorm,
	misterPeeks,
} = fieldUpgradeRegistry
