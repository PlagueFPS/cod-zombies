import { Option } from "effect"

export interface ZombieAttack {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "ZombieAttack"
	/** Unique identifier for the zombie attack */
	readonly id: string
	/** Name of the zombie attack */
	readonly title: string
	/** Range of the zombie attack */
	readonly range: "Short" | "Medium" | "Long"
	/** Description of the zombie attack */
	readonly description: string
}

/** Union type of all zombie attacks */
export type ZombieAttackKey = Parameters<(typeof ZOMBIE_ATTACKS)["get"]>[0]

/**
 * Gets a zombie attack by its key.
 */
export const getZombieAttackByKey = (key: ZombieAttackKey) =>
	Option.fromUndefinedOr(ZOMBIE_ATTACKS.get(key))

const makeZombieAttack = <T extends string>(
	identifier: T,
	attack: Omit<ZombieAttack, "_tag" | "id">,
): [T, ZombieAttack] => [
	identifier,
	{
		_tag: "ZombieAttack",
		id: identifier,
		...attack,
	},
]

const ZOMBIE_ATTACKS = new Map([
	makeZombieAttack("melee-swing", {
		title: "Melee Swing",
		range: "Short",
		description: "Swings at players when within melee range.",
	}),
	makeZombieAttack("flesh-throw", {
		title: "Flesh Throw",
		range: "Medium",
		description: "Hurls a piece of flesh at players only when unable to path towards them.",
	}),
	makeZombieAttack("bite", {
		title: "Bite",
		range: "Short",
		description: "A quick chomp when within melee range of the targeted player.",
	}),
	makeZombieAttack("lunge", {
		title: "Lunge",
		range: "Medium",
		description:
			"Quickly jumps towards the targeted player when outside of melee range, biting the player if hit by the lunge.",
	}),
	makeZombieAttack("explosion", {
		title: "Explosion",
		range: "Short",
		description:
			"Releases an explosion on death, damaging and disorienting all players within the radius.",
	}),
	makeZombieAttack("nova-gas", {
		title: "Nova Gas",
		range: "Short",
		description:
			"Releases Nova 6 gas when killed damaging and disorienting players within the radius.",
	}),
	makeZombieAttack("weapon-steal", {
		title: "Weapon Steal",
		range: "Short",
		description:
			"Sprints towards the targeted player, grabbing them, teleporting them, and stealing their currently held weapon.",
	}),
	makeZombieAttack("perk-steal", {
		title: "Perk Steal",
		range: "Short",
		description:
			"Repeated banging on Perk Machines until they are destroyed, causing all players to lose that perk.",
	}),
	makeZombieAttack("rally-cry", {
		title: "Rally Cry",
		range: "Medium",
		description:
			"Releases a rally cry that Unleashes a roar that rallies nearby zombies to sprint towards the player.",
	}),
	makeZombieAttack("power-up-steal", {
		title: "Power-Up Steal",
		range: "Short",
		description:
			"Steals dropped Power-Ups, cycling through all drops as they try to escape with the drop.",
	}),
	makeZombieAttack("sonic-screech", {
		title: "Sonic Screech",
		range: "Medium",
		description:
			"Unleashes a loud shriek, temporarily blinding and deafening all players hit by it.",
	}),
	makeZombieAttack("flaming-aura", {
		title: "Flaming Aura",
		range: "Medium",
		description: "Slowly burns nearby players within a radius.",
	}),
	makeZombieAttack("fiery-explosion", {
		title: "Fiery Explosion",
		range: "Short",
		description:
			"Releases a powerful explosion upon death or if a player gets too close. Leaving a fire patch on the ground for a short period.",
	}),
	makeZombieAttack("grab", {
		title: "Grab",
		range: "Short",
		description:
			"Grabs the player and headbutts them, dealing massive damage, teleporting them to a random location, and stealing one of their perks.",
	}),
	makeZombieAttack("knockback-explosion", {
		title: "Knockback Explosion",
		range: "Medium",
		description:
			"Releases a strong explosion upon death, damaging and knocking back players several meters.",
	}),
	makeZombieAttack("leap", {
		title: "Leap",
		range: "Medium",
		description:
			"Leaps onto the player, attaching to their head and scratching their face until downed.",
	}),
	makeZombieAttack("aoe-slam", {
		title: "AOE Slam",
		range: "Short",
		description: "Slams the ground stunning all players within the radius for around 5 seconds.",
	}),
	makeZombieAttack("lightning-bolt", {
		title: "Lightning Bolt",
		range: "Long",
		description: "Fires a lightning bolt at the targeted player dealing significant damage.",
	}),
	makeZombieAttack("charge", {
		title: "Charge",
		range: "Long",
		description: "Charges towards the targeted player dealing critical damage on impact.",
	}),
	makeZombieAttack("jump-swing", {
		title: "Jump Swing",
		range: "Medium",
		description: "Jumps towards the player while swinging, dealing damage once within melee range.",
	}),
	makeZombieAttack("point-steal", {
		title: "Point Steal",
		range: "Short",
		description:
			"Steals 2000 points per hit on a player, dealing normal damage if the player has no points available.",
	}),
	makeZombieAttack("flamethrower", {
		title: "Flamethrower",
		range: "Short",
		description: "Shoots a flamethrower constantly burning players within close proximity.",
	}),
	makeZombieAttack("claw-grab", {
		title: "Claw Grab",
		range: "Short",
		description:
			"Launches a Giant Claw that grabs players, slowly bringing them to the Panzer, as they are being burned by the Flamethrower. *Origins Only",
	}),
	makeZombieAttack("emp-launcher", {
		title: "EMP Launcher",
		range: "Long",
		description:
			"Shoots a barrage of EMP Grenades, stunning and disorienting players hit by the projectile. *Der Eisendrache & Revelations Only",
	}),
	makeZombieAttack("projectile-vomit", {
		title: "Projectile Vomit",
		range: "Long",
		description: "Shoots a liquid out of its mouth towards the player, damaging them when hit.",
	}),
	makeZombieAttack("ground-slam", {
		title: "Ground Slam",
		range: "Short",
		description: "Slams the ground, dealing critical damage to nearby players.",
	}),
	makeZombieAttack("skull-summon", {
		title: "Skull Summon",
		range: "Long",
		description: "Summons a few giant skulls that chase the player dealing damage once hit.",
	}),
	makeZombieAttack("volcano-summon", {
		title: "Volcano Summon",
		range: "Long",
		description:
			"Summons a bunch of mini-volcanos along the battlefield burning players that pass through them.",
	}),
	makeZombieAttack("electric-burst", {
		title: "Electric Burst",
		range: "Long",
		description:
			"Channels electrical energy for a brief time in the center of the arena, instantly downing any player hit by the attack once it is fully charged.",
	}),
	makeZombieAttack("web-projectile", {
		title: "Web Projectile",
		range: "Long",
		description: "Shoots a web at the targeted player, damaging them on hit.",
	}),
	makeZombieAttack("powerful-melee", {
		title: "Powerful Melee",
		range: "Short",
		description: "Melee swing dealing critical damage to any player hit.",
	}),
	makeZombieAttack("toxic-gas", {
		title: "Toxic Gas",
		range: "Short",
		description:
			"Releases toxic gas that cause players to begin coughing, disabling the ability to run, or fire weapons for a brief period.",
	}),
	makeZombieAttack("leg-stab", {
		title: "Leg Stab",
		range: "Medium",
		description: "Uses its massive legs to stab players dealing critical damage if hit.",
	}),
	makeZombieAttack("vine-slam", {
		title: "Vine Slam",
		range: "Medium",
		description:
			"Slams a vine down in the center of the room, dealing critical damage to any player hit.",
	}),
	makeZombieAttack("lightning-beam", {
		title: "Lightning Beam",
		range: "Medium",
		description:
			"Charges up lightning to unleash it as a beam towards the player, damaging them on hit.",
	}),
	makeZombieAttack("self-destruct", {
		title: "Self Destruct",
		range: "Short",
		description: "Charges the player self-destructing once within melee range.",
	}),
	makeZombieAttack("cannon-blast", {
		title: "Cannon Blast",
		range: "Long",
		description:
			"Charges and fires a homing arm cannon blast at the targeted player, dealing damage on hit.",
	}),
	makeZombieAttack("dragon-fire", {
		title: "Dragon Fire",
		range: "Long",
		description:
			"Breathes dragon fire down on the battlefield engulfing the entire area in flames that damage players.",
	}),
	makeZombieAttack("harpoon-barrage", {
		title: "Harpoon Barrage",
		range: "Long",
		description:
			"Launches a barrage of harpoons at the targeted player that explode after a short time.",
	}),
	makeZombieAttack("zombie-buff", {
		title: "Zombie Buff",
		range: "Short",
		description:
			"Buffs nearby regular zombies, making them deal more damage, faster, and become more resistant to damage.",
	}),
	makeZombieAttack("poison-aura", {
		title: "Poison Aura",
		range: "Short",
		description: "Deals poison damage to players when within close proximity.",
	}),
	makeZombieAttack("axe-throw", {
		title: "Axe Throw",
		range: "Medium",
		description: "Launches one of its two axes at the targeted player dealing damage on hit.",
	}),
	makeZombieAttack("rapid-slashes", {
		title: "Rapid Slashes",
		range: "Short",
		description:
			"Unleashes a barrage of rapid slashes from their metallic claws dealing quick damage.",
	}),
	makeZombieAttack("heavy-leap", {
		title: "Heavy Leap",
		range: "Medium",
		description:
			"Leaps towards the targeted player doing damage on hit and unleashes Rapid Slashes once landing.",
	}),
	makeZombieAttack("homing-vomit", {
		title: "Homing Vomit",
		range: "Long",
		description:
			"Shoots a homing vomit projectile at the targeted player dealing damage on hit and overtime.",
	}),
	makeZombieAttack("tongue-grab", {
		title: "Tongue Grab",
		range: "Medium",
		description: "Releases its tongue, grabbing any player in range and slowly pulling them.",
	}),
	makeZombieAttack("fireball", {
		title: "Fireball",
		range: "Long",
		description:
			"Shoots a fireball at the targeted player dealing damage on hit and leaving a patch of flames on the ground.",
	}),
	makeZombieAttack("eye-beam", {
		title: "Eye Beam",
		range: "Long",
		description:
			"Shoots a powerful laser beam from its eye dealing massive damage overtime to the player while being hit by the beam.",
	}),
	makeZombieAttack("vampiric-melee", {
		title: "Vampiric Melee",
		range: "Short",
		description:
			"Swings at the targeted player when within range, temporarily stopping health regeneration.",
	}),
	makeZombieAttack("mega-bite", {
		title: "Mega Bite",
		range: "Short",
		description:
			"Latches onto the player and bites into them, dealing massive damage. *Crimson Nosferatu Only",
	}),
	makeZombieAttack("pounce", {
		title: "Pounce",
		range: "Long",
		description:
			"Jumps onto the targeted player to gain a positional advantage dealing little damage to the player.",
	}),
	makeZombieAttack("sword-swing", {
		title: "Sword Swing",
		range: "Short",
		description: "Swings their sword to deal damage to the player in close range.",
	}),
	makeZombieAttack("spear-throw", {
		title: "Spear Throw",
		range: "Long",
		description:
			"Throws a spear at the targeted player exploding on contact dealing damage to anyone in the area of effect.",
	}),
	makeZombieAttack("shield-blind", {
		title: "Shield Blind",
		range: "Medium",
		description:
			"Sits behind its shield while charging up and releasing a flash temporarily blinding nearby players.",
	}),
	makeZombieAttack("lightning-strike", {
		title: "Lightning Strike",
		range: "Long",
		description: "Covers an entire island in lightning forcing all players to re-locate or die.",
	}),
	makeZombieAttack("flaming-spears", {
		title: "Flaming Spears",
		range: "Long",
		description:
			"Throws flaming spears onto the arena dealing damage to player, but also charging the players special weapon when taking damage.",
	}),
	makeZombieAttack("lightning-bolts", {
		title: "Lightning Bolts",
		range: "Long",
		description: "Shoots electric bolts at the targeted player dealing damage on impact.",
	}),
	makeZombieAttack("radioactive-blast", {
		title: "Radioactive Blast",
		range: "Long",
		description:
			"Shoots a single radioactive blast, dealing damage on impact and leaving a zone of toxic radiation that ignores armor. *Megaton Bomber Only",
	}),
	makeZombieAttack("radioactive-flurry", {
		title: "Radioactive Flurry",
		range: "Long",
		description:
			"Shoots a flurry of three radioactive blasts dealing damage on impact. *Megaton Blaster Only",
	}),
	makeZombieAttack("tentacle-grab", {
		title: "Tentacle Grab",
		range: "Medium",
		description:
			"Uses the tentacles on its back to grab a player out of melee range dealing damage before throwing them back out.",
	}),
	makeZombieAttack("shock-burst", {
		title: "Shock Burst",
		range: "Long",
		description:
			"Releases a shock burst when destroying thrown equipment, damaging nearby players.",
	}),
	makeZombieAttack("fireballs", {
		title: "Fireballs",
		range: "Long",
		description:
			"Launches a barrage of fireballs that track the player, dealing damage and spawning a hellhound upon impact.",
	}),
	makeZombieAttack("life-drain", {
		title: "Life Drain",
		range: "Medium",
		description:
			"Shoots a beam at the targeted player ignoring armor and draining the life from the player simultaneously healing the Disciple.",
	}),
	makeZombieAttack("molotov-cannon", {
		title: "Molotov Cannon",
		range: "Medium",
		description:
			"Fires incendiary projectiles simlar to Molotovs dealing damage on impact and overtime.",
	}),
	makeZombieAttack("crystal-barrage", {
		title: "Crystal Barrage",
		range: "Long",
		description:
			"Fires a barrage of orange crystals damaging only the players armor or their health if their armor is fully depleted.",
	}),
	makeZombieAttack("heal-summon", {
		title: "Heal Summon",
		range: "Short",
		description:
			"Summons a circle of zombies around her to drain life from and gain some health back.",
	}),
	makeZombieAttack("aether-release", {
		title: "Aether Release",
		range: "Long",
		description:
			"Charges up and releases a devasting blast of Aether energy instantly downing any player without line of sight of the attack.",
	}),
	makeZombieAttack("slow-field", {
		title: "Slow Field",
		range: "Medium",
		description:
			"Spawns a slow field at a dedicated location in the arena, slowing any players within the field.",
	}),
	makeZombieAttack("energy-orbs", {
		title: "Energy Orbs",
		range: "Long",
		description: "Shoots tracking energy orbs that deal damage to players upon impact.",
	}),
	makeZombieAttack("electrical-bolts", {
		title: "Electrical Bolts",
		range: "Long",
		description:
			"Fire electric bolts at players damaging them on impact and leaving a shock field around the point of impact for a short duration.",
	}),
	makeZombieAttack("sweeping-slam", {
		title: "Sweeping Slam",
		range: "Medium",
		description:
			"Slams the ground on the side of the arena, than sweeps across to the other side dealing critical damage to anyone hit.",
	}),
	makeZombieAttack("needle-barrage", {
		title: "Needle Barrage",
		range: "Medium",
		description: "Release a barrage of needles dealing damage and disorienting any player hit.",
	}),
	makeZombieAttack("lava-balls", {
		title: "Lava Balls",
		range: "Long",
		description:
			"Launches three fireballs that spread lava over an area dealing massive damage on impact and damage overtime via the lava.",
	}),
	makeZombieAttack("ground-stomp", {
		title: "Ground Stomp",
		range: "Short",
		description:
			"Stomps the ground with its foot, dealing damage and knocking back players in close proximity.",
	}),
	makeZombieAttack("hammer-slam", {
		title: "Hammer Slam",
		range: "Long",
		description:
			"Slams his hammer down in front of him dealing damage to players nearby while also spawning a line of lava from the impact to the edge of the arena.",
	}),
	makeZombieAttack("leaping-hammer", {
		title: "Leaping Hammer",
		range: "Long",
		description:
			"Targets an area to leap to, slamming his hammer in the center of the zone dealing more damage the closer you are to the center, knocking back enemies.",
	}),
	makeZombieAttack("laser", {
		title: "Laser",
		range: "Long",
		description:
			"Emits a laser as it rotates slowly around the arena, with more lasers appearing the deeper in the fight.",
	}),
	makeZombieAttack("acid-explosion", {
		title: "Acid Explosion",
		range: "Short",
		description:
			"Release a powerful explosion upon death, leaving behind a pool of acid that damages the player over time.",
	}),
	makeZombieAttack("zombie-evolution", {
		title: "Zombie Evolution",
		range: "Medium",
		description:
			"While nearby another zombie, it will send a beam to the zombie to force it to evolve to its next stage of evolution. Zombie into Vermin, Vermin into Parasite, Parasite into Doppleghast, Doppleghast into Amalgam.",
	}),
	makeZombieAttack("tail-slam", {
		title: "Tail Slam",
		range: "Short",
		description:
			"Slams its tail on the ground three times in quick succession when the player is behind it within melee range.",
	}),
	makeZombieAttack("dino-leap", {
		title: "Dino Leap",
		range: "Long",
		description:
			"Leaps towards the targeted player, dealing damage on impact and knocking back all enemies.",
	}),
	makeZombieAttack("aether-barrage", {
		title: "Aether Barrage",
		range: "Long",
		description:
			"Shoots a barrage of purple aether beams that deal significant damage on direct impact.",
	}),
	makeZombieAttack("wunderwaffe-shot", {
		title: "Wunderwaffe Shot",
		range: "Long",
		description:
			"Fires the Wunderwaffe DG-2 at players, damaging and stunning them for a short time.",
	}),
	makeZombieAttack("aerial-bomber", {
		title: "Aerial Bomber",
		range: "Long",
		description:
			"Flys through the sky dropping bombs over the battlefield that explode upon impact or act as landmines when stepped near.",
	}),
	makeZombieAttack("generator-siphon", {
		title: "Generator Siphon",
		range: "Short",
		description:
			"Siphons element 115 from the Conversion Generators, disabling them if fully drained.",
	}),
	makeZombieAttack("ravage", {
		title: "Ravage",
		range: "Short",
		description: "Eats left over ground loot, sprinting and teleporting underground when full.",
	}),
	makeZombieAttack("maul", {
		title: "Maul",
		range: "Short",
		description:
			"Bites or claw swipes nearby enemies, dealing significant damage and leaving a Damage Over Time effect on the player.",
	}),
	makeZombieAttack("bee-swarm", {
		title: "Bee Swarm",
		range: "Long",
		description:
			"Launches a swarm of bees that follow the player until destroyed, dealing damage and slowing the affected player.",
	}),
	makeZombieAttack("missile-barrage", {
		title: "Missile Barrage",
		range: "Long",
		description:
			"Shoots a barrage of three missiles in the direction the player is currently moving, dealing significant damage.",
	}),
	makeZombieAttack("carpet-bomb", {
		title: "Carpet Bomb",
		range: "Long",
		description:
			"Launches a massive barrage of missiles, covering an entire section of the arena that move much slower, dealing significant damage.",
	}),
	makeZombieAttack("car-steal", {
		title: "Car Steal",
		range: "Short",
		description:
			"Steals Ol' Tessie if no one is inside, damage the car, and throwing it back at a player, dealing decent damage.",
	}),
	makeZombieAttack("aether-laser", {
		title: "Aether Laser",
		range: "Long",
		description:
			"Launches a powerful laser beam that perfectly tracks players, dealing critical damage.",
	}),
	makeZombieAttack("drone-shield", {
		title: "Drone Shield",
		range: "Short",
		description:
			"A smaller, mobile robot tethers itself to O.S.C.A.R., keeping it immune to all incoming damage.",
	}),
	makeZombieAttack("tesla-field", {
		title: "Tesla Field",
		range: "Medium",
		description:
			"An offensive electrical arc crackles out of O.S.C.A.R.’s carapace, searing damage into any nearby threats.",
	}),
	makeZombieAttack("attack-drones-hologram", {
		title: "Attack Drones Hologram",
		range: "Medium",
		description:
			"A Drone Hologram is deployed from O.S.C.A.R.’s chest cavity, and travels directly towards a perceived threat. Attracting nearby enemies to the hit player.",
	}),
	makeZombieAttack("internal-circuitry-projectile", {
		title: "Internal Circuitry Projectile",
		range: "Long",
		description:
			"Produces non-critical internal parts from its interior and hefts them at a threat",
	}),
	makeZombieAttack("orbital-laser", {
		title: "Orbital Laser",
		range: "Long",
		description:
			"Launches a powerful laser beam that perfectly tracks players, dealing critical damage.",
	}),
	makeZombieAttack("meteor-shower", {
		title: "Meteor Shower",
		range: "Long",
		description:
			"Launches a barrage of meteors that rain down on the player, dealing critical damage.",
	}),
	makeZombieAttack("toxic-gas-cloud", {
		title: "Toxic Gas Cloud",
		range: "Long",
		description:
			"Produces a toxic gas cloud that covers the lower arena, limiting health to a maximum of 175HP.",
	}),
	makeZombieAttack("rock-throw", {
		title: "Rock Throw",
		range: "Long",
		description: "Throws a rock at a player, dealing critical damage.",
	}),
	makeZombieAttack("radioactive-explosion", {
		title: "Radioactive Explosion",
		range: "Medium",
		description:
			"Releases a powerful radioactive explosion on death, damaging any players in range.",
	}),
	makeZombieAttack("fire-tornadoes", {
		title: "Fire Tornadoes",
		range: "Short",
		description:
			"Spawns a fire tornado that moves around the area, dealing damage to players in its path.",
	}),
	makeZombieAttack("trident-stab", {
		title: "Trident Stab",
		range: "Short",
		description: "Stabs adversaries who venture too close, dealing critical damage.",
	}),
	makeZombieAttack("trident-throw", {
		title: "Trident Throw",
		range: "Long",
		description: "Throws its trident at more distant foes, dealing damage to the player it hits.",
	}),
	makeZombieAttack("claw-slam", {
		title: "Claw Slam",
		range: "Short",
		description: "Slams its giant claw, dealing critical damage to nearby players.",
	}),
	makeZombieAttack("claw-block", {
		title: "Claw Block",
		range: "Short",
		description: "Summons a shield using its giant claw to block incoming attacks.",
	}),
	makeZombieAttack("ice-rock-barrage", {
		title: "Ice Rock Barrage",
		range: "Long",
		description:
			"Throws a barrage of ice rocks at players, dealing AoE damage, and severe damage if directly impacted.",
	}),
	makeZombieAttack("frozen-dawn", {
		title: "Frozen Dawn",
		range: "Long",
		description:
			"Summons a frozen dawn that denies a large portion of the arena, slowing and dealing damage to players within.",
	}),
	makeZombieAttack("ice-pillars", {
		title: "Ice Pillars",
		range: "Medium",
		description:
			"Summons a series of ice pillars that deal damage to players within their range, and launching them into the air.",
	}),
	makeZombieAttack("fire-beam", {
		title: "Fire Beam",
		range: "Long",
		description:
			"Charges a powerful fire beam that destroys a narrow path, with a delayed explosion along the entire path when the attack is done.",
	}),
])
