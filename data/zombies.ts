import { deadWire, type AmmoMod } from "@/data/ammo-mods"
import { blackOps1, blackOps2, blackOps3, blackOps4, blackOpsColdWar, getGames, worldAtWar, type Game } from "@/data/games"
import { ascension, bloodOfTheDead, callOfTheDead, classified, derEisendrache, derRiese, firebaseZ, five, getMaps, kinoDerToten, mobOfTheDead, moon, shangriLa, shiNoNuma, tagDerToten, theGiant, tranzit, type Maps } from "@/data/maps"
import { head, type WeakPoint } from "@/data/weak-points"
import { bite, explosion, fieryExplosion, flamingAura, grab, knockbackExplosion, lunge, meleeSwing, novaGas, perkSteal, powerUpSteal, rallyCry, sonicScreech, weaponSteal, type ZombieAttack } from "@/data/zombie-attacks"

export const getZombies = () => Object.values(zombiesRegistry)
export const getZombieByKey = (key: ZombieKey) => zombiesRegistry[key]

export interface Zombie {
	id: string
	title: string
	description: string
	state?: "Coming Soon" | "New" | null
	releaseDate: Date
	image: string
	games: Game[]
	maps: Maps[]
	type: "Normal" | "Special" | "Elite" | "Boss"
	speed: "Slow" | "Medium" | "Fast"
	weakPoints: WeakPoint[]
	elementalWeakness: AmmoMod[]
	attacks: ZombieAttack[]
	spawnBehavior: string
	combatStrategy: () => Promise<typeof import("*.mdx")>
}

export type ZombieKey = keyof typeof zombiesRegistry

