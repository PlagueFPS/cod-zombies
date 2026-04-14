import type { SortOption } from "@/components/grid-sort"
import type { AmmoModKey } from "@/data/ammo-mods"
import type { WeakPointKey } from "@/data/weak-points"
import type { ZombieAttackKey } from "@/data/zombie-attacks"
import type { ContentState } from "@/types/data"
import type { ZombiesPaths } from "@/types/generated/content-paths.gen"
import type { ZombiesImagePath } from "@/types/generated/image-paths.gen"
import { Option } from "effect"
import { type GameKey, getGames } from "@/data/games"
import { getMaps, type MapKey } from "@/data/maps"
import { resolveNewContentState } from "@/utils/content-state"
import { getAdjacentItems, sortDates } from "@/utils/shared-functions"

/** Union type of all zombie types */
export type ZombieType = "Normal" | "Special" | "Elite" | "Boss"
/** Union type of all zombie speeds */
export type ZombieSpeed = "Slow" | "Medium" | "Fast"
/** Union type of all zombies */
export type ZombieKey = Parameters<typeof ZOMBIES.get>[0]
export interface Zombie {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "Zombie"
	/** Unique identifier for the zombie */
	readonly id: string
	/** Name of the zombie */
	readonly title: string
	/** Description of the zombie */
	readonly description: string
	/** State of the zombie. A stored value of `"New"` is time-limited after `releaseDate` (see `resolveNewContentState`) */
	readonly state: Option.Option<ContentState>
	/**
	 * Release calendar day as an ISO 8601 date-only string (`YYYY-MM-DD`).
	 * Same calendar day: higher {@link ZOMBIES} insertion index sorts first when descending.
	 */
	readonly releaseDate: string
	/** Image of the zombie */
	readonly image: ZombiesImagePath
	/** Games the zombie is available in */
	readonly games: GameKey[]
	/** Maps the zombie is available in */
	readonly maps: MapKey[]
	/** Type of the zombie */
	readonly type: ZombieType
	/** Speed of the zombie */
	readonly speed: ZombieSpeed
	/** Weak points of the zombie */
	readonly weakPoints: WeakPointKey[]
	/** Elemental weaknesses of the zombie */
	readonly elementalWeakness: AmmoModKey[]
	/** Attacks of the zombie */
	readonly attacks: ZombieAttackKey[]
	/** Spawn behavior of the zombie */
	readonly spawnBehavior: string
	/** Combat strategy of the zombie */
	readonly combatStrategy: ZombiesPaths
}

/**
 * Newest-first: {@link sortDates}, then higher {@link ZOMBIES} insertion index when calendar days tie.
 */
export function compareZombieReleaseDescending(
	a: Pick<Zombie, "id" | "releaseDate">,
	b: Pick<Zombie, "id" | "releaseDate">,
): number {
	const byDate = sortDates(b.releaseDate, a.releaseDate)
	if (byDate !== 0) return byDate

	// Use inseration index as a tiebreaker (higher index = later insertion = newer Zombie)
	return (
		ZOMBIE_INSERATION_INDEX_BY_ID.get(b.id as ZombieKey)! -
		ZOMBIE_INSERATION_INDEX_BY_ID.get(a.id as ZombieKey)!
	)
}

function withResolvedZombieState(zombie: Zombie): Zombie {
	const nowMs = Date.now()
	return {
		...zombie,
		state: resolveNewContentState(zombie.state, zombie.releaseDate, nowMs),
	}
}

/** @returns An array of all zombies sorted by release date in descending order */
export const getZombies = (): Zombie[] =>
	[...ZOMBIES.values()].map(withResolvedZombieState).sort(compareZombieReleaseDescending)

/** @returns The zombie with the given key */
export const getZombieByKey = (key: ZombieKey) =>
	Option.fromUndefinedOr(ZOMBIES.get(key)).pipe(Option.map(withResolvedZombieState))

/**
 * @returns The previous and next zombies based on the current
 * @param current The key of the current zombie
 */
export const getAdjacentZombies = (current: ZombieKey) => {
	return getAdjacentItems(getZombies(), current)
}

/**
 * Gets the sort options for zombies.
 * @returns An array of sort options.
 */
