import { blackOps3, blackOps6, type Game } from "./games"
/**
 * Gets a gobblegum by its key.
 * @param key The key of the gobblegum.
 * @returns The gobblegum.
 */
export const getGobblegumByKey = (key: GobblegumKey): Gobblegum => gobblegumRegistry[key]
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
	/** The game the gobblegum is from */
	game: Game
	/** The image of the gobblegum */
	image: string
}

const gobblegumRegistry = {
	alchemcialAntithesis: {
		id: "alchemcial-antithesis",
		title: "Alchemcial Antithesis",
		description:
			"Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon. Affects all weapons.",
		type: "Player-Activated",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/alchemcial-antithesis.avif",
	},
	anywhereButHere: {
		id: "anywhere-but-here",
		title: "Anywhere But Here",
		description:
			"Instantly teleport to a random location. A concussive blast knocks away any nearby zombies, keeping the player safe.",
		type: "Player-Activated",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/anywhere-but-here.avif",
	},
	inPlainSight: {
		id: "in-plain-sight",
		title: "In Plain Sight",
		description: "All Zombies ignore the player. Lasts 10 seconds.",
		type: "Player-Activated",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/in-plain-sight.avif",
	},
	stockOption: {
		id: "stock-option",
		title: "Stock Option",
		description:
			"Ammo is taken from the player's stockpile instead of their weapon's magazine. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/stock-option.avif",
	},
	dangerClosest: {
		id: "danger-closest",
		title: "Danger Closest",
		description: "Zero explosive damage. Lasts 3 full rounds.",
		type: "Round-Based",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/danger-closest.avif",
	},
	perkaholic: {
		id: "perkaholic",
		title: "Perkaholic",
		description: "Gives the player all Perk-a-Colas available on the map.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/perkaholic.avif",
	},
	shoppingFree: {
		id: "shopping-free",
		title: "Shopping Free",
		description: "All purchases are free. Lasts 1 minute.",
		type: "Time-Based",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/shopping-free.avif",
	},
	reignDrops: {
		id: "reign-drops",
		title: "Reign Drops",
		description: "Spawns all nine core Power-Ups at once. 2x Activations.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/reign-drops.avif",
	},
	immolationLiquidation: {
		id: "immolation-liquidation",
		title: "Immolation Liquidation",
		description: "Spawns a Fire Sale Power-Up. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		game: blackOps3,
		image: "/gobblegum/immolation-liquidation.avif",
	},
	nearDeathExperience: {
		id: "near-death-experience",
		title: "Near Death Experience",
		description:
			"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/near-death-experience.avif",
	},
	wallPower: {
		id: "wall-power",
		title: "Wall Power",
		description: "The next wall weapon purchased becomes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		game: blackOps3,
		image: "/gobblegum/wall-power.avif",
	},
	roundRobbin: {
		id: "round-robbin",
		title: "Round Robbin'",
		description: "Ends the current round. All players gain 1600 points.",
		type: "Player-Activated",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/round-robbin.avif",
	},
	swordFlay: {
		id: "sword-flay",
		title: "Sword Flay",
		description:
			"Melee attacks and any melee weapon will inflict 5x more damage on Zombies. Lasts 2:30 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/sword-flay.avif",
	},
	powerVacuum: {
		id: "power-vacuum",
		title: "Power Vacuum",
		description:
			"Power-Ups spawn more often. The drop chance is greatly increased, the normal cap of only 4 drops per round is ignored. Lasts 4 rounds.",
		type: "Round-Based",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/power-vacuum.avif",
	},
	idleEyes: {
		id: "idle-eyes",
		title: "Idle Eyes",
		description: "All zombies ignore all players and stand idle. Lasts 30 seconds. 3x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		game: blackOps3,
		image: "/gobblegum/idle-eyes.avif",
	},
	fearInHeadlights: {
		id: "fear-in-headlights",
		title: "Fear in Headlights",
		description: "Zombies seen by the player will not move. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Rare-Mega",
		game: blackOps3,
		image: "/gobblegum/fear-in-headlights.avif",
	},
	ephemeralEnhancement: {
		id: "ephemeral-enhancement",
		title: "Ephemeral Enhancement",
		description:
			"Turns the weapon in the player's hands into the Pack-A-Punched version. Lasts 60 seconds. 2x Activations.",
		type: "Player-Activated",
		rarity: "Mega",
		game: blackOps3,
		image: "/gobblegum/ephemeral-enhancement.avif",
	},
	cratePower: {
		id: "crate-power",
		title: "Crate Power",
		description: "The next gun taken from the Mystery Box comes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Rare-Mega",
		game: blackOps3,
		image: "/gobblegum/crate-power.avif",
	},
	arsenalAccelerator: {
		id: "arsenal-accelerator",
		title: "Arsenal Accelerator",
		description: "Charge the player's special weapon faster. Lasts 10 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/arsenal-accelerator.avif",
	},
	selfMedication: {
		id: "self-medication",
		title: "Self Medication",
		description: "Self-revive by killing a zombie while downed. Keep all perks. 3x Activations.",
		type: "Immediate",
		rarity: "Ultra-Rare Mega",
		game: blackOps3,
		image: "/gobblegum/self-medication.avif",
	},
	undeadManWalking: {
		id: "undead-man-walking",
		title: "Undead Man Walking",
		description: "Slow down all zombies to shambling speed. Lasts 4 minutes.",
		type: "Time-Based",
		rarity: "Classic",
		game: blackOps3,
		image: "/gobblegum/undead-man-walking.avif",
	},
	wonderbar: {
		id: "wonderbar",
		title: "Wonderbar!",
		description:
			"The next weapon from the Mystery Box will be a Wonder Weapon. Activates on Mystery Box Spin.",
		type: "Immediate",
		rarity: "Ultra",
		game: blackOps6,
		image: "/gobblegum/wonderbar.avif",
	},
	shieldsUp: {
		id: "shields-up",
		title: "Shields Up",
		description: "Refill armor on use. Armor is twice as strong. Lasts 3 Minutes.",
		type: "Time-Based",
		rarity: "Rare",
		game: blackOps6,
		image: "/gobblegum/shields-up.avif",
	},
	nearDeathExperienceBO6: {
		id: "near-death-experience-bo6",
		title: "Near Death Experience",
		description:
			"Revive, or be revived simply by being near other players. Revived players keep all their perks. Lasts 3 Minutes or 5 Revives.",
		type: "Time-Based",
		rarity: "Ultra",
		game: blackOps6,
		image: "/gobblegum/near-death-experience-bo6.avif",
	},
	idleEyesBO6: {
		id: "idle-eyes-bo6",
		title: "Idle Eyes",
		description: "All zombies ignore all players and stand idle. Lasts 30 seconds",
		type: "Time-Based",
		rarity: "Legendary",
		game: blackOps6,
		image: "/gobblegum/idle-eyes-bo6.avif",
	},
	killJoy: {
		id: "kill-joy",
		title: "Kill Joy",
		description: "Spawns an Insta-Kill Power-Up.",
		type: "Player-Activated",
		rarity: "Rare",
		game: blackOps6,
		image: "/gobblegum/kill-joy.avif",
	},
	profitSharing: {
		id: "profit-sharing",
		title: "Profit Sharing",
		description:
			"A portion of the essence you earn is also received by nearby players and vice versa. Lasts 2 minutes.",
		type: "Time-Based",
		rarity: "Epic",
		game: blackOps6,
		image: "/gobblegum/profit-sharing.avif",
	},
	arsenalAcceleratorBO6: {
		id: "arsenal-accelerator-bo6",
		title: "Arsenal Accelerator",
		description: "Charge the player's Field Upgrade faster. Lasts 5 minutes.",
		type: "Time-Based",
		rarity: "Rare",
		game: blackOps6,
		image: "/gobblegum/arsenal-accelerator-bo6.avif",
	},
	anywhereButHereBO6: {
		id: "anywhere-but-here-bo6",
		title: "Anywhere But Here",
		description:
			"Instantly teleport to a random location. A concussive blast knocks away nearby zombies.",
		type: "Player-Activated",
		rarity: "Rare",
		game: blackOps6,
		image: "/gobblegum/anywhere-but-here-bo6.avif",
	},
	extraCredit: {
		id: "extra-credit",
		title: "Extra Credit",
		description: "Spawns a Bonus Points Power-Up worth 1,250 Points. 4x Activations.",
		type: "Player-Activated",
		rarity: "Rare-Mega",
		game: blackOps3,
		image: "/gobblegum/extra-credit.avif",
	},
	perkaholicBO6: {
		id: "perkaholic-bo6",
		title: "Perkaholic",
		description: "Gives the player all available perks.",
		type: "Immediate",
		rarity: "Ultra",
		game: blackOps6,
		image: "/gobblegum/perkaholic-bo6.avif",
	},
	hiddenPower: {
		id: "hidden-power",
		title: "Hidden Power",
		description: "Upgrade your currently held weapon to Legendary rarity.",
		type: "Immediate",
		rarity: "Ultra",
		game: blackOps6,
		image: "/gobblegum/hidden-power.avif",
	},
	wallPowerBO6: {
		id: "wall-power-bo6",
		title: "Wall Power",
		description: "The next wall weapon purchased becomes Pack-a-Punched.",
		type: "Immediate",
		rarity: "Legendary",
		game: blackOps6,
		image: "/gobblegum/wall-power-bo6.avif",
	},
	powerKeg: {
		id: "power-keg",
		title: "Power Keg",
		description: "Spawns a Full Power power-up.",
		type: "Player-Activated",
		rarity: "Rare",
		game: blackOps6,
		image: "/gobblegum/power-keg.avif",
	},
	freeFire: {
		id: "free-fire",
		title: "Free Fire",
		description:
			"Firing weapons consumes no ammo. Does not work on wonder weapons. Lasts 60 Seconds.",
		type: "Time-Based",
		rarity: "Epic",
		game: blackOps6,
		image: "/gobblegum/free-fire.avif",
	},
} as const satisfies Record<string, Gobblegum>

/** Union of all Gobblegum keys */
export type GobblegumKey = keyof typeof gobblegumRegistry
/** Union of all Gobblegum types */
export type GobblegumType = Gobblegum["type"]
/** Union of all Gobblegum rarities */
export type GobblegumRarity = Gobblegum["rarity"]
export const {
	alchemcialAntithesis,
	anywhereButHere,
	inPlainSight,
	stockOption,
	dangerClosest,
	perkaholic,
	shoppingFree,
	reignDrops,
	immolationLiquidation,
	nearDeathExperience,
	nearDeathExperienceBO6,
	wonderbar,
	shieldsUp,
	undeadManWalking,
	selfMedication,
	arsenalAccelerator,
	cratePower,
	idleEyesBO6,
	killJoy,
	profitSharing,
	arsenalAcceleratorBO6,
	anywhereButHereBO6,
	extraCredit,
	perkaholicBO6,
	hiddenPower,
	wallPowerBO6,
	powerKeg,
	freeFire,
} = gobblegumRegistry
