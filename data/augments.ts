import type { Augment as PayloadAugment } from "@/types/payload-types"
import { Effect, Predicate } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import { getMediaById } from "./media"

export type MinifiedAugment = NonNullable<Awaited<ReturnType<typeof getAugmentById>>>

export const getAugmentById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.augments.all, CACHE_KEYS.augments.byId(id))

	return await getAugmentByIdEffect(id).pipe(
		Effect.withLogSpan("get_augment_by_id"),
		Effect.annotateLogs({ id }),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

export const getAugmentByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const augment = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "augments",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						type: true,
						image: true,
						description: true,
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Augment with id ${id} not found`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(augment =>
				Effect.gen(function* () {
					const image = yield* assertRelation(augment.image)
					return {
						id: augment.id,
						title: augment.title,
						type: augment.type,
						description: augment.description,
						image: createMediaDto(image),
					}
				}),
			),
		)

		return augment
	}).pipe(Effect.withLogSpan("internal_get_augment_by_id"), Effect.annotateLogs({ id }))

export const createAugmentDto = (augmentOrId: string | PayloadAugment) =>
	Effect.gen(function* () {
		const augment = Predicate.isString(augmentOrId)
			? yield* getAugmentByIdEffect(augmentOrId)
			: yield* assertRelation(augmentOrId)

		const image = Predicate.isString(augment.image)
			? yield* getMediaById(augment.image)
			: yield* assertRelation(augment.image).pipe(Effect.map(createMediaDto))

		return {
			id: augment.id,
			title: augment.title,
			type: augment.type,
			description: augment.description,
			image: {
				url: image?.url,
				width: image?.width,
				height: image?.height,
			},
		}
	}).pipe(Effect.withLogSpan("create_augment_dto"))

export interface Augment {
	id: string
	title: string
	type: "Major" | "Minor"
	description: string
	image: string
}

const augmentRegistry = {
	doubleJeopardy: {
		id: "double-jeopardy",
		title: "Double Jeopardy",
		description: "Normal Zombies at low health have a chance to die immediately when shot.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
	},
	doubleStandard: {
		id: "double-standard",
		title: "Double Standard",
		description: "All non-critical shots do double damage. Only applies to normal bullet weapons.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
	},
	doubleImpact: {
		id: "double-impact",
		title: "Double Impact",
		description: "Double hits on the same target in quick succession deal more damage.",
		type: "Major",
		image: "/augments/double-impact-major-augment.webp",
	},
	doubleTime: {
		id: "double-time",
		title: "Double Time",
		description: "Increases fire rate bonus.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
	},
	doubleOrNothing: {
		id: "double-or-nothing",
		title: "Double or Nothing",
		description:
			"Weapons have a chance to do double damage, but also have a chance to do 0 damage.",
		type: "Minor",
		image: "/augments/double-or-nothing-minor-augment.webp",
	},
	doublePlay: {
		id: "double-play",
		title: "Double Play",
		description:
			"Killing 2 enemies in quick succession will have a chance to return 2 rounds to your magazine. Only applies to normal bullet weapons.",
		type: "Minor",
		image: "/augments/hidden-impact-minor-augment.webp",
	},
	treasureHunter: {
		id: "treasure-hunter",
		title: "Treasure Hunter",
		description:
			"Spot items others can miss from loot containers as well as special and elite kills.",
		type: "Major",
		image: "/augments/supercharged-major-augment.webp",
	},
	deathStare: {
		id: "death-stare",
		title: "Death Stare",
		description:
			"Your Elemental Weakness damage has a chance to kill an enemy that is low on health.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
	},
	criticalEye: {
		id: "critical-eye",
		title: "Critical Eye",
		description: "Small chance that a body shot becomes a critical shot.",
		type: "Major",
		image: "/augments/dead-first-major-augment.webp",
	},
	birdsEyeView: {
		id: "birds-eye-view",
		title: "Bird's Eye View",
		description: "The minimap’s scan rate is increased.",
		type: "Minor",
		image: "/augments/speedy-roulette-minor-augment.webp",
	},
	extraChange: {
		id: "extra-change",
		title: "Extra Change",
		description: "Find extra essence under more locations.",
		type: "Minor",
		image: "/augments/incendiary-minor-augment.webp",
	},
	furtherInsight: {
		id: "further-insight",
		title: "Further Insight",
		description: "Increase perception radius.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
	},
	gravityMD: {
		id: "gravity-md",
		title: "Gravity MD",
		description: "Just falling from heights creates explosions.",
		type: "Major",
		image: "/augments/gravity-md-major-augment.webp",
	},
	drRam: {
		id: "dr-ram",
		title: "Dr Ram",
		description: "Tactical Sprint knocks down and damages base zombies.",
		type: "Major",
		image: "/augments/dr-ram-major-augment.webp",
	},
	phdSlider: {
		id: "phd-slider",
		title: "PhD Slider",
		description: "Sliding into enemies triggers explosions.",
		type: "Major",
		image: "/augments/phd-slider-major-augment.webp",
	},
	environmentalist: {
		id: "environmentalist",
		title: "Environmentalist",
		description: "Become immune to environmental damage while sliding.",
		type: "Minor",
		image: "/augments/environmentalist-minor-augment.webp",
	},
	eodTechnician: {
		id: "eod-technician",
		title: "EOD Technician",
		description: "Slightly reduce height and distance requirements for explosions.",
		type: "Minor",
		image: "/augments/eod-technician-minor-augment.webp",
	},
	tribologist: {
		id: "tribologist",
		title: "Tribologist",
		description: "Sliding distance and speed are increased.",
		type: "Minor",
		image: "/augments/tribologist-minor-augment.webp",
	},
	fetidUpgraid: {
		id: "fetid-upgraid",
		title: "Fetid Upgr-aid",
		description:
			"On death, zombies have a chance to create a gas cloud that charges your Field Upgrade.",
		type: "Major",
		image: "/augments/frenzy-fire-major-augment.webp",
	},
	smellOfDeath: {
		id: "smell-of-death",
		title: "Smell of Death",
		description:
			"On death, zombies have a chance to create a gas cloud that conceals you while standing in it.",
		type: "Major",
		image: "/augments/citrus-focus-major-augment.webp",
	},
	partingGift: {
		id: "parting-gift",
		title: "Parting Gift",
		description: "Vulture Aid ammo drops give more ammo to Wonder Weapons.",
		type: "Major",
		image: "/augments/supercharged-major-augment.webp",
	},
	condorsReach: {
		id: "condors-reach",
		title: "Condor's Reach",
		description: "Auto-pickup loot from farther away.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
	},
	carrionLuggage: {
		id: "carrion-luggage",
		title: "Carrion Luggage",
		description: "Critical kills have a chance to drop extra salvage.",
		type: "Minor",
		image: "/augments/eod-technician-minor-augment.webp",
	},
	pickyEater: {
		id: "picky-eater",
		title: "Picky Eater",
		description: "On death, zombies have a higher chance of dropping your current equipment.",
		type: "Minor",
		image: "/augments/picky-eater-minor-augment.webp",
	},
	expresso: {
		id: "expresso",
		title: "Expresso",
		description: "All melee attacks are slightly faster.",
		type: "Major",
		image: "/augments/classic-formula-major-augment.webp",
	},
	vampiricExtraction: {
		id: "vampiric-extraction",
		title: "Vampiric Extraction",
		description: "Melee attacks heal a small amount of your health.",
		type: "Major",
		image: "/augments/vampiric-extraction-major-augment.webp",
	},
	tripleShot: {
		id: "triple-shot",
		title: "Triple Shot",
		description: "Your punch can hit multiple enemies at once.",
		type: "Major",
		image: "/augments/triple-shot-major-augment.webp",
	},
	stickNMove: {
		id: "stick-n-move",
		title: "Stick 'n Move",
		description: "Backpedal speed is increased after a successful melee attack.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
	},
	strengthTraining: {
		id: "strength-training",
		title: "Strength Training",
		description: "Your punch can one hit kill normal enemies for more rounds.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
	},
	hiddenImpact: {
		id: "hidden-impact",
		title: "Hidden Impact",
		description: "Melee kills reload a portion of your held weapon.",
		type: "Minor",
		image: "/augments/hidden-impact-minor-augment.webp",
	},
	probiotic: {
		id: "probiotic",
		title: "Probiotic",
		description: "Slightly increase maximum health with Jugger-Nog.",
		type: "Major",
		image: "/augments/probiotic-major-augment.webp",
	},
	turtleShell: {
		id: "turtle-shell",
		title: "Turtle Shell",
		description:
			"Armor acts as a shield on your back, completely absorbing damage to your back. No damage mitigation when hit from the front.",
		type: "Major",
		image: "/augments/turtle-shell-major-augment.webp",
	},
	reactiveArmor: {
		id: "reactive-armor",
		title: "Reactive Armor",
		description: "When an armor plate breaks, nearby normal enemies are stunned for a short time.",
		type: "Major",
		image: "/augments/reactive-armor-major-augment.webp",
	},
	retaliation: {
		id: "retaliation",
		title: "Retaliation",
		description: "Deal bonus damage when health is low.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
	},
	hardenedPlates: {
		id: "hardened-plates",
		title: "Hardened Plates",
		description: "Armor plates have more damage mitigation.",
		type: "Minor",
		image: "/augments/hardened-plates-minor-augment.webp",
	},
	durablePlates: {
		id: "durable-plates",
		title: "Durable Plates",
		description: "Slightly increase armor durability.",
		type: "Minor",
		image: "/augments/durable-plates-minor-augment.webp",
	},
	emt: {
		id: "emt",
		title: "EMT",
		description: "Reviving an ally allows them to keep all of the Perks on their bleed-out bar.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
	},
	equivalentExchange: {
		id: "equivalent-exchange",
		title: "Equivalent Exchange",
		description:
			"If you have Quick Revive while downed, killing an enemy will revive you and remove Quick Revive. This can be done up to 3 times.",
		type: "Major",
		image: "/augments/emt-major-augment.webp",
	},
	dyingWish: {
		id: "dying-wish",
		title: "Dying Wish",
		description:
			"On lethal damage, become immune to all damage for 2 seconds and keep 1 health. Quick Revive is removed on use. This can be done up to 3 times.",
		type: "Major",
		image: "/augments/dying-wish-major-augment.webp",
	},
	swiftRecovery: {
		id: "swift-recovery",
		title: "Swift Recovery",
		description: "Reviving an ally increases both of your movement speeds for a short time.",
		type: "Minor",
		image: "/augments/hot-foot-minor-augment.webp",
	},
	karmicReturn: {
		id: "karmic-return",
		title: "Karmic Return",
		description: "Reviving an ally heals you to full health.",
		type: "Minor",
		image: "/augments/karmic-return-minor-augment.webp",
	},
	slowDeath: {
		id: "slow-death",
		title: "Slow Death",
		description: "Increase your time in last stand.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
	},
	antibiotic: {
		id: "antibiotic",
		title: "Antibiotic",
		description:
			"The healing glyph now damages enemies that touch it, but its lifetime is reduced.",
		type: "Major",
		image: "/augments/dead-head-major-augment.webp",
	},
	bigGameLightMend: {
		id: "big-game-light-mend",
		title: "Big Game",
		description: "Light Mend can activate on elite enemies, dropping 3 more healing glyphs.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
	},
	dualAction: {
		id: "dual-action",
		title: "Dual Action",
		description: "Consuming a healing glyph will temporarily allow you to heal faster.",
		type: "Major",
		image: "/augments/resilience-major-augment.webp",
	},
	longerLife: {
		id: "longer-life",
		title: "Longer Life",
		description: "The healing glyph's lifetime is increased.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
	},
	extraStrength: {
		id: "extra-strength",
		title: "Extra Strength",
		description: "The healing glyph replenishes more health when consumed.",
		type: "Minor",
		image: "/augments/extra-strength-minor-augment.webp",
	},
	expressRemedy: {
		id: "express-remedy",
		title: "Express Remedy",
		description: "Increase the range that the glyph will move to an ally.",
		type: "Minor",
		image: "/augments/supermassive-minor-augment.webp",
	},
	chainLightning: {
		id: "chain-lightning",
		title: "Chain Lightning",
		description: "The stunned enemy can spread the stun to others.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
	},
	bigGameDeadWire: {
		id: "big-game-dead-wire",
		title: "Big Game",
		description: "Dead Wire can stun elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
	},
	lightningStrike: {
		id: "lightning-strike",
		title: "Lightning Strike",
		description:
			"A bolt of lightning strikes from above, stunning all normal and special enemies in the area.",
		type: "Major",
		image: "/augments/electric-cherry-major-augment.webp",
	},
	highVoltage: {
		id: "high-voltage",
		title: "High Voltage",
		description: "Dead Wire deals slightly more damage.",
		type: "Minor",
		image: "/augments/retaliation-minor-augment.webp",
	},
	hasteDeadWire: {
		id: "haste-dead-wire",
		title: "Haste",
		description: "Dead Wire cooldown is slightly reduced.",
		type: "Minor",
		image: "/augments/chill-berry-minor-augment.webp",
	},
	extensionDeadWire: {
		id: "extension-dead-wire",
		title: "Extension",
		description: "The stun and electric field last longer.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
	},
	plague: {
		id: "plague",
		title: "Plague",
		description: "The charmed enemy has a chance to turn other enemies.",
		type: "Major",
		image: "/augments/chain-lightning-major-augment.webp",
	},
	pheromone: {
		id: "pheromone",
		title: "Pheromone",
		description: "The charmed enemy distracts nearby normal and special enemies for a short time.",
		type: "Major",
		image: "/augments/pheromone-major-augment.webp",
	},
	bigGameBrainRot: {
		id: "big-game-brain-rot",
		title: "Big Game",
		description: "Brain Rot can charm elite enemies.",
		type: "Major",
		image: "/augments/big-game-major-augment.webp",
	},
	extensionBrainRot: {
		id: "extension-brain-rot",
		title: "Extension",
		description: "Brain Rot duration is slightly increased.",
		type: "Minor",
		image: "/augments/slow-death-minor-augment.webp",
	},
	// page 8 of augments is where to being from
} satisfies Record<string, Augment>

export const {
	doubleJeopardy,
	doubleStandard,
	doubleImpact,
	doubleTime,
	doubleOrNothing,
	doublePlay,
	treasureHunter,
	deathStare,
	criticalEye,
	birdsEyeView,
	extraChange,
	furtherInsight,
	gravityMD,
	drRam,
	phdSlider,
	environmentalist,
	eodTechnician,
	tribologist,
	bigGameBrainRot,
	extensionBrainRot,
	bigGameDeadWire,
	extensionDeadWire,
	lightningStrike,
	highVoltage,
	hasteDeadWire,
	plague,
	pheromone,
	bigGameLightMend,
	antibiotic,
	carrionLuggage,
	chainLightning,
	condorsReach,
	dualAction,
	durablePlates,
	dyingWish,
	emt,
	equivalentExchange,
	expressRemedy,
	extraStrength,
	expresso,
	fetidUpgraid,
	hardenedPlates,
	hiddenImpact,
	karmicReturn,
	longerLife,
	partingGift,
	pickyEater,
	probiotic,
	reactiveArmor,
	retaliation,
	slowDeath,
	smellOfDeath,
	stickNMove,
	strengthTraining,
	swiftRecovery,
	turtleShell,
	tripleShot,
	vampiricExtraction,
} = augmentRegistry
