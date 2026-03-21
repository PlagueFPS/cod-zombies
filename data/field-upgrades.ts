import type { GameKey } from "@/data/games"
import type { FieldUpgradesImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"
import { type AugmentTuple, makeAugmentTuple } from "@/data/augments"
import { resolveGameVariantOption } from "@/data/registry-helpers"

type FieldUpgradeVariant = Omit<Partial<FieldUpgrade>, "_tag" | "id" | "title" | "variants">

export interface FieldUpgrade {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "FieldUpgrade"
	/** The unique identifier of the field upgrade */
	readonly id: string
	/** The title of the field upgrade */
	readonly title: string
	/** The description of the field upgrade */
	readonly description: string
	/** The image of the field upgrade */
	readonly image: FieldUpgradesImagePath
	/** The augments of the field upgrade */
	readonly augments: Option.Option<AugmentTuple>
	/** The game variants of the field upgrade */
	readonly variants: Option.Option<Partial<Record<GameKey, FieldUpgradeVariant>>>
}

/** Union type of all field upgrade keys */
export type FieldUpgradeKey = HashMap.HashMap.Key<typeof fieldUpgradeHashMap>

/** Gets a field upgrade by its key.
 * @param key The key of the field upgrade.
 * @param game The game to get the field upgrade variant for.
 */
export const getFieldUpgradeByKey = (
	key: FieldUpgradeKey,
	game?: GameKey,
): Option.Option<FieldUpgrade> =>
	resolveGameVariantOption(HashMap.get(fieldUpgradeHashMap, key), game)

const makeFieldUpgrade = <T extends string>(
	identifier: T,
	fieldUpgrade: Omit<FieldUpgrade, "_tag" | "id">,
): [T, FieldUpgrade] => [
	identifier,
	{
		_tag: "FieldUpgrade" as const,
		id: identifier,
		...fieldUpgrade,
	},
]

const fieldUpgradeHashMap = HashMap.make(
	makeFieldUpgrade("ring-of-fire", {
		title: "Ring of Fire",
		description:
			"Create a ring of ethereal fire that boosts damage for you and allies. Normal enemies who enter gain a burning effect that deals fire damage. Last 15 seconds.",
		image: "/field-upgrades/ring-of-fire.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makeFieldUpgrade("aether-shroud", {
		title: "Aether Shroud",
		description: "Phase into the Dark Aether and become temporarily hidden from enemy detection.",
		image: "/field-upgrades/aether-shroud.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				augments: makeAugmentTuple([
					"group-shroud",
					"burst-dash",
					"void-sheath",
					"instant-reload",
					"extra-charge",
					"extension-aether-shroud",
				]),
			},
			"black-ops-7": {
				augments: makeAugmentTuple([
					"group-shroud",
					"burst-dash",
					"void-sheath",
					"afterimage",
					"instant-reload",
					"extra-charge",
					"extension-aether-shroud",
					"impulse",
				]),
			},
		}),
	}),
	makeFieldUpgrade("frenzied-guard", {
		title: "Frenzied Guard",
		description:
			"Repair armor to full and force all enemies in the area to temporarily target you. Armor takes all damage during this time, and is repaired on every kill.",
		image: "/field-upgrades/frenzied-guard.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				augments: makeAugmentTuple([
					"phalanx",
					"retribution",
					"frenzy-fire",
					"repair-boost",
					"extension-frenzied-guard",
					"rally",
				]),
			},
			"black-ops-7": {
				augments: makeAugmentTuple([
					"phalanx",
					"retribution",
					"frenzy-fire",
					"fists-of-frenzy",
					"repair-boost",
					"extension-frenzied-guard",
					"rally",
					"dual-layer",
				]),
			},
		}),
	}),
	makeFieldUpgrade("dark-flare", {
		title: "Dark Flare",
		description:
			"Generate an energy beam that deals lethal shadow damage and penetrates everything in its path.",
		image: "/field-upgrades/dark-flare.webp",
		augments: makeAugmentTuple([
			"extension-dark-flare",
			"supernova",
			"dark-pact",
			"broad-beam",
			"heavy-shadow",
			"extra-charge",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"extension-dark-flare",
					"supernova",
					"dark-pact",
					"muzzle-blast",
					"broad-beam",
					"heavy-shadow",
					"extra-charge",
					"dusk-flame",
				]),
			},
		}),
	}),
	makeFieldUpgrade("energy-mine", {
		title: "Energy Mine",
		description: "Create a mine of pure energy that detonates 3 times, dealing lethal damage.",
		image: "/field-upgrades/energy-mine.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				augments: makeAugmentTuple([
					"scatter",
					"turret",
					"carousel",
					"frequency-boost",
					"extra-charge",
					"siren",
				]),
			},
			"black-ops-7": {
				augments: makeAugmentTuple([
					"scatter",
					"turret",
					"carousel",
					"smart-mine",
					"frequency-boost",
					"extra-charge",
					"siren",
					"recycle",
				]),
			},
		}),
	}),
	makeFieldUpgrade("tesla-storm", {
		title: "Tesla Storm",
		description:
			"For 10 seconds lightning connects to other players, stunning and damaging normal enemies.",
		image: "/field-upgrades/tesla-storm.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				augments: makeAugmentTuple([
					"transformer",
					"shockwave",
					"static-discharge",
					"power-grid",
					"overclocked",
					"lithium-charged",
				]),
			},
			"black-ops-7": {
				augments: makeAugmentTuple([
					"transformer",
					"shockwave",
					"static-discharge",
					"haywire",
					"power-grid",
					"overclocked",
					"lithium-charged",
					"amped",
				]),
			},
		}),
	}),
	makeFieldUpgrade("mister-peeks", {
		title: "Mister Peeks",
		description: "Summon Mister Peeks to our reality to create chaos.",
		image: "/field-upgrades/mister-peeks.webp",
		augments: makeAugmentTuple([
			"dance-party",
			"arcane-fury",
			"apex-hunter",
			"social-butterfly",
			"peeks-favor",
			"party-animal",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"dance-party",
					"arcane-fury",
					"apex-hunter",
					"peek-health",
					"social-butterfly",
					"peeks-favor",
					"party-animal",
					"vib-discount",
				]),
			},
		}),
	}),
	makeFieldUpgrade("toxic-growth", {
		title: "Toxic Growth",
		description:
			"Summon a deadly growth of thorns in front of you. Enemies moving through it are slowed and take toxic damage.",
		image: "/field-upgrades/toxic-growth.webp",
		augments: makeAugmentTuple([
			"urticant",
			"cordyception",
			"pollination",
			"zoochory",
			"ankle-shredder",
			"green-thumb",
			"extra-charge",
			"plant-food",
		]),
		variants: Option.none(),
	}),
)
