import type { GobblegumsImagePath } from "@/types/generated/image-paths.gen"
import type { GameKey } from "./games"
/** Union of all Gobblegum keys */
export type GobblegumKey = keyof typeof gobblegumRegistry
/** Union of all Gobblegum types */
export type GobblegumType = Gobblegum["type"]
/** Union of all Gobblegum rarities */
export type GobblegumRarity = Gobblegum["rarity"]

type GobblegumVariant = Omit<Partial<Gobblegum>, "id" | "title" | "variants">

export interface Gobblegum {
	/** The unique identifier of the gobblegum */
	id: string
	/** The title of the gobblegum */
	title: string
	/** The description of the gobblegum */
	description: string
	/** The type of the gobblegum */
	type: "Player-Activated" | "Immediate" | "Time-Based" | "Round-Based"
	/** The rarity of the gobblegum */
	rarity:
		| "Classic"
		| "Mega"
		| "Rare-Mega"
		| "Ultra-Rare Mega"
		| "Rare"
		| "Epic"
		| "Legendary"
		| "Ultra"
	/** The image of the gobblegum */
	image: GobblegumsImagePath
	/** The variants of the gobblegum */
	variants?: Partial<Record<GameKey, GobblegumVariant>>
}

/**
 * Gets a gobblegum by its key.
 * @param key The key of the gobblegum.
 * @param game The game to get the gobblegum variant for.
 */
export const getGobblegumByKey = (key: GobblegumKey, game?: GameKey): Gobblegum => {
	const gobblegum: Gobblegum = gobblegumRegistry[key]

	if (!game || !gobblegum.variants?.[game]) return gobblegum

	const variant = gobblegum.variants?.[game]
	return {
		...gobblegum,
		...variant,
	}
}

/**
 * Gets all gobblegums.
 * @param game The game to get the gobblegum variants for.
 */
export const getGobblegums = (game?: GameKey): Gobblegum[] => {
	return Object.values(gobblegumRegistry).map((gobblegum: Gobblegum) => {
		if (!game || !gobblegum.variants?.[game]) return gobblegum

		const variant = gobblegum.variants?.[game]
		return {
			...gobblegum,
			...variant,
		}
	})
}

