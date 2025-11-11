import type { AmmoModKey } from "@/data/ammo-mods"
import type { ZombiesImagePath } from "@/types/generated/image-paths.gen"
import { Array as Arr, Effect, Option } from "effect"
import { convertIdToGameKey, type Game, getGameByKey, getGames } from "@/data/games"
import { getMapByKey, getMaps, type Maps } from "@/data/maps"
import { getWeakPointByKey, type WeakPoint } from "@/data/weak-points"
import { getZombieAttackByKey, type ZombieAttack } from "@/data/zombie-attacks"
import { sortReleaseDateDesc } from "@/utils/functions.client"
import { getAdjacentItems } from "./utils"

/** Union type of all zombie types */
export type ZombieType = "Normal" | "Special" | "Elite" | "Boss"
/** Union type of all zombie speeds */
export type ZombieSpeed = "Slow" | "Medium" | "Fast"
/** Union type of all zombies */
export type ZombieKey = keyof typeof zombiesRegistry
export interface Zombie {
	/** Unique identifier for the zombie */
	id: string
	/** Name of the zombie */
	title: string
	/** Description of the zombie */
	description: string
	/** State of the zombie */
	state: Option.Option<"Coming Soon" | "New">
	/** Release date of the zombie */
	releaseDate: Date
	/** Image of the zombie */
	image: ZombiesImagePath
	/** Games the zombie is available in */
	games: Game[]
	/** Maps the zombie is available in */
	maps: Maps[]
	/** Type of the zombie */
	type: ZombieType
	/** Speed of the zombie */
	speed: ZombieSpeed
	/** Weak points of the zombie */
	weakPoints: WeakPoint[]
	/** Elemental weaknesses of the zombie */
	elementalWeakness: AmmoModKey[]
	/** Attacks of the zombie */
	attacks: ZombieAttack[]
	/** Spawn behavior of the zombie */
	spawnBehavior: string
	/** Combat strategy of the zombie */
	combatStrategy: Effect.Effect<typeof import("*.mdx"), never, never>
}

/** Gets all zombies
 * @returns An array of all zombies
 */
export const getZombies = (): Zombie[] => zombies

/** Gets a zombie by its key
 * @param key The key of the zombie
 * @returns The zombie
 */
export const getZombieByKey = (key: ZombieKey): Zombie => zombiesRegistry[key]

/** Gets a zombie by its id
 * @param id The id of the zombie
 * @returns The zombie
 */
export const getZombieById = (id: string) => zombieMap.get(id)

/** Gets the previous and next zombies
 * @param currentId The id of the current zombie
 * @returns The previous and next zombies
 */
export const getAdjacentZombies = (currentId: string) => {
	return getAdjacentItems(zombies, currentId)
}

/**
 * Gets the most recent game that featured this zombie
 * @param games - The array of games that featured this zombie
 * @returns The most recent game key that featured this zombie
 */
export const getLatestZombieGameKey = (games: Game[]) => {
	return Option.match(Arr.last(games), {
		onNone: () => undefined,
		onSome: game => convertIdToGameKey(game.id),
	})
}

