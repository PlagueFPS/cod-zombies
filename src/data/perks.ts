import type { GameKey } from "@/data/games"
import type { PerksImagePath } from "@/types/generated/image-paths.gen"
import { Option } from "effect"
import { type AugmentTuple, makeAugmentTuple } from "@/data/augments"
import { resolveGameVariantOption } from "@/data/registry-helpers"

type PerkVariant = Omit<Partial<Perk>, "_tag" | "id" | "title" | "variants">

export interface Perk {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Perk"
	/** The unique identifier of the perk */
	readonly id: string
	/** The title of the perk */
	readonly title: string
	/** The description of the perk */
	readonly description: string
	/** The image of the perk */
	readonly image: PerksImagePath
	/** The modifier of the perk */
	readonly modifier: Option.Option<string>
	/** The augments of the perk */
	readonly augments: Option.Option<AugmentTuple>
	/** The game variants of the perk */
	readonly variants: Option.Option<Partial<Record<GameKey, PerkVariant>>>
}
/**Union of all perk keys */
export type PerkKey = Parameters<(typeof PERKS)["get"]>[0]

/**
 * Gets a perk by its key.
 * @param key The key of the perk.
 * @param game The game to get the perk variant for.
 * @returns The perk.
 */
export const getPerkByKey = (key: PerkKey, game?: GameKey): Option.Option<Perk> =>
	resolveGameVariantOption(Option.fromUndefinedOr(PERKS.get(key)), game)

const makePerk = <T extends string>(identifier: T, perk: Omit<Perk, "_tag" | "id">): [T, Perk] => [
	identifier,
	{
		_tag: "Perk" as const,
		id: identifier,
		...perk,
	},
]