const zombiesRegistry = {
	zombie: {
		id: "zombie",
		title: "Zombie",
		description:
			"The first and most common enemy type. Varying in speeds, zombies provide the most basic threat on their own but will quickly become a challenge in hordes.",
		releaseDate: new Date("November 11, 2008 12:00 AM"),
		image: "/zombies/base-zombie.avif",
		type: "Normal",
		speed: "Medium",
		spawnBehavior:
			"Zombies spawn at the start of and throughout each round. Special situations like boss fights or main quest interactions may alter the spawns of zombies, changing them or completely removing them temporarily.",
		games: getGames(), // base zombie is in all games
		maps: getMaps(), // base zombie is in all maps
		elementalWeakness: [],
		weakPoints: [head],
		attacks: [meleeSwing],
		combatStrategy: () => import("@/content/zombies/base-zombie.mdx"),
	},
	hellhound: {
		id: "hellhound",
		title: "Hellhound",
		releaseDate: new Date("June 10, 2010 12:00 AM"),
		description: "Hellhounds are fast flaming zombie dogs that hunt in packs, targeting the first player they see until they are eliminated before switching to another target.",
		image: "/zombies/hellhound.webp",
		type: "Special",
		speed: "Fast",
		spawnBehavior: 'Hellhounds typically spawn within the first 6-8 rounds, and then every 5 rounds after that in packs. During a special round, the map will appear to be shrouded in heavy fog, the announcer can be heard saying "Fetch me their souls!", and the ground will shake when the player is spawned. During certain main quest steps or objectives, hellhounds may spawn infinitely or periodically, in which only the ground will shake when spawned.',
		games: [worldAtWar, blackOps1, blackOps2, blackOps3, blackOps4, blackOpsColdWar],
		maps: [shiNoNuma, derRiese, kinoDerToten, moon, tranzit, mobOfTheDead, theGiant, derEisendrache, bloodOfTheDead, classified, tagDerToten, firebaseZ],
		elementalWeakness: [],
		weakPoints: [head],
		attacks: [bite, lunge, explosion],
		combatStrategy: () => import("@/content/zombies/hellhound.mdx"),
	},
	nova6Crawler: {
		id: "nova-6-crawler",
		title: "Nova-6 Crawler",
		releaseDate: new Date("November 09, 2010 12:00 AM"),
		description: "These creepy crawlers are slow-moving zombies that emit green nova gas from their bodies as they crawl on all fours towards their target, releasing the gas when killed.",
		image: "/zombies/nova-6-crawler.avif",
		games: [blackOps1, blackOps3, blackOps4],
		maps: [kinoDerToten, five, moon, classified],
		type: "Special",
		speed: "Slow",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [meleeSwing, novaGas],
		spawnBehavior: "Nova-6 Crawlers typically start spawning once a certain area in a map has been accessed and will continue to spawn within the normal rounds in smaller numbers than zombies from that point on.",
		combatStrategy: () => import("@/content/zombies/nova-6-crawler.mdx"),
	},
	pentagonThief: {
		id: "pentagon-thief",
		title: "Pentagon Thief",
		releaseDate: new Date("November 09, 2010 12:30 AM"),
		image: "/zombies/pentagon-thief.avif",
		description: "The Pentagon Thief is a special enemy appearing in the map 'Five', periodically trying to steal the player's weapons forcing them to reacquire the weapon if successful.",
		games: [blackOps1],
		maps: [five],
		type: "Special",
		speed: "Fast",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [weaponSteal],
		spawnBehavior: "The Pentagon Thief will teleport onto the map at certain rounds once the power has been turned off appearing as red floating numbers, with the spawn rate being more frequent at higher rounds.",
		combatStrategy: () => import("@/content/zombies/pentagon-thief.mdx"),
	},
	spaceMonkey: {
		id: "space-monkey",
		title: "Space Monkey",
		releaseDate: new Date("February 01, 2011 12:00 AM"),
		image: "/zombies/space-monkey.avif",
		description: "Space Monkeys are a special enemy appearing on the map Ascension, attempting to steal the player's perks by attacking the perk machines.",
		games: [blackOps1, blackOps3],
		maps: [ascension],
		type: "Special",
		speed: "Medium",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [meleeSwing, perkSteal],
		spawnBehavior: "Space Monkeys will first appear after four to five rounds, after the first perk has been purchased. Arriving on lunar landers crashing into the ground with the map having a yellow-orange tint, and the announcer saying, 'Warning. Re-entry detected. All security personnel on high alert.'",
		combatStrategy: () => import("@/content/zombies/space-monkey.mdx"),
	},
	georgeARomero: {
		id: "george-a-romero",
		title: "George A. Romero",
		releaseDate: new Date("May 03, 2011 12:00 AM"),
		image: "/zombies/george-a-romero.avif",
		description: "George A. Romero is a special zombie, and the main antagonist featured in the map Call of the Dead. Roaming the map and constantly following the player.",
		games: [blackOps1],
		maps: [callOfTheDead],
		type: "Special",
		speed: "Medium",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [meleeSwing, rallyCry],
		spawnBehavior: "Romero spawns in via a lightning strike in the spawn area at the very start of the game, holding a stage light as his main weapon of choice and begin to follow the closest player to him from that point on.",
		combatStrategy: () => import("@/content/zombies/george-a-romero.mdx"),
	},
	jungleMonkey: {
		id: "jungle-monkey",
		title: "Jungle Monkey",
		releaseDate: new Date("June 12, 2011 12:00 AM"),
		image: "/zombies/jungle-monkey.avif",
		description: "The Jungle Monkey is a special enemy appearing on the map Shangri-La, unlike the Space Monkey, the Jungle Monkey prefers to go after Power-Up drops.",
		games: [blackOps1, blackOps3],
		maps: [shangriLa],
		type: "Special",
		speed: "Medium",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [meleeSwing, powerUpSteal],
		spawnBehavior: "These monkeys spawn perched on top of the sides of the stairs leading up to the Pack-a-Punch machine, and if one is killed, another will replace it. They are constant throughout the entire match and will always go after Power-Up drops.",
		combatStrategy: () => import("@/content/zombies/jungle-monkey.mdx"),
	},
	shriekerZombie: {
		id: "shrieker-zombie",
		title: "Shrieker Zombie",
		releaseDate: new Date("June 12, 2011 01:00 AM"),
		image: "/zombies/shrieker-zombie.avif",
		description: "Shrieker Zombies are a special enemy appearing on the map Shangri-La. These zombies appear with pale white skin, glowing white eyes, and can move very quickly.",
		games: [blackOps1, blackOps3],
		maps: [shangriLa],
		type: "Special",
		speed: "Fast",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [sonicScreech],
		spawnBehavior: "These zombies spawn throughout the normal rounds by blasting out of the ground with a Sonic Screech, making it likely you will hear them before you see them spawn. These zombies also do not count towards the normal round, so you can flip the round without killing them.",
		combatStrategy: () => import("@/content/zombies/shreker-zombie.mdx"),
	},
	napalmZombie: {
		id: "napalm-zombie",
		title: "Napalm Zombie",
		releaseDate: new Date("June 12, 2011 02:00 AM"),
		image: "/zombies/napalm-zombie.avif",
		description: "Napalm Zombies are a special enemy appearing on the map Shangri-La. These zombies look like a burnt zombie with a flaming aura surrounding them.",
		games: [blackOps1, blackOps3],
		maps: [shangriLa],
		type: "Special",
		speed: "Slow",
		weakPoints: [head],
		elementalWeakness: [],
		attacks: [flamingAura, fieryExplosion],
		spawnBehavior: "Napalm Zombies spawn from a patch of flames on the ground and do not count towards the normal round. Only one Napalm Zombie can appear at a time.",
		combatStrategy: () => import("@/content/zombies/napalm-zombie.mdx"),
	},
	astronautZombie: {
		id: "astronaut-zombie",
		title: "Astronaut Zombie",
		releaseDate: new Date("August 23, 2011 12:00 AM"),
		image: "/zombies/astronaut-zombie.avif",
		description: "The Astronaut is a special enemy appearing on the map Moon, often taking the name of someone on your friends list or if solo a predetermined name instead.",
		games: [blackOps1, blackOps3],
		maps: [moon],
		type: "Special",
		speed: "Slow",
		weakPoints: [head],
		elementalWeakness: [deadWire],
		attacks: [grab, knockbackExplosion],
		spawnBehavior: "The Astronaut spawns in shortly after you have teleported to the Moon from Earth, and will always spawn in the Receiving Bay and make their way to the player. After every death, it will return with a different name above its head.",
		combatStrategy: () => import("@/content/zombies/astronaut-zombie.mdx"),
	},
	// page 7 of zombies
} satisfies Record<string, Zombie>

export const { zombie } = zombiesRegistry
