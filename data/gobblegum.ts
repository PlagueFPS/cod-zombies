import type { GameKey } from "@/data/games"
import type { GobblegumsImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"
import { resolveGameVariantOption } from "@/data/registry-helpers"

/** Union of all Gobblegum keys */
export type GobblegumKey = HashMap.HashMap.Key<typeof gobblegumHashMap>
/** Union of all Gobblegum types */
export type GobblegumType =
	| "Player-Activated"
	| "Immediate"
	| "Time-Based"
	| "Round-Based"
	| "Instant"
	| "Conditional"
/** Union of all Gobblegum rarities */
export type GobblegumRarity =
	| "Classic"
	| "Mega"
	| "Rare-Mega"
	| "Ultra-Rare Mega"
	| "Rare"
	| "Epic"
	| "Legendary"
	| "Ultra"

type GobblegumVariant = Omit<Partial<Gobblegum>, "id" | "title" | "variants" | "_tag">

export interface Gobblegum {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Gobblegum"
	/** The unique identifier of the gobblegum */
	readonly id: string
	/** The title of the gobblegum */
	readonly title: string
	/** The description of the gobblegum */
	readonly description: string
	/** The type of the gobblegum */
	readonly type: GobblegumType
	/** The rarity of the gobblegum */
	readonly rarity: GobblegumRarity
	/** The image of the gobblegum */
	readonly image: GobblegumsImagePath
	/** The variants of the gobblegum */
	readonly variants: Option.Option<Partial<Record<GameKey, GobblegumVariant>>>
}

/**
 * Gets a gobblegum by its key.
 * @param key The key of the gobblegum.
 * @param game The game to get the gobblegum variant for.
 */
export const getGobblegumByKey = (key: GobblegumKey, game?: GameKey): Option.Option<Gobblegum> =>
	resolveGameVariantOption(HashMap.get(gobblegumHashMap, key), game)

const makeGobblegum = <T extends string>(
	identifier: T,
	gobblegum: Omit<Gobblegum, "_tag" | "id">,
): [T, Gobblegum] => [
	identifier,
	{
		_tag: "Gobblegum" as const,
		id: identifier,
		...gobblegum,
	},
]

const gobblegumHashMap = HashMap.make(
	makeGobblegum("alchemical-antithesis", {
		title: "Alchemical Antithesis",
		description:
			"Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon. Affects all weapons.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/alchemical-antithesis.webp",
		variants: Option.none(),
	}),
	makeGobblegum("anywhere-but-here", {
		title: "Anywhere But Here",
		description:
			"Instantly teleport to a random location. A concussive blast knocks away any nearby zombies, keeping the player safe.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/anywhere-but-here.webp",
		variants: Option.some({
			"black-ops-6": {
				description:
					"Instantly teleport to a random location. A concussive blast knocks away nearby zombies.",
				type: "Instant",
				rarity: "Rare",
				image: "/gobblegums/anywhere-but-here-bo6.webp",
			},
			"black-ops-7": {
				description:
					"Instantly teleport to a random location. A concussive blast knocks away nearby zombies.",
				type: "Instant",
				rarity: "Rare",
				image: "/gobblegums/anywhere-but-here-bo6.webp",
			},
		}),
	}),
	makeGobblegum("in-plain-sight", {
		title: "In Plain Sight",
		description: "All Zombies ignore the player. Lasts 10 seconds.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/in-plain-sight.webp",
		variants: Option.none(),
	}),
	makeGobblegum("stock-option", {
		title: "Stock Option",
		description:
			"Ammo is taken from the player's stockpile instead of their weapon's magazine. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/stock-option.webp",
		variants: Option.none(),
	}),
	makeGobblegum("danger-closest", {
		title: "Danger Closest",
		description: "Zero explosive damage. Lasts 3 full rounds.",
		type: "Round-Based",
		rarity: "Classic",
		image: "/gobblegums/danger-closest.webp",
		variants: Option.none(),
	}),
	makeGobblegum("perkaholic", {
		title: "Perkaholic",
		description: "Gives the player all Perk-a-Colas available on the map.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/perkaholic.webp",
		variants: Option.some({
			"black-ops-6": {
				description: "Gives the player all available perks.",
				type: "Instant",
				rarity: "Ultra",
				image: "/gobblegums/perkaholic-bo6.webp",
			},
			"black-ops-7": {
				description: "Gives the player all available perks.",
				type: "Instant",
				rarity: "Ultra",
				image: "/gobblegums/perkaholic-bo6.webp",
			},
		}),
	}),
	makeGobblegum("shopping-free", {
		title: "Shopping Free",
		description: "All purchases are free. Lasts 1 minute.",
		type: "Time-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/shopping-free.webp",
		variants: Option.none(),
	}),
	makeGobblegum("reign-drops", {
		title: "Reign Drops",
		description: "Spawns all nine core Power-Ups at once. 2x Activations.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/reign-drops.webp",
		variants: Option.some({
			"black-ops-7": {
				description: "Spawns all the core Power-Ups at once. 1x Activation.",
				type: "Instant",
				rarity: "Ultra",
				image: "/gobblegums/reign-drops-bo7.webp",
			},
		}),
	}),
	makeGobblegum("immolation-liquidation", {
		title: "Immolation Liquidation",
		description: "Spawns a Fire Sale Power-Up. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/immolation-liquidation.webp",
		variants: Option.none(),
	}),
	makeGobblegum("near-death-experience", {
		title: "Near Death Experience",
		description:
			"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/near-death-experience.webp",
		variants: Option.some({
			"black-ops-6": {
				description:
					"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Minutes or 5 Revives.",
				type: "Time-Based",
				rarity: "Ultra",
				image: "/gobblegums/near-death-experience-bo6.webp",
			},
			"black-ops-7": {
				description:
					"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Minutes or 5 Revives.",
				type: "Time-Based",
				rarity: "Ultra",
				image: "/gobblegums/near-death-experience-bo6.webp",
			},
		}),
	}),
	makeGobblegum("wall-power", {
		title: "Wall Power",
		description: "The next wall weapon purchased becomes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		image: "/gobblegums/wall-power.webp",
		variants: Option.some({
			"black-ops-6": {
				description: "The next wall weapon purchased becomes Pack-a-Punched.",
				type: "Conditional",
				rarity: "Legendary",
				image: "/gobblegums/wall-power-bo6.webp",
			},
		}),
	}),
	makeGobblegum("round-robbin", {
		title: "Round Robbin'",
		description: "Ends the current round. All players gain 1600 points.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/round-robbin.webp",
		variants: Option.none(),
	}),
	makeGobblegum("sword-flay", {
		title: "Sword Flay",
		description:
			"Melee attacks and any melee weapon will inflict 5x more damage on Zombies. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/sword-flay.webp",
		variants: Option.none(),
	}),
	makeGobblegum("power-vacuum", {
		title: "Power Vacuum",
		description:
			"Power-Ups spawn more often. The drop chance is greatly increased, the normal cap of only 4 drops per round is ignored. Lasts 4 rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/power-vacuum.webp",
		variants: Option.none(),
	}),
	makeGobblegum("idle-eyes", {
		title: "Idle Eyes",
		description: "All zombies ignore all players and stand idle. Lasts 30 seconds. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/idle-eyes.webp",
		variants: Option.some({
			"black-ops-6": {
				description: "All zombies ignore all players and stand idle. Lasts 30 seconds",
				type: "Time-Based",
				rarity: "Legendary",
				image: "/gobblegums/idle-eyes-bo6.webp",
			},
		}),
	}),
	makeGobblegum("fear-in-headlights", {
		title: "Fear in Headlights",
		description: "Zombies seen by the player will not move. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Rare-Mega",
		image: "/gobblegums/fear-in-headlights.webp",
		variants: Option.none(),
	}),
	makeGobblegum("ephemeral-enhancement", {
		title: "Ephemeral Enhancement",
		description:
			"Turns the weapon in the player's hands into the Pack-A-Punched version. Lasts 60 seconds. 2x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/ephemeral-enhancement.webp",
		variants: Option.none(),
	}),
	makeGobblegum("crate-power", {
		title: "Crate Power",
		description: "The next gun taken from the Mystery Box comes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		image: "/gobblegums/crate-power.webp",
		variants: Option.some({
			"black-ops-6": {},
		}),
	}),
	makeGobblegum("arsenal-accelerator", {
		title: "Arsenal Accelerator",
		description: "Charge the player's special weapon faster. Lasts 10 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/arsenal-accelerator.webp",
		variants: Option.some({
			"black-ops-6": {
				description: "Charge the player's Field Upgrade faster. Lasts 5 minutes.",
				type: "Time-Based",
				rarity: "Rare",
				image: "/gobblegums/arsenal-accelerator-bo6.webp",
			},
		}),
	}),
	makeGobblegum("self-medication", {
		title: "Self Medication",
		description: "Self-revive by killing a zombie while downed. Keep all perks. 3x Activations.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/self-medication.webp",
		variants: Option.none(),
	}),
	makeGobblegum("undead-man-walking", {
		title: "Undead Man Walking",
		description: "Slow down all zombies to shambling speed. Lasts 4 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/undead-man-walking.webp",
		variants: Option.none(),
	}),
	makeGobblegum("wonderbar", {
		title: "Wonderbar!",
		description:
			"The next weapon from the Mystery Box will be a Wonder Weapon. Activates on Mystery Box Spin.",
		type: "Conditional",
		rarity: "Ultra",
		image: "/gobblegums/wonderbar.webp",
		variants: Option.none(),
	}),
	makeGobblegum("shields-up", {
		title: "Shields Up",
		description: "Refill armor on use. Armor is twice as strong. Lasts 3 Minutes.",
		type: "Time-Based",
		rarity: "Rare",
		image: "/gobblegums/shields-up.webp",
		variants: Option.none(),
	}),
	makeGobblegum("kill-joy", {
		title: "Kill Joy",
		description: "Spawns an Insta-Kill Power-Up.",
		type: "Player-Activated",
		rarity: "Rare",
		image: "/gobblegums/kill-joy.webp",
		variants: Option.none(),
	}),
	makeGobblegum("profit-sharing", {
		title: "Profit Sharing",
		description:
			"A portion of the essence you earn is also received by nearby players and vice versa. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Epic",
		image: "/gobblegums/profit-sharing.webp",
		variants: Option.none(),
	}),
	makeGobblegum("extra-credit", {
		title: "Extra Credit",
		description: "Spawns a Bonus Points Power-Up worth 1,250 Points. 4x Activations.",
		type: "Player-Activated",
		rarity: "Rare-Mega",
		image: "/gobblegums/extra-credit.webp",
		variants: Option.none(),
	}),
	makeGobblegum("hidden-power", {
		title: "Hidden Power",
		description: "Upgrade your currently held weapon to Legendary rarity.",
		type: "Instant",
		rarity: "Ultra",
		image: "/gobblegums/hidden-power.webp",
		variants: Option.none(),
	}),
	makeGobblegum("power-keg", {
		title: "Power Keg",
		description: "Spawns a Full Power power-up.",
		type: "Instant",
		rarity: "Rare",
		image: "/gobblegums/power-keg.webp",
		variants: Option.none(),
	}),
	makeGobblegum("free-fire", {
		title: "Free Fire",
		description:
			"Firing weapons consumes no ammo. Does not work on wonder weapons. Lasts 60 Seconds.",
		type: "Time-Based",
		rarity: "Epic",
		image: "/gobblegums/free-fire.webp",
		variants: Option.none(),
	}),
	makeGobblegum("aftertaste", {
		title: "Aftertaste",
		description: "Keep all your Perks after being revived. 1x Activation; Activates on Revive.",
		type: "Conditional",
		rarity: "Rare",
		image: "/gobblegums/aftertaste-bo7.webp",
		variants: Option.none(),
	}),
	makeGobblegum("armor-gettin", {
		title: "Armor Gettin'",
		description: "Receive a 3-Plate Armor Vest and Full Plates.",
		type: "Instant",
		rarity: "Legendary",
		image: "/gobblegums/armor-gettin.webp",
		variants: Option.none(),
	}),
	makeGobblegum("phoenix-up", {
		title: "Phoenix Up",
		description: "Revive all teammates. Teammates keep all their perks.",
		type: "Instant",
		rarity: "Legendary",
		image: "/gobblegums/phoenix-up.webp",
		variants: Option.none(),
	}),
	makeGobblegum("gift-card", {
		title: "Gift Card",
		description: "Gain 30,000 Essence. Cannot be combined with other bonuses.",
		type: "Instant",
		rarity: "Ultra",
		image: "/gobblegums/gift-card.webp",
		variants: Option.none(),
	}),
)