const zombiesRegistry = {
	zombie: {
		id: "zombie",
		title: "Zombie",
		state: Option.none(),
		description:
			"The first and most common enemy type. Varying in speeds, zombies provide the most basic threat on their own but will quickly become a challenge in hordes.",
		releaseDate: new Date("November 11, 2008 12:00 AM"),
		image: "/zombies/base-zombie.webp",
		type: "Normal",
		speed: "Medium",
		spawnBehavior:
			"Zombies spawn at the start of and throughout each round. Special situations like boss fights or main quest interactions may alter the spawns of zombies, changing them or completely removing them temporarily.",
		games: getGames().reverse(), // base zombie is in all games, reversed since its desc order by default
		maps: getMaps().reverse(), // base zombie is in all maps, reversed since its desc order by default
		elementalWeakness: [],
		weakPoints: [getWeakPointByKey("head")],
		attacks: [getZombieAttackByKey("meleeSwing")],
		combatStrategy: Effect.promise(() => import("@/content/zombies/zombie.mdx")),
	},
	hellhound: {
		id: "hellhound",
		title: "Hellhound",
		state: Option.none(),
		releaseDate: new Date("June 10, 2010 12:00 AM"),
		description:
			"Hellhounds are fast flaming zombie dogs that hunt in packs, targeting the first player they see until they are eliminated before switching to another target.",
		image: "/zombies/hellhound.webp",
		type: "Special",
		speed: "Fast",
		spawnBehavior:
			'Hellhounds typically spawn within the first 6-8 rounds, and then every 5 rounds after that in packs. During a special round, the map will appear to be shrouded in heavy fog, the announcer can be heard saying "Fetch me their souls!", and the ground will shake when the player is spawned. During certain main quest steps or objectives, hellhounds may spawn infinitely or periodically, in which only the ground will shake when spawned.',
		games: [
			getGameByKey("worldAtWar"),
			getGameByKey("blackOps1"),
			getGameByKey("blackOps2"),
			getGameByKey("blackOps3"),
			getGameByKey("blackOps4"),
			getGameByKey("blackOpsColdWar"),
		],
		maps: [
			getMapByKey("shiNoNuma"),
			getMapByKey("derRiese"),
			getMapByKey("kinoDerToten"),
			getMapByKey("moon"),
			getMapByKey("tranzit"),
			getMapByKey("mobOfTheDead"),
			getMapByKey("theGiant"),
			getMapByKey("derEisendrache"),
			getMapByKey("bloodOfTheDead"),
			getMapByKey("classified"),
			getMapByKey("tagDerToten"),
			getMapByKey("firebaseZ"),
		],
		elementalWeakness: [],
		weakPoints: [getWeakPointByKey("head")],
		attacks: [
			getZombieAttackByKey("bite"),
			getZombieAttackByKey("lunge"),
			getZombieAttackByKey("explosion"),
		],
		combatStrategy: Effect.promise(() => import("@/content/zombies/hellhound.mdx")),
	},
	nova6Crawler: {
		id: "nova-6-crawler",
		title: "Nova-6 Crawler",
		state: Option.none(),
		releaseDate: new Date("November 09, 2010 12:00 AM"),
		description:
			"These creepy crawlers are slow-moving zombies that emit green nova gas from their bodies as they crawl on all fours towards their target, releasing the gas when killed.",
		image: "/zombies/nova-6-crawler.webp",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3"), getGameByKey("blackOps4")],
		maps: [
			getMapByKey("kinoDerToten"),
			getMapByKey("five"),
			getMapByKey("moon"),
			getMapByKey("classified"),
		],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("novaGas")],
		spawnBehavior:
			"Nova-6 Crawlers typically start spawning once a certain area in a map has been accessed and will continue to spawn within the normal rounds in smaller numbers than zombies from that point on.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/nova-6-crawler.mdx")),
	},
	pentagonThief: {
		id: "pentagon-thief",
		title: "Pentagon Thief",
		state: Option.none(),
		releaseDate: new Date("November 09, 2010 12:30 AM"),
		image: "/zombies/pentagon-thief.webp",
		description:
			"The Pentagon Thief is a special enemy appearing in the map 'Five', periodically trying to steal the player's weapons forcing them to reacquire the weapon if successful.",
		games: [getGameByKey("blackOps1")],
		maps: [getMapByKey("five")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("weaponSteal")],
		spawnBehavior:
			"The Pentagon Thief will teleport onto the map at certain rounds once the power has been turned off appearing as red floating numbers, with the spawn rate being more frequent at higher rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/pentagon-thief.mdx")),
	},
	spaceMonkey: {
		id: "space-monkey",
		title: "Space Monkey",
		state: Option.none(),
		releaseDate: new Date("February 01, 2011 12:00 AM"),
		image: "/zombies/space-monkey.webp",
		description:
			"Space Monkeys are a special enemy appearing on the map Ascension, attempting to steal the player's perks by attacking the perk machines.",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3")],
		maps: [getMapByKey("ascension")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("perkSteal")],
		spawnBehavior:
			"Space Monkeys will first appear after four to five rounds, after the first perk has been purchased. Arriving on lunar landers crashing into the ground with the map having a yellow-orange tint, and the announcer saying, 'Warning. Re-entry detected. All security personnel on high alert.'",
		combatStrategy: Effect.promise(() => import("@/content/zombies/space-monkey.mdx")),
	},
	georgeARomero: {
		id: "george-a-romero",
		title: "George A. Romero",
		state: Option.none(),
		releaseDate: new Date("May 03, 2011 12:00 AM"),
		image: "/zombies/george-a-romero.webp",
		description:
			"George A. Romero is a special zombie, and the main antagonist featured in the map Call of the Dead. Roaming the map and constantly following the player.",
		games: [getGameByKey("blackOps1")],
		maps: [getMapByKey("callOfTheDead")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("rallyCry")],
		spawnBehavior:
			"Romero spawns in via a lightning strike in the spawn area at the very start of the game, holding a stage light as his main weapon of choice and begin to follow the closest player to him from that point on.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/george-a-romero.mdx")),
	},
	jungleMonkey: {
		id: "jungle-monkey",
		title: "Jungle Monkey",
		state: Option.none(),
		releaseDate: new Date("June 12, 2011 12:00 AM"),
		image: "/zombies/jungle-monkey.webp",
		description:
			"The Jungle Monkey is a special enemy appearing on the map Shangri-La, unlike the Space Monkey, the Jungle Monkey prefers to go after Power-Up drops.",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3")],
		maps: [getMapByKey("shangriLa")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("powerUpSteal")],
		spawnBehavior:
			"These monkeys spawn perched on top of the sides of the stairs leading up to the Pack-a-Punch machine, and if one is killed, another will replace it. They are constant throughout the entire match and will always go after Power-Up drops.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/jungle-monkey.mdx")),
	},
	shriekerZombie: {
		id: "shrieker-zombie",
		title: "Shrieker Zombie",
		state: Option.none(),
		releaseDate: new Date("June 12, 2011 01:00 AM"),
		image: "/zombies/shrieker-zombie.webp",
		description:
			"Shrieker Zombies are a special enemy appearing on the map Shangri-La. These zombies appear with pale white skin, glowing white eyes, and can move very quickly.",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3")],
		maps: [getMapByKey("shangriLa")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("sonicScreech")],
		spawnBehavior:
			"These zombies spawn throughout the normal rounds by blasting out of the ground with a Sonic Screech, making it likely you will hear them before you see them spawn. These zombies also do not count towards the normal round, so you can flip the round without killing them.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/shrieker-zombie.mdx")),
	},
	napalmZombie: {
		id: "napalm-zombie",
		title: "Napalm Zombie",
		state: Option.none(),
		releaseDate: new Date("June 12, 2011 02:00 AM"),
		image: "/zombies/napalm-zombie.webp",
		description:
			"Napalm Zombies are a special enemy appearing on the map Shangri-La. These zombies look like a burnt zombie with a flaming aura surrounding them.",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3")],
		maps: [getMapByKey("shangriLa")],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("flamingAura"), getZombieAttackByKey("fieryExplosion")],
		spawnBehavior:
			"Napalm Zombies spawn from a patch of flames on the ground and do not count towards the normal round. Only one Napalm Zombie can appear at a time.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/napalm-zombie.mdx")),
	},
	astronautZombie: {
		id: "astronaut-zombie",
		title: "Astronaut Zombie",
		state: Option.none(),
		releaseDate: new Date("August 23, 2011 12:00 AM"),
		image: "/zombies/astronaut-zombie.webp",
		description:
			"The Astronaut is a special enemy appearing on the map Moon, often taking the name of someone on your friends list or if solo a predetermined name instead.",
		games: [getGameByKey("blackOps1"), getGameByKey("blackOps3")],
		maps: [getMapByKey("moon")],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["deadWire"],
		attacks: [getZombieAttackByKey("grab"), getZombieAttackByKey("knockbackExplosion")],
		spawnBehavior:
			"The Astronaut spawns in shortly after you have teleported to the Moon from Earth, and will always spawn in the Receiving Bay and make their way to the player. After every death, it will return with a different name above its head.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/astronaut-zombie.mdx")),
	},
	denizen: {
		id: "denizen",
		title: "Denizen",
		state: Option.none(),
		releaseDate: new Date("November 12, 2012 12:00 AM"),
		image: "/zombies/denizen.webp",
		description:
			"The Denizen is a special enemy appearing on the map Tranzit, lurking within the fog of the map waiting for unsuspecting players to jump onto.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("tranzit")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("leap")],
		spawnBehavior:
			"Denizens spawn within the fog of the map, in-between each Point of Interest and will always exist within those areas no matter the round.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/denizen.mdx")),
	},
	avogadro: {
		id: "avogadro",
		title: "Avogadro",
		state: Option.none(),
		releaseDate: new Date("November 12, 2012 01:00 AM"),
		image: "/zombies/avogadro.webp",
		description:
			"The Avogadro is a boss zombie appearing on the maps Tranzit & Alpha Omega, also known as Cornelius Pernell the leader of Broken Arrow.",
		games: [getGameByKey("blackOps2"), getGameByKey("blackOps4")],
		maps: [getMapByKey("tranzit"), getMapByKey("alphaOmega")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("aoeSlam"),
			getZombieAttackByKey("lightningBolt"),
			getZombieAttackByKey("charge"),
		],
		spawnBehavior:
			"In TranZit, the Avogadro spawns in after turning on the power. In Alpha Omega, the Avogadro is the final boss of the Main Quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/avogadro.mdx")),
	},
	jumpingJack: {
		id: "jumping-jack",
		title: "Jumping Jack",
		state: Option.none(),
		releaseDate: new Date("January 29, 2013 12:00 AM"),
		image: "/zombies/jumping-jack.webp",
		description:
			"Jumping Jacks are special enemies appearing on the map Die Rise. Similar in appearance to the Nova-6 Crawler, however, these zombies behave much differently.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("dieRise")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("jumpSwing")],
		spawnBehavior:
			"Jumping Jacks are round-specific, and when they spawn, these will be the only enemies on the map for that round. They first spawn on rounds 5-7, and then every 5 rounds after their first appearance. They will spawn in groups of two per player alive, with a new group spawning after a group has been killed.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/jumping-jack.mdx")),
	},
	brutus: {
		id: "brutus",
		title: "Brutus",
		state: Option.none(),
		releaseDate: new Date("April 16, 2013 12:00 AM"),
		image: "/zombies/brutus.webp",
		description:
			"Brutus is the boss zombie appearing on the maps Mob of the Dead and Blood of the Dead. Also known as the Warden of Alcatraz, tormenting the souls of the damned.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("mobOfTheDead"), getMapByKey("bloodOfTheDead")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing")],
		spawnBehavior:
			"In Mob of the Dead, Brutus first spawns after rounds 5 and 7 with normal zombies, and then randomly after that. He will appear again if players use the Mystery Box too much, spawning in and destroying the Mystery Box, then running after players; As well as if players are on the Golden Gate Bridge. In Blood of the Dead, Brutus first appears after entering the Prison for the first time via the Catwalk, randomly after that, and finally as the final boss in the Main Quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/brutus.mdx")),
	},
	ghost: {
		id: "ghost",
		title: "Ghost",
		state: Option.none(),
		releaseDate: new Date("July 13, 2013 12:00 AM"),
		image: "/zombies/ghost.webp",
		description:
			"The Ghost also known as The Witch is a special enemy appearing in the map Buried. These enemies can only be found within the Mansion of the map.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("buried")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("pointSteal")],
		spawnBehavior:
			"The Ghosts only spawn within the Mansion on the map and spawn infinitely until players leave the mansion.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/ghost.mdx")),
	},
	crusaderZombie: {
		id: "crusader-zombie",
		title: "Crusader Zombie",
		state: Option.none(),
		releaseDate: new Date("August 27, 2013 12:00 AM"),
		image: "/zombies/crusader-zombie.webp",
		description:
			"Crusader Zombies are a special enemy type on Origins, originating from the various Crusader Knights that fought in The Great War against the Apothicons alongside the Keepers.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("origins")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("generatorSiphon")],
		spawnBehavior:
			"Crusader Zombies will spawn out of blue portals in the ground during any 115 generator activation to try to stop you from powering the generator. They will also spawn every few rounds after at least one generator has been powered on, attempting to disable it by siphoning the element 115 energy from it. In The Crazy Place, these enemies will spawn naturally in place of regular zombies.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/crusader-zombie.mdx")),
	},
	panzersoldat: {
		id: "panzersoldat",
		title: "Panzersoldat",
		state: Option.none(),
		releaseDate: new Date("August 27, 2013 01:00 AM"),
		image: "/zombies/panzersoldat.webp",
		description:
			"The Panzersoldat is an elite enemy appearing on the maps Origins, Der Eisendrache, and Revelations, wearing an armored suit equipped with a flamethrower.",
		games: [getGameByKey("blackOps2")],
		maps: [getMapByKey("origins"), getMapByKey("derEisendrache"), getMapByKey("revelations")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head"), getWeakPointByKey("powerCore")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("flamethrower"),
			getZombieAttackByKey("clawGrab"),
			getZombieAttackByKey("empLauncher"),
		],
		spawnBehavior:
			"In Origins, the Panzersoldat will always spawn in on Round 8 as long as the door to No Man's Land has been opened. Otherwise, it will spawn on the next round after that door has been opened, and then every 3-5 rounds after that. In Der Eisendrache, the Panzersoldat will spawn on Round 12 and every 5-6 rounds after that. During the Main Quest, a Panzersoldat will always spawn in after returning to the present time, and multiple will spawn during the final boss fight. In Revelations, the Panzersoldat will be between rounds 18-21, and is also present during the final boss fight.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/panzersoldat.mdx")),
	},
	keepers: {
		id: "keepers",
		title: "Keepers",
		state: Option.none(),
		releaseDate: new Date("November 06, 2015 12:00 AM"),
		image: "/zombies/keeper.webp",
		description:
			"Keepers are a special enemy appearing on almost all maps in Black Ops 3 and play a crucial part in the events that happen within the Aether Storyline.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("shadowsOfEvil"), getMapByKey("revelations")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing")],
		spawnBehavior:
			"In Shadows of Evil, keepers spawn in during all rituals and during certain Main Quest steps. In Der Eisendrache, one keeper appears during the Main Quest to aid Primis in the return of the M.P.D. In Zetsubou No Shima, keepers spawn during the Skull of Nan Sapwe ritual. Finally, in Revelations, keepers spawn during rituals, certain Main Quest steps, and naturally throughout the rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/keepers.mdx")),
	},
	insanityElementals: {
		id: "insanity-elementals",
		title: "Insanity Elementals",
		state: Option.none(),
		releaseDate: new Date("November 06, 2015 01:00 AM"),
		image: "/zombies/insanity-elementals.webp",
		description:
			"Insanity Elementals, commonly referred to as Meatballs are special enemies appearing on the map Shadows of Evil, dropping from the sky and rolling into the fight.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("shadowsOfEvil")],
		type: "Special",
		speed: "Fast",
		weakPoints: [],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("explosion")],
		spawnBehavior:
			'Insanity Elementals spawn during a special round after the 2nd parasite round. During the "Capture the Flag" main quest step, they infinitely spawn until the flag has been charged and returned to the ritual site.',
		combatStrategy: Effect.promise(() => import("@/content/zombies/insanity-elementals.mdx")),
	},
	parasite: {
		id: "parasite",
		title: "Parasite",
		state: Option.none(),
		releaseDate: new Date("November 06, 2015 02:00 AM"),
		image: "/zombies/parasite.webp",
		description:
			"Parasites are a special enemy appearing on multiple maps throughout zombies. These zombies are the first flying enemy to appear in the franchise.",
		games: [getGameByKey("blackOps3"), getGameByKey("blackOps6")],
		maps: [
			getMapByKey("shadowsOfEvil"),
			getMapByKey("revelations"),
			getMapByKey("terminus"),
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
		],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["cryoFreeze"],
		attacks: [getZombieAttackByKey("projectileVomit")],
		spawnBehavior:
			"In Shadows of Evil, Parasites spawn during their own special round, out of destroyed heads of Margwas, harvest pods, and during certain Main Quest steps. In Revelations, they behave the same way, but appear red instead of yellow. In Black Ops 6, they spawn during the special round alongside Vermin and can evolve from Vermin that are left alive for too long.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/parasite.mdx")),
	},
	margwa: {
		id: "margwa",
		title: "Margwa",
		state: Option.none(),
		releaseDate: new Date("November 06, 2015 03:00 AM"),
		image: "/zombies/margwa.webp",
		description:
			"Margwas are an elite enemy appearing on the maps Shadows of Evil and Revelations. These three-headed beasts are intimidating threats that can be hard to deal with.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("shadowsOfEvil"), getMapByKey("revelations")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("glowingMouths")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("groundSlam")],
		spawnBehavior:
			"In Shadows of Evil, Margwas first spawns on Round 8. They will continue to spawn throughout the rounds after that and will appear in greater numbers during certain Main Quest steps, spawning infinitely during the final step of the Main Quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/margwa.mdx")),
	},
	skeleton: {
		id: "skeleton",
		title: "Skeleton",
		state: Option.none(),
		releaseDate: new Date("February 02, 2016 12:00 AM"),
		image: "/zombies/skeleton.webp",
		description:
			"Skeletons are a variant of the normal zombie also known as Spartoi in Ancient Evil. These enemies bring a cool new look to the normal zombie.",
		games: [getGameByKey("blackOps3"), getGameByKey("blackOps4")],
		maps: [getMapByKey("derEisendrache"), getMapByKey("ancientEvil")],
		type: "Normal",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing")],
		spawnBehavior:
			"In Der Eisendrache, Skeletons spawn as the dominant enemy in the My Brother's Keeper main quest boss fight. In Ancient Evil, these skeletons are known as Spartoi and spawn once you activate the Sentinel Artifact. These Spartoi will not be killed if the final blow is not a headshot; they will instead crumble to the ground and reconstruct up to two times before actually dying.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/skeleton.mdx")),
	},
	theCorruptedKeeper: {
		id: "the-corrupted-keeper",
		title: "The Corrupted Keeper",
		state: Option.none(),
		releaseDate: new Date("February 02, 2016 01:00 AM"),
		image: "/zombies/the-corrupted-keeper.webp",
		description:
			"The Corruputed Keeper is the final boss of the My Brother's Keeper main quest in Der Eisendrache, the first boss fight in the zombies franchise.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("derEisendrache")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("glowingSymbol")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("skullSummon"),
			getZombieAttackByKey("volcanoSummon"),
			getZombieAttackByKey("electricBurst"),
		],
		spawnBehavior:
			"The Corrupted Keeper spawns once you enter the boss arena for the My Brother's Keeper Main Quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/the-corrupted-keeper.mdx")),
	},
	spider: {
		id: "spider",
		title: "Spider",
		state: Option.none(),
		releaseDate: new Date("April 19, 2016 12:00 AM"),
		image: "/zombies/spider.webp",
		description:
			"Spiders are a special enemy originating from Zetsubou No Shima. These enemies have the appearance of a Black Widow, but with some interesting enhancements.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("zetsubouNoShima")],
		type: "Special",
		speed: "Fast",
		weakPoints: [],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("bite"), getZombieAttackByKey("webProjectile")],
		spawnBehavior:
			'In Zetsubou No Shima, spiders have their own dedicated special round, which can be on Round 5-7, then every 5 rounds after that. They will then start spawning within the normal rounds after Round 20. In Revelations, spiders exclusively spawn within the Apothicon and only every 2-3 rounds. Once they appear, they will spawn pretty frequently during that round, but not again until the next "Spider round" within the apothicon.',
		combatStrategy: Effect.promise(() => import("@/content/zombies/spider.mdx")),
	},
	thrasher: {
		id: "thrasher",
		title: "Thrasher",
		state: Option.none(),
		releaseDate: new Date("April 19, 2016 01:00 AM"),
		description:
			"Thrashers are an elite enemy originating from the map Zetsubou No Shima. These brutes are mutated zombies from spores completely transforming their appearance.",
		image: "/zombies/thrasher.webp",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("zetsubouNoShima")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head"), getWeakPointByKey("spores")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("powerfulMelee"), getZombieAttackByKey("toxicGas")],
		spawnBehavior:
			"Thrashers spawn from normal zombies affected by a fully-grown toxic spore's gas. They can also spawn naturally throughout rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/thrasher.mdx")),
	},
	giantSpider: {
		id: "giant-spider",
		title: "Giant Spider",
		state: Option.none(),
		releaseDate: new Date("April 19, 2016 02:00 AM"),
		image: "/zombies/giant-spider.webp",
		description:
			"The Giant Spider is the first boss you face in Zetsubou No Shima to obtain the Spider's tooth to build the Masamune wonder weapon.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("zetsubouNoShima")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("mouth")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("webProjectile"), getZombieAttackByKey("legStab")],
		spawnBehavior:
			"The Giant Spider spawns once you shoot the blue webbing with the KT-4, blocking the cave entrance by Speed Cola behind Lab A.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/giant-spider.mdx")),
	},
	giantThrasher: {
		id: "giant-thrasher",
		title: "Giant Thrasher",
		state: Option.none(),
		releaseDate: new Date("April 19, 2016 03:00 AM"),
		image: "/zombies/giant-thrasher.webp",
		description:
			"The Giant Thrasher is the final boss for the Seeds of Doubt main quest in Zetsubou No Shima, appearing more unique than other Thrashers on the map.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("zetsubouNoShima")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("spores")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("vineSlam")],
		spawnBehavior:
			"The Giant Thrasher spawns once the elevator has been repaired and taken the players underground.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/giant-thrasher.mdx")),
	},
	valkyrieDrone: {
		id: "valkyrie-drone",
		title: "Valkyrie Drone",
		state: Option.none(),
		releaseDate: new Date("July 12, 2016 12:00 AM"),
		image: "/zombies/valkyrie-drone.webp",
		description:
			"Valkyrie Drones are a special enemy type originating from the map Gorod Krovi. These enemies appear as flying drones with three tentacle-like arms and a red eye.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("gorodKrovi")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("redCamera")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("lightningBeam"), getZombieAttackByKey("selfDestruct")],
		spawnBehavior:
			"Valkyrie Drones spawn between rounds 9-12, then every 8-10 rounds after that acting as the maps special round. When the special round starts, the map will have a slight blue hue to it, and brief electricity will encircle the screen.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/valkyrie-drone.mdx")),
	},
	mangler: {
		id: "mangler",
		title: "Mangler",
		state: Option.none(),
		releaseDate: new Date("July 12, 2016 01:00 AM"),
		image: "/zombies/mangler.webp",
		description:
			"Manglers are a special type of enemy originating from the map Gorod Krovi. These enemies appear as armored russian super-soldiers armed with an arm cannon.",
		games: [getGameByKey("blackOps3"), getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6")],
		maps: [
			getMapByKey("gorodKrovi"),
			getMapByKey("firebaseZ"),
			getMapByKey("mauerDerToten"),
			getMapByKey("forsaken"),
			getMapByKey("libertyFalls"),
			getMapByKey("terminus"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
		],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head"), getWeakPointByKey("armCannon")],
		elementalWeakness: ["napalmBurst"],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("cannonBlast")],
		spawnBehavior:
			"Manglers spawn out of window barriers just like normal zombies and will spawn through the rounds with normal zombies as well. Up to four manglers can spawn at a time.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/mangler.mdx")),
	},
	dragon: {
		id: "dragon",
		title: "Dragon",
		state: Option.none(),
		releaseDate: new Date("July 12, 2016 02:00 AM"),
		image: "/zombies/dragon.webp",
		description:
			"The Dragon is the first boss appearing on the map Gorod Krovi. This enemy appears as main dragon seen throughout the map breathing fire down on the battlefield.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("gorodKrovi")],
		type: "Boss",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("redGlowingSpots")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("dragonFire")],
		spawnBehavior:
			"The Dragon spawns in the moment you enter the map and can be seen flying around and periodically landing on certain areas to breathe fire.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/dragon.mdx")),
	},
	nikolaiMech: {
		id: "nikolai-mech",
		title: "Nikolai Mech",
		state: Option.none(),
		releaseDate: new Date("July 12, 2016 03:00 AM"),
		image: "/zombies/nikolai-mech.webp",
		description:
			"The Nikolai Mech is the final boss enemy in the map Gorod Krovi. The mech hosts Ultimis Nikolai inside who is the controller of the mech while being drunk.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("gorodKrovi")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("powerCores")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("harpoonBarrage")],
		spawnBehavior:
			"The Nikolai Mech spawns in after starting the final encounter of the Gorod Krovi main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/nikolai-mech.mdx")),
	},
	fury: {
		id: "fury",
		title: "Fury",
		state: Option.none(),
		releaseDate: new Date("October 06, 2016 12:00 AM"),
		image: "/zombies/fury.webp",
		description:
			"Furies are a special enemy originating from the map Revelations in Black Ops 3. These enemies are unique in appearance while having similar behavior to the Insanity Elementals.",
		games: [getGameByKey("blackOps3")],
		maps: [getMapByKey("revelations")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing")],
		spawnBehavior:
			"Furies spawn on the second special round, then every special round after that. They will also spawn during the first, second, and final Corruption Engine overrides that the player activates.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/fury.mdx")),
	},
	fireCatalyst: {
		id: "fire-catalyst",
		title: "Fire Catalyst",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 12:00 AM"),
		image: "/zombies/fire-catalyst.webp",
		description:
			"Fire Catalysts are one of the four variants of catalyst zombies, originating from the map Voyage of Despair, and appearing similar to the Napalm Zombie from Shangri-La.",
		games: [getGameByKey("blackOps4")],
		maps: [
			getMapByKey("voyageOfDespair"),
			getMapByKey("ix"),
			getMapByKey("deadOfTheNight"),
			getMapByKey("ancientEvil"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("fieryExplosion")],
		spawnBehavior:
			"Fire Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/fire-catalyst.mdx")),
	},
	poisonCatalyst: {
		id: "poison-catalyst",
		title: "Poison Catalyst",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 01:00 AM"),
		image: "/zombies/poison-catalyst.webp",
		description:
			"Poison Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with a focus on toxic area denial.",
		games: [getGameByKey("blackOps4")],
		maps: [
			getMapByKey("voyageOfDespair"),
			getMapByKey("ix"),
			getMapByKey("deadOfTheNight"),
			getMapByKey("ancientEvil"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("poisonAura")],
		spawnBehavior:
			"Poison Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/poison-catalyst.mdx")),
	},
	waterCatalyst: {
		id: "water-catalyst",
		title: "Water Catalyst",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 02:00 AM"),
		image: "/zombies/water-catalyst.webp",
		description:
			"Water Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with a focus on buffing other zombies.",
		games: [getGameByKey("blackOps4")],
		maps: [
			getMapByKey("voyageOfDespair"),
			getMapByKey("ix"),
			getMapByKey("deadOfTheNight"),
			getMapByKey("ancientEvil"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("zombieBuff")],
		spawnBehavior:
			"Water Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/water-catalyst.mdx")),
	},
	lightningCatalyst: {
		id: "lightning-catalyst",
		title: "Lightning Catalyst",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 03:00 AM"),
		image: "/zombies/lightning-catalyst.webp",
		description:
			"Lightning Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with similarities to the Shrieker Zombie.",
		games: [getGameByKey("blackOps4")],
		maps: [
			getMapByKey("voyageOfDespair"),
			getMapByKey("ix"),
			getMapByKey("deadOfTheNight"),
			getMapByKey("ancientEvil"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("sonicScreech")],
		spawnBehavior:
			"Lightning Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/lightning-catalyst.mdx")),
	},
	stoker: {
		id: "stoker",
		title: "Stoker",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 04:00 AM"),
		image: "/zombies/stoker.webp",
		description:
			"The Stoker is an elite enemy originating on the map Voyage of Despair in Black Ops 4, wielding a shovel and appearing as a fiery zombie spawned from hell.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("voyageOfDespair")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [
			getWeakPointByKey("head"),
			getWeakPointByKey("encrustedLava"),
			getWeakPointByKey("redGlowingSpots"),
		],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("fireball")],
		spawnBehavior: "Stokers spawn in groups of 2-3 and will attack the player with a shovel swing.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/stoker.mdx")),
	},
	blightfather: {
		id: "blightfather",
		title: "Blightfather",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 05:00 AM"),
		image: "/zombies/blightfather.webp",
		description:
			"The Blightfather is an elite enemy originating from the map Voyage of Despair, appearing as a tall and mutated arachnid similar with long legs.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("voyageOfDespair"), getMapByKey("ix"), getMapByKey("ancientEvil")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("backSacs"), getWeakPointByKey("elbowSacs")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("meleeSwing"),
			getZombieAttackByKey("homingVomit"),
			getZombieAttackByKey("tongueGrab"),
		],
		spawnBehavior:
			"The Blightfather will not spawn until Round 15 on any map and spawns from a normal zombie by ripping apart the zombie like a parasite and crawling out of the zombie's mouth, quickly growing to full size.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/blightfather.mdx")),
	},
	eyeOfMalice: {
		id: "eye-of-malice",
		title: "Eye of Malice",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 06:00 AM"),
		image: "/zombies/eye-of-malice.webp",
		description:
			"The Eye of Malice and Despair is the final boss of the map Voyage of Despair's Abandon Ship main quest, also known as the Sky-Eye.",
		type: "Boss",
		speed: "Slow",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("voyageOfDespair")],
		weakPoints: [getWeakPointByKey("eyePupil")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("eyeBeam")],
		spawnBehavior:
			"The Eye of Malice spawns once you enter the final encounter and place the Sentinel Artifact inside of the Iceberg.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/eye-of-malice.mdx")),
	},
	tiger: {
		id: "tiger",
		title: "Tiger",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 07:00 AM"),
		image: "/zombies/tiger.webp",
		description:
			"The Tiger is a special enemy originating from the map IX in Black Ops 4, similar to Hellhounds however having slightly higher health.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ix")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("bite"), getZombieAttackByKey("lunge")],
		spawnBehavior:
			"Tigers spawn during the special round of the map IX, as champions of one of the gods, and during specific steps in the main quest. They will also spawn in with normal zombies starting on Round 8.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/tiger.mdx")),
	},
	destroyer: {
		id: "destroyer",
		title: "Destroyer",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 08:00 AM"),
		image: "/zombies/destroyer.webp",
		description:
			"The Destroyer is a special enemy originating from the map IX in Black Ops 4, wielding dual-axes while wearing heavy armor that must be destroyed.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ix")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("axeThrow")],
		spawnBehavior:
			"Destroyers spawn during the special round on the map IX, as champions of one of the gods, and during specific parts of the main quest. They will also spawn with normal zombies starting on Round 8.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/destroyer.mdx")),
	},
	marauder: {
		id: "marauder",
		title: "Marauder",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 09:00 AM"),
		image: "/zombies/marauder.webp",
		description:
			"The Marauder is a special enemy originating from the map IX in Black Ops 4 wielding metallic claws with little to no armor.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ix")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("rapidSlashes"), getZombieAttackByKey("heavyLeap")],
		spawnBehavior:
			"Marauders spawn in during the special round of the map IX, as champions of one of the gods, and during specific steps of the main quest. They also begin spawning with normal zombies on Round 8.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/marauder.mdx")),
	},
	furyAndWrath: {
		id: "fury-and-wrath",
		title: "Fury & Wrath",
		state: Option.none(),
		releaseDate: new Date("October 12, 2018 10:00 AM"),
		image: "/zombies/fury-and-wrath.webp",
		description:
			"Fury and Wrath are the final bosses in the map IX's main quest Venerated Warrior, appearing as two war elephants with heavy armor.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ix")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("foreheadCrystal"), getWeakPointByKey("redGlowingSpots")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("charge")],
		spawnBehavior:
			"Fury will spawn in after Phase 1 of the boss fight is complete defeating all the Gladiators and Tigers. Wrath will spawn in once Fury is defeated and his essence is transfered to Wrath.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/fury-and-wrath.mdx")),
	},
	nosferatu: {
		id: "nosferatu",
		title: "Nosferatu",
		state: Option.none(),
		releaseDate: new Date("December 11, 2018 12:00 AM"),
		image: "/zombies/nosferatu.webp",
		description:
			"The Nosferatu is a special enemy orignating from the map Dead of the Night in Black Ops 4, appearing as a vampire like zombie.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("deadOfTheNight")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("vampiricMelee"), getZombieAttackByKey("megaBite")],
		spawnBehavior:
			"The Nosferatu will begin spawning naturally in the later rounds and will be spawned during specific points of the main quest. The Crimson Nosferatu will begin spawning naturally in the 30s and can also be spawned from one of the Allistair Annihilators upgrade quest steps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/nosferatu.mdx")),
	},
	werewolf: {
		id: "werewolf",
		title: "Werewolf",
		state: Option.none(),
		releaseDate: new Date("December 11, 2018 01:00 AM"),
		image: "/zombies/werewolf.webp",
		description:
			"The Werewolf is an elite enemy originating from the map Dead of the Night in Black Ops 4, these enemies are fierce, agile, and strong posing a true threat.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("deadOfTheNight")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("pounce")],
		spawnBehavior:
			"The Werewolf will not spawn until Round 15, however one Werewolf is always present in The Forest until it is defeated.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/werewolf.mdx")),
	},
	shadowWerewolf: {
		id: "shadow-werewolf",
		title: "Shadow Werewolf",
		state: Option.none(),
		releaseDate: new Date("December 11, 2018 02:00 AM"),
		image: "/zombies/shadow-werewolf.webp",
		description:
			"The Shadow Werewolf is the final boss of the map Dead of the Nights main quest Trial by Ordeal, appearing as a bigger, stronger, and faster Werewolf.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("deadOfTheNight")],
		type: "Boss",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("chest")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("charge")],
		spawnBehavior:
			"The Shadow Werewolf will spawn in once you have started the final encounter and entered the boss arena.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/shadow-werewolf.mdx")),
	},
	gegenees: {
		id: "gegenees",
		title: "Gegenees",
		state: Option.none(),
		releaseDate: new Date("March 26, 2019 12:00 AM"),
		image: "/zombies/gegenees.webp",
		description:
			"The Gegenees is an elite enemy originating on the map Ancient Evil in Black Ops 4, appearing a six-armed giant wielding a spear, sword, and shield.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ancientEvil")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("redGlowingSpots")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("swordSwing"),
			getZombieAttackByKey("spearThrow"),
			getZombieAttackByKey("shieldBlind"),
		],
		spawnBehavior:
			"The Gegenees will begin spawning on Round 15, however one will spawn when picking up the Golden Bridle and when shooting down the bird cage within the Omphalos.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/gegenees.mdx")),
	},
	pegasus: {
		id: "pegasus",
		title: "Pegasus",
		state: Option.none(),
		releaseDate: new Date("March 26, 2019 01:00 AM"),
		image: "/zombies/pegasus.webp",
		description:
			"Pegasus is the first boss faced in the map Ancient Evil's main quest Greek Tragedy, appearing as the mythical steed of Perseus in all its glory.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ancientEvil")],
		type: "Boss",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("body")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("lightningStrike")],
		spawnBehavior:
			"Pegasus spawns once you obtain the Sentinel Artifact, but does not become a threat until the final encounter.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/pegasus.mdx")),
	},
	perseus: {
		id: "perseus",
		title: "Perseus",
		state: Option.none(),
		releaseDate: new Date("March 26, 2019 02:00 AM"),
		image: "/zombies/perseus.webp",
		description:
			"Perseus is the final boss in the map Ancient Evil's main quest Greek Tragedy, also known as the Zombie Warlord and the son of Zeus.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("ancientEvil")],
		type: "Boss",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("body")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("flamingSpears")],
		spawnBehavior: "Perseus spawns in during the final encounter of the main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/perseus.mdx")),
	},
	adamUnit: {
		id: "adam-unit",
		title: "A.D.A.M. Unit",
		state: Option.none(),
		releaseDate: new Date("July 09, 2019 12:00 AM"),
		image: "/zombies/adam-unit.webp",
		description:
			"The A.D.A.M. Unit is a unique variant of the standard zombie originating on the map Alpha Omega in Black Ops 4, being tankier, faster, and robotic.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("alphaOmega")],
		type: "Normal",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing")],
		spawnBehavior:
			"A.D.A.M. Units begin spawning after the power is turned on and during specific steps of the main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/adam-unit.mdx")),
	},
	nova6Bomber: {
		id: "nova-6-bomber",
		title: "Nova-6 Bomber",
		state: Option.none(),
		releaseDate: new Date("July 09, 2019 01:00 AM"),
		image: "/zombies/nova-6-bomber.webp",
		description:
			"The Nova-6 Bomber is a special unique variant of the Nova-6 Crawler originating on the map Alpha Omega in Black Ops 4, glowing yellow with spikes on its back.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("alphaOmega")],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("meleeSwing"),
			getZombieAttackByKey("zombieBuff"),
			getZombieAttackByKey("novaGas"),
		],
		spawnBehavior:
			"Nova-6 Bombers begin spawning with normal zombies once the player has activated the Pack-a-Punch machine.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/nova-6-bomber.mdx")),
	},
	joltingJack: {
		id: "jolting-jack",
		title: "Jolting Jack",
		state: Option.none(),
		releaseDate: new Date("July 09, 2019 02:00 AM"),
		image: "/zombies/jolting-jack.webp",
		description:
			"The Jolting Jack is a special variant of the Nova-6 Crawler originating on the map Alpha Omega in Black Ops 4, having a blue aura of electricity around them.",
		games: [getGameByKey("blackOps4")],
		maps: [getMapByKey("alphaOmega")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("lightningBolts")],
		spawnBehavior:
			"Jolting Jacks will begin spawning in with normal zombies once the Pack-a-Punch machine has been activated.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/jolting-jack.mdx")),
	},
	armoredZombie: {
		id: "armored-zombie",
		title: "Armored Zombie",
		state: Option.none(),
		releaseDate: new Date("November 13, 2020 12:00 AM"),
		image: "/zombies/armored-zombie.webp",
		description:
			"The Armored Zombie is a variant of the standard zombie originating on the map Die Maschine in Black Ops: Cold War, having light armor on compared to standard zombies.",
		games: [getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6"), getGameByKey("blackOps7")],
		maps: [
			getMapByKey("dieMaschine"),
			getMapByKey("firebaseZ"),
			getMapByKey("mauerDerToten"),
			getMapByKey("forsaken"),
			getMapByKey("libertyFalls"),
			getMapByKey("terminus"),
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
			getMapByKey("ashesOfTheDamned"),
		],
		type: "Normal",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("fleshThrow")],
		spawnBehavior:
			"Armored Zombies will begin spawning on Round 10 with normal zombies and will spawn more frequently as the round increases.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/armored-zombie.mdx")),
	},
	heavyZombie: {
		id: "heavy-zombie",
		title: "Heavy Zombie",
		state: Option.none(),
		releaseDate: new Date("November 13, 2020 01:00 AM"),
		image: "/zombies/heavy-zombie.webp",
		description:
			"The Heavy Zombie is a variant of the standard zombie originating on the map Die Maschine in Black Ops: Cold War, wearing heavy armor compared to other zombies.",
		games: [getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6"), getGameByKey("blackOps7")],
		maps: [
			getMapByKey("dieMaschine"),
			getMapByKey("firebaseZ"),
			getMapByKey("mauerDerToten"),
			getMapByKey("forsaken"),
			getMapByKey("libertyFalls"),
			getMapByKey("terminus"),
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
			getMapByKey("ashesOfTheDamned"),
		],
		type: "Normal",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("fleshThrow")],
		spawnBehavior:
			"Heavy Zombies begin spawning with normal zombies at and after Round 20 and will spawn more frequently as the rounds increase.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/heavy-zombie.mdx")),
	},
	plaguehound: {
		id: "plaguehound",
		title: "Plaguehound",
		state: Option.none(),
		releaseDate: new Date("November 13, 2020 02:00 AM"),
		image: "/zombies/plaguehound.webp",
		description:
			"The Plaguehound is a variant of the Hellhound originating on the map Die Maschine in Black Ops: Cold War, being heavily mutated with Nova 6 Gas compared to hellhounds.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("dieMaschine"), getMapByKey("forsaken")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["napalmBurst"],
		attacks: [
			getZombieAttackByKey("bite"),
			getZombieAttackByKey("lunge"),
			getZombieAttackByKey("novaGas"),
		],
		spawnBehavior:
			"Plaguehounds spawn during the special round on Die Maschine and Forsaken, while also spawning in with normal zombies in the later rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/plaguehound.mdx")),
	},
	megaton: {
		id: "megaton",
		title: "Megaton",
		state: Option.none(),
		releaseDate: new Date("November 13, 2020 03:00 AM"),
		image: "/zombies/megaton.webp",
		description:
			"The Megaton is the first elite enemy appearing in Black Ops: Cold War originating from the map Die Maschine, appearing as a radioactive mutated juggernaut of a zombie.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("dieMaschine"), getMapByKey("mauerDerToten"), getMapByKey("forsaken")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["deadWire"],
		attacks: [
			getZombieAttackByKey("powerfulMelee"),
			getZombieAttackByKey("radioactiveBlast"),
			getZombieAttackByKey("radioactiveFlurry"),
		],
		spawnBehavior:
			"Megatons spawn two rounds after the Pack-a-Punch has been activated on Die Maschine or on Wave 15 if the power has not been restored. In Mauer Der Toten, Megatons spawn during one of the steps of the main quest. In Forsaken, Megatons spawn during the lockdown step when obtaining Samantha's Ballad easter egg song.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/megaton.mdx")),
	},
	mimic: {
		id: "mimic",
		title: "Mimic",
		state: Option.none(),
		releaseDate: new Date("February 04, 2021 12:00 AM"),
		image: "/zombies/shock-mimic.webp",
		description:
			"The Mimic is a special enemy originating in Black Ops: Cold War, shapeshifting into objects to trick the player before attack them. The Shock Mimic is a variant appearing in Black Ops 6 Zombies.",
		games: [getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6")],
		maps: [
			getMapByKey("firebaseZ"),
			getMapByKey("mauerDerToten"),
			getMapByKey("forsaken"),
			getMapByKey("theTomb"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("mouth")],
		elementalWeakness: ["brainRot", "cryoFreeze"],
		attacks: [
			getZombieAttackByKey("meleeSwing"),
			getZombieAttackByKey("tentacleGrab"),
			getZombieAttackByKey("shockBurst"),
		],
		spawnBehavior:
			"In Black Ops: Cold War, Mimics can spawn with normal zombies during the middle and later rounds, or as a piece of loot on the ground that, when approached transforms into a Mimic. On The Tomb, Mimics return as a variant called Shock Mimics, with the first one spawning in on Round 8, and periodically after that as ground loot or with zombies. They will also spawn during the Golden Armor side quest on The Tomb as HVTs.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/mimic.mdx")),
	},
	orda: {
		id: "orda",
		title: "Orda",
		state: Option.none(),
		releaseDate: new Date("February 04, 2021 01:00 AM"),
		image: "/zombies/orda.webp",
		description:
			"Orda is a boss type zombie originating on Firebase Z in Black Ops: Cold War, appearing as an elder god from the Dark Aether.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("firebaseZ")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("mouth")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("powerfulMelee"), getZombieAttackByKey("fireballs")],
		spawnBehavior:
			"Ordas can spawn during the third Dimensional Tear Assault waves in Firebase Z, and an Orda is also the final boss of the main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/orda.mdx")),
	},
	tormentors: {
		id: "tormentors",
		title: "Tormentors",
		state: Option.none(),
		releaseDate: new Date("July 15, 2021 12:00 AM"),
		image: "/zombies/tormentor.webp",
		description:
			"Tormentors are a special enemy type originating on the map Mauer Der Toten in Black Ops: Cold War, appearing a red crystalized zombie.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("mauerDerToten"), getMapByKey("forsaken")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("selfDestruct")],
		spawnBehavior:
			"In Mauer Der Toten, Tormentors spawn during the special round and will begin spawning with normal zombies at Round 15 and onward. In Forsaken, Tormentors only spawn with normal zombies on Round 15 and onward.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/tormentors.mdx")),
	},
	disciple: {
		id: "disciple",
		title: "Disciple",
		state: Option.none(),
		releaseDate: new Date("July 15, 2021 01:00 AM"),
		image: "/zombies/disciple.webp",
		description:
			"Disciples are a special enemy type originating on the map Mauer Der Toten in Black Ops Cold War, appearing as summoners from the Dark Aether. ",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("mauerDerToten"), getMapByKey("forsaken")],
		type: "Special",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["deadWire"],
		attacks: [getZombieAttackByKey("zombieBuff"), getZombieAttackByKey("lifeDrain")],
		spawnBehavior:
			"In Mauer Der Toten, the first Disciple is encountered during the Pack-a-Punch ritual to activate it; afterwards, they will appear periodically. In Forsaken, Disciples will begin spawning in the later rounds periodically.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/disciple.mdx")),
	},
	tempest: {
		id: "tempest",
		title: "Tempest",
		state: Option.none(),
		releaseDate: new Date("July 15, 2021 02:00 AM"),
		image: "/zombies/tempest.webp",
		description:
			"Tempest are a special enemy type originating on the map Mauer Der Toten in Black Ops Cold War, appearing a smaller purple variant of the Avogadro.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("mauerDerToten")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["brainRot"],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("lightningBolts")],
		spawnBehavior:
			"In Mauer Der Toten, the first Tempests you will encounter during the quest to turn on the power, they will also with normal zombies in the later rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/tempest.mdx")),
	},
	krasnySoldat: {
		id: "krasny-soldat",
		title: "Krasny Soldat",
		state: Option.none(),
		releaseDate: new Date("July 15, 2021 03:00 AM"),
		image: "/zombies/krasny-soldat.webp",
		description:
			"The Krasny Soldat is an elite variant of the Panzersoldat originating on the map Mauer Der Toten in Black Ops Cold War, adopting a red color scheme for the Omega Group.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("mauerDerToten")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head"), getWeakPointByKey("powerCore")],
		elementalWeakness: ["cryoFreeze"],
		attacks: [
			getZombieAttackByKey("meleeSwing"),
			getZombieAttackByKey("flamethrower"),
			getZombieAttackByKey("molotovCannon"),
		],
		spawnBehavior:
			"In Mauer Der Toten, the first Krasny Soldat spawns on Round 10, then will spawn periodically after that point. In Forsaken, the Krasny Soldat only appears in the final boss fight of the main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/krasny-soldat.mdx")),
	},
	valentina: {
		id: "valentina",
		title: "Valentina",
		state: Option.none(),
		releaseDate: new Date("July 15, 2021 04:00 AM"),
		image: "/zombies/valentina.webp",
		description:
			"Valentina is the final boss in the map Mauer Der Toten in Black Ops Cold War, appearing similar to the Tormentors in appearance however without being turned.",
		games: [getGameByKey("blackOpsColdWar")],
		maps: [getMapByKey("mauerDerToten")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("crystalBarrage"),
			getZombieAttackByKey("healSummon"),
			getZombieAttackByKey("aetherRelease"),
		],
		spawnBehavior:
			"Valentina spawns in during the final encounter of the main quest Tin Man Heart.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/valentina.mdx")),
	},
	abomination: {
		id: "abomination",
		title: "Abomination",
		state: Option.none(),
		releaseDate: new Date("October 07, 2021 12:00 AM"),
		image: "/zombies/abomination.webp",
		description:
			"The Abomination is an elite type of enemy originating on the map Forsaken in Black Ops Cold war, appearing a three-headed mutated zombie similar to the Margwa.",
		games: [getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6")],
		maps: [getMapByKey("forsaken"), getMapByKey("libertyFalls"), getMapByKey("shatteredVeil")],
		type: "Elite",
		speed: "Slow",
		weakPoints: [getWeakPointByKey("glowingMouths")],
		elementalWeakness: ["napalmBurst", "brainRot"],
		attacks: [
			getZombieAttackByKey("bite"),
			getZombieAttackByKey("charge"),
			getZombieAttackByKey("lightningBeam"),
		],
		spawnBehavior:
			"In Forsaken, the abomination first spawns when entering The Amplifier and then periodically after that. In Liberty Falls, the abomination first spawns on Round 15, during specific main quest steps, and periodically after the first spawn. In Shattered Veil, the abomination only spawns during the Ray Gun MKII-W upgrade quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/abomination.mdx")),
	},
	theForsaken: {
		id: "the-forsaken",
		title: "The Forsaken",
		state: Option.none(),
		releaseDate: new Date("October 07, 2021 01:00 AM"),
		image: "/zombies/the-forsaken.webp",
		description:
			"The Forsaken is the final boss of the map Forsaken in Black Ops Cold War, appearing as one of the elder gods of the Dark Aether.",
		games: [getGameByKey("blackOpsColdWar"), getGameByKey("blackOps6")],
		maps: [getMapByKey("forsaken"), getMapByKey("reckoning")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [
			getWeakPointByKey("head"),
			getWeakPointByKey("shoulders"),
			getWeakPointByKey("stomach"),
			getWeakPointByKey("powerCore"),
		],
		elementalWeakness: ["napalmBurst", "cryoFreeze"],
		attacks: [
			getZombieAttackByKey("groundSlam"),
			getZombieAttackByKey("eyeBeam"),
			getZombieAttackByKey("slowField"),
			getZombieAttackByKey("energyOrbs"),
			getZombieAttackByKey("electricalBolts"),
			getZombieAttackByKey("powerfulMelee"),
		],
		spawnBehavior:
			"The Forsaken spawns once you have entered the final encounter arena. In Reckoning, the forsaken is the dark entity you must defeat in order to obtain the Gorgofex wonder weapon, in the form of an Uber Klaus.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/the-forsaken.mdx")),
	},
	vermin: {
		id: "vermin",
		title: "Vermin",
		state: Option.none(),
		releaseDate: new Date("October 25, 2024 12:00 AM"),
		image: "/zombies/vermin.webp",
		description:
			"Vermin are large, spider-like ravenous scuttlers with a central thorax that seems to take the form of a screaming human head. Originating on the map Liberty Falls and Terminus in Black Ops 6.",
		games: [getGameByKey("blackOps6")],
		maps: [
			getMapByKey("libertyFalls"),
			getMapByKey("terminus"),
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
		],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["cryoFreeze"],
		attacks: [getZombieAttackByKey("bite"), getZombieAttackByKey("lunge")],
		spawnBehavior:
			"Vermin serve as the special round on Liberty Falls, and spawn infrequently on non-special rounds. In all other maps, Vermin appear periodically or during specific quest steps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/vermin.mdx")),
	},
	amalgam: {
		id: "amalgam",
		title: "Amalgam",
		state: Option.none(),
		releaseDate: new Date("October 25, 2024 01:00 AM"),
		image: "/zombies/amalgam.webp",
		description:
			"The Amalgam is an elite enemy originating from the map Terminus in Black Ops 6, appearing as a multi-armed and multi-legged mutation of the original zombie.",
		games: [getGameByKey("blackOps6")],
		maps: [
			getMapByKey("terminus"),
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
		],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("glowingHeads")],
		elementalWeakness: ["deadWire", "shadowRift"],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("tongueGrab")],
		spawnBehavior:
			"On Terminus, Citadelle Des Morts, and The Tomb, the Amalgam will first spawn on Round 16. On Citadelle Des Morts, The Tomb, Shattered Veil, and Reckoning, Amalgams can spawn from Doppelghast, which may evolve into Amalgams if left alive for too long. They will also spawn in specific main quest steps in all of these maps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/amalgam.mdx")),
	},
	nathan: {
		id: "nathan",
		title: "Nathan",
		state: Option.none(),
		releaseDate: new Date("October 25, 2024 02:00 AM"),
		image: "/zombies/nathan.webp",
		description:
			"Nathan Aguinaldo is a mini-boss originating on the map Terminus in Black Ops 6, serving as Maya's younger brother who was experimented on by Dr. Modi for Project Janus.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("terminus")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("glowingHeads")],
		elementalWeakness: ["deadWire", "shadowRift"],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("tongueGrab")],
		spawnBehavior:
			"Nathan spawns in as a mini-boss once you enter the code into the keypad in the Bio-Lab, freeing him.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/nathan.mdx")),
	},
	patient13: {
		id: "patient-13",
		title: "Patient 13",
		state: Option.none(),
		releaseDate: new Date("October 25, 2024 03:00 AM"),
		image: "/zombies/patient-13.webp",
		description:
			"Patient 13 is the final boss on the map Terminus in Black Ops 6, appearing as a giant mutated kraken like creature who was another experiment of Dr. Modi known as Owen Guthrie.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("terminus")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [
			getWeakPointByKey("redCysts"),
			getWeakPointByKey("glowingTentacles"),
			getWeakPointByKey("mouth"),
			getWeakPointByKey("eyes"),
		],
		elementalWeakness: [
			"deadWire",
			"shadowRift",
			"brainRot",
			"napalmBurst",
			"cryoFreeze",
			"lightMend",
		],
		attacks: [
			getZombieAttackByKey("groundSlam"),
			getZombieAttackByKey("sweepingSlam"),
			getZombieAttackByKey("tongueGrab"),
			getZombieAttackByKey("aetherRelease"),
		],
		spawnBehavior:
			"Patient 13 spawns once you have entered the final encounter arena, after completing majority of the main quest.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/patient-13.mdx")),
	},
	doppelghast: {
		id: "doppelghast",
		title: "Doppelghast",
		state: Option.none(),
		releaseDate: new Date("December 05, 2024 12:00 AM"),
		image: "/zombies/doppelghast.webp",
		description:
			"Doppelghasts are violent and display erratic and unsettling movement, as if each head is independently fighting for control of its body. Originating from the map Citadelle Des Morts in Black Ops 6.",
		games: [getGameByKey("blackOps6"), getGameByKey("blackOps7")],
		maps: [
			getMapByKey("citadelleDesMorts"),
			getMapByKey("theTomb"),
			getMapByKey("shatteredVeil"),
			getMapByKey("reckoning"),
			getMapByKey("ashesOfTheDamned"),
		],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["lightMend"],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("needleBarrage")],
		spawnBehavior:
			"Doppelghasts will first spawn on Round 13 on Citadelle Des Morts and Round 14 on The Tomb. Doppelghasts on Citadelle Des Morts, The Tomb, Shattered Veil, and Reckoning can spawn as an evolution of parasites if they are left alive too long and consume a zombie.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/doppelghast.mdx")),
	},
	theGuardian: {
		id: "the-guardian",
		title: "The Guardian",
		state: Option.none(),
		releaseDate: new Date("December 05, 2024 01:00 AM"),
		image: "/zombies/the-guardian.webp",
		description:
			"The Guardian is a colossal stone golem that served as the guardian of the Obscurus Altilium also known as the Amulet. Originating from the map Citadelle Des Morts in Black Ops 6.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("citadelleDesMorts")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [
			getWeakPointByKey("chest"),
			getWeakPointByKey("shoulders"),
			getWeakPointByKey("forearms"),
			getWeakPointByKey("calves"),
		],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("lavaBalls"),
			getZombieAttackByKey("groundStomp"),
			getZombieAttackByKey("hammerSlam"),
			getZombieAttackByKey("leapingHammer"),
		],
		spawnBehavior:
			"The Guardian spawns once you use the Guardian Key on the statue in the Town Square.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/the-guardian.mdx")),
	},
	sentinelArtifact: {
		id: "sentinel-artifact",
		title: "Sentinel Artifact",
		state: Option.none(),
		releaseDate: new Date("January 28, 2025 12:00 AM"),
		image: "/zombies/sentinel-artifact.webp",
		description:
			"The Sentinel Artifact is a powerful relic with a history spanning eons, originating from the Chaos Story in Voyage of Desiar, and appearing as a boss in Black Ops 6 Zombies.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("theTomb")],
		type: "Boss",
		speed: "Slow",
		weakPoints: [],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("laser")],
		spawnBehavior:
			"The Sentinel Artifact spawns in once you activate it by trying to take it in the final encounter.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/sentinel-artifact.mdx")),
	},
	toxicZombies: {
		id: "toxic-zombies",
		title: "Toxic Zombies",
		state: Option.none(),
		releaseDate: new Date("April 02, 2025 12:00 AM"),
		image: "/zombies/toxic-zombie.webp",
		description:
			"Toxic Zombies are glowing ghouls identifiable by their greenish hue and skeletal exterior intent on sprinting toward their prey before exploding. Originating on the map Shattered Veil in Black Ops 6.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("shatteredVeil"), getMapByKey("reckoning")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("acidExplosion")],
		spawnBehavior:
			"Toxic Zombies spawn during the special round on Shattered Veil, while also periodically spawning outside of these rounds and during specific main quest steps. On Reckoning, Toxic Zombies will only spawn out of the test tubes during one of the main quest steps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/toxic-zombies.mdx")),
	},
	elderDisciple: {
		id: "elder-disciple",
		title: "Elder Disciple",
		state: Option.none(),
		releaseDate: new Date("April 02, 2025 01:00 AM"),
		image: "/zombies/elder-disciple.webp",
		description:
			"Elder Disciples are strange, floating apparitions gaining strength as they empower the zombies around them while summoning more undead to join the battle.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("shatteredVeil"), getMapByKey("reckoning")],
		type: "Special",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: ["deadWire", "lightMend"],
		attacks: [getZombieAttackByKey("zombieBuff"), getZombieAttackByKey("zombieEvolution")],
		spawnBehavior:
			"Elder Disciples spawn on Round 16, then around every 3 Rounds after that. On Reckoning, Elder Disciple will only spawn out of one of the test tubes during one of the main quest steps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/elder-disciple.mdx")),
	},
	zRex: {
		id: "z-rex",
		title: "Z-Rex",
		state: Option.none(),
		releaseDate: new Date("April 02, 2025 02:00 AM"),
		image: "/zombies/z-rex.webp",
		description:
			"The Z-Rex is a massive reanimated dinosaur revived by residual temporal energy, originating on Shattered Veil in Black Ops 6.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("shatteredVeil")],
		type: "Boss",
		speed: "Fast",
		weakPoints: [
			getWeakPointByKey("eyes"),
			getWeakPointByKey("mouth"),
			getWeakPointByKey("attachedZombies"),
		],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("bite"),
			getZombieAttackByKey("tailSlam"),
			getZombieAttackByKey("dinoLeap"),
		],
		spawnBehavior:
			"The Dinosaur spawns after activating the final encounter by giving the Sentinel Artifact to S.A.M.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/z-rex.mdx")),
	},
	kommandoKlaus: {
		id: "kommando-klaus",
		title: "Kommando Klaus",
		state: Option.none(),
		releaseDate: new Date("August 07, 2025 12:00 AM"),
		image: "/zombies/kommando-klaus.webp",
		description:
			"These periodic robot battalions known as Kommando Klaus, equipped with rocket boots, home in on perceived intruders with deadly self-destruct sequences engaged.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("reckoning")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head"), getWeakPointByKey("powerCore")],
		elementalWeakness: ["cryoFreeze"],
		attacks: [getZombieAttackByKey("selfDestruct")],
		spawnBehavior:
			"Kommando Klaus will first spawn on Reckoning on round 5, 6, or 7 as the special round and then every 5 rounds afterwards. They will also spawn alongside regular zombies in the later rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/kommando-klaus.mdx")),
	},
	uberKlaus: {
		id: "uber-klaus",
		title: "Uber Klaus",
		state: Option.none(),
		releaseDate: new Date("August 07, 2025 01:00 AM"),
		image: "/zombies/uber-klaus.webp",
		description:
			"A murderous automaton encased in a toughened, bulky exoskeleton that maintains a cocky attitude, lethal efficiency, and super strength, all directed at newly programmed threats.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("reckoning")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [
			getWeakPointByKey("head"),
			getWeakPointByKey("powerCore"),
			getWeakPointByKey("shoulders"),
		],
		elementalWeakness: ["cryoFreeze", "napalmBurst"],
		attacks: [getZombieAttackByKey("powerfulMelee"), getZombieAttackByKey("electricalBolts")],
		spawnBehavior:
			"Uber Klaus will first spawn on Reckoning on Round 16, then every 3-5 rounds afterwards. They will also spawn in during specific main quest steps.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/uber-klaus.mdx")),
	},
	sam: {
		id: "sam",
		title: "S.A.M.",
		state: Option.none(),
		releaseDate: new Date("August 07, 2025 02:00 AM"),
		image: "/zombies/sam.webp",
		description:
			"An Artificial Intelligence based on a snapshot of Samantha Maxis, obsessed with the idea of using Maxis' body to become Human.",
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("reckoning")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("glowingLights"), getWeakPointByKey("powerCore")],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("eyeBeam"),
			getZombieAttackByKey("electricalBolts"),
			getZombieAttackByKey("aetherBarrage"),
		],
		spawnBehavior: "S.A.M. spawns when you choose the Richtofen side of the final boss fight.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/sam.mdx")),
	},
	uberRichtofen: {
		id: "uber-richtofen",
		title: "Uber Richtofen",
		state: Option.none(),
		releaseDate: new Date("August 07, 2025 03:00 AM"),
		image: "/zombies/uber-richtofen.webp",
		description:
			'Appearing initially encased in a toughened, bulky exoskeleton, "The Director" will stop at nothing to save his family.',
		games: [getGameByKey("blackOps6")],
		maps: [getMapByKey("reckoning")],
		type: "Boss",
		speed: "Medium",
		weakPoints: [
			getWeakPointByKey("shoulders"),
			getWeakPointByKey("powerCore"),
			getWeakPointByKey("head"),
			getWeakPointByKey("jetpack"),
		],
		elementalWeakness: [],
		attacks: [
			getZombieAttackByKey("powerfulMelee"),
			getZombieAttackByKey("electricalBolts"),
			getZombieAttackByKey("wunderwaffeShot"),
			getZombieAttackByKey("aerialBomber"),
		],
		spawnBehavior: "Uber Richtofen spawns when you choose to help S.A.M. in the final boss fight.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/uber-richtofen.mdx")),
	},
	ravager: {
		id: "ravager",
		title: "Ravager",
		state: Option.some("New"),
		releaseDate: new Date("November 14, 2025 12:00 AM"),
		image: "/zombies/ravager.webp",
		description:
			"A tortured minion of an unknown evil, prowling the Dark Aether on all fours, usually in packs, lurking in the shadows until the moment it can strike.",
		games: [getGameByKey("blackOps7")],
		maps: [getMapByKey("ashesOfTheDamned")],
		type: "Special",
		speed: "Fast",
		weakPoints: [getWeakPointByKey("head")],
		elementalWeakness: [],
		attacks: [getZombieAttackByKey("meleeSwing"), getZombieAttackByKey("ravage")],
		spawnBehavior:
			"Ravagers spawn as the special round in Ashes of the Damned, and will spawn in among normal zombies in the later rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/ravager.mdx")),
	},
	zursa: {
		id: "zursa",
		title: "Zursa",
		state: Option.some("New"),
		releaseDate: new Date("November 14, 2025 01:00 AM"),
		image: "/zombies/zursa.webp",
		description:
			"An apex predator twisted by the Dark Aether, driven by madness and aggression with parasitic infestations that make it an Elite level threat.",
		games: [getGameByKey("blackOps7")],
		maps: [getMapByKey("ashesOfTheDamned")],
		type: "Elite",
		speed: "Medium",
		weakPoints: [getWeakPointByKey("redGlowingSpots"), getWeakPointByKey("beeNests")],
		elementalWeakness: ["napalmBurst"],
		attacks: [getZombieAttackByKey("maul"), getZombieAttackByKey("beeSwarm")],
		spawnBehavior:
			"Zursa will first spawn on Round 16, then every 3-5 rounds after that with the chance for multiple to spawn on those rounds.",
		combatStrategy: Effect.promise(() => import("@/content/zombies/zursa.mdx")),
	},
} as const satisfies Record<string, Zombie>

const zombieMap = new Map<string, Zombie>()
const zombies: Zombie[] = Object.values(zombiesRegistry).sort((a, b) =>
	sortReleaseDateDesc(a.releaseDate, b.releaseDate),
)
for (const zombie of zombies) {
	zombieMap.set(zombie.id, zombie)
}