const gobblegumRegistry = {
	alchemcialAntithesis: {
		id: "alchemcial-antithesis",
		title: "Alchemcial Antithesis",
		description:
			"Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon. Affects all weapons.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/alchemical-antithesis.webp",
	},
	anywhereButHere: {
		id: "anywhere-but-here",
		title: "Anywhere But Here",
		description:
			"Instantly teleport to a random location. A concussive blast knocks away any nearby zombies, keeping the player safe.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/anywhere-but-here.webp",
		variants: {
			blackOps6: {
				description:
					"Instantly teleport to a random location. A concussive blast knocks away nearby zombies.",
				type: "Player-Activated",
				rarity: "Rare",
				image: "/gobblegums/anywhere-but-here-bo6.webp",
			},
		},
	},
	inPlainSight: {
		id: "in-plain-sight",
		title: "In Plain Sight",
		description: "All Zombies ignore the player. Lasts 10 seconds.",
		type: "Player-Activated",
		rarity: "Classic",
		image: "/gobblegums/in-plain-sight.webp",
	},
	stockOption: {
		id: "stock-option",
		title: "Stock Option",
		description:
			"Ammo is taken from the player's stockpile instead of their weapon's magazine. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/stock-option.webp",
	},
	dangerClosest: {
		id: "danger-closest",
		title: "Danger Closest",
		description: "Zero explosive damage. Lasts 3 full rounds.",
		type: "Round-Based",
		rarity: "Classic",
		image: "/gobblegums/danger-closest.webp",
	},
	perkaholic: {
		id: "perkaholic",
		title: "Perkaholic",
		description: "Gives the player all Perk-a-Colas available on the map.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/perkaholic.webp",
		variants: {
			blackOps6: {
				description: "Gives the player all available perks.",
				type: "Immediate",
				rarity: "Ultra",
				image: "/gobblegums/perkaholic-bo6.webp",
			},
		},
	},
	shoppingFree: {
		id: "shopping-free",
		title: "Shopping Free",
		description: "All purchases are free. Lasts 1 minute.",
		type: "Time-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/shopping-free.webp",
	},
	reignDrops: {
		id: "reign-drops",
		title: "Reign Drops",
		description: "Spawns all nine core Power-Ups at once. 2x Activations.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/reign-drops.webp",
	},
	immolationLiquidation: {
		id: "immolation-liquidation",
		title: "Immolation Liquidation",
		description: "Spawns a Fire Sale Power-Up. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/immolation-liquidation.webp",
	},
	nearDeathExperience: {
		id: "near-death-experience",
		title: "Near Death Experience",
		description:
			"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/near-death-experience.webp",
		variants: {
			blackOps6: {
				description:
					"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Minutes or 5 Revives.",
				type: "Time-Based",
				rarity: "Ultra",
				image: "/gobblegums/near-death-experience-bo6.webp",
			},
		},
	},
	wallPower: {
		id: "wall-power",
		title: "Wall Power",
		description: "The next wall weapon purchased becomes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		image: "/gobblegums/wall-power.webp",
		variants: {
			blackOps6: {
				description: "The next wall weapon purchased becomes Pack-a-Punched.",
				type: "Immediate",
				rarity: "Legendary",
				image: "/gobblegums/wall-power-bo6.webp",
			},
		},
	},
	roundRobbin: {
		id: "round-robbin",
		title: "Round Robbin'",
		description: "Ends the current round. All players gain 1600 points.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/round-robbin.webp",
	},
	swordFlay: {
		id: "sword-flay",
		title: "Sword Flay",
		description:
			"Melee attacks and any melee weapon will inflict 5x more damage on Zombies. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/sword-flay.webp",
	},
	powerVacuum: {
		id: "power-vacuum",
		title: "Power Vacuum",
		description:
			"Power-Ups spawn more often. The drop chance is greatly increased, the normal cap of only 4 drops per round is ignored. Lasts 4 rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/power-vacuum.webp",
	},
	idleEyes: {
		id: "idle-eyes",
		title: "Idle Eyes",
		description: "All zombies ignore all players and stand idle. Lasts 30 seconds. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/idle-eyes.webp",
		variants: {
			blackOps6: {
				description: "All zombies ignore all players and stand idle. Lasts 30 seconds",
				type: "Time-Based",
				rarity: "Legendary",
				image: "/gobblegums/idle-eyes-bo6.webp",
			},
		},
	},
	fearInHeadlights: {
		id: "fear-in-headlights",
		title: "Fear in Headlights",
		description: "Zombies seen by the player will not move. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Rare-Mega",
		image: "/gobblegums/fear-in-headlights.webp",
	},
	ephemeralEnhancement: {
		id: "ephemeral-enhancement",
		title: "Ephemeral Enhancement",
		description:
			"Turns the weapon in the player's hands into the Pack-A-Punched version. Lasts 60 seconds. 2x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		image: "/gobblegums/ephemeral-enhancement.webp",
	},
	cratePower: {
		id: "crate-power",
		title: "Crate Power",
		description: "The next gun taken from the Mystery Box comes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		image: "/gobblegums/crate-power.webp",
		variants: {
			blackOps6: {},
		},
	},
	arsenalAccelerator: {
		id: "arsenal-accelerator",
		title: "Arsenal Accelerator",
		description: "Charge the player's special weapon faster. Lasts 10 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/arsenal-accelerator.webp",
		variants: {
			blackOps6: {
				description: "Charge the player's Field Upgrade faster. Lasts 5 minutes.",
				type: "Time-Based",
				rarity: "Rare",
				image: "/gobblegums/arsenal-accelerator-bo6.webp",
			},
		},
	},
	selfMedication: {
		id: "self-medication",
		title: "Self Medication",
		description: "Self-revive by killing a zombie while downed. Keep all perks. 3x Activations.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		image: "/gobblegums/self-medication.webp",
	},
	undeadManWalking: {
		id: "undead-man-walking",
		title: "Undead Man Walking",
		description: "Slow down all zombies to shambling speed. Lasts 4 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		image: "/gobblegums/undead-man-walking.webp",
	},
	wonderbar: {
		id: "wonderbar",
		title: "Wonderbar!",
		description:
			"The next weapon from the Mystery Box will be a Wonder Weapon. Activates on Mystery Box Spin.",
		type: "Immediate",
		rarity: "Ultra",
		image: "/gobblegums/wonderbar.webp",
	},
	shieldsUp: {
		id: "shields-up",
		title: "Shields Up",
		description: "Refill armor on use. Armor is twice as strong. Lasts 3 Minutes.",
		type: "Time-Based",
		rarity: "Rare",
		image: "/gobblegums/shields-up.webp",
	},
	killJoy: {
		id: "kill-joy",
		title: "Kill Joy",
		description: "Spawns an Insta-Kill Power-Up.",
		type: "Player-Activated",
		rarity: "Rare",
		image: "/gobblegums/kill-joy.webp",
	},
	profitSharing: {
		id: "profit-sharing",
		title: "Profit Sharing",
		description:
			"A portion of the essence you earn is also received by nearby players and vice versa. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Epic",
		image: "/gobblegums/profit-sharing.webp",
	},
	extraCredit: {
		id: "extra-credit",
		title: "Extra Credit",
		description: "Spawns a Bonus Points Power-Up worth 1,250 Points. 4x Activations.",
		type: "Player-Activated",
		rarity: "Rare-Mega",
		image: "/gobblegums/extra-credit.webp",
	},
	hiddenPower: {
		id: "hidden-power",
		title: "Hidden Power",
		description: "Upgrade your currently held weapon to Legendary rarity.",
		type: "Immediate",
		rarity: "Ultra",
		image: "/gobblegums/hidden-power.webp",
	},
	powerKeg: {
		id: "power-keg",
		title: "Power Keg",
		description: "Spawns a Full Power power-up.",
		type: "Player-Activated",
		rarity: "Rare",
		image: "/gobblegums/power-keg.webp",
	},
	freeFire: {
		id: "free-fire",
		title: "Free Fire",
		description:
			"Firing weapons consumes no ammo. Does not work on wonder weapons. Lasts 60 Seconds.",
		type: "Time-Based",
		rarity: "Epic",
		image: "/gobblegums/free-fire.webp",
	},
} as const satisfies Record<string, Gobblegum>
