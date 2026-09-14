import type { FateAndFortuneCardsImagePath } from "@/types/generated/image-paths.gen"
import { Data, Option } from "effect"
import { type RegistryKeyInput, registryGet, uniqueMap } from "@/data/registry-helpers"

/** Union of all Fortune card rarities */
export type FateAndFortuneCardRarity = "Common" | "Rare" | "Legendary" | "Epic"

export interface FateAndFortuneCard {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "FateAndFortuneCard"
	/** The unique identifier of the card */
	readonly id: string
	/** The title of the card */
	readonly title: string
	/** The description of the card */
	readonly description: string
	/** Whether the card is a Fate or Fortune card */
	readonly type: "Fate" | "Fortune"
	/** The rarity of the card. Fate cards have no rarity. */
	readonly rarity: Option.Option<FateAndFortuneCardRarity>
	/** The image of the card */
	readonly image: FateAndFortuneCardsImagePath
}

/** Union of all Fate and Fortune card types */
export type FateAndFortuneCardType = FateAndFortuneCard["type"]

/** Union of all Fate and Fortune card keys */
export type FateAndFortuneCardKey = Parameters<(typeof FATE_AND_FORTUNE_CARDS)["get"]>[0]

/**
 * Gets all Fate and Fortune cards.
 */
export const getFateAndFortuneCards = (): FateAndFortuneCard[] => [
	...FATE_AND_FORTUNE_CARDS.values(),
]

/**
 * Gets a Fate and Fortune card by its key.
 * @param key The key of the card.
 */
export const getFateAndFortuneCardByKey = (key: RegistryKeyInput<FateAndFortuneCardKey>) =>
	registryGet(FATE_AND_FORTUNE_CARDS, key)

class FateAndFortuneCardRecord extends Data.TaggedClass("FateAndFortuneCard")<
	Omit<FateAndFortuneCard, "_tag">
> {}

const makeFateAndFortuneCard = <T extends string>(
	identifier: T,
	card: Omit<FateAndFortuneCard, "_tag" | "id">,
): [T, FateAndFortuneCard] => [
	identifier,
	new FateAndFortuneCardRecord({ id: identifier, ...card }),
]

const makeFateCard = <T extends string>(
	identifier: T,
	card: Omit<FateAndFortuneCard, "_tag" | "id" | "type" | "rarity">,
): [T, FateAndFortuneCard] =>
	makeFateAndFortuneCard(identifier, {
		...card,
		type: "Fate",
		rarity: Option.none(),
	})

const makeFortuneCard = <T extends string>(
	identifier: T,
	card: Omit<FateAndFortuneCard, "_tag" | "id" | "type" | "rarity"> & {
		readonly rarity: FateAndFortuneCardRarity
	},
): [T, FateAndFortuneCard] =>
	makeFateAndFortuneCard(identifier, {
		...card,
		type: "Fortune",
		rarity: Option.some(card.rarity),
	})

const FATE_AND_FORTUNE_CARDS = uniqueMap([
	makeFateCard("five-second-muscle", {
		title: "5 Second Muscle",
		description: "Increased damage after reloading for 5 seconds. Duration: 1 wave.",
		image: "/fate-and-fortune-cards/five-second-muscle.webp",
	}),
	makeFateCard("best-for-last", {
		title: "Best for Last",
		description: "The last 4 bullets in your clip have increased damage. Duration: 3 waves.",
		image: "/fate-and-fortune-cards/best-for-last.webp",
	}),
	makeFateCard("nade-party", {
		title: "Nade Party",
		description: "Your grenade slot will regenerate over time. Duration: 3 waves.",
		image: "/fate-and-fortune-cards/nade-party.webp",
	}),
	makeFateCard("scoped-dollars", {
		title: "Scoped Dollars",
		description: "$300 bonus for each kill with a sniper. Duration: 10 bonuses rewarded on kill.",
		image: "/fate-and-fortune-cards/scoped-dollars.webp",
	}),
	makeFortuneCard("perk-insured", {
		title: "Perk Insured",
		description: "Keep your perks when you are revived before bleeding out. Duration: 1 revive.",
		rarity: "Common",
		image: "/fate-and-fortune-cards/perk-insured.webp",
	}),
	makeFortuneCard("raining-bullets", {
		title: "Raining Bullets",
		description: "Spawn an Infinite Ammo power up nearby. Duration: Until used.",
		rarity: "Common",
		image: "/fate-and-fortune-cards/raining-bullets.webp",
	}),
	makeFortuneCard("explosive-touch", {
		title: "Explosive Touch",
		description: "Zombies in direct contact with the player explode. Duration: 60 seconds.",
		rarity: "Legendary",
		image: "/fate-and-fortune-cards/explosive-touch.webp",
	}),
	makeFortuneCard("all-the-ammos", {
		title: "All the Ammos",
		description: "Spawn a Max Ammo power up nearby. Duration: Until used.",
		rarity: "Epic",
		image: "/fate-and-fortune-cards/all-the-ammos.webp",
	}),
])
