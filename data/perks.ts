import type { AugmentTuple } from "./augments"
import type { GameKey } from "./games"

type PerkVariant = Omit<Partial<Perk>, "id" | "title" | "variants">

export interface Perk {
	/** The unique identifier of the perk */
	id: string
	/** The title of the perk */
	title: string
	/** The description of the perk */
	description: string
	/** The image of the perk */
	image: string
	/** The modifier of the perk */
	modifier?: string
	/** The augments of the perk */
	augments?: AugmentTuple
	/** The game variants of the perk */
	variants?: Partial<Record<GameKey, PerkVariant>>
}
/**Union of all perk keys */
export type PerkKey = keyof typeof perkRegistry

/**
 * Gets a perk by its key.
 * @param key The key of the perk.
 * @param game The game to get the perk variant for.
 * @returns The perk.
 */
export const getPerkByKey = (key: PerkKey, game?: GameKey): Perk => {
	const perk: Perk = perkRegistry[key]

	if (!game || !perk.variants?.[game]) return perk

	const variant = perk.variants?.[game]
	return { ...perk, ...variant }
}

/** Gets all perks.
 * @param game The game to get the perk variants for.
 */
export const getPerks = (game?: GameKey): Perk[] => {
	return Object.values(perkRegistry).map((perk: Perk) => {
		if (!game || !perk.variants?.[game]) return perk

		const variant = perk.variants[game]
		return {
			...perk,
			...variant,
		}
	})
}