export const getZombieSortOptions = (): SortOption[] => [
	{ value: "latest", label: "Latest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "type-asc", label: "Type: Normal to Boss" },
	{ value: "type-desc", label: "Type: Boss to Normal" },
	{ value: "speed-asc", label: "Speed: Slowest to Fastest" },
	{ value: "speed-desc", label: "Speed: Fastest to Slowest" },
]

const makeZombie = <T extends string>(
	identifier: T,
	zombie: Omit<Zombie, "_tag" | "id">,
): [T, Zombie] => [
	identifier,
	{
		_tag: "Zombie" as const,
		id: identifier,
		...zombie,
	},
]

const ZOMBIES = new Map([
	makeZombie("zombie", {
		title: "Zombie",
		state: Option.none(),
		description:
			"The first and most common enemy type. Varying in speeds, zombies provide the most basic threat on their own but will quickly become a challenge in hordes.",
		releaseDate: "2008-11-11",
		image: "/zombies/base-zombie.webp",
		type: "Normal",
		speed: "Medium",
		spawnBehavior:
			"Zombies spawn at the start of and throughout each round. Special situations like boss fights or main quest interactions may alter the spawns of zombies, changing them or completely removing them temporarily.",
		// base zombie is in all games, reversed since its desc order by default
		games: getGames()
			.reverse()
			.map(game => game.id) as GameKey[],
		// base zombie is in all maps, reversed since its desc order by default
		maps: getMaps()
			.reverse()
			.map(map => map.id) as MapKey[],
		elementalWeakness: [],
		weakPoints: ["head"],
		attacks: ["melee-swing"],
		combatStrategy: "content/zombies/zombie",
	}),
	makeZombie("hellhound", {
		title: "Hellhound",
		state: Option.none(),
		releaseDate: "2010-06-10",
		description:
			"Hellhounds are fast flaming zombie dogs that hunt in packs, targeting the first player they see until they are eliminated before switching to another target.",
		image: "/zombies/hellhound.webp",
		type: "Special",
		speed: "Fast",
		spawnBehavior:
			'Hellhounds typically spawn within the first 6-8 rounds, and then every 5 rounds after that in packs. During a special round, the map will appear to be shrouded in heavy fog, the announcer can be heard saying "Fetch me their souls!", and the ground will shake when the player is spawned. During certain main quest steps or objectives, hellhounds may spawn infinitely or periodically, in which only the ground will shake when spawned.',
		games: [
			"world-at-war",
			"black-ops-1",
			"black-ops-2",
			"black-ops-3",
			"black-ops-4",
			"black-ops-cold-war",
		],
		maps: [
			"shi-no-numa",
			"der-riese",
			"kino-der-toten",
			"moon",
			"tranzit",
			"mob-of-the-dead",
			"the-giant",
			"der-eisendrache",
			"blood-of-the-dead",
			"classified",
			"tag-der-toten",
			"firebase-z",
		],
		elementalWeakness: [],
		weakPoints: ["head"],
		attacks: ["bite", "lunge", "explosion"],
		combatStrategy: "content/zombies/hellhound",
	}),
	makeZombie("nova-6-crawler", {
		title: "Nova-6 Crawler",
		state: Option.none(),
		releaseDate: "2010-11-09",
		description:
			"These creepy crawlers are slow-moving zombies that emit green nova gas from their bodies as they crawl on all fours towards their target, releasing the gas when killed.",
		image: "/zombies/nova-6-crawler.webp",
		games: ["black-ops-1", "black-ops-3", "black-ops-4"],
		maps: ["kino-der-toten", "five", "moon", "classified"],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "nova-gas"],
		spawnBehavior:
			"Nova-6 Crawlers typically start spawning once a certain area in a map has been accessed and will continue to spawn within the normal rounds in smaller numbers than zombies from that point on.",
		combatStrategy: "content/zombies/nova-6-crawler",
	}),
	makeZombie("pentagon-thief", {
		title: "Pentagon Thief",
		state: Option.none(),
		releaseDate: "2010-11-09",
		image: "/zombies/pentagon-thief.webp",
		description:
			"The Pentagon Thief is a special enemy appearing in the map 'Five', periodically trying to steal the player's weapons forcing them to reacquire the weapon if successful.",
		games: ["black-ops-1"],
		maps: ["five"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["weapon-steal"],
		spawnBehavior:
			"The Pentagon Thief will teleport onto the map at certain rounds once the power has been turned off appearing as red floating numbers, with the spawn rate being more frequent at higher rounds.",
		combatStrategy: "content/zombies/pentagon-thief",
	}),
	makeZombie("space-monkey", {
		title: "Space Monkey",
		state: Option.none(),
		releaseDate: "2011-02-01",
		image: "/zombies/space-monkey.webp",
		description:
			"Space Monkeys are a special enemy appearing on the map Ascension, attempting to steal the player's perks by attacking the perk machines.",
		games: ["black-ops-1", "black-ops-3"],
		maps: ["ascension"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "perk-steal"],
		spawnBehavior:
			"Space Monkeys will first appear after four to five rounds, after the first perk has been purchased. Arriving on lunar landers crashing into the ground with the map having a yellow-orange tint, and the announcer saying, 'Warning. Re-entry detected. All security personnel on high alert.'",
		combatStrategy: "content/zombies/space-monkey",
	}),
	makeZombie("george-a-romero", {
		title: "George A. Romero",
		state: Option.none(),
		releaseDate: "2011-05-03",
		image: "/zombies/george-a-romero.webp",
		description:
			"George A. Romero is a special zombie, and the main antagonist featured in the map Call of the Dead. Roaming the map and constantly following the player.",
		games: ["black-ops-1"],
		maps: ["call-of-the-dead"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "rally-cry"],
		spawnBehavior:
			"Romero spawns in via a lightning strike in the spawn area at the very start of the game, holding a stage light as his main weapon of choice and begin to follow the closest player to him from that point on.",
		combatStrategy: "content/zombies/george-a-romero",
	}),
	makeZombie("jungle-monkey", {
		title: "Jungle Monkey",
		state: Option.none(),
		releaseDate: "2011-06-12",
		image: "/zombies/jungle-monkey.webp",
		description:
			"The Jungle Monkey is a special enemy appearing on the map Shangri-La, unlike the Space Monkey, the Jungle Monkey prefers to go after Power-Up drops.",
		games: ["black-ops-1", "black-ops-3"],
		maps: ["shangri-la"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "power-up-steal"],
		spawnBehavior:
			"These monkeys spawn perched on top of the sides of the stairs leading up to the Pack-a-Punch machine, and if one is killed, another will replace it. They are constant throughout the entire match and will always go after Power-Up drops.",
		combatStrategy: "content/zombies/jungle-monkey",
	}),
	makeZombie("shrieker-zombie", {
		title: "Shrieker Zombie",
		state: Option.none(),
		releaseDate: "2011-06-12",
		image: "/zombies/shrieker-zombie.webp",
		description:
			"Shrieker Zombies are a special enemy appearing on the map Shangri-La. These zombies appear with pale white skin, glowing white eyes, and can move very quickly.",
		games: ["black-ops-1", "black-ops-3"],
		maps: ["shangri-la"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["sonic-screech"],
		spawnBehavior:
			"These zombies spawn throughout the normal rounds by blasting out of the ground with a Sonic Screech, making it likely you will hear them before you see them spawn. These zombies also do not count towards the normal round, so you can flip the round without killing them.",
		combatStrategy: "content/zombies/shrieker-zombie",
	}),
	makeZombie("napalm-zombie", {
		title: "Napalm Zombie",
		state: Option.none(),
		releaseDate: "2011-06-12",
		image: "/zombies/napalm-zombie.webp",
		description:
			"Napalm Zombies are a special enemy appearing on the map Shangri-La. These zombies look like a burnt zombie with a flaming aura surrounding them.",
		games: ["black-ops-1", "black-ops-3"],
		maps: ["shangri-la"],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["flaming-aura", "fiery-explosion"],
		spawnBehavior:
			"Napalm Zombies spawn from a patch of flames on the ground and do not count towards the normal round. Only one Napalm Zombie can appear at a time.",
		combatStrategy: "content/zombies/napalm-zombie",
	}),
	makeZombie("astronaut-zombie", {
		title: "Astronaut Zombie",
		state: Option.none(),
		releaseDate: "2011-08-23",
		image: "/zombies/astronaut-zombie.webp",
		description:
			"The Astronaut is a special enemy appearing on the map Moon, often taking the name of someone on your friends list or if solo a predetermined name instead.",
		games: ["black-ops-1", "black-ops-3"],
		maps: ["moon"],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: ["dead-wire"],
		attacks: ["grab", "knockback-explosion"],
		spawnBehavior:
			"The Astronaut spawns in shortly after you have teleported to the Moon from Earth, and will always spawn in the Receiving Bay and make their way to the player. After every death, it will return with a different name above its head.",
		combatStrategy: "content/zombies/astronaut-zombie",
	}),
	makeZombie("denizen", {
		title: "Denizen",
		state: Option.none(),
		releaseDate: "2012-11-12",
		image: "/zombies/denizen.webp",
		description:
			"The Denizen is a special enemy appearing on the map Tranzit, lurking within the fog of the map waiting for unsuspecting players to jump onto.",
		games: ["black-ops-2"],
		maps: ["tranzit"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["leap"],
		spawnBehavior:
			"Denizens spawn within the fog of the map, in-between each Point of Interest and will always exist within those areas no matter the round.",
		combatStrategy: "content/zombies/denizen",
	}),
	makeZombie("avogadro", {
		title: "Avogadro",
		state: Option.none(),
		releaseDate: "2012-11-12",
		image: "/zombies/avogadro.webp",
		description:
			"The Avogadro is a boss zombie appearing on the maps Tranzit & Alpha Omega, also known as Cornelius Pernell the leader of Broken Arrow.",
		games: ["black-ops-2", "black-ops-4"],
		maps: ["tranzit", "alpha-omega"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["aoe-slam", "lightning-bolt", "charge"],
		spawnBehavior:
			"In TranZit, the Avogadro spawns in after turning on the power. In Alpha Omega, the Avogadro is the final boss of the Main Quest.",
		combatStrategy: "content/zombies/avogadro",
	}),
	makeZombie("jumping-jack", {
		title: "Jumping Jack",
		state: Option.none(),
		releaseDate: "2013-01-29",
		image: "/zombies/jumping-jack.webp",
		description:
			"Jumping Jacks are special enemies appearing on the map Die Rise. Similar in appearance to the Nova-6 Crawler, however, these zombies behave much differently.",
		games: ["black-ops-2"],
		maps: ["die-rise"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "jump-swing"],
		spawnBehavior:
			"Jumping Jacks are round-specific, and when they spawn, these will be the only enemies on the map for that round. They first spawn on rounds 5-7, and then every 5 rounds after their first appearance. They will spawn in groups of two per player alive, with a new group spawning after a group has been killed.",
		combatStrategy: "content/zombies/jumping-jack",
	}),
	makeZombie("brutus", {
		title: "Brutus",
		state: Option.none(),
		releaseDate: "2013-04-16",
		image: "/zombies/brutus.webp",
		description:
			"Brutus is the boss zombie appearing on the maps Mob of the Dead and Blood of the Dead. Also known as the Warden of Alcatraz, tormenting the souls of the damned.",
		games: ["black-ops-2"],
		maps: ["mob-of-the-dead", "blood-of-the-dead"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing"],
		spawnBehavior:
			"In Mob of the Dead, Brutus first spawns after rounds 5 and 7 with normal zombies, and then randomly after that. He will appear again if players use the Mystery Box too much, spawning in and destroying the Mystery Box, then running after players; As well as if players are on the Golden Gate Bridge. In Blood of the Dead, Brutus first appears after entering the Prison for the first time via the Catwalk, randomly after that, and finally as the final boss in the Main Quest.",
		combatStrategy: "content/zombies/brutus",
	}),
	makeZombie("ghost", {
		title: "Ghost",
		state: Option.none(),
		releaseDate: "2013-07-13",
		image: "/zombies/ghost.webp",
		description:
			"The Ghost also known as The Witch is a special enemy appearing in the map Buried. These enemies can only be found within the Mansion of the map.",
		games: ["black-ops-2"],
		maps: ["buried"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["point-steal"],
		spawnBehavior:
			"The Ghosts only spawn within the Mansion on the map and spawn infinitely until players leave the mansion.",
		combatStrategy: "content/zombies/ghost",
	}),
	makeZombie("crusader-zombie", {
		title: "Crusader Zombie",
		state: Option.none(),
		releaseDate: "2013-08-27",
		image: "/zombies/crusader-zombie.webp",
		description:
			"Crusader Zombies are a special enemy type on Origins, originating from the various Crusader Knights that fought in The Great War against the Apothicons alongside the Keepers.",
		games: ["black-ops-2"],
		maps: ["origins"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "generator-siphon"],
		spawnBehavior:
			"Crusader Zombies will spawn out of blue portals in the ground during any 115 generator activation to try to stop you from powering the generator. They will also spawn every few rounds after at least one generator has been powered on, attempting to disable it by siphoning the element 115 energy from it. In The Crazy Place, these enemies will spawn naturally in place of regular zombies.",
		combatStrategy: "content/zombies/crusader-zombie",
	}),
	makeZombie("panzersoldat", {
		title: "Panzersoldat",
		state: Option.none(),
		releaseDate: "2013-08-27",
		image: "/zombies/panzersoldat.webp",
		description:
			"The Panzersoldat is an elite enemy appearing on the maps Origins, Der Eisendrache, and Revelations, wearing an armored suit equipped with a flamethrower.",
		games: ["black-ops-2"],
		maps: ["origins", "der-eisendrache", "revelations"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head", "power-core"],
		elementalWeakness: [],
		attacks: ["flamethrower", "claw-grab", "emp-launcher"],
		spawnBehavior:
			"In Origins, the Panzersoldat will always spawn in on Round 8 as long as the door to No Man's Land has been opened. Otherwise, it will spawn on the next round after that door has been opened, and then every 3-5 rounds after that. In Der Eisendrache, the Panzersoldat will spawn on Round 12 and every 5-6 rounds after that. During the Main Quest, a Panzersoldat will always spawn in after returning to the present time, and multiple will spawn during the final boss fight. In Revelations, the Panzersoldat will be between rounds 18-21, and is also present during the final boss fight.",
		combatStrategy: "content/zombies/panzersoldat",
	}),
	makeZombie("keepers", {
		title: "Keepers",
		state: Option.none(),
		releaseDate: "2015-11-06",
		image: "/zombies/keeper.webp",
		description:
			"Keepers are a special enemy appearing on almost all maps in Black Ops 3 and play a crucial part in the events that happen within the Aether Storyline.",
		games: ["black-ops-3"],
		maps: ["shadows-of-evil", "revelations"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing"],
		spawnBehavior:
			"In Shadows of Evil, keepers spawn in during all rituals and during certain Main Quest steps. In Der Eisendrache, one keeper appears during the Main Quest to aid Primis in the return of the M.P.D. In Zetsubou No Shima, keepers spawn during the Skull of Nan Sapwe ritual. Finally, in Revelations, keepers spawn during rituals, certain Main Quest steps, and naturally throughout the rounds.",
		combatStrategy: "content/zombies/keepers",
	}),
	makeZombie("insanity-elementals", {
		title: "Insanity Elementals",
		state: Option.none(),
		releaseDate: "2015-11-06",
		image: "/zombies/insanity-elementals.webp",
		description:
			"Insanity Elementals, commonly referred to as Meatballs, are special enemies appearing on the map Shadows of Evil, dropping from the sky and rolling into the fight.",
		games: ["black-ops-3"],
		maps: ["shadows-of-evil"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["glowing-lights"],
		elementalWeakness: [],
		attacks: ["explosion"],
		spawnBehavior:
			'Insanity Elementals spawn during a special round after the 2nd parasite round. During the "Capture the Flag" main quest step, they infinitely spawn until the flag has been charged and returned to the ritual site.',
		combatStrategy: "content/zombies/insanity-elementals",
	}),
	makeZombie("parasite", {
		title: "Parasite",
		state: Option.none(),
		releaseDate: "2015-11-06",
		image: "/zombies/parasite.webp",
		description:
			"Parasites are a special enemy appearing on multiple maps throughout zombies. These zombies are the first flying enemy to appear in the franchise.",
		games: ["black-ops-3", "black-ops-6"],
		maps: [
			"shadows-of-evil",
			"revelations",
			"terminus",
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
		],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["cryo-freeze"],
		attacks: ["projectile-vomit"],
		spawnBehavior:
			"In Shadows of Evil, Parasites spawn during their own special round, out of destroyed heads of Margwas, harvest pods, and during certain Main Quest steps. In Revelations, they behave the same way, but appear red instead of yellow. In Black Ops 6, they spawn during the special round alongside Vermin and can evolve from Vermin that are left alive for too long.",
		combatStrategy: "content/zombies/parasite",
	}),
	makeZombie("margwa", {
		title: "Margwa",
		state: Option.none(),
		releaseDate: "2015-11-06",
		image: "/zombies/margwa.webp",
		description:
			"Margwas are an elite enemy appearing on the maps Shadows of Evil and Revelations. These three-headed beasts are intimidating threats that can be hard to deal with.",
		games: ["black-ops-3"],
		maps: ["shadows-of-evil", "revelations"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["glowing-mouths"],
		elementalWeakness: [],
		attacks: ["melee-swing", "ground-slam"],
		spawnBehavior:
			"In Shadows of Evil, Margwas first spawns on Round 8. They will continue to spawn throughout the rounds after that and will appear in greater numbers during certain Main Quest steps, spawning infinitely during the final step of the Main Quest.",
		combatStrategy: "content/zombies/margwa",
	}),
	makeZombie("skeleton", {
		title: "Skeleton",
		state: Option.none(),
		releaseDate: "2016-02-02",
		image: "/zombies/skeleton.webp",
		description:
			"Skeletons are a variant of the normal zombie also known as Spartoi in Ancient Evil. These enemies bring a cool new look to the normal zombie.",
		games: ["black-ops-3", "black-ops-4"],
		maps: ["der-eisendrache", "ancient-evil"],
		type: "Normal",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing"],
		spawnBehavior:
			"In Der Eisendrache, Skeletons spawn as the dominant enemy in the My Brother's Keeper main quest boss fight. In Ancient Evil, these skeletons are known as Spartoi and spawn once you activate the Sentinel Artifact. These Spartoi will not be killed if the final blow is not a headshot; they will instead crumble to the ground and reconstruct up to two times before actually dying.",
		combatStrategy: "content/zombies/skeleton",
	}),
	makeZombie("the-corrupted-keeper", {
		title: "The Corrupted Keeper",
		state: Option.none(),
		releaseDate: "2016-02-02",
		image: "/zombies/the-corrupted-keeper.webp",
		description:
			"The Corrupted Keeper is the final boss of the My Brother's Keeper main quest in Der Eisendrache, the first boss fight in the zombies franchise.",
		games: ["black-ops-3"],
		maps: ["der-eisendrache"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["glowing-symbol"],
		elementalWeakness: [],
		attacks: ["skull-summon", "volcano-summon", "electric-burst"],
		spawnBehavior:
			"The Corrupted Keeper spawns once you enter the boss arena for the My Brother's Keeper Main Quest.",
		combatStrategy: "content/zombies/the-corrupted-keeper",
	}),
	makeZombie("spider", {
		title: "Spider",
		state: Option.none(),
		releaseDate: "2016-04-19",
		image: "/zombies/spider.webp",
		description:
			"Spiders are a special enemy originating from Zetsubou No Shima. These enemies have the appearance of a Black Widow, but with some interesting enhancements.",
		games: ["black-ops-3"],
		maps: ["zetsubou-no-shima"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["bite", "web-projectile"],
		spawnBehavior:
			'In Zetsubou No Shima, spiders have their own dedicated special round, which can be on Round 5-7, then every 5 rounds after that. They will then start spawning within the normal rounds after Round 20. In Revelations, spiders exclusively spawn within the Apothicon and only every 2-3 rounds. Once they appear, they will spawn pretty frequently during that round, but not again until the next "Spider round" within the apothicon.',
		combatStrategy: "content/zombies/spider",
	}),
	makeZombie("thrasher", {
		title: "Thrasher",
		state: Option.none(),
		releaseDate: "2016-04-19",
		description:
			"Thrashers are an elite enemy originating from the map Zetsubou No Shima. These brutes are mutated zombies from spores completely transforming their appearance.",
		image: "/zombies/thrasher.webp",
		games: ["black-ops-3"],
		maps: ["zetsubou-no-shima"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head", "spores"],
		elementalWeakness: [],
		attacks: ["powerful-melee", "toxic-gas"],
		spawnBehavior:
			"Thrashers spawn from normal zombies affected by a fully-grown toxic spore's gas. They can also spawn naturally throughout rounds.",
		combatStrategy: "content/zombies/thrasher",
	}),
	makeZombie("giant-spider", {
		title: "Giant Spider",
		state: Option.none(),
		releaseDate: "2016-04-19",
		image: "/zombies/giant-spider.webp",
		description:
			"The Giant Spider is the first boss you face in Zetsubou No Shima to obtain the Spider's tooth to build the Masamune wonder weapon.",
		games: ["black-ops-3"],
		maps: ["zetsubou-no-shima"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["mouth"],
		elementalWeakness: [],
		attacks: ["web-projectile", "leg-stab"],
		spawnBehavior:
			"The Giant Spider spawns once you shoot the blue webbing with the KT-4, blocking the cave entrance by Speed Cola behind Lab A.",
		combatStrategy: "content/zombies/giant-spider",
	}),
	makeZombie("giant-thrasher", {
		title: "Giant Thrasher",
		state: Option.none(),
		releaseDate: "2016-04-19",
		image: "/zombies/giant-thrasher.webp",
		description:
			"The Giant Thrasher is the final boss for the Seeds of Doubt main quest in Zetsubou No Shima, appearing more unique than other Thrashers on the map.",
		games: ["black-ops-3"],
		maps: ["zetsubou-no-shima"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["spores"],
		elementalWeakness: [],
		attacks: ["vine-slam"],
		spawnBehavior:
			"The Giant Thrasher spawns once the elevator has been repaired and taken the players underground.",
		combatStrategy: "content/zombies/giant-thrasher",
	}),
	makeZombie("valkyrie-drone", {
		title: "Valkyrie Drone",
		state: Option.none(),
		releaseDate: "2016-07-12",
		image: "/zombies/valkyrie-drone.webp",
		description:
			"Valkyrie Drones are a special enemy type originating from the map Gorod Krovi. These enemies appear as flying drones with three tentacle-like arms and a red eye.",
		games: ["black-ops-3"],
		maps: ["gorod-krovi"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["red-camera"],
		elementalWeakness: [],
		attacks: ["lightning-beam", "self-destruct"],
		spawnBehavior:
			"Valkyrie Drones spawn between rounds 9-12, then every 8-10 rounds after that acting as the map's special round. When the special round starts, the map will have a slight blue hue to it, and brief electricity will encircle the screen.",
		combatStrategy: "content/zombies/valkyrie-drone",
	}),
	makeZombie("mangler", {
		title: "Mangler",
		state: Option.none(),
		releaseDate: "2016-07-12",
		image: "/zombies/mangler.webp",
		description:
			"Manglers are a special type of enemy originating from the map Gorod Krovi. These enemies appear as armored Russian super-soldiers armed with an arm cannon.",
		games: ["black-ops-3", "black-ops-cold-war", "black-ops-6"],
		maps: [
			"gorod-krovi",
			"firebase-z",
			"mauer-der-toten",
			"forsaken",
			"liberty-falls",
			"terminus",
			"shattered-veil",
			"reckoning",
		],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head", "arm-cannon"],
		elementalWeakness: ["napalm-burst"],
		attacks: ["melee-swing", "cannon-blast"],
		spawnBehavior:
			"Manglers spawn out of window barriers just like normal zombies and will spawn through the rounds with normal zombies as well. Up to four manglers can spawn at a time.",
		combatStrategy: "content/zombies/mangler",
	}),
	makeZombie("dragon", {
		title: "Dragon",
		state: Option.none(),
		releaseDate: "2016-07-12",
		image: "/zombies/dragon.webp",
		description:
			"The Dragon is the first boss appearing on the map Gorod Krovi. This enemy appears as the main dragon seen throughout the map breathing fire down on the battlefield.",
		games: ["black-ops-3"],
		maps: ["gorod-krovi"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["dragon-fire"],
		spawnBehavior:
			"The Dragon spawns in the moment you enter the map and can be seen flying around and periodically landing on certain areas to breathe fire.",
		combatStrategy: "content/zombies/dragon",
	}),
	makeZombie("nikolai-mech", {
		title: "Nikolai Mech",
		state: Option.none(),
		releaseDate: "2016-07-12",
		image: "/zombies/nikolai-mech.webp",
		description:
			"The Nikolai Mech is the final boss enemy in the map Gorod Krovi. The mech hosts Ultimis Nikolai inside who is the controller of the mech while being drunk.",
		games: ["black-ops-3"],
		maps: ["gorod-krovi"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["power-cores"],
		elementalWeakness: [],
		attacks: ["harpoon-barrage"],
		spawnBehavior:
			"The Nikolai Mech spawns in after starting the final encounter of the Gorod Krovi main quest.",
		combatStrategy: "content/zombies/nikolai-mech",
	}),
	makeZombie("fury", {
		title: "Fury",
		state: Option.none(),
		releaseDate: "2016-10-06",
		image: "/zombies/fury.webp",
		description:
			"Furies are a special enemy originating from the map Revelations in Black Ops 3. These enemies are unique in appearance while having similar behavior to the Insanity Elementals.",
		games: ["black-ops-3"],
		maps: ["revelations"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing"],
		spawnBehavior:
			"Furies spawn on the second special round, then every special round after that. They will also spawn during the first, second, and final Corruption Engine overrides that the player activates.",
		combatStrategy: "content/zombies/fury",
	}),
	makeZombie("fire-catalyst", {
		title: "Fire Catalyst",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/fire-catalyst.webp",
		description:
			"Fire Catalysts are one of the four variants of catalyst zombies, originating from the map Voyage of Despair, and appearing similar to the Napalm Zombie from Shangri-La.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair", "ix", "dead-of-the-night", "ancient-evil"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["fiery-explosion"],
		spawnBehavior:
			"Fire Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: "content/zombies/fire-catalyst",
	}),
	makeZombie("poison-catalyst", {
		title: "Poison Catalyst",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/poison-catalyst.webp",
		description:
			"Poison Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with a focus on toxic area denial.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair", "ix", "dead-of-the-night", "ancient-evil"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "poison-aura"],
		spawnBehavior:
			"Poison Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: "content/zombies/poison-catalyst",
	}),
	makeZombie("water-catalyst", {
		title: "Water Catalyst",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/water-catalyst.webp",
		description:
			"Water Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with a focus on buffing other zombies.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair", "ix", "dead-of-the-night", "ancient-evil"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "zombie-buff"],
		spawnBehavior:
			"Water Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: "content/zombies/water-catalyst",
	}),
	makeZombie("lightning-catalyst", {
		title: "Lightning Catalyst",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/lightning-catalyst.webp",
		description:
			"Lightning Catalysts are one of four variants of Catalyst zombies, originating from the map Voyage of Despair with similarities to the Shrieker Zombie.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair", "ix", "dead-of-the-night", "ancient-evil"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["sonic-screech"],
		spawnBehavior:
			"Lightning Catalysts can start spawning on Round 8 on Chaos-Story maps and will spawn in with normal zombies during the round.",
		combatStrategy: "content/zombies/lightning-catalyst",
	}),
	makeZombie("stoker", {
		title: "Stoker",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/stoker.webp",
		description:
			"The Stoker is an elite enemy originating on the map Voyage of Despair in Black Ops 4, wielding a shovel and appearing as a fiery zombie spawned from hell.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head", "encrusted-lava", "red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["melee-swing", "fireball"],
		spawnBehavior: "Stokers spawn in groups of 2-3 and will attack the player with a shovel swing.",
		combatStrategy: "content/zombies/stoker",
	}),
	makeZombie("blightfather", {
		title: "Blightfather",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/blightfather.webp",
		description:
			"The Blightfather is an elite enemy originating from the map Voyage of Despair, appearing as a tall, mutated arachnid with long legs.",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair", "ix", "ancient-evil"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["back-sacs", "elbow-sacs"],
		elementalWeakness: [],
		attacks: ["melee-swing", "homing-vomit", "tongue-grab"],
		spawnBehavior:
			"The Blightfather will not spawn until Round 15 on any map and spawns from a normal zombie by ripping apart the zombie like a parasite and crawling out of the zombie's mouth, quickly growing to full size.",
		combatStrategy: "content/zombies/blightfather",
	}),
	makeZombie("eye-of-malice", {
		title: "Eye of Malice",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/eye-of-malice.webp",
		description:
			"The Eye of Malice and Despair is the final boss of the map Voyage of Despair's Abandon Ship main quest, also known as the Sky-Eye.",
		type: "Boss",
		speed: "Slow",
		games: ["black-ops-4"],
		maps: ["voyage-of-despair"],
		weakPoints: ["eye-pupil"],
		elementalWeakness: [],
		attacks: ["eye-beam"],
		spawnBehavior:
			"The Eye of Malice spawns once you enter the final encounter and place the Sentinel Artifact inside of the Iceberg.",
		combatStrategy: "content/zombies/eye-of-malice",
	}),
	makeZombie("tiger", {
		title: "Tiger",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/tiger.webp",
		description:
			"The Tiger is a special enemy originating from the map IX in Black Ops 4, similar to Hellhounds however having slightly higher health.",
		games: ["black-ops-4"],
		maps: ["ix"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["bite", "lunge"],
		spawnBehavior:
			"Tigers spawn during the special round of the map IX, as champions of one of the gods, and during specific steps in the main quest. They will also spawn in with normal zombies starting on Round 8.",
		combatStrategy: "content/zombies/tiger",
	}),
	makeZombie("destroyer", {
		title: "Destroyer",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/destroyer.webp",
		description:
			"The Destroyer is a special enemy originating from the map IX in Black Ops 4, wielding dual-axes while wearing heavy armor that must be destroyed.",
		games: ["black-ops-4"],
		maps: ["ix"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "axe-throw"],
		spawnBehavior:
			"Destroyers spawn during the special round on the map IX, as champions of one of the gods, and during specific parts of the main quest. They will also spawn with normal zombies starting on Round 8.",
		combatStrategy: "content/zombies/destroyer",
	}),
	makeZombie("marauder", {
		title: "Marauder",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/marauder.webp",
		description:
			"The Marauder is a special enemy originating from the map IX in Black Ops 4 wielding metallic claws with little to no armor.",
		games: ["black-ops-4"],
		maps: ["ix"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["rapid-slashes", "heavy-leap"],
		spawnBehavior:
			"Marauders spawn in during the special round of the map IX, as champions of one of the gods, and during specific steps of the main quest. They also begin spawning with normal zombies on Round 8.",
		combatStrategy: "content/zombies/marauder",
	}),
	makeZombie("fury-and-wrath", {
		title: "Fury & Wrath",
		state: Option.none(),
		releaseDate: "2018-10-12",
		image: "/zombies/fury-and-wrath.webp",
		description:
			"Fury and Wrath are the final bosses in the map IX's main quest Venerated Warrior, appearing as two war elephants with heavy armor.",
		games: ["black-ops-4"],
		maps: ["ix"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["forehead-crystal", "red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["charge"],
		spawnBehavior:
			"Fury will spawn in after Phase 1 of the boss fight is complete defeating all the Gladiators and Tigers. Wrath will spawn in once Fury is defeated and his essence is transferred to Wrath.",
		combatStrategy: "content/zombies/fury-and-wrath",
	}),
	makeZombie("nosferatu", {
		title: "Nosferatu",
		state: Option.none(),
		releaseDate: "2018-12-11",
		image: "/zombies/nosferatu.webp",
		description:
			"The Nosferatu is a special enemy originating from the map Dead of the Night in Black Ops 4, appearing as a vampire like zombie.",
		games: ["black-ops-4"],
		maps: ["dead-of-the-night"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["vampiric-melee", "mega-bite"],
		spawnBehavior:
			"The Nosferatu will begin spawning naturally in the later rounds and will be spawned during specific points of the main quest. The Crimson Nosferatu will begin spawning naturally in the 30s and can also be spawned from one of the Allistair Annihilators upgrade quest steps.",
		combatStrategy: "content/zombies/nosferatu",
	}),
	makeZombie("werewolf", {
		title: "Werewolf",
		state: Option.none(),
		releaseDate: "2018-12-11",
		image: "/zombies/werewolf.webp",
		description:
			"The Werewolf is an elite enemy originating from the map Dead of the Night in Black Ops 4, these enemies are fierce, agile, and strong posing a true threat.",
		games: ["black-ops-4"],
		maps: ["dead-of-the-night"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "pounce"],
		spawnBehavior:
			"The Werewolf will not spawn until Round 15, however one Werewolf is always present in The Forest until it is defeated.",
		combatStrategy: "content/zombies/werewolf",
	}),
	makeZombie("shadow-werewolf", {
		title: "Shadow Werewolf",
		state: Option.none(),
		releaseDate: "2018-12-11",
		image: "/zombies/shadow-werewolf.webp",
		description:
			"The Shadow Werewolf is the final boss of the map Dead of the Night's main quest Trial by Ordeal, appearing as a bigger, stronger, and faster Werewolf.",
		games: ["black-ops-4"],
		maps: ["dead-of-the-night"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["chest"],
		elementalWeakness: [],
		attacks: ["melee-swing", "charge"],
		spawnBehavior:
			"The Shadow Werewolf will spawn in once you have started the final encounter and entered the boss arena.",
		combatStrategy: "content/zombies/shadow-werewolf",
	}),
	makeZombie("gegenees", {
		title: "Gegenees",
		state: Option.none(),
		releaseDate: "2019-03-26",
		image: "/zombies/gegenees.webp",
		description:
			"The Gegenees is an elite enemy originating on the map Ancient Evil in Black Ops 4, appearing as a six-armed giant wielding a spear, sword, and shield.",
		games: ["black-ops-4"],
		maps: ["ancient-evil"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["sword-swing", "spear-throw", "shield-blind"],
		spawnBehavior:
			"The Gegenees will begin spawning on Round 15, however one will spawn when picking up the Golden Bridle and when shooting down the bird cage within the Omphalos.",
		combatStrategy: "content/zombies/gegenees",
	}),
	makeZombie("pegasus", {
		title: "Pegasus",
		state: Option.none(),
		releaseDate: "2019-03-26",
		image: "/zombies/pegasus.webp",
		description:
			"Pegasus is the first boss faced in the map Ancient Evil's main quest Greek Tragedy, appearing as the mythical steed of Perseus in all its glory.",
		games: ["black-ops-4"],
		maps: ["ancient-evil"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["body"],
		elementalWeakness: [],
		attacks: ["lightning-strike"],
		spawnBehavior:
			"Pegasus spawns once you obtain the Sentinel Artifact, but does not become a threat until the final encounter.",
		combatStrategy: "content/zombies/pegasus",
	}),
	makeZombie("perseus", {
		title: "Perseus",
		state: Option.none(),
		releaseDate: "2019-03-26",
		image: "/zombies/perseus.webp",
		description:
			"Perseus is the final boss in the map Ancient Evil's main quest Greek Tragedy, also known as the Zombie Warlord and the son of Zeus.",
		games: ["black-ops-4"],
		maps: ["ancient-evil"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["body"],
		elementalWeakness: [],
		attacks: ["flaming-spears"],
		spawnBehavior: "Perseus spawns in during the final encounter of the main quest.",
		combatStrategy: "content/zombies/perseus",
	}),
	makeZombie("adam-unit", {
		title: "A.D.A.M. Unit",
		state: Option.none(),
		releaseDate: "2019-07-09",
		image: "/zombies/adam-unit.webp",
		description:
			"The A.D.A.M. Unit is a unique variant of the standard zombie originating on the map Alpha Omega in Black Ops 4, being tankier, faster, and robotic.",
		games: ["black-ops-4"],
		maps: ["alpha-omega"],
		type: "Normal",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing"],
		spawnBehavior:
			"A.D.A.M. Units begin spawning after the power is turned on and during specific steps of the main quest.",
		combatStrategy: "content/zombies/adam-unit",
	}),
	makeZombie("nova-6-bomber", {
		title: "Nova-6 Bomber",
		state: Option.none(),
		releaseDate: "2019-07-09",
		image: "/zombies/nova-6-bomber.webp",
		description:
			"The Nova-6 Bomber is a special unique variant of the Nova-6 Crawler originating on the map Alpha Omega in Black Ops 4, glowing yellow with spikes on its back.",
		games: ["black-ops-4"],
		maps: ["alpha-omega"],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "zombie-buff", "nova-gas"],
		spawnBehavior:
			"Nova-6 Bombers begin spawning with normal zombies once the player has activated the Pack-a-Punch machine.",
		combatStrategy: "content/zombies/nova-6-bomber",
	}),
	makeZombie("jolting-jack", {
		title: "Jolting Jack",
		state: Option.none(),
		releaseDate: "2019-07-09",
		image: "/zombies/jolting-jack.webp",
		description:
			"The Jolting Jack is a special variant of the Nova-6 Crawler originating on the map Alpha Omega in Black Ops 4, having a blue aura of electricity around them.",
		games: ["black-ops-4"],
		maps: ["alpha-omega"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "lightning-bolts"],
		spawnBehavior:
			"Jolting Jacks will begin spawning in with normal zombies once the Pack-a-Punch machine has been activated.",
		combatStrategy: "content/zombies/jolting-jack",
	}),
	makeZombie("armored-zombie", {
		title: "Armored Zombie",
		state: Option.none(),
		releaseDate: "2020-11-13",
		image: "/zombies/armored-zombie.webp",
		description:
			"The Armored Zombie is a variant of the standard zombie originating on the map Die Maschine in Black Ops: Cold War, having light armor on compared to standard zombies.",
		games: ["black-ops-cold-war", "black-ops-6", "black-ops-7"],
		maps: [
			"die-maschine",
			"firebase-z",
			"mauer-der-toten",
			"forsaken",
			"liberty-falls",
			"terminus",
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
			"reckoning",
			"ashes-of-the-damned",
			"astra-malorum",
			"paradox-junction",
			"totenreich",
		],
		type: "Normal",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "flesh-throw"],
		spawnBehavior:
			"Armored Zombies will begin spawning on Round 10 with normal zombies and will spawn more frequently as the round increases.",
		combatStrategy: "content/zombies/armored-zombie",
	}),
	makeZombie("heavy-zombie", {
		title: "Heavy Zombie",
		state: Option.none(),
		releaseDate: "2020-11-13",
		image: "/zombies/heavy-zombie.webp",
		description:
			"The Heavy Zombie is a variant of the standard zombie originating on the map Die Maschine in Black Ops: Cold War, wearing heavy armor compared to other zombies.",
		games: ["black-ops-cold-war", "black-ops-6", "black-ops-7"],
		maps: [
			"die-maschine",
			"firebase-z",
			"mauer-der-toten",
			"forsaken",
			"liberty-falls",
			"terminus",
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
			"reckoning",
			"ashes-of-the-damned",
			"astra-malorum",
			"paradox-junction",
			"totenreich",
		],
		type: "Normal",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "flesh-throw"],
		spawnBehavior:
			"Heavy Zombies begin spawning with normal zombies at and after Round 20 and will spawn more frequently as the rounds increase.",
		combatStrategy: "content/zombies/heavy-zombie",
	}),
	makeZombie("plaguehound", {
		title: "Plaguehound",
		state: Option.none(),
		releaseDate: "2020-11-13",
		image: "/zombies/plaguehound.webp",
		description:
			"The Plaguehound is a variant of the Hellhound originating on the map Die Maschine in Black Ops: Cold War, being heavily mutated with Nova 6 Gas compared to hellhounds.",
		games: ["black-ops-cold-war"],
		maps: ["die-maschine", "forsaken"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["napalm-burst"],
		attacks: ["bite", "lunge", "nova-gas"],
		spawnBehavior:
			"Plaguehounds spawn during the special round on Die Maschine and Forsaken, while also spawning in with normal zombies in the later rounds.",
		combatStrategy: "content/zombies/plaguehound",
	}),
	makeZombie("megaton", {
		title: "Megaton",
		state: Option.none(),
		releaseDate: "2020-11-13",
		image: "/zombies/megaton.webp",
		description:
			"The Megaton is the first elite enemy appearing in Black Ops: Cold War originating from the map Die Maschine, appearing as a radioactive mutated juggernaut of a zombie.",
		games: ["black-ops-cold-war"],
		maps: ["die-maschine", "mauer-der-toten", "forsaken"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: ["dead-wire"],
		attacks: ["powerful-melee", "radioactive-blast", "radioactive-flurry"],
		spawnBehavior:
			"Megatons spawn two rounds after the Pack-a-Punch has been activated on Die Maschine or on Wave 15 if the power has not been restored. In Mauer Der Toten, Megatons spawn during one of the steps of the main quest. In Forsaken, Megatons spawn during the lockdown step when obtaining Samantha's Ballad easter egg song.",
		combatStrategy: "content/zombies/megaton",
	}),
	makeZombie("mimic", {
		title: "Mimic",
		state: Option.none(),
		releaseDate: "2021-02-04",
		image: "/zombies/mimic.webp",
		description:
			"The Mimic is a special enemy originating in Black Ops: Cold War, shapeshifting into objects to trick the player before attacking them.",
		games: ["black-ops-cold-war", "black-ops-7"],
		maps: ["firebase-z", "mauer-der-toten", "forsaken", "paradox-junction"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["mouth"],
		elementalWeakness: ["brain-rot"],
		attacks: ["melee-swing", "tentacle-grab"],
		spawnBehavior:
			"Mimics can spawn with normal zombies during the middle and later rounds, or as a piece of loot on the ground that, when approached transforms into a Mimic. In Paradox Junction, a Mimic is one of the HVT enemies in the Purple Cyst side quest.",
		combatStrategy: "content/zombies/mimic",
	}),
	makeZombie("orda", {
		title: "Orda",
		state: Option.none(),
		releaseDate: "2021-02-04",
		image: "/zombies/orda.webp",
		description:
			"Orda is a boss type zombie originating on Firebase Z in Black Ops: Cold War, appearing as an elder god from the Dark Aether.",
		games: ["black-ops-cold-war"],
		maps: ["firebase-z"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["mouth"],
		elementalWeakness: [],
		attacks: ["powerful-melee", "fireballs"],
		spawnBehavior:
			"Ordas can spawn during the third Dimensional Tear Assault waves in Firebase Z, and an Orda is also the final boss of the main quest.",
		combatStrategy: "content/zombies/orda",
	}),
	makeZombie("tormentors", {
		title: "Tormentors",
		state: Option.none(),
		releaseDate: "2021-07-15",
		image: "/zombies/tormentor.webp",
		description:
			"Tormentors are a special enemy type originating on the map Mauer Der Toten in Black Ops: Cold War, appearing as a red crystallized zombie.",
		games: ["black-ops-cold-war"],
		maps: ["mauer-der-toten", "forsaken"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["self-destruct"],
		spawnBehavior:
			"In Mauer Der Toten, Tormentors spawn during the special round and will begin spawning with normal zombies at Round 15 and onward. In Forsaken, Tormentors only spawn with normal zombies on Round 15 and onward.",
		combatStrategy: "content/zombies/tormentors",
	}),
	makeZombie("disciple", {
		title: "Disciple",
		state: Option.none(),
		releaseDate: "2021-07-15",
		image: "/zombies/disciple.webp",
		description:
			"Disciples are a special enemy type originating on the map Mauer Der Toten in Black Ops Cold War, appearing as summoners from the Dark Aether.",
		games: ["black-ops-cold-war"],
		maps: ["mauer-der-toten", "forsaken"],
		type: "Special",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: ["dead-wire"],
		attacks: ["zombie-buff", "life-drain"],
		spawnBehavior:
			"In Mauer Der Toten, the first Disciple is encountered during the Pack-a-Punch ritual to activate it; afterwards, they will appear periodically. In Forsaken, Disciples will begin spawning in the later rounds periodically.",
		combatStrategy: "content/zombies/disciple",
	}),
	makeZombie("tempest", {
		title: "Tempest",
		state: Option.none(),
		releaseDate: "2021-07-15",
		image: "/zombies/tempest.webp",
		description:
			"Tempests are a special enemy type originating on the map Mauer Der Toten in Black Ops Cold War, appearing as a smaller purple variant of the Avogadro.",
		games: ["black-ops-cold-war"],
		maps: ["mauer-der-toten"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: ["brain-rot"],
		attacks: ["melee-swing", "lightning-bolts"],
		spawnBehavior:
			"In Mauer Der Toten, the first Tempests you will encounter during the quest to turn on the power, they will also spawn with normal zombies in the later rounds.",
		combatStrategy: "content/zombies/tempest",
	}),
	makeZombie("krasny-soldat", {
		title: "Krasny Soldat",
		state: Option.none(),
		releaseDate: "2021-07-15",
		image: "/zombies/krasny-soldat.webp",
		description:
			"The Krasny Soldat is an elite variant of the Panzersoldat originating on the map Mauer Der Toten in Black Ops Cold War, adopting a red color scheme for the Omega Group.",
		games: ["black-ops-cold-war"],
		maps: ["mauer-der-toten"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head", "power-core"],
		elementalWeakness: ["cryo-freeze"],
		attacks: ["melee-swing", "flamethrower", "molotov-cannon"],
		spawnBehavior:
			"In Mauer Der Toten, the first Krasny Soldat spawns on Round 10, then will spawn periodically after that point. In Forsaken, the Krasny Soldat only appears in the final boss fight of the main quest.",
		combatStrategy: "content/zombies/krasny-soldat",
	}),
	makeZombie("valentina", {
		title: "Valentina",
		state: Option.none(),
		releaseDate: "2021-07-15",
		image: "/zombies/valentina.webp",
		description:
			"Valentina is the final boss in the map Mauer Der Toten in Black Ops Cold War, appearing similar to the Tormentors in appearance however without being turned.",
		games: ["black-ops-cold-war"],
		maps: ["mauer-der-toten"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["crystal-barrage", "heal-summon", "aether-release"],
		spawnBehavior:
			"Valentina spawns in during the final encounter of the main quest Tin Man Heart.",
		combatStrategy: "content/zombies/valentina",
	}),
	makeZombie("abomination", {
		title: "Abomination",
		state: Option.none(),
		releaseDate: "2021-10-07",
		image: "/zombies/abomination.webp",
		description:
			"The Abomination is an elite type of enemy originating on the map Forsaken in Black Ops Cold War, appearing as a three-headed mutated zombie similar to the Margwa.",
		games: ["black-ops-cold-war", "black-ops-6"],
		maps: ["forsaken", "liberty-falls", "shattered-veil"],
		type: "Elite",
		speed: "Slow",
		weakPoints: ["glowing-mouths"],
		elementalWeakness: ["napalm-burst", "brain-rot"],
		attacks: ["bite", "charge", "lightning-beam"],
		spawnBehavior:
			"In Forsaken, the abomination first spawns when entering The Amplifier and then periodically after that. In Liberty Falls, the abomination first spawns on Round 15, during specific main quest steps, and periodically after the first spawn. In Shattered Veil, the abomination only spawns during the Ray Gun MKII-W upgrade quest.",
		combatStrategy: "content/zombies/abomination",
	}),
	makeZombie("the-forsaken", {
		title: "The Forsaken",
		state: Option.none(),
		releaseDate: "2021-10-07",
		image: "/zombies/the-forsaken.webp",
		description:
			"The Forsaken is the final boss of the map Forsaken in Black Ops Cold War, appearing as one of the elder gods of the Dark Aether.",
		games: ["black-ops-cold-war", "black-ops-6"],
		maps: ["forsaken", "reckoning"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["head", "shoulders", "stomach", "power-core"],
		elementalWeakness: ["napalm-burst", "cryo-freeze"],
		attacks: [
			"ground-slam",
			"eye-beam",
			"slow-field",
			"energy-orbs",
			"electrical-bolts",
			"powerful-melee",
		],
		spawnBehavior:
			"The Forsaken spawns once you have entered the final encounter arena. In Reckoning, the forsaken is the dark entity you must defeat in order to obtain the Gorgofex wonder weapon, in the form of an Uber Klaus.",
		combatStrategy: "content/zombies/the-forsaken",
	}),
	makeZombie("vermin", {
		title: "Vermin",
		state: Option.none(),
		releaseDate: "2024-10-25",
		image: "/zombies/vermin.webp",
		description:
			"Vermin are large, spider-like ravenous scuttlers with a central thorax that seems to take the form of a screaming human head. Originating on the map Liberty Falls and Terminus in Black Ops 6.",
		games: ["black-ops-6"],
		maps: [
			"liberty-falls",
			"terminus",
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
			"reckoning",
		],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: ["cryo-freeze"],
		attacks: ["bite", "lunge"],
		spawnBehavior:
			"Vermin serve as the special round on Liberty Falls, and spawn infrequently on non-special rounds. In all other maps, Vermin appear periodically or during specific quest steps.",
		combatStrategy: "content/zombies/vermin",
	}),
	makeZombie("amalgam", {
		title: "Amalgam",
		state: Option.none(),
		releaseDate: "2024-10-25",
		image: "/zombies/amalgam.webp",
		description:
			"The Amalgam is an elite enemy originating from the map Terminus in Black Ops 6, appearing as a multi-armed and multi-legged mutation of the original zombie.",
		games: ["black-ops-6", "black-ops-7"],
		maps: [
			"terminus",
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
			"reckoning",
			"totenreich",
		],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["glowing-heads"],
		elementalWeakness: ["dead-wire", "shadow-rift"],
		attacks: ["melee-swing", "tongue-grab"],
		spawnBehavior:
			'On Terminus, Citadelle Des Morts, and The Tomb, the Amalgam will first spawn on Round 16. On Citadelle Des Morts, The Tomb, Shattered Veil, and Reckoning, Amalgams can spawn from Doppelghast, which may evolve into Amalgams if left alive for too long. They will also spawn in specific main quest steps in all of these maps. In BO7, the Amalgam spawns as an HVT during the "Stuffed Elephant" relic',
		combatStrategy: "content/zombies/amalgam",
	}),
	makeZombie("nathan", {
		title: "Nathan",
		state: Option.none(),
		releaseDate: "2024-10-25",
		image: "/zombies/nathan.webp",
		description:
			"Nathan Aguinaldo is a mini-boss originating on the map Terminus in Black Ops 6, serving as Maya's younger brother who was experimented on by Dr. Modi for Project Janus.",
		games: ["black-ops-6"],
		maps: ["terminus"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["glowing-heads"],
		elementalWeakness: ["dead-wire", "shadow-rift"],
		attacks: ["melee-swing", "tongue-grab"],
		spawnBehavior:
			"Nathan spawns in as a mini-boss once you enter the code into the keypad in the Bio-Lab, freeing him.",
		combatStrategy: "content/zombies/nathan",
	}),
	makeZombie("patient-13", {
		title: "Patient 13",
		state: Option.none(),
		releaseDate: "2024-10-25",
		image: "/zombies/patient-13.webp",
		description:
			"Patient 13 is the final boss on the map Terminus in Black Ops 6, appearing as a giant mutated kraken like creature who was another experiment of Dr. Modi known as Owen Guthrie.",
		games: ["black-ops-6"],
		maps: ["terminus"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["red-cysts", "glowing-tentacles", "mouth", "eyes"],
		elementalWeakness: [
			"dead-wire",
			"shadow-rift",
			"brain-rot",
			"napalm-burst",
			"cryo-freeze",
			"light-mend",
		],
		attacks: ["ground-slam", "sweeping-slam", "tongue-grab", "aether-release"],
		spawnBehavior:
			"Patient 13 spawns once you have entered the final encounter arena, after completing majority of the main quest.",
		combatStrategy: "content/zombies/patient-13",
	}),
	makeZombie("doppelghast", {
		title: "Doppelghast",
		state: Option.none(),
		releaseDate: "2024-12-05",
		image: "/zombies/doppelghast.webp",
		description:
			"Doppelghasts are violent and display erratic and unsettling movement, as if each head is independently fighting for control of its body. Originating from the map Citadelle Des Morts in Black Ops 6.",
		games: ["black-ops-6", "black-ops-7"],
		maps: [
			"citadelle-des-morts",
			"the-tomb",
			"shattered-veil",
			"reckoning",
			"ashes-of-the-damned",
			"paradox-junction",
		],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["light-mend"],
		attacks: ["melee-swing", "needle-barrage"],
		spawnBehavior:
			"Doppelghasts will first spawn on Round 13 on Citadelle Des Morts and Round 14 on The Tomb. Doppelghasts on Citadelle Des Morts, The Tomb, Shattered Veil, and Reckoning can spawn as an evolution of parasites if they are left alive too long and consume a zombie.",
		combatStrategy: "content/zombies/doppelghast",
	}),
	makeZombie("the-guardian", {
		title: "The Guardian",
		state: Option.none(),
		releaseDate: "2024-12-05",
		image: "/zombies/the-guardian.webp",
		description:
			"The Guardian is a colossal stone golem that served as the guardian of the Obscurus Altilium also known as the Amulet. Originating from the map Citadelle Des Morts in Black Ops 6.",
		games: ["black-ops-6"],
		maps: ["citadelle-des-morts"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["chest", "shoulders", "forearms", "calves"],
		elementalWeakness: [],
		attacks: ["lava-balls", "ground-stomp", "hammer-slam", "leaping-hammer"],
		spawnBehavior:
			"The Guardian spawns once you use the Guardian Key on the statue in the Town Square.",
		combatStrategy: "content/zombies/the-guardian",
	}),
	makeZombie("shock-mimic", {
		title: "Shock Mimic",
		state: Option.none(),
		releaseDate: "2025-01-28",
		image: "/zombies/shock-mimic.webp",
		description:
			"Shock Mimics are a special enemy often disguising themselves as useful items, then breaking out when approached to attack players.",
		games: ["black-ops-6", "black-ops-7"],
		maps: ["the-tomb", "ashes-of-the-damned", "astra-malorum", "paradox-junction", "totenreich"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["mouth"],
		elementalWeakness: ["brain-rot"],
		attacks: ["melee-swing", "tentacle-grab", "shock-burst"],
		spawnBehavior:
			"On The Tomb, they first spawn in on Round 8, and periodically after that as useful items. In Black Ops 7, they spawn in Cursed Mode with the Lawyer's Pen relic equipped, but are also a normal spawn in the Paradox Junction map.",
		combatStrategy: "content/zombies/shock-mimic",
	}),
	makeZombie("sentinel-artifact", {
		title: "Sentinel Artifact",
		state: Option.none(),
		releaseDate: "2025-01-28",
		image: "/zombies/sentinel-artifact.webp",
		description:
			"The Sentinel Artifact is a powerful relic with a history spanning eons, originating from the Chaos Story in Voyage of Despair, and appearing as a boss in Black Ops 6 Zombies.",
		games: ["black-ops-6"],
		maps: ["the-tomb"],
		type: "Boss",
		speed: "Slow",
		weakPoints: [],
		elementalWeakness: [],
		attacks: ["laser"],
		spawnBehavior:
			"The Sentinel Artifact spawns in once you activate it by trying to take it in the final encounter.",
		combatStrategy: "content/zombies/sentinel-artifact",
	}),
	makeZombie("toxic-zombies", {
		title: "Toxic Zombies",
		state: Option.none(),
		releaseDate: "2025-04-02",
		image: "/zombies/toxic-zombie.webp",
		description:
			"Toxic Zombies are glowing ghouls identifiable by their greenish hue and skeletal exterior intent on sprinting toward their prey before exploding. Originating on the map Shattered Veil in Black Ops 6.",
		games: ["black-ops-6", "black-ops-7"],
		maps: [
			"shattered-veil",
			"reckoning",
			"ashes-of-the-damned",
			"astra-malorum",
			"paradox-junction",
			"totenreich",
		],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: [],
		attacks: ["melee-swing", "acid-explosion"],
		spawnBehavior:
			'Toxic Zombies spawn during the special round on Shattered Veil, while also periodically spawning outside of these rounds and during specific main quest steps. On Reckoning, Toxic Zombies will only spawn out of the test tubes during one of the main quest steps. Can also spawn on all BO7 maps via the "Dancing Arnie" relic.',
		combatStrategy: "content/zombies/toxic-zombies",
	}),
	makeZombie("elder-disciple", {
		title: "Elder Disciple",
		state: Option.none(),
		releaseDate: "2025-04-02",
		image: "/zombies/elder-disciple.webp",
		description:
			"Elder Disciples are strange, floating apparitions gaining strength as they empower the zombies around them while summoning more undead to join the battle.",
		games: ["black-ops-6"],
		maps: ["shattered-veil", "reckoning"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: ["dead-wire", "light-mend"],
		attacks: ["zombie-buff", "zombie-evolution"],
		spawnBehavior:
			"Elder Disciples spawn on Round 16, then around every 3 Rounds after that. On Reckoning, Elder Disciple will only spawn out of one of the test tubes during one of the main quest steps.",
		combatStrategy: "content/zombies/elder-disciple",
	}),
	makeZombie("z-rex", {
		title: "Z-Rex",
		state: Option.none(),
		releaseDate: "2025-04-02",
		image: "/zombies/z-rex.webp",
		description:
			"The Z-Rex is a massive reanimated dinosaur revived by residual temporal energy, originating on Shattered Veil in Black Ops 6.",
		games: ["black-ops-6"],
		maps: ["shattered-veil"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["eyes", "mouth", "attached-zombies"],
		elementalWeakness: [],
		attacks: ["bite", "tail-slam", "dino-leap"],
		spawnBehavior:
			"The Dinosaur spawns after activating the final encounter by giving the Sentinel Artifact to S.A.M.",
		combatStrategy: "content/zombies/z-rex",
	}),
	makeZombie("kommando-klaus", {
		title: "Kommando Klaus",
		state: Option.none(),
		releaseDate: "2025-08-07",
		image: "/zombies/kommando-klaus.webp",
		description:
			"These periodic robot battalions known as Kommando Klaus, equipped with rocket boots, home in on perceived intruders with deadly self-destruct sequences engaged.",
		games: ["black-ops-6"],
		maps: ["reckoning"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head", "power-core"],
		elementalWeakness: ["cryo-freeze"],
		attacks: ["self-destruct"],
		spawnBehavior:
			"Kommando Klaus will first spawn on Reckoning on round 5, 6, or 7 as the special round and then every 5 rounds afterwards. They will also spawn alongside regular zombies in the later rounds.",
		combatStrategy: "content/zombies/kommando-klaus",
	}),
	makeZombie("uber-klaus", {
		title: "Uber Klaus",
		state: Option.none(),
		releaseDate: "2025-08-07",
		image: "/zombies/uber-klaus.webp",
		description:
			"A murderous automaton encased in a toughened, bulky exoskeleton that maintains a cocky attitude, lethal efficiency, and super strength, all directed at newly programmed threats.",
		games: ["black-ops-6", "black-ops-7"],
		maps: ["reckoning", "ashes-of-the-damned", "astra-malorum"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["head", "power-core", "shoulders"],
		elementalWeakness: ["cryo-freeze", "napalm-burst"],
		attacks: ["powerful-melee", "electrical-bolts"],
		spawnBehavior:
			"Uber Klaus will first spawn on Reckoning on Round 16, then every 3-5 rounds afterwards. They will also spawn in during specific main quest steps. On Ashes of the Damned, he spawns in after Round 8 when walking near the gate leading to Blackwater Lake in Janus Towers Plaza.",
		combatStrategy: "content/zombies/uber-klaus",
	}),
	makeZombie("sam", {
		title: "S.A.M.",
		state: Option.none(),
		releaseDate: "2025-08-07",
		image: "/zombies/sam.webp",
		description:
			"An Artificial Intelligence based on a snapshot of Samantha Maxis, obsessed with the idea of using Maxis' body to become Human.",
		games: ["black-ops-6"],
		maps: ["reckoning"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["glowing-lights", "power-core"],
		elementalWeakness: [],
		attacks: ["eye-beam", "electrical-bolts", "aether-barrage"],
		spawnBehavior: "S.A.M. spawns when you choose the Richtofen side of the final boss fight.",
		combatStrategy: "content/zombies/sam",
	}),
	makeZombie("uber-richtofen", {
		title: "Uber Richtofen",
		state: Option.none(),
		releaseDate: "2025-08-07",
		image: "/zombies/uber-richtofen.webp",
		description:
			'Appearing initially encased in a toughened, bulky exoskeleton, "The Director" will stop at nothing to save his family.',
		games: ["black-ops-6"],
		maps: ["reckoning"],
		type: "Boss",
		speed: "Medium",
		weakPoints: ["shoulders", "power-core", "head", "jetpack"],
		elementalWeakness: [],
		attacks: ["powerful-melee", "electrical-bolts", "wunderwaffe-shot", "aerial-bomber"],
		spawnBehavior: "Uber Richtofen spawns when you choose to help S.A.M. in the final boss fight.",
		combatStrategy: "content/zombies/uber-richtofen",
	}),
	makeZombie("ravager", {
		title: "Ravager",
		state: Option.none(),
		releaseDate: "2025-11-14",
		image: "/zombies/ravager.webp",
		description:
			"A tortured minion of an unknown evil, prowling the Dark Aether on all fours, usually in packs, lurking in the shadows until the moment it can strike.",
		games: ["black-ops-7"],
		maps: ["ashes-of-the-damned", "astra-malorum"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["light-mend"],
		attacks: ["melee-swing", "ravage"],
		spawnBehavior:
			"Ravagers spawn as the special round in Ashes of the Damned, and will spawn in among normal zombies in the later rounds.",
		combatStrategy: "content/zombies/ravager",
	}),
	makeZombie("zursa", {
		title: "Zursa",
		state: Option.none(),
		releaseDate: "2025-11-14",
		image: "/zombies/zursa.webp",
		description:
			"An apex predator twisted by the Dark Aether, driven by madness and aggression with parasitic infestations that make it an Elite level threat.",
		games: ["black-ops-7"],
		maps: ["ashes-of-the-damned"],
		type: "Elite",
		speed: "Medium",
		weakPoints: ["red-glowing-spots", "bee-nests"],
		elementalWeakness: ["napalm-burst", "brain-rot"],
		attacks: ["maul", "bee-swarm"],
		spawnBehavior:
			"Zursa will first spawn on Round 16, then every 3-5 rounds after that with the chance for multiple to spawn on those rounds.",
		combatStrategy: "content/zombies/zursa",
	}),
	makeZombie("veytharion", {
		title: "Veytharion",
		state: Option.none(),
		releaseDate: "2025-11-14",
		image: "/zombies/veytharion.webp",
		description:
			"A tormented shadowsmith controlled by the Warden, tasked with containing our crew and the Dark Aether in Ashes of the Damned.",
		games: ["black-ops-7"],
		maps: ["ashes-of-the-damned"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["red-glowing-spots", "golden-underbelly"],
		elementalWeakness: [],
		attacks: ["missile-barrage", "carpet-bomb", "car-steal", "aether-laser"],
		spawnBehavior:
			"Veytharion is the final boss of the Ashes of the Damned main quest Dust To Dust and will spawn during the final encounter.",
		combatStrategy: "content/zombies/veytharion",
	}),
	makeZombie("oscar", {
		title: "O.S.C.A.R.",
		state: Option.none(),
		releaseDate: "2025-12-04",
		image: "/zombies/oscar.webp",
		description:
			"The Observation System and Carnifex Adjudicator Robot (O.S.C.A.R.) is a stalking menace persistent in assessing and neutralizing threats.",
		games: ["black-ops-7"],
		maps: ["astra-malorum"],
		type: "Elite",
		speed: "Slow",
		weakPoints: [],
		elementalWeakness: ["brain-rot"],
		attacks: [
			"drone-shield",
			"tesla-field",
			"attack-drones-hologram",
			"internal-circuitry-projectile",
		],
		spawnBehavior:
			"O.S.C.A.R. will first spawn once the power is turned on and will patrol the map until killed, and will then respawn after two full rounds. He can also spawn during specific main quest steps.",
		combatStrategy: "content/zombies/oscar",
	}),
	makeZombie("caltheris", {
		title: "Caltheris",
		state: Option.none(),
		releaseDate: "2025-12-04",
		image: "/zombies/caltheris.webp",
		description:
			"An imprisoned shadowsmith by the Warden, sister of Veytharion, forced against her will to serve the Warden's will.",
		games: ["black-ops-7"],
		maps: ["astra-malorum"],
		type: "Boss",
		speed: "Fast",
		weakPoints: ["blue-glowing-spots"],
		elementalWeakness: [],
		attacks: ["orbital-laser", "meteor-shower", "toxic-gas-cloud", "ground-slam", "rock-throw"],
		spawnBehavior:
			"Caltheris is the final boss of the Astra Malorum main quest and will spawn during the final encounter.",
		combatStrategy: "content/zombies/caltheris",
	}),
	makeZombie("rad-hound", {
		title: "Rad-Hound",
		state: Option.none(),
		releaseDate: "2026-03-11",
		image: "/zombies/rad-hound.webp",
		description:
			"Bulging with irradiated innards, these foul minions of The Warden can be quelled with quick thinking and rapid firing, but they leave behind a dangerous radioactive explosion on death.",
		games: ["black-ops-7"],
		maps: ["paradox-junction"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["shadow-rift"],
		attacks: ["bite", "lunge", "radioactive-explosion"],
		spawnBehavior:
			"Rad Hounds spawn during the special rounds on Paradox Junction, while also spawning in with normal zombies in the later rounds.",
		combatStrategy: "content/zombies/rad-hound",
	}),
	makeZombie("the-dark-heart", {
		title: "The Dark Heart",
		state: Option.none(),
		releaseDate: "2026-03-11",
		image: "/zombies/the-dark-heart.webp",
		description:
			"The Dark Heart is the core of the Warden's temporal prison, serving as the barrier between reality and purgatory.",
		games: ["black-ops-7"],
		maps: ["paradox-junction"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["meteor-shower", "fire-tornadoes"],
		spawnBehavior:
			"The Dark Heart is the final boss of the Paradox Junction main quest and will spawn during the final encounter.",
		combatStrategy: "content/zombies/the-dark-heart",
	}),
	makeZombie("frost-zombie", {
		title: "Frost Zombie",
		state: Option.some("New"),
		releaseDate: "2026-04-30",
		image: "/zombies/frost-zombie.webp",
		description:
			"Frost Zombies are lurking enemies emerging from the mists during special rounds to attack in droves.",
		games: ["black-ops-7"],
		maps: ["totenreich", "ashes-of-the-damned", "astra-malorum", "paradox-junction"],
		type: "Special",
		speed: "Medium",
		weakPoints: ["head"],
		elementalWeakness: ["napalm-burst"],
		attacks: ["melee-swing"],
		spawnBehavior:
			'Frost Zombies spawn during the special rounds on Totenreich, while also spawning in with normal zombies from Round 8 onwards. Can also spawn on all BO7 maps via the "Dancing Arnie" relic.',
		combatStrategy: "content/zombies/frost-zombie",
	}),
	makeZombie("necropincer", {
		title: "Necropincer",
		state: Option.some("New"),
		releaseDate: "2026-04-30",
		image: "/zombies/necropincer.webp",
		description:
			"A doomed undead Viking warrior spirit that rises from the cold seas to aid in the protection of Eidskallen.",
		games: ["black-ops-7"],
		maps: ["totenreich"],
		type: "Special",
		speed: "Fast",
		weakPoints: ["head"],
		elementalWeakness: ["dead-wire"],
		attacks: ["trident-stab", "trident-throw", "claw-slam", "claw-block"],
		spawnBehavior:
			"The Necropincer will first spawn on Round 12, and will continue to spawn in with normal zombies from that point on.",
		combatStrategy: "content/zombies/necropincer",
	}),
	makeZombie("dravakar", {
		title: "Dravakar",
		state: Option.some("New"),
		releaseDate: "2026-04-30",
		image: "/zombies/dravakar.webp",
		description:
			"The big brother of Veytharion and Caltheris, Dravakar is an ice giant Shadowsmith forced to rule over Eidskallen at the behest of The Warden.",
		games: ["black-ops-7"],
		maps: ["totenreich"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["red-glowing-spots"],
		elementalWeakness: [],
		attacks: ["ice-rock-barrage", "frozen-dawn"],
		spawnBehavior:
			"Dravakar is the final boss of the Totenreich main quest and will spawn during the final encounter.",
		combatStrategy: "content/zombies/dravakar",
	}),
	makeZombie("gjallarfrost", {
		title: "Gjallarfrost",
		state: Option.some("New"),
		releaseDate: "2026-04-30",
		image: "/zombies/gjallarfrost.webp",
		description:
			"An icy golem-like figure summoned by Dravakar serving as an extension of the Shadowsmith.",
		games: ["black-ops-7"],
		maps: ["totenreich"],
		type: "Boss",
		speed: "Slow",
		weakPoints: ["mouth"],
		elementalWeakness: [],
		attacks: ["ice-pillars"],
		spawnBehavior:
			"The Gjallarfrost is summoned by Dravakar during this final encounter of the main quest, during the transition phases.",
		combatStrategy: "content/zombies/gjallarfrost",
	}),
])

const ZOMBIE_INSERATION_INDEX_BY_ID = new Map<ZombieKey, number>(
	[...ZOMBIES.keys()].map((id, i) => [id, i]),
)
