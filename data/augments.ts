import type { GameKey } from "./games"
import type { AugmentsImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"
import { mapWithGameVariant, resolveGameVariantOption } from "@/data/registry-helpers"

type AugmentVariant = Omit<Partial<Augment>, "id" | "variants">

export interface Augment {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Augment"
	/** The unique identifier of the augment */
	readonly id: string
	/** The title of the augment */
	readonly title: string
	/** The type of the augment */
	readonly type: "Major" | "Minor"
	/** The description of the augment */
	readonly description: string
	/** The image of the augment */
	readonly image: AugmentsImagePath
	/** The game variants of the augment */
	readonly variants: Option.Option<Partial<Record<GameKey, AugmentVariant>>>
}

/**Union of all keys in the Augment Registry */
export type AugmentKey = HashMap.HashMap.Key<typeof augmentHashMap>
/**Tuple to enforce min/max allowed augments */
export type AugmentTuple = [
	AugmentKey,
	AugmentKey,
	AugmentKey,
	AugmentKey,
	AugmentKey,
	AugmentKey,
	AugmentKey?,
	AugmentKey?,
]
/**Union of all Augment types */
export type AugmentType = Augment["type"]

/** Gets an augment by its key.
 * @param key The key of the augment.
 * @param game The game to get the augment variant for.
 */
export const getAugmentByKey = (key: AugmentKey, game?: GameKey): Option.Option<Augment> =>
	resolveGameVariantOption(HashMap.get(augmentHashMap, key), game)

/** Gets all augments.
 * @param game The game to get the augment variants for.
 */
export const getAugments = (game?: GameKey): Augment[] =>
	mapWithGameVariant(HashMap.toValues(augmentHashMap), game)

/** Type helper to ensure type-safe AugmentTuple creation */
export const makeAugmentTuple = (t: AugmentTuple) => Option.some(t)

const makeAugment = <T extends string>(
	identifier: T,
	augment: Omit<Augment, "_tag" | "id">,
): [T, Augment] => [
	identifier,
	{
		_tag: "Augment",
		id: identifier,
		...augment,
	},
]

const augmentHashMap = HashMap.make(
	makeAugment("double-jeopardy", {
		title: "Double Jeopardy",
		description: "Normal Zombies at low health have a chance to die immediately when shot.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dead-first-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("double-standard", {
		title: "Double Standard",
		description: "All non-critical shots do double damage. Only applies to normal bullet weapons.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/thermite-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("double-impact", {
		title: "Double Impact",
		description: "Double hits on the same target in quick succession deal more damage.",
		type: "Major",
		image: "/augments/double-impact-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-impact-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("double-time", {
		title: "Double Time",
		description: "Increases fire rate bonus.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-time-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("double-or-nothing", {
		title: "Double or Nothing",
		description:
			"Weapons have a chance to do double damage, but also have a chance to do 0 damage.",
		type: "Minor",
		image: "/augments/double-or-nothing-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-or-nothing-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("double-play", {
		title: "Double Play",
		description:
			"Killing 2 enemies in quick succession will have a chance to return 2 rounds to your magazine. Only applies to normal bullet weapons.",
		type: "Minor",
		image: "/augments/hidden-impact-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mugging-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("treasure-hunter", {
		title: "Treasure Hunter",
		description:
			"Spot items others can miss from loot containers as well as special and elite kills.",
		type: "Major",
		image: "/augments/supercharged-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/parting-gift-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("death-stare", {
		title: "Death Stare",
		description:
			"Your Elemental Weakness damage has a chance to kill an enemy that is low on health.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("critical-eye", {
		title: "Critical Eye",
		description: "Small chance that a body shot becomes a critical shot.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-jeopardy-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("birds-eye-view", {
		title: "Bird's Eye View",
		description: "The minimap’s scan rate is increased.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-time-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extra-change", {
		title: "Extra Change",
		description: "Find extra essence under more locations.",
		type: "Minor",
		image: "/augments/incendiary-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/incendiary-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("further-insight", {
		title: "Further Insight",
		description: "Increase perception radius.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("gravity-md", {
		title: "Gravity MD",
		description: "Just falling from heights creates explosions.",
		type: "Major",
		image: "/augments/gravity-md-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-distraction-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dr-ram", {
		title: "Dr Ram",
		description: "Tactical Sprint knocks down and damages base zombies.",
		type: "Major",
		image: "/augments/dr-ram-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dr-ram-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("phd-slider", {
		title: "PhD Slider",
		description: "Sliding into enemies triggers explosions.",
		type: "Major",
		image: "/augments/phd-slider-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/phd-slider-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("environmentalist", {
		title: "Environmentalist",
		description: "Become immune to environmental damage while sliding.",
		type: "Minor",
		image: "/augments/environmentalist-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/environmentalist-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("eod-technician", {
		title: "EOD Technician",
		description: "Slightly reduce height and distance requirements for explosions.",
		type: "Minor",
		image: "/augments/eod-technician-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/eod-technician-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("tribologist", {
		title: "Tribologist",
		description: "Sliding distance and speed are increased.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/tribologist-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("fetid-upgraid", {
		title: "Fetid Upgr-aid",
		description:
			"On death, zombies have a chance to create a gas cloud that charges your Field Upgrade.",
		type: "Major",
		image: "/augments/frenzy-fire-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/fetid-upgraid-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("smell-of-death", {
		title: "Smell of Death",
		description:
			"On death, zombies have a chance to create a gas cloud that conceals you while standing in it.",
		type: "Major",
		image: "/augments/citrus-focus-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/citrus-focus-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("parting-gift", {
		title: "Parting Gift",
		description: "Vulture Aid ammo drops give more ammo to Wonder Weapons.",
		type: "Major",
		image: "/augments/supercharged-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/parting-gift-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("condors-reach", {
		title: "Condor's Reach",
		description: "Auto-pickup loot from farther away.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("carrion-luggage", {
		title: "Carrion Luggage",
		description: "Critical kills have a chance to drop extra salvage.",
		type: "Minor",
		image: "/augments/eod-technician-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/barista-brawl-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("picky-eater", {
		title: "Picky Eater",
		description: "On death, zombies have a higher chance of dropping your current equipment.",
		type: "Minor",
		image: "/augments/picky-eater-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("expresso", {
		title: "Expresso",
		description: "All melee attacks are slightly faster.",
		type: "Major",
		image: "/augments/classic-formula-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/expresso-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("vampiric-extraction", {
		title: "Vampiric Extraction",
		description: "Melee attacks heal a small amount of your health.",
		type: "Major",
		image: "/augments/vampiric-extraction-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/vampiric-extraction-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("triple-shot", {
		title: "Triple Shot",
		description: "Your punch can hit multiple enemies at once.",
		type: "Major",
		image: "/augments/triple-shot-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/petroleum-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("stick-n-move", {
		title: "Stick 'n Move",
		description: "Backpedal speed is increased after a successful melee attack.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/tribologist-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("strength-training", {
		title: "Strength Training",
		description: "Your punch can one hit kill normal enemies for more rounds.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("hidden-impact", {
		title: "Hidden Impact",
		description: "Melee kills reload a portion of your held weapon.",
		type: "Minor",
		image: "/augments/hidden-impact-minor-augment.webp",
		variants: Option.none(),
	}),
	makeAugment("probiotic", {
		title: "Probiotic",
		description: "Slightly increase maximum health with Jugger-Nog.",
		type: "Major",
		image: "/augments/probiotic-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/probiotic-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("turtle-shell", {
		title: "Turtle Shell",
		description:
			"Armor acts as a shield on your back, completely absorbing damage to your back. No damage mitigation when hit from the front.",
		type: "Major",
		image: "/augments/turtle-shell-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				description:
					"Armor acts as a shield on your back, completely absorbing damage to your back. Normal damage mitigation when hit from the front.",
				image: "/augments/bo7/turtle-shell-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("reactive-armor", {
		title: "Reactive Armor",
		description: "When an armor plate breaks, nearby normal enemies are stunned for a short time.",
		type: "Major",
		image: "/augments/reactive-armor-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/reactive-armor-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("retaliation", {
		title: "Retaliation",
		description: "Deal bonus damage when health is low.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("hardened-plates", {
		title: "Hardened Plates",
		description: "Armor plates have more damage mitigation.",
		type: "Minor",
		image: "/augments/hardened-plates-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/hardened-plates-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("durable-plates", {
		title: "Durable Plates",
		description: "Slightly increase armor durability.",
		type: "Minor",
		image: "/augments/durable-plates-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/durable-plates-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("emt", {
		title: "EMT",
		description: "Reviving an ally allows them to keep all of the Perks on their bleed-out bar.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("equivalent-exchange", {
		title: "Equivalent Exchange",
		description:
			"If you have Quick Revive while downed, killing an enemy will revive you and remove Quick Revive. This can be done up to 3 times.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/equivalent-exchange-major-augment-bo7.webp",
				description:
					"If you have Quick Revive while downed, killing an enemy will revive you. This can be done up to 3 times.",
			},
		}),
	}),
	makeAugment("dying-wish", {
		title: "Dying Wish",
		description:
			"On lethal damage, become immune to all damage for 2 seconds and keep 1 health. Quick Revive is removed on use. This can be done up to 3 times.",
		type: "Major",
		image: "/augments/dying-wish-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-salvation-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("swift-recovery", {
		title: "Swift Recovery",
		description: "Reviving an ally increases both of your movement speeds for a short time.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/tribologist-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("karmic-return", {
		title: "Karmic Return",
		description: "Reviving an ally heals you to full health.",
		type: "Minor",
		image: "/augments/karmic-return-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/karmic-return-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("slow-death", {
		title: "Slow Death",
		description: "Increase your time in last stand.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("antibiotic", {
		title: "Antibiotic",
		description:
			"The healing glyph now damages enemies that touch it, but its lifetime is reduced.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/thermite-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-light-mend", {
		title: "Big Game",
		description: "Light Mend can activate on elite enemies, dropping 3 more healing glyphs.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dual-action", {
		title: "Dual Action",
		description: "Consuming a healing glyph will temporarily allow you to heal faster.",
		type: "Major",
		image: "/augments/resilience-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-benevolence-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("longer-life", {
		title: "Longer Life",
		description: "The healing glyph's lifetime is increased.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extra-strength", {
		title: "Extra Strength",
		description: "The healing glyph replenishes more health when consumed.",
		type: "Minor",
		image: "/augments/extra-strength-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/durable-plates-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("express-remedy", {
		title: "Express Remedy",
		description: "Increase the range that the glyph will move to an ally.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("chain-lightning", {
		title: "Chain Lightning",
		description: "The stunned enemy can spread the stun to others.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/group-shroud-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-dead-wire", {
		title: "Big Game",
		description: "Dead Wire can stun elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("lightning-strike", {
		title: "Lightning Strike",
		description:
			"A bolt of lightning strikes from above, stunning all normal and special enemies in the area.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/reactive-armor-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("high-voltage", {
		title: "High Voltage",
		description: "Dead Wire deals slightly more damage.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("haste-dead-wire", {
		title: "Haste",
		description: "Dead Wire cooldown is slightly reduced.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/haste-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-dead-wire", {
		title: "Extension",
		description: "The stun and electric field last longer.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("plague", {
		title: "Plague",
		description: "The charmed enemy has a chance to turn other enemies.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/group-shroud-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("pheromone", {
		title: "Pheromone",
		description: "The charmed enemy distracts nearby normal and special enemies for a short time.",
		type: "Major",
		image: "/augments/pheromone-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/afterimage-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-brain-rot", {
		title: "Big Game",
		description: "Brain Rot can charm elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-brain-rot", {
		title: "Extension",
		description: "Brain Rot duration is slightly increased.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("haste-brain-rot", {
		title: "Haste",
		description: "Brain Rot cooldown is slightly reduced.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/haste-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("explosive", {
		title: "Explosive",
		description:
			"Charmed enemies explode at the end of Brain Rot's duration, dealing toxic damage.",
		type: "Minor",
		image: "/augments/explosive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/stuntman-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-cryo-freeze", {
		title: "Big Game",
		description: "Cryo Freeze can slow elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("ice-cloud", {
		title: "Ice Cloud",
		description: "Enemies that are killed while frozen may leave a cloud that slows enemies.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/reactive-armor-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("frozen-stiff", {
		title: "Frozen Stiff",
		description: "Enemies are frozen in place.",
		type: "Major",
		image: "/augments/classic-formula-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/expresso-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-cryo-freeze", {
		title: "Extension",
		description: "Slightly increase the slow duration.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("freezer-burn", {
		title: "Freezer Burn",
		description: "Slightly increase damage to frozen enemies.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("liquid-nitrogen", {
		title: "Liquid Nitrogen",
		description: "Significantly increase your chance for Cryo Freeze to activate.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/haste-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-napalm-burst", {
		title: "Big Game",
		description: "Napalm Burst can burn elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("thermite", {
		title: "Thermite",
		description: "Increase burn effect damage.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/thermite-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("firebomb", {
		title: "Firebomb",
		description: "Burned enemies explode on death, spreading the fire to nearby enemies.",
		type: "Major",
		image: "/augments/firebomb-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/firebomb-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-napalm-burst", {
		title: "Extension",
		description: "Increase the burn duration.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("incendiary", {
		title: "Incendiary",
		description: "Each damage tick has a small chance to spread to a nearby enemy.",
		type: "Minor",
		image: "/augments/incendiary-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/incendiary-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("contact-burn", {
		title: "Contact Burn",
		description: "Initial burn effect deals more damage.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("big-game-shadow-rift", {
		title: "Big Game",
		description: "Shadow Rift can activate on elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("topple-danger", {
		title: "Topple Danger",
		description:
			"Warp 1 enemy that deals shadow damage to others nearby. Normal enemies are knocked down while special enemies are stunned.",
		type: "Major",
		image: "/augments/triple-shot-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/petroleum-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("explosive-rain", {
		title: "Explosive Rain",
		description: "Enemies that are dropped from portals will explode on contact with the ground.",
		type: "Major",
		image: "/augments/gravity-md-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-distraction-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("haste-shadow-rift", {
		title: "Haste",
		description: "Shadow Rift cooldown is reduced.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/haste-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("targeted", {
		title: "Targeted",
		description: "Dropped enemies will fall on other enemies.",
		type: "Minor",
		image: "/augments/targeted-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/amped-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("supermassive", {
		title: "Supermassive",
		description: "The singularity’s lethal radius is increased and can kill more enemies.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("group-shroud", {
		title: "Group Shroud",
		description: "Nearby players are also cloaked.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/group-shroud-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("burst-dash", {
		title: "Burst Dash",
		description: "Warp forward a short distance, killing all normal enemies in your path.",
		type: "Major",
		image: "/augments/burst-dash-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/burst-dash-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("void-sheath", {
		title: "Void Sheath",
		description:
			"Swap to your dedicated melee weapon as it's imbued with Dark Aether energy. Kills allow you to stay in Aether Shroud for longer.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("instant-reload", {
		title: "Instant Reload",
		description: "Activation instantly reloads your currently held weapon.",
		type: "Minor",
		image: "/augments/hidden-impact-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mugging-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extra-charge", {
		title: "Extra Charge",
		description: "Increase Max Charges by one.",
		type: "Minor",
		image: "/augments/extra-charge-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extra-charge-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-aether-shroud", {
		title: "Extension",
		description: "Aether Shroud duration is significantly increased.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("phalanx", {
		title: "Phalanx",
		description: "Teammates can also repair armor from kills while near you.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/phalanx-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("retribution", {
		title: "Retribution",
		description:
			"Trigger an explosion on activation. Normal enemies that melee you are damaged and knocked down.",
		type: "Major",
		image: "/augments/retribution-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/turtle-shell-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("frenzy-fire", {
		title: "Frenzy Fire",
		description: "Use ammo from stock.",
		type: "Major",
		image: "/augments/frenzy-fire-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/fetid-upgraid-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("repair-boost", {
		title: "Repair Boost",
		description: "Repair more armor per kill.",
		type: "Minor",
		image: "/augments/repair-boost-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/emergency-medical-kit-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-frenzied-guard", {
		title: "Extension",
		description: "Increase Frenzied Guard duration.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("rally", {
		title: "Rally",
		description: "On activation, repair all nearby allies' armor to full.",
		type: "Minor",
		image: "/augments/rally-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/rally-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("extension-dark-flare", {
		title: "Extension",
		description: "Significantly increase Dark Flare duration.",
		type: "Major",
		image: "/augments/enduring-radiance-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("supernova", {
		title: "Supernova",
		description:
			"The beam is replaced with a sphere that damages nearby enemies as it travels. The ball detonates at the end of Dark Flare's duration.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/reactive-armor-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dark-pact", {
		title: "Dark Pact",
		description: "Beam heals and revives other players on contact.",
		type: "Major",
		image: "/augments/resilience-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-benevolence-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("broad-beam", {
		title: "Broad Beam",
		description: "Significantly increases the size of the beam.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/broad-beam-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("heavy-shadow", {
		title: "Heavy Shadow",
		description: "The beam slows enemies on contact.",
		type: "Minor",
		image: "/augments/heavy-shadow-minor-augment.webp",
		variants: Option.none(),
	}),
	makeAugment("scatter", {
		title: "Scatter",
		description: "The Energy Mine will split into 3 mines that scatter and detonate 1 time each.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/firebomb-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("turret", {
		title: "Turret",
		description:
			"Instead of detonating, Energy Mine becomes a turret that shoots targets on at a time.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("carousel", {
		title: "Carousel",
		description: "3 Energy Mines will float around you, detonating when an enemy is nearby.",
		type: "Major",
		image: "/augments/classic-formula-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/expresso-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("frequency-boost", {
		title: "Frequency Boost",
		description: "Increase detonation count and duration of Energy Mine.",
		type: "Minor",
		image: "/augments/frequency-boost-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("siren", {
		title: "Siren",
		description: "Energy mine now attracts nearby normal enemies for a short time.",
		type: "Minor",
		image: "/augments/siren-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/zombie-sitter-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("transformer", {
		title: "Transformer",
		description: "The field's damage is increased by the number of allies that are connected.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/thermite-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("shockwave", {
		title: "Shockwave",
		description: "On activation, stun and damage all nearby enemies.",
		type: "Major",
		image: "/augments/gravity-md-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/petroleum-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("static-discharge", {
		title: "Static Discharge",
		description: "On activation, create a lethal surge of electricity around you.",
		type: "Major",
		image: "/augments/gravity-md-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mask-of-distraction-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("power-grid", {
		title: "Power Grid",
		description: "Increase the range the electric tether can connect to allies.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("overclocked", {
		title: "Overclocked",
		description: "Your movement speed is increased during Tesla Storm.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-time-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("lithium-charged", {
		title: "Lithium Charged",
		description: "Increase Tesla Storm duration.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dance-party", {
		title: "Dance Party",
		description: "Mister Peeks becomes the life of the party.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/group-shroud-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("arcane-fury", {
		title: "Arcane Fury",
		description: "Mister Peeks has become a master of the elements.",
		type: "Major",
		image: "/augments/firebomb-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/firebomb-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("apex-hunter", {
		title: "Apex Hunter",
		description: "Mister Peeks focuses all attacks on the strongest nearby enemy.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/big-game-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("social-butterfly", {
		title: "Social Butterfly",
		description: "Increase Mister Peeks attraction radius.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("peeks-favor", {
		title: "Peeks' Favor",
		description: "Mister Peeks is good to have around near Mystery Box locations.",
		type: "Minor",
		image: "/augments/pineapple-blast-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/pineapple-blast-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("party-animal", {
		title: "Party Animal",
		description: "Increase Mister Peeks dance duration.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/extension-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("citrus-focus", {
		title: "Citrus Focus",
		description: "If a weapon has an Ammo Mod applied, Elemental Pop will only activate that one.",
		type: "Major",
		image: "/augments/citrus-focus-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/citrus-focus-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("imperial-peach", {
		title: "Imperial Peach",
		description: "Enemies that hit you have a chance to trigger a random Ammo Mod.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/turtle-shell-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("electric-cherry", {
		title: "Electric Cherry",
		description:
			"Reloading creates an electric damage discharge that damages and stuns nearby normal enemies. The more empty the magazine, the stronger the damage.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/reactive-armor-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("vulnera-bean", {
		title: "Vulnera Bean",
		description: "Slightly increase enemy elemental weakness damage.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("pineapple-blast", {
		title: "Pineapple Blast",
		description: "Equipment can also trigger a random Ammo Mod.",
		type: "Minor",
		image: "/augments/pineapple-blast-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/pineapple-blast-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("chill-berry", {
		title: "Chill Berry",
		description: "Slightly reduce all Ammo Mod cooldowns.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/haste-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-head", {
		title: "Dead Head",
		description: "Further increase critical damage.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/thermite-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-first", {
		title: "Dead First",
		description: "Deal double critical damage if an enemy is at full health.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dead-first-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-again", {
		title: "Dead Again",
		description: "Critical hits have a chance of adding a bullet to your magazine.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-jeopardy-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-break", {
		title: "Dead Break",
		description: "Increase damage to armor pieces.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-draw", {
		title: "Dead Draw",
		description: "Reduce hip-fire spread.",
		type: "Minor",
		image: "/augments/dead-draw-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dead-draw-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dead-set", {
		title: "Dead Set",
		description: "Reduce gun movement while doing advanced movement.",
		type: "Minor",
		image: "/augments/dead-set-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dead-set-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("free-faller", {
		title: "Free Faller",
		description: "Become immune to fall damage.",
		type: "Major",
		image: "/augments/free-faller-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/free-faller-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("dasher", {
		title: "Dasher",
		description: "Increase Tactical Sprint duration.",
		type: "Major",
		image: "/augments/dasher-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/dasher-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("stalker", {
		title: "Stalker",
		description: "Walk faster while aiming.",
		type: "Major",
		image: "/augments/stalker-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/mocha-maul-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("hard-target", {
		title: "Hard Target",
		description: "While Tactical Sprinting, projectile damage is reduced.",
		type: "Minor",
		image: "/augments/hard-target-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/hard-target-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("quarterback", {
		title: "Quarterback",
		description: "Use equipment while sprinting.",
		type: "Minor",
		image: "/augments/quarterback-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/quarterback-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("hot-foot", {
		title: "Hot Foot",
		description: "Gain a speed boost after your equipment kills an enemy.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/tribologist-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("supercharged", {
		title: "Supercharged",
		description: "Field Upgrades recharge a bit faster.",
		type: "Major",
		image: "/augments/supercharged-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/parting-gift-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("classic-formula", {
		title: "Classic Formula",
		description: "Reload speed is even faster.",
		type: "Major",
		image: "/augments/classic-formula-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/expresso-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("phantom-reload", {
		title: "Phantom Reload",
		description: "Weapon magazines are slowly refilled over time.",
		type: "Major",
		image: "/augments/phantom-reload-major-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/phantom-reload-major-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("speedy-roulette", {
		title: "Speedy Roulette",
		description: "The Mystery Box settles much faster.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/double-time-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("quick-swap", {
		title: "Quick Swap",
		description: "Swap weapons faster.",
		type: "Minor",
		image: "/augments/quick-swap-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/quick-swap-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("fast-pitcher", {
		title: "Fast Pitcher",
		description: "Deploy equipment faster.",
		type: "Minor",
		image: "/augments/fast-pitcher-minor-augment.webp",
		variants: Option.some({
			"black-ops-7": {
				image: "/augments/bo7/fast-pitcher-minor-augment-bo7.webp",
			},
		}),
	}),
	makeAugment("mask-of-wrath", {
		title: "Mask of Wrath",
		description: "The Demon does more damage.",
		type: "Major",
		image: "/augments/bo7/thermite-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mask-of-salvation", {
		title: "Mask of Salvation",
		description:
			"The Fox can revive you while it’s active. This can be done up to three times per match.",
		type: "Major",
		image: "/augments/bo7/mask-of-salvation-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mask-of-distraction", {
		title: "Mask of Distraction",
		description: "The Monkey attracts enemies and does damage in an area.",
		type: "Major",
		image: "/augments/bo7/mask-of-distraction-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mask-of-benevolence", {
		title: "Mask of Benevolence",
		description: "The Maiden does not attack but will periodically heal you.",
		type: "Major",
		image: "/augments/bo7/mask-of-benevolence-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("extension-wisp-tea", {
		title: "Extension",
		description: "Increase the Wisp’s lifetime.",
		type: "Minor",
		image: "/augments/bo7/extension-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("haste-wisp-tea", {
		title: "Haste",
		description: "Decrease the cooldown before a Wisp can be summoned.",
		type: "Minor",
		image: "/augments/bo7/haste-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("zombie-sitter", {
		title: "Zombie Sitter",
		description:
			"The Wisp will distract and avoid damaging the last zombie in the round until the round times out.",
		type: "Minor",
		image: "/augments/bo7/zombie-sitter-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("fetcher", {
		title: "Fetcher",
		description: "The Wisp will pick up items and Powerups (aside from the Nuke) for you.",
		type: "Minor",
		image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("sixth-sense", {
		title: "Sixth Sense",
		description: "See enemies close behind you and take less damage from behind.",
		type: "Major",
		image: "/augments/bo7/equivalent-exchange-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("guns-up", {
		title: "Guns Up",
		description: "Fire while sprinting.",
		type: "Major",
		image: "/augments/bo7/guns-up-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("ammo-surge", {
		title: "Ammo Surge",
		description: "Gain a burst of speed when initiating a reload.",
		type: "Major",
		image: "/augments/bo7/mocha-maul-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("big-game-fire-works", {
		title: "Big Game",
		description: "Fire Works can activate on Elite Enemies, creating a bigger lightshow.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
		variants: Option.none(),
	}),
	makeAugment("caustic-fumes", {
		title: "Caustic Fumes",
		description: "Charmed enemies deal Toxic damage to nearby enemies.",
		type: "Major",
		image: "/augments/bo7/petroleum-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("petroleum", {
		title: "Petroleum",
		description: "Napalm Burst leaves a pool of fire on the ground.",
		type: "Major",
		image: "/augments/bo7/petroleum-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("gravity-well", {
		title: "Gravity Well",
		description:
			"Shadow Rift becomes a black hole that pulls in enemies, before teleporting away nearby enemy survivors.",
		type: "Major",
		image: "/augments/bo7/afterimage-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("ball-lightning", {
		title: "Ball Lightning",
		description:
			"Activating Dead Wire launches an orb that deals electric damage to nearby enemies as it moves.",
		type: "Major",
		image: "/augments/bo7/firebomb-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("cold-company", {
		title: "Cold Company",
		description: "Cryo Freeze has a chance to activate on more than one enemy at a time.",
		type: "Major",
		image: "/augments/bo7/group-shroud-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("muzzle-blast", {
		title: "Muzzle Blast",
		description: "The beam now deals additional damage in a cone in front of you.",
		type: "Major",
		image: "/augments/bo7/petroleum-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("fists-of-frenzy", {
		title: "Fists of Frenzy",
		description: "While Frenzied, annihilate enemies with your fists.",
		type: "Major",
		image: "/augments/bo7/dr-ram-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("smart-mine", {
		title: "Smart Mine",
		description:
			"Energy Mine has more detonations and waits for multiple enemies to be in range for each detonation.",
		type: "Major",
		image: "/augments/bo7/mask-of-distraction-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("afterimage", {
		title: "Afterimage",
		description: "Distract enemies with a Dark Aether clone of yourself.",
		type: "Major",
		image: "/augments/bo7/afterimage-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("hidden-gems", {
		title: "Hidden Gems",
		description: "Death Perception can now see loot.",
		type: "Minor",
		image: "/augments/bo7/hidden-gems-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("footwork", {
		title: "Footwork",
		description: "Increase non-forward sprinting speed.",
		type: "Minor",
		image: "/augments/bo7/footwork-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("prestidigitation", {
		title: "Prestidigitation",
		description: "Reloading has a chance to not use stock ammo.",
		type: "Minor",
		image: "/augments/bo7/mugging-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("super-serum", {
		title: "Super Serum",
		description: "Increase the damage dealt by charmed enemies.",
		type: "Minor",
		image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("backdraft", {
		title: "Backdraft",
		description: "Increase the activation radius.",
		type: "Minor",
		image: "/augments/bo7/backdraft-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("ammo-theorem", {
		title: "Ammo Theorem",
		description: "Teleporting enemies away adds ammo to your weapon magazine from stock.",
		type: "Minor",
		image: "/augments/bo7/mugging-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("aftershock", {
		title: "Aftershock",
		description: "Enemies that are stunned by Dead Wire have a chance to spread to nearby enemies.",
		type: "Minor",
		image: "/augments/bo7/incendiary-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("thermal-shock", {
		title: "Thermal Shock",
		description: "Enemies are damaged once they’re unfrozen.",
		type: "Minor",
		image: "/augments/bo7/eod-technician-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("dusk-flame", {
		title: "Dusk Flame",
		description: "Enemies that are hit by the beam are dealt additional Shadow damage over time.",
		type: "Minor",
		image: "/augments/bo7/eod-technician-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("dual-layer", {
		title: "Dual Layer",
		description: "While Frenzied Guard is active, armor durability is increased.",
		type: "Minor",
		image: "/augments/bo7/hardened-plates-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("recycle", {
		title: "Recycle",
		description: "A deployed Energy Mine can be recycled for Field Upgrade charge.",
		type: "Minor",
		image: "/augments/bo7/mugging-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("impulse", {
		title: "Impulse",
		description:
			"Deal Shadow damage to enemies on activation and increase your movement speed during Aether Shroud.",
		type: "Minor",
		image: "/augments/bo7/stuntman-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("iron-core", {
		title: "Iron Core",
		description: "Your health is increased when all of your Armor Plates are broken.",
		type: "Major",
		image: "/augments/bo7/mask-of-salvation-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("shake-it-off", {
		title: "Shake It Off",
		description: "Incoming damage will occasionally be significantly reduced.",
		type: "Minor",
		image: "/augments/bo7/shake-it-off-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("double-whammy", {
		title: "Double Whammy",
		description: "Release a second explosion (shortly after the first one).",
		type: "Major",
		image: "/augments/bo7/firebomb-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("stuntman", {
		title: "Stuntman",
		description: "Wall Jumping creates an explosion.",
		type: "Minor",
		image: "/augments/bo7/stuntman-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("rainbow-pop", {
		title: "Rainbow Pop",
		description:
			"Weapons with an Ammo Mod equipped have a chance to deal the elemental damage that an enemy is weak to.",
		type: "Major",
		image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("refresh-mint", {
		title: "Refresh Mint",
		description:
			"Killing a Special or Elite Enemy with its elemental weakness resets your Elemental Pop cooldown.",
		type: "Minor",
		image: "/augments/bo7/refresh-mint-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mocha-maul", {
		title: "Mocha Maul",
		description: "The punch is replaced with your dedicated melee weapon.",
		type: "Major",
		image: "/augments/bo7/mocha-maul-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("barista-brawl", {
		title: "Barista Brawl",
		description: "Gain more Essence from Melee Kills.",
		type: "Minor",
		image: "/augments/bo7/barista-brawl-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("armor-matic", {
		title: "Armor-matic",
		description: "Picking up an Armor Plate automatically applies it to your vest.",
		type: "Major",
		image: "/augments/bo7/mask-of-salvation-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("extra-serving", {
		title: "Extra Serving",
		description: "Special and Elite Enemies you kill have a chance to drop a Large Essence Vial.",
		type: "Minor",
		image: "/augments/bo7/pineapple-blast-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("double-dealer", {
		title: "Double Dealer",
		description: "Every fourth bullet in your weapon magazine deals double damage.",
		type: "Major",
		image: "/augments/bo7/thermite-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("double-down", {
		title: "Double Down",
		description: "Bullet weapons have increased penetration damage through enemies.",
		type: "Minor",
		image: "/augments/bo7/contact-burn-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("adrenaline-rush", {
		title: "Adrenaline Rush",
		description: "Killing a Special or Elite Enemy will start your health regeneration.",
		type: "Major",
		image: "/augments/bo7/mask-of-benevolence-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("emergency-medical-kit", {
		title: "Emergency Medical Kit",
		description: "You can now craft a Self-Revive Kit up to four times.",
		type: "Minor",
		image: "/augments/bo7/emergency-medical-kit-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("dead-point", {
		title: "Dead Point",
		description: "Bullets deal bonus damage to enemies within Point Blank range.",
		type: "Major",
		image: "/augments/bo7/rainbow-pop-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("dead-heat", {
		title: "Dead Heat",
		description: "Temporarily increase your movement speed after getting a Point-Blank kill.",
		type: "Minor",
		image: "/augments/bo7/eod-technician-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mugging", {
		title: "Mugging",
		description: "Melee kills reload a portion of your held weapon.",
		type: "Minor",
		image: "/augments/bo7/mugging-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("heavy-gloom", {
		title: "Heavy Gloom",
		description: "The beam slows enemies on contact.",
		type: "Minor",
		image: "/augments/bo7/double-time-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("urticant", {
		title: "Urticant",
		description:
			"Toxic Growth takes up a wider area and enemies that enter the growth continue to be slowed after leaving it.",
		type: "Major",
		image: "/augments/bo7/urticant-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("cordyception", {
		title: "Cordyception",
		description:
			"The first Normal or Special Enemy to walk into the growth is entangled and charmed, attacking other enemies that enter.",
		type: "Major",
		image: "/augments/bo7/thermite-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("pollination", {
		title: "Pollination",
		description:
			"Enemies killed by the growth explode, dealing Toxic damage to nearby enemies and slowing them.",
		type: "Major",
		image: "/augments/bo7/firebomb-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("zoochory", {
		title: "Zoochory",
		description: "The growth will attach itself to Normal or Special Enemies that walk into it.",
		type: "Major",
		image: "/augments/bo7/petroleum-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("ankle-shredder", {
		title: "Ankle Shredder",
		description: "Enemies moving through the growth are even slower.",
		type: "Minor",
		image: "/augments/bo7/double-time-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("green-thumb", {
		title: "Green Thumb",
		description: "Significantly increases the Toxic Growth's health.",
		type: "Minor",
		image: "/augments/bo7/extension-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("plant-food", {
		title: "Plant Food",
		description:
			"Killing enemies with Toxic Growth has a chance to drop fruit that overcharge health.",
		type: "Minor",
		image: "/augments/bo7/durable-plates-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("mitosis", {
		title: "Mitosis",
		description: "Each activation has a chance to create an extra Healing Glyph.",
		type: "Minor",
		image: "/augments/bo7/emergency-medical-kit-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("booster-shot", {
		title: "Booster Shot",
		description: "The Healing Glyph can now overcharge health.",
		type: "Major",
		image: "/augments/bo7/probiotic-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("haywire", {
		title: "Haywire",
		description:
			"Periodically send out electric charges that stun and damage enemies while the Tesla Storm is active.",
		type: "Major",
		image: "/augments/bo7/double-impact-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("amped", {
		title: "Amped",
		description: "The Tesla Storm's damage is increased.",
		type: "Minor",
		image: "/augments/bo7/amped-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("vib-discount", {
		title: "Vib Discount",
		description: "Mister Peeks will offer an ammo discount to VIBs (Very Important Buddies).",
		type: "Minor",
		image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("peek-health", {
		title: "Peek Health",
		description: "Heal rapidly while near Mister Peeks.",
		type: "Major",
		image: "/augments/bo7/vampiric-extraction-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("pack-mule", {
		title: "Pack Mule",
		description: "Carry more stock ammo",
		type: "Major",
		image: "/augments/bo7/parting-gift-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("free-throw", {
		title: "Free Throw",
		description: "Chance to keep equipment when used. Does not apply to the Combat Axe.",
		type: "Major",
		image: "/augments/bo7/free-throw-major-augment.webp",
		variants: Option.none(),
	}),
	makeAugment("ol-reliable", {
		title: "Ol' Reliable",
		description:
			"Your 3rd primary weapon is recovered when you repurchase Mule Kick. Does not apply to limited-quanity weapons.",
		type: "Major",
		image: "/augments/bo7/phantom-reload-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("multi-pack", {
		title: "Multi Pack",
		description:
			"Pack-A-Punching a weapon might cause another weapon to upgrade of the same PAP level.",
		type: "Major",
		image: "/augments/bo7/citrus-focus-major-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("fully-equipped", {
		title: "Fully Equipped",
		description: "Carry more Equipment",
		type: "Minor",
		image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("plate-hunter", {
		title: "Plate Hunter",
		description: "Carry more Armor Plates",
		type: "Minor",
		image: "/augments/bo7/extra-charge-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("bogo", {
		title: "BOGO",
		description: "Crafted Equipment grants an additional Equipment up to the maximum capacity.",
		type: "Minor",
		image: "/augments/bo7/fetcher-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
	makeAugment("kick-back", {
		title: "Kick Back",
		description: "Get a discount on Perks.",
		type: "Minor",
		image: "/augments/bo7/fast-pitcher-minor-augment-bo7.webp",
		variants: Option.none(),
	}),
)
