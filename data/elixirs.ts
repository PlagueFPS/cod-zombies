export interface Elixir {
	/** The unique identifier of the elixir */
	id: string
	/** The title of the elixir */
	title: string
	/** The description of the elixir */
	description: string
	/** The rarity of the elixir */
	rarity: "Classic" | "Common" | "Rare" | "Legendary" | "Epic"
	/** The image of the elixir */
	image: string
}

/** Union of all Elixir rarities */
export type ElixirRarity = Elixir["rarity"]
/** Union of all Elixir keys */
export type ElixirKey = keyof typeof elixirRegistry

/**
 * Gets an Elixir by its key.
 * @param key The key of the Elixir.
 */
export const getElixirByKey = (key: ElixirKey): Elixir => elixirRegistry[key]

/**
 * Gets all Elixirs.
 */
export const getElixirs = (): Elixir[] => Object.values(elixirRegistry)

const elixirRegistry = {
	anywhereButHere: {
		id: "anywhere-but-here-elixir",
		title: "Anywhere But Here!",
		description:
			"Instant Activation - Instantly teleport to a random location. A concussive blast knocks away any nearby zombies keeping you safe.",
		rarity: "Classic",
		image: "/elixirs/anywhere-but-here-elixir.webp",
	},
	equipMint: {
		id: "equip-mint-elixir",
		title: "Equip Mint",
		description: "Instant Activation - Refreshes cooldown on equipment.",
		rarity: "Classic",
		image: "/elixirs/equip-mint-elixir.webp",
	},
	temporalGift: {
		id: "temporal-gift-elixir",
		title: "Temporal Gift",
		description: "Instant Activation (Lasts 5 minutes) - Power-ups last longer.",
		rarity: "Classic",
		image: "/elixirs/temporal-gift-elixir.webp",
	},
	aftertaste: {
		id: "aftertaste-elixir",
		title: "Aftertaste",
		description:
			"Instant Activation (Lasts 5 minutes or 1 down) - Keep all perks when being revived.",
		rarity: "Classic",
		image: "/elixirs/aftertaste-elixir.webp",
	},
	arsenalAccelerator: {
		id: "arsenal-accelerator-elixir",
		title: "Arsenal Accelerator",
		description: "Instant Activation (Lasts 2 minutes) - Charge your special weapon faster.",
		rarity: "Classic",
		image: "/elixirs/arsenal-accelerator-elixir.webp",
	},
	stockOption: {
		id: "stock-option-elixir",
		title: "Stock Option",
		description:
			"Instant Activation (Lasts 2 minutes) - Ammo is taken from your stockpile instead of your weapon's magazine.",
		rarity: "Classic",
		image: "/elixirs/stock-option-elixir.webp",
	},
	ctrlZ: {
		id: "ctrl-z-elixir",
		title: "Ctrl-Z",
		description:
			"Instant Activation (Lasts 30 seconds) - Turns zombies near you into allies. (Max 2)",
		rarity: "Common",
		image: "/elixirs/ctrl-z-elixir.webp",
	},
	deadOfNuclearWinter: {
		id: "dead-of-nuclear-winter-elixir",
		title: "Dead of Nuclear Winter",
		description: "Instant Activation - Spawns a Nuke power-up.",
		rarity: "Common",
		image: "/elixirs/dead-of-nuclear-winter-elixir.webp",
	},
	inPlainSight: {
		id: "in-plain-sight-elixir",
		title: "In Plain Sight",
		description: "Instant Activation (Lasts 10 seconds) - You are ignored by zombies.",
		rarity: "Common",
		image: "/elixirs/in-plain-sight-elixir.webp",
	},
	licensedContractor: {
		id: "licensed-contractor-elixir",
		title: "Licensed Contractor",
		description: "Instant Activation - Spawns a Carpenter power-up.",
		rarity: "Common",
		image: "/elixirs/licensed-contractor-elixir.webp",
	},
	alchemicalAntithesis: {
		id: "alchemical-antithesis-elixir",
		title: "Alchemical Antithesis",
		description:
			"Instant Activation (Lasts 1 minute) - Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon.",
		rarity: "Rare",
		image: "/elixirs/alchemical-antithesis-elixir.webp",
	},
	bloodDebt: {
		id: "blood-debt-elixir",
		title: "Blood Debt",
		description:
			"Instant Activation (Lasts 1 minute) - Instead of losing health, you lose points. Amount lost increases each time you are hit until max amount is hit. If you have 0 points, Blood Debt ends.",
		rarity: "Rare",
		image: "/elixirs/blood-debt-elixir.webp",
	},
	immolationLiquidation: {
		id: "immolation-liquidation-elixir",
		title: "Immolation Liquidation",
		description: "Instant Activation - Spawns a Fire Sale power-up.",
		rarity: "Rare",
		image: "/elixirs/immolation-liquidation-elixir.webp",
	},
	shieldsUp: {
		id: "shields-up-elixir",
		title: "Shields Up",
		description: "Instant Activation - Gives a new shield.",
		rarity: "Rare",
		image: "/elixirs/shields-up-elixir.webp",
	},
	talkinBoutRegeneration: {
		id: "talkin-bout-regeneration-elixir",
		title: "Talkin' Bout Regeneration",
		description:
			"Instant Activation (Lasts 4 minutes) - Your health constantly regenerates while moving.",
		rarity: "Rare",
		image: "/elixirs/talkin-bout-regeneration-elixir.webp",
	},
	cacheBack: {
		id: "cache-back-elixir",
		title: "Cache Back",
		description: "Instant Activation - Spawns a Max Ammo power up.",
		rarity: "Legendary",
		image: "/elixirs/cache-back-elixir.webp",
	},
	freeFire: {
		id: "free-fire-elixir",
		title: "Free Fire",
		description: "Instant Activation (Lasts 30 seconds) - Fire weapons without using up bullets.",
		rarity: "Legendary",
		image: "/elixirs/free-fire-elixir.webp",
	},
	powerKeg: {
		id: "power-keg-elixir",
		title: "Power Keg",
		description: "Instant Activation - Spawns a Full Power power-up.",
		rarity: "Legendary",
		image: "/elixirs/power-keg-elixir.webp",
	},
	wallToWallClearance: {
		id: "wall-to-wall-clearance-elixir",
		title: "Wall to Wall Clearance",
		description: "Instant Activation (Lasts 30 seconds) - Wall buy Fire Sale.",
		rarity: "Legendary",
		image: "/elixirs/wall-to-wall-clearance-elixir.webp",
	},
	undeadManWalking: {
		id: "undead-man-walking-elixir",
		title: "Undead Man Walking",
		description: "Instant Activation (Lasts 1 minute) - Slows down all zombies to shambling speed.",
		rarity: "Legendary",
		image: "/elixirs/undead-man-walking-elixir.webp",
	},
	shoppingFree: {
		id: "shopping-free-elixir",
		title: "Shopping Free",
		description: "Activates Immediately (Lasts 1 minute) - All purchases are free.",
		rarity: "Epic",
		image: "/elixirs/shopping-free-elixir.webp",
	},
	reignDrops: {
		id: "reign-drops-elixir",
		title: "Reign Drops",
		description: "Instant Activation - Spawns one of each of the nine core power ups.",
		rarity: "Epic",
		image: "/elixirs/reign-drops-elixir.webp",
	},
	perkaholic: {
		id: "perkaholic-elixir",
		title: "Perkaholic",
		description:
			"Activates Immediately - Receive all Loadout Perks and six random, extra perks that are not in your loadout. Will not stack with itself.",
		rarity: "Epic",
		image: "/elixirs/perkaholic-elixir.webp",
	},
	refreshMint: {
		id: "refresh-mint-elixir",
		title: "Refresh Mint",
		description:
			"Instant Activation - Refreshes cooldowns on Equipment, Special Weapons and Perks for all players.",
		rarity: "Epic",
		image: "/elixirs/refresh-mint-elixir.webp",
	},
} as const satisfies Record<string, Elixir>