const PERKS = new Map([
	makePerk("wisp-tea", {
		title: "Wisp Tea",
		description: "Summon a companion wisp after killing zombies.",
		image: "/perks/wisp-tea.webp",
		modifier: Option.none(),
		augments: makeAugmentTuple([
			"mask-of-wrath",
			"mask-of-salvation",
			"mask-of-distraction",
			"mask-of-benevolence",
			"extension-wisp-tea",
			"haste-wisp-tea",
			"zombie-sitter",
			"fetcher",
		]),
		variants: Option.none(),
	}),
	makePerk("juggernog", {
		title: "Juggernog",
		description: "Increases max health.",
		image: "/perks/juggernog.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				description: "Increase Max Health by 100.",
				image: "/perks/juggernog-bo6.webp",
			},
			"black-ops-6": {
				description: "Increase Max Health by 100.",
				image: "/perks/juggernog-bo6.webp",
				augments: makeAugmentTuple([
					"probiotic",
					"turtle-shell",
					"reactive-armor",
					"retaliation",
					"hardened-plates",
					"durable-plates",
				]),
			},
			"black-ops-7": {
				description: "Increase Max Health by 100.",
				image: "/perks/juggernog-bo6.webp",
				augments: makeAugmentTuple([
					"probiotic",
					"turtle-shell",
					"reactive-armor",
					"iron-core",
					"retaliation",
					"hardened-plates",
					"durable-plates",
					"shake-it-off",
				]),
			},
		}),
	}),
	makePerk("deadshot-daiquiri", {
		title: "Deadshot Daiquiri",
		description:
			"Reduces weapon spread by 35%, removes weapon sway, and auto-locks aim-assist to a zombies head.",
		image: "/perks/deadshot-daiquiri.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				description: "Aiming down sights moves to enemy critical location. Remove scope sway.",
				image: "/perks/deadshot-daiquiri-cold-war.webp",
			},
			"black-ops-6": {
				description: "Improve ADS precision and increase critical damage.",
				image: "/perks/deadshot-daiquiri-cold-war.webp",
				augments: makeAugmentTuple([
					"dead-head",
					"dead-first",
					"dead-again",
					"dead-break",
					"dead-draw",
					"dead-set",
				]),
			},
			"black-ops-7": {
				description: "Improve ADS precision and increase critical damage.",
				image: "/perks/deadshot-daiquiri-cold-war.webp",
				augments: makeAugmentTuple([
					"dead-head",
					"dead-first",
					"dead-again",
					"dead-point",
					"dead-break",
					"dead-draw",
					"dead-set",
					"dead-heat",
				]),
			},
		}),
	}),
	makePerk("widows-wine", {
		title: "Widow's Wine",
		description:
			"Replaces lethal equipment with four special grenades that explode automatically when hit, consuming a grenade, and slowing and damaging all normal/special zombies in the blast radius.",
		image: "/perks/widows-wine.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("double-tap", {
		title: "Double Tap",
		description:
			"Increases the rate of fire and doubles the damage of every round fired from a projectile weapon.",
		image: "/perks/double-tap-bo3.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description: "Increases weapon fire rate.",
				image: "/perks/double-tap.webp",
				augments: makeAugmentTuple([
					"double-jeopardy",
					"double-standard",
					"double-impact",
					"double-time",
					"double-or-nothing",
					"double-play",
				]),
			},
			"black-ops-7": {
				description: "Increases weapon fire rate.",
				image: "/perks/double-tap.webp",
				augments: makeAugmentTuple([
					"double-jeopardy",
					"double-standard",
					"double-impact",
					"double-dealer",
					"double-time",
					"double-or-nothing",
					"double-play",
					"double-down",
				]),
			},
		}),
	}),
	makePerk("timeslip", {
		title: "Timeslip",
		description:
			"Equipment cooldown rate increased. Mystery Box and Pack-a-Punch weapons appear faster. Greatly reduce Trap and Fast Travel cooldowns.",
		modifier: Option.some(
			"Special Weapon charge rate and Elixir cooldown rate are slightly increased.",
		),
		image: "/perks/timeslip.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("stone-cold-stronghold", {
		title: "Stone Cold Stronghold",
		description:
			"Standing your ground creates a defensive circle which boosts damage and armor over time while inside.",
		modifier: Option.some(
			"Enemies killed inside the defensive circle also boost damage and armor.",
		),
		image: "/perks/stone-cold-stronghold.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("phd-slider", {
		title: "PHD Slider",
		description:
			"Slide to build up charge. Once full charged, slide into an enemy to trigger an explosion. Gain full resistance to self-inflicted explosive damage and partial resistance to enemy explosive damage.",
		modifier: Option.some(
			"Improved slide distance. Trap immunity while sliding. Increased explosion damage when entering a slide from greater heights.",
		),
		image: "/perks/phd-slider.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("quick-revive", {
		title: "Quick Revive",
		description: "Revive teammates 100% faster. Self-revive on solo, up to 3 times.",
		image: "/perks/quick-revive.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-4": {
				description:
					"Shorter delay before regenerating health and increased regeneration rate. Revive Players faster.",
				modifier: Option.some(
					"Gain a sprint speed after health regeneration starts. Reviving grants both players full health and a sprint speed boost.",
				),
				image: "/perks/quick-revive.webp",
			},
			"black-ops-6": {
				description: "Recover health and revive allies faster.",
				image: "/perks/quick-revive-cold-war.webp",
				augments: makeAugmentTuple([
					"emt",
					"equivalent-exchange",
					"dying-wish",
					"swift-recovery",
					"karmic-return",
					"slow-death",
				]),
			},
			"black-ops-7": {
				description: "Recover health and revive allies faster.",
				image: "/perks/quick-revive-cold-war.webp",
				augments: makeAugmentTuple([
					"emt",
					"equivalent-exchange",
					"dying-wish",
					"adrenaline-rush",
					"swift-recovery",
					"karmic-return",
					"slow-death",
					"emergency-medical-kit",
				]),
			},
		}),
	}),
	makePerk("stamin-up", {
		title: "Stamin-Up",
		description: "Sprint duration is increased by 100%. Sprint speed increased.",
		image: "/perks/stamin-up.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-4": {
				description: "Increased sprint speed and duration. Stamina regenerates faster.",
				modifier: Option.some("Unlimited full sprint. Player can fire weapons while sprinting."),
			},
			"black-ops-cold-war": {
				description: "Increase run and sprint speed.",
				image: "/perks/stamin-up-cold-war.webp",
			},
			"black-ops-6": {
				description: "Increase run and sprint speed.",
				image: "/perks/stamin-up-cold-war.webp",
				augments: makeAugmentTuple([
					"free-faller",
					"dasher",
					"stalker",
					"hard-target",
					"quarterback",
					"hot-foot",
				]),
			},
			"black-ops-7": {
				description: "Increase movement speed.",
				image: "/perks/stamin-up-cold-war.webp",
				augments: makeAugmentTuple([
					"free-faller",
					"dasher",
					"stalker",
					"guns-up",
					"hard-target",
					"quarterback",
					"hot-foot",
					"footwork",
				]),
			},
		}),
	}),
	makePerk("winters-wail", {
		title: "Winter's Wail",
		description:
			"Getting hit by a melee attack while not at full health will cause a frost explosion that will freeze or slow enemies nearby. You can store three charges. In Realistic Difficulty, the frost explosion will trigger regardless of health.",
		modifier: Option.some(
			"Frost explosion triggers a slowing field around the Player for a limited time. Store an additional charge.",
		),
		image: "/perks/winters-wail.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("death-perception", {
		title: "Death Perception",
		description:
			"See nearby enemies through walls. Receive screen indicators when enemies approach the Player from off-screen.",
		modifier: Option.some("Deal increased damage to special enemy weak points."),
		image: "/perks/death-perception.webp",
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description: "Obscured enemies are keylined.",
				image: "/perks/death-perception-bo6.webp",
				modifier: Option.none(),
				augments: makeAugmentTuple([
					"treasure-hunter",
					"death-stare",
					"critical-eye",
					"birds-eye-view",
					"extra-change",
					"further-insight",
				]),
			},
			"black-ops-7": {
				description: "Obscured enemies are outlined.",
				image: "/perks/death-perception-bo6.webp",
				modifier: Option.none(),
				augments: makeAugmentTuple([
					"treasure-hunter",
					"death-stare",
					"critical-eye",
					"sixth-sense",
					"birds-eye-view",
					"extra-change",
					"further-insight",
					"hidden-gems",
				]),
			},
		}),
	}),
	makePerk("victorious-tortoise", {
		title: "Victorious Tortoise",
		description:
			"Shields block damage from all directions when held. When a Shield breaks it will trigger a defensive explosion.",
		modifier: Option.some("Shield bash attacks can knock down heavy and Mini-Boss enemies."),
		image: "/perks/victorious-tortoise.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("dying-wish", {
		title: "Dying Wish",
		description:
			"Instead of entering Last Stand the Player goes Berserk for 9 seconds. While Berserk, they are invulnerable and melee damage is greatly increased. Afterwards, the Player is left with 1 health. Cooldown increases with every use.",
		modifier: Option.some("Player will receive full health when no longer Berserk."),
		image: "/perks/dying-wish.webp",
		augments: Option.none(),
		variants: Option.none(),
	}),
	makePerk("phd-flopper", {
		title: "PHD Flopper",
		description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
		image: "/perks/phd-flopper-bo1.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
				image: "/perks/phd-flopper.webp",
				augments: makeAugmentTuple([
					"gravity-md",
					"dr-ram",
					"phd-slider",
					"environmentalist",
					"eod-technician",
					"tribologist",
				]),
			},
			"black-ops-7": {
				description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
				image: "/perks/phd-flopper.webp",
				augments: makeAugmentTuple([
					"gravity-md",
					"dr-ram",
					"phd-slider",
					"double-whammy",
					"environmentalist",
					"eod-technician",
					"tribologist",
					"stuntman",
				]),
			},
		}),
	}),
	makePerk("vulture-aid", {
		title: "Vulture Aid",
		description:
			"See items through walls, zombies drop ammo packs, and the occasional gas cloud that, if stood in, allows the player to be ignored by zombies.",
		image: "/perks/vulture-aid-bo2.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description: "Increase the variety of loot dropped by enemies.",
				image: "/perks/vulture-aid.webp",
				augments: makeAugmentTuple([
					"fetid-upgraid",
					"smell-of-death",
					"parting-gift",
					"condors-reach",
					"carrion-luggage",
					"picky-eater",
				]),
			},
			"black-ops-7": {
				description: "Increase the variety of loot dropped by enemies.",
				image: "/perks/vulture-aid.webp",
				augments: makeAugmentTuple([
					"fetid-upgraid",
					"smell-of-death",
					"parting-gift",
					"armor-matic",
					"condors-reach",
					"carrion-luggage",
					"picky-eater",
					"extra-serving",
				]),
			},
		}),
	}),
	makePerk("melee-macchiato", {
		title: "Melee Macchiato",
		description: "Replace weapon gun butt with a deadly punch.",
		image: "/perks/melee-macchiato.webp",
		modifier: Option.none(),
		augments: makeAugmentTuple([
			"expresso",
			"vampiric-extraction",
			"triple-shot",
			"stick-n-move",
			"strength-training",
			"hidden-impact",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"expresso",
					"vampiric-extraction",
					"triple-shot",
					"mocha-maul",
					"stick-n-move",
					"strength-training",
					"mugging",
					"barista-brawl",
				]),
			},
		}),
	}),
	makePerk("mule-kick", {
		title: "Mule Kick",
		description: "Carry an additional weapon.",
		image: "/perks/mule-kick.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				image: "/perks/mule-kick-cold-war.webp",
			},
			"black-ops-7": {
				image: "/perks/mule-kick-cold-war.webp",
				augments: makeAugmentTuple([
					"pack-mule",
					"free-throw",
					"ol-reliable",
					"multi-pack",
					"fully-equipped",
					"plate-hunter",
					"bogo",
					"kick-back",
				]),
			},
		}),
	}),
	makePerk("speed-cola", {
		title: "Speed Cola",
		description: "Increases Reload Speed.",
		image: "/perks/speed-cola-bo3.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-6": {
				description: "Increase reload speed bonus to 15%.",
				image: "/perks/speed-cola.webp",
				augments: makeAugmentTuple([
					"supercharged",
					"classic-formula",
					"phantom-reload",
					"speedy-roulette",
					"quick-swap",
					"fast-pitcher",
				]),
			},
			"black-ops-7": {
				description: "Reload weapon and replate armor faster.",
				image: "/perks/speed-cola.webp",
				augments: makeAugmentTuple([
					"supercharged",
					"classic-formula",
					"phantom-reload",
					"ammo-surge",
					"speedy-roulette",
					"quick-swap",
					"fast-pitcher",
					"prestidigitation",
				]),
			},
		}),
	}),
	makePerk("elemental-pop", {
		title: "Elemental Pop",
		description: "Grants a small chance to apply a random Ammo Mod effect to your next attack.",
		image: "/perks/elemental-pop.webp",
		modifier: Option.none(),
		augments: makeAugmentTuple([
			"citrus-focus",
			"imperial-peach",
			"electric-cherry",
			"vulnera-bean",
			"pineapple-blast",
			"chill-berry",
		]),
		variants: Option.some({
			"black-ops-7": {
				augments: makeAugmentTuple([
					"citrus-focus",
					"imperial-peach",
					"electric-cherry",
					"rainbow-pop",
					"vulnera-bean",
					"pineapple-blast",
					"chill-berry",
					"refresh-mint",
				]),
			},
		}),
	}),
	makePerk("tombstone", {
		title: "Tombstone",
		description:
			"Allows you to drop a tombstone that you can pick up after death to reclaim your weapons and perks you had before dying. (Excluding Tombstone itself).",
		image: "/perks/tombstone.webp",
		modifier: Option.none(),
		augments: Option.none(),
		variants: Option.some({
			"black-ops-cold-war": {
				description: "Have a chance to revive yourself when downed.",
				image: "/perks/tombstone-cold-war.webp",
			},
		}),
	}),
])