const perkRegistry = {
	wispTea: {
		id: "wisp-tea",
		title: "Wisp Tea",
		description: "Summon a companion wisp after killing zombies.",
		image: "/perks/wisp-tea.webp",
		augments: [
			"maskOfWrath",
			"maskOfSalvation",
			"maskOfDistraction",
			"maskOfBenevolence",
			"extensionWisp",
			"hasteWisp",
			"zombieSitter",
			"fetcher",
		],
	},
	juggernog: {
		id: "juggernog",
		title: "Juggernog",
		description: "Increases max health.",
		image: "/perks/juggernog.webp",
		variants: {
			blackOps6: {
				description: "Increase Max Health by 100.",
				image: "/perks/juggernog-bo6.webp",
				augments: [
					"probiotic",
					"turtleShell",
					"reactiveArmor",
					"retaliation",
					"hardenedPlates",
					"durablePlates",
				],
			},
			blackOps7: {
				description: "Increase Max Health by 100.",
				image: "/perks/juggernog-bo6.webp",
				augments: [
					"probiotic",
					"turtleShell",
					"reactiveArmor",
					"ironCore",
					"retaliation",
					"hardenedPlates",
					"durablePlates",
					"shakeItOff",
				],
			},
		},
	},
	deadshotDaiquiri: {
		id: "deadshot-daiquiri",
		title: "Deadshot Daiquiri",
		description:
			"Reduces weapon spread by 35%, removes weapon sway, and auto-locks aim-assist to a zombies head.",
		image: "/perks/deadshot-daiquiri.webp",
		variants: {
			blackOpsColdWar: {
				description: "Aiming down sights moves to enemy critical location. Remove scope sway.",
				image: "/perks/deadshot-daiquiri-cold-war.webp",
			},
			blackOps6: {
				description: "Improve ADS precision and increase critical damage.",
				image: "/perks/deadshot-daiquiri-cold-war.webp",
				augments: ["deadHead", "deadFirst", "deadAgain", "deadBreak", "deadDraw", "deadSet"],
			},
		},
	},
	widowsWine: {
		id: "widows-wine",
		title: "Widow's Wine",
		description:
			"Replaces lethal equipment with four special grenades that explode automatically when hit, consuming a grenade, and slowing and damaging all normal/special zombies in the blast radius.",
		image: "/perks/widows-wine.webp",
	},
	doubleTap: {
		id: "double-tap",
		title: "Double Tap",
		description:
			"Increases the rate of fire and doubles the damage of every round fired from a projectile weapon.",
		image: "/perks/double-tap-bo3.webp",
		variants: {
			blackOps6: {
				description: "Increases weapon fire rate.",
				image: "/perks/double-tap.webp",
				augments: [
					"doubleJeopardy",
					"doubleStandard",
					"doubleImpact",
					"doubleTime",
					"doubleOrNothing",
					"doublePlay",
				],
			},
		},
	},
	timeslip: {
		id: "timeslip",
		title: "Timeslip",
		description:
			"Equipment cooldown rate increased. Mystery Box and Pack-a-Punch weapons appear faster. Greatly reduce Trap and Fast Travel cooldowns.",
		modifier: "Special Weapon charge rate and Elixir cooldown rate are slightly increased.",
		image: "/perks/timeslip.webp",
	},
	stoneColdStronghold: {
		id: "stone-cold-stronghold",
		title: "Stone Cold Stronghold",
		description:
			"Standing your ground creates a defensive circle which boosts damage and armor over time while inside.",
		modifier: "Enemies killed inside the defensive circle also boost damage and armor.",
		image: "/perks/stone-cold-stronghold.webp",
	},
	phdSlider: {
		id: "phd-slider",
		title: "PHD Slider",
		description:
			"Slide to build up charge. Once full charged, slide into an enemy to trigger an explosion. Gain full resistance to self-inflicted explosive damage and partial resistance to enemy explosive damage.",
		modifier:
			"Improved slide distance. Trap immunity while sliding. Increased explosion damage when entering a slide from greater heights.",
		image: "/perks/phd-slider.webp",
	},
	quickRevive: {
		id: "quick-revive",
		title: "Quick Revive",
		description: "Revive teammates 100% faster. Self-revive on solo, up to 3 times.",
		image: "/perks/quick-revive.webp",
		variants: {
			blackOps4: {
				description:
					"Shorter delay before regenerating health and increased regeneration rate. Revive Players faster.",
				modifier:
					"Gain a sprint speed after health regeneration starts. Reviving grants both players full health and a sprint speed boost.",
				image: "/perks/quick-revive.webp",
			},
			blackOps6: {
				description: "Recover health and revive allies faster.",
				image: "/perks/quick-revive-cold-war.webp",
				augments: [
					"emt",
					"equivalentExchange",
					"dyingWish",
					"swiftRecovery",
					"karmicReturn",
					"slowDeath",
				],
			},
		},
	},
	staminUp: {
		id: "stamin-up",
		title: "Stamin-Up",
		description: "Sprint duration is increased by 100%. Sprint speed increased.",
		image: "/perks/stamin-up.webp",
		variants: {
			blackOps4: {
				description: "Increased sprint speed and duration. Stamina regenerates faster.",
				modifier: "Unlimited full sprint. Player can fire weapons while sprinting.",
			},
			blackOps6: {
				description: "Increase run and sprint speed.",
				image: "/perks/stamin-up-cold-war.webp",
				augments: ["freeFaller", "dasher", "stalker", "hardTarget", "quarterback", "hotFoot"],
			},
		},
	},
	wintersWail: {
		id: "winters-wail",
		title: "Winter's Wail",
		description:
			"Getting hit by a melee attack while not at full health will cause a frost explosion that will freeze or slow enemies nearby. You can store three charges. In Realistic Difficulty, the frost explosion will trigger regardless of health.",
		modifier:
			"Frost explosion triggers a slowing field around the Player for a limited time. Store an additional charge.",
		image: "/perks/winters-wail.webp",
	},
	deathPerception: {
		id: "death-perception",
		title: "Death Perception",
		description:
			"See nearby enemies through walls. Receive screen indicators when enemies approach the Player from off-screen.",
		modifier: "Deal increased damage to special enemy weak points.",
		image: "/perks/death-perception.webp",
		variants: {
			blackOps6: {
				description: "Obscured enemies are keylined.",
				image: "/perks/death-perception-bo6.webp",
				augments: [
					"treasureHunter",
					"deathStare",
					"criticalEye",
					"birdsEyeView",
					"extraChange",
					"furtherInsight",
				],
			},
		},
	},
	victoriousTortoise: {
		id: "victorious-tortoise",
		title: "Victorious Tortoise",
		description:
			"Shields block damage from all directions when held. When a Shield breaks it will trigger a defensive explosion.",
		modifier: "Shield bash attacks can knock down heavy and Mini-Boss enemies.",
		image: "/perks/victorious-tortoise.webp",
	},
	dyingWish: {
		id: "dying-wish",
		title: "Dying Wish",
		description:
			"Instead of entering Last Stand the Player goes Berserk for 9 seconds. While Berserk, they are invulnerable and melee damage is greatly increased. Afterwards, the Player is left with 1 health. Cooldown increases with every use.",
		modifier: "Player will receive full health when no longer Berserk.",
		image: "/perks/dying-wish.webp",
	},
	phdFlopper: {
		id: "phd-flopper",
		title: "PHD Flopper",
		description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
		image: "/perks/phd-flopper-bo1.webp",
		variants: {
			blackOps6: {
				description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
				image: "/perks/phd-flopper.webp",
				augments: [
					"gravityMD",
					"drRam",
					"phdSlider",
					"environmentalist",
					"eodTechnician",
					"tribologist",
				],
			},
		},
	},
	vultureAid: {
		id: "vulture-aid",
		title: "Vulture Aid",
		description:
			"See items through walls, zombies drop ammo packs, and the occasional gas cloud that, if stood in, allows the player to be ignored by zombies.",
		image: "/perks/vulture-aid-bo2.webp",
		variants: {
			blackOps6: {
				description: "Increase the variety of loot dropped by enemies.",
				image: "/perks/vulture-aid.webp",
				augments: [
					"fetidUpgraid",
					"smellOfDeath",
					"partingGift",
					"condorsReach",
					"carrionLuggage",
					"pickyEater",
				],
			},
		},
	},
	meleeMacchiato: {
		id: "melee-macchiato",
		title: "Melee Macchiato",
		description: "Replace weapon gun butt with a deadly punch.",
		image: "/perks/melee-macchiato.webp",
		augments: [
			"expresso",
			"vampiricExtraction",
			"tripleShot",
			"stickNMove",
			"strengthTraining",
			"hiddenImpact",
		],
	},
	muleKick: {
		id: "mule-kick",
		title: "Mule Kick",
		description: "Carry an additional weapon.",
		image: "/perks/mule-kick.webp",
		variants: {
			blackOpsColdWar: {
				image: "/perks/mule-kick-cold-war.webp",
			},
		},
	},
	speedCola: {
		id: "speed-cola",
		title: "Speed Cola",
		description: "Increases Reload Speed.",
		image: "/perks/speed-cola-bo3.webp",
		variants: {
			blackOps6: {
				description: "Increase reload speed bonus to 15%.",
				image: "/perks/speed-cola.webp",
				augments: [
					"supercharged",
					"classicFormula",
					"phantomReload",
					"speedyRoulette",
					"quickSwap",
					"fastPitcher",
				],
			},
		},
	},
	elementalPop: {
		id: "elemental-pop",
		title: "Elemental Pop",
		description: "Grants a small chance to apply a random Ammo Mod effect to your next attack.",
		image: "/perks/elemental-pop.webp",
		augments: [
			"citrusFocus",
			"imperialPeach",
			"electricCherry",
			"vulneraBean",
			"pineappleBlast",
			"chillBerry",
		],
	},
	tombstone: {
		id: "tombstone",
		title: "Tombstone",
		description:
			"Allows you to drop a tombstone that you can pick up after death to reclaim your weapons and perks you had before dying. (Excluding Tombstone itself).",
		image: "/perks/tombstone.webp",
		variants: {
			blackOpsColdWar: {
				description: "Have a chance to revive yourself when downed.",
				image: "/perks/tombstone-cold-war.webp",
			},
		},
	},
} as const satisfies Record<string, Perk>
