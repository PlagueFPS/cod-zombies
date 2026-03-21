import type { ElixirsImagePath } from "@/types/generated/image-paths.gen"

import { HashMap } from "effect"

export interface Elixir {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Elixir"
	/** The unique identifier of the elixir */
	readonly id: string
	/** The title of the elixir */
	readonly title: string
	/** The description of the elixir */
	readonly description: string
	/** The rarity of the elixir */
	readonly rarity: "Classic" | "Common" | "Rare" | "Legendary" | "Epic"
	/** The image of the elixir */
	readonly image: ElixirsImagePath
}

/** Union of all Elixir rarities */
export type ElixirRarity = Elixir["rarity"]
/** Union of all Elixir keys */
export type ElixirKey = HashMap.HashMap.Key<typeof elixirHashMap>

/**
 * Gets an Elixir by its key.
 * @param key The key of the Elixir.
 */
export const getElixirByKey = (key: ElixirKey) => HashMap.get(elixirHashMap, key)

const makeElixir = <T extends string>(
	identifier: T,
	elixir: Omit<Elixir, "_tag" | "id">,
): [T, Elixir] => [
	identifier,
	{
		_tag: "Elixir" as const,
		id: identifier,
		...elixir,
	},
]

const elixirHashMap = HashMap.make(
	makeElixir("anywhere-but-here", {
		title: "Anywhere But Here!",
		description:
			"Instant Activation - Instantly teleport to a random location. A concussive blast knocks away any nearby zombies keeping you safe.",
		rarity: "Classic",
		image: "/elixirs/anywhere-but-here-elixir.webp",
	}),
	makeElixir("equip-mint", {
		title: "Equip Mint",
		description: "Instant Activation - Refreshes cooldown on equipment.",
		rarity: "Classic",
		image: "/elixirs/equip-mint-elixir.webp",
	}),
	makeElixir("temporal-gift", {
		title: "Temporal Gift",
		description: "Instant Activation (Lasts 5 minutes) - Power-ups last longer.",
		rarity: "Classic",
		image: "/elixirs/temporal-gift-elixir.webp",
	}),
	makeElixir("aftertaste", {
		title: "Aftertaste",
		description:
			"Instant Activation (Lasts 5 minutes or 1 down) - Keep all perks when being revived.",
		rarity: "Classic",
		image: "/elixirs/aftertaste-elixir.webp",
	}),
	makeElixir("arsenal-accelerator", {
		title: "Arsenal Accelerator",
		description: "Instant Activation (Lasts 2 minutes) - Charge your special weapon faster.",
		rarity: "Classic",
		image: "/elixirs/arsenal-accelerator-elixir.webp",
	}),
	makeElixir("stock-option", {
		title: "Stock Option",
		description:
			"Instant Activation (Lasts 2 minutes) - Ammo is taken from your stockpile instead of your weapon's magazine.",
		rarity: "Classic",
		image: "/elixirs/stock-option-elixir.webp",
	}),
	makeElixir("ctrl-z", {
		title: "Ctrl-Z",
		description:
			"Instant Activation (Lasts 30 seconds) - Turns zombies near you into allies. (Max 2)",
		rarity: "Common",
		image: "/elixirs/ctrl-z-elixir.webp",
	}),
	makeElixir("dead-of-nuclear-winter", {
		title: "Dead of Nuclear Winter",
		description: "Instant Activation - Spawns a Nuke power-up.",
		rarity: "Common",
		image: "/elixirs/dead-of-nuclear-winter-elixir.webp",
	}),
	makeElixir("in-plain-sight", {
		title: "In Plain Sight",
		description: "Instant Activation (Lasts 10 seconds) - You are ignored by zombies.",
		rarity: "Common",
		image: "/elixirs/in-plain-sight-elixir.webp",
	}),
	makeElixir("licensed-contractor", {
		title: "Licensed Contractor",
		description: "Instant Activation - Spawns a Carpenter power-up.",
		rarity: "Common",
		image: "/elixirs/licensed-contractor-elixir.webp",
	}),
	makeElixir("alchemical-antithesis", {
		title: "Alchemical Antithesis",
		description:
			"Instant Activation (Lasts 1 minute) - Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon.",
		rarity: "Rare",
		image: "/elixirs/alchemical-antithesis-elixir.webp",
	}),
	makeElixir("blood-debt", {
		title: "Blood Debt",
		description:
			"Instant Activation (Lasts 1 minute) - Instead of losing health, you lose points. Amount lost increases each time you are hit until max amount is hit. If you have 0 points, Blood Debt ends.",
		rarity: "Rare",
		image: "/elixirs/blood-debt-elixir.webp",
	}),
	makeElixir("immolation-liquidation", {
		title: "Immolation Liquidation",
		description: "Instant Activation - Spawns a Fire Sale power-up.",
		rarity: "Rare",
		image: "/elixirs/immolation-liquidation-elixir.webp",
	}),
	makeElixir("shields-up", {
		title: "Shields Up",
		description: "Instant Activation - Gives a new shield.",
		rarity: "Rare",
		image: "/elixirs/shields-up-elixir.webp",
	}),
	makeElixir("talkin-bout-regeneration", {
		title: "Talkin' Bout Regeneration",
		description:
			"Instant Activation (Lasts 4 minutes) - Your health constantly regenerates while moving.",
		rarity: "Rare",
		image: "/elixirs/talkin-bout-regeneration-elixir.webp",
	}),
	makeElixir("cache-back", {
		title: "Cache Back",
		description: "Instant Activation - Spawns a Max Ammo power up.",
		rarity: "Legendary",
		image: "/elixirs/cache-back-elixir.webp",
	}),
	makeElixir("free-fire", {
		title: "Free Fire",
		description: "Instant Activation (Lasts 30 seconds) - Fire weapons without using up bullets.",
		rarity: "Legendary",
		image: "/elixirs/free-fire-elixir.webp",
	}),
	makeElixir("power-keg", {
		title: "Power Keg",
		description: "Instant Activation - Spawns a Full Power power-up.",
		rarity: "Legendary",
		image: "/elixirs/power-keg-elixir.webp",
	}),
	makeElixir("wall-to-wall-clearance", {
		title: "Wall to Wall Clearance",
		description: "Instant Activation (Lasts 30 seconds) - Wall buy Fire Sale.",
		rarity: "Legendary",
		image: "/elixirs/wall-to-wall-clearance-elixir.webp",
	}),
	makeElixir("undead-man-walking", {
		title: "Undead Man Walking",
		description: "Instant Activation (Lasts 1 minute) - Slows down all zombies to shambling speed.",
		rarity: "Legendary",
		image: "/elixirs/undead-man-walking-elixir.webp",
	}),
	makeElixir("shopping-free", {
		title: "Shopping Free",
		description: "Activates Immediately (Lasts 1 minute) - All purchases are free.",
		rarity: "Epic",
		image: "/elixirs/shopping-free-elixir.webp",
	}),
	makeElixir("reign-drops", {
		title: "Reign Drops",
		description: "Instant Activation - Spawns one of each of the nine core power ups.",
		rarity: "Epic",
		image: "/elixirs/reign-drops-elixir.webp",
	}),
	makeElixir("perkaholic", {
		title: "Perkaholic",
		description:
			"Activates Immediately - Receive all Loadout Perks and six random, extra perks that are not in your loadout. Will not stack with itself.",
		rarity: "Epic",
		image: "/elixirs/perkaholic-elixir.webp",
	}),
	makeElixir("refresh-mint", {
		title: "Refresh Mint",
		description:
			"Instant Activation - Refreshes cooldowns on Equipment, Special Weapons and Perks for all players.",
		rarity: "Epic",
		image: "/elixirs/refresh-mint-elixir.webp",
	}),
)
