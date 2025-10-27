export interface ZombieAttack {
	/** Unique identifier for the zombie attack */
	id: string
	/** Name of the zombie attack */
	title: string
	/** Range of the zombie attack */
	range: "Short" | "Medium" | "Long"
	/** Description of the zombie attack */
	description: string
}

const zombieAttacksRegistry = {
	meleeSwing: {
		id: "melee-swing",
		title: "Melee Swing",
		range: "Short",
		description: "Swings at players when within melee range.",
	},
	fleshThrow: {
		id: "flesh-throw",
		title: "Flesh Throw",
		range: "Medium",
		description: "Hurls a piece of flesh at players only when unable to path towards them.",
	},
	bite: {
		id: "bite",
		title: "Bite",
		range: "Short",
		description: "A quick chomp when within melee range of the targeted player.",
	},
	lunge: {
		id: "lunge",
		title: "Lunge",
		range: "Medium",
		description:
			"Quickly jumps towards the targeted player when outside of melee range, biting the player if hit by the lunge.",
	},
	explosion: {
		id: "explosion",
		title: "Explosion",
		range: "Short",
		description:
			"Releases an explosion on death, damaging and disorienting all players within the radius.",
	},
	novaGas: {
		id: "nova-gas",
		title: "Nova Gas",
		range: "Short",
		description:
			"Releases Nova 6 gas when killed damaging and disorienting players within the radius.",
	},
	weaponSteal: {
		id: "weapon-steal",
		title: "Weapon Steal",
		range: "Short",
		description:
			"Sprints towards the targeted player, grabbing them, teleporting them, and stealing their currently held weapon.",
	},
	perkSteal: {
		id: "perk-steal",
		title: "Perk Steal",
		range: "Short",
		description:
			"Repeated banging on Perk Machines until they are destroyed, causing all players to lose that perk.",
	},
	rallyCry: {
		id: "rally-cry",
		title: "Rally Cry",
		range: "Medium",
		description:
			"Releases a rally cry that Unleashes a roar that rallies nearby zombies to sprint towards the player.",
	},
	powerUpSteal: {
		id: "power-up-steal",
		title: "Power-Up Steal",
		range: "Short",
		description:
			"Steals dropped Power-Ups, cycling through all drops as they try to escape with the drop.",
	},
	sonicScreech: {
		id: "sonic-screech",
		title: "Sonic Screech",
		range: "Medium",
		description:
			"Unleashes a loud shriek, temporarily blinding and deafening all players hit by it.",
	},
	flamingAura: {
		id: "flaming-aura",
		title: "Flaming Aura",
		range: "Medium",
		description: "Slowly burns nearby players within a radius.",
	},
	fieryExplosion: {
		id: "fiery-explosion",
		title: "Fiery Explosion",
		range: "Short",
		description:
			"Releases a powerful explosion upon death or if a player gets too close. Leaving a fire patch on the ground for a short period.",
	},
	grab: {
		id: "grab",
		title: "Grab",
		range: "Short",
		description:
			"Grabs the player and headbutts them, dealing massive damage, teleporting them to a random location, and stealing one of their perks.",
	},
	knockbackExplosion: {
		id: "knockback-explosion",
		title: "Knockback Explosion",
		range: "Medium",
		description:
			"Releases a strong explosion upon death, damaging and knocking back players several meters.",
	},
	leap: {
		id: "leap",
		title: "Leap",
		range: "Medium",
		description:
			"Leaps onto the player, attaching to their head and scratching their face until downed.",
	},
	aoeSlam: {
		id: "aoe-slam",
		title: "AOE Slam",
		range: "Short",
		description: "Slams the ground stunning all players within the radius for around 5 seconds.",
	},
	lightningBolt: {
		id: "lightning-bolt",
		title: "Lightning Bolt",
		range: "Long",
		description: "Fires a lightning bolt at the targeted player dealing significant damage.",
	},
	charge: {
		id: "charge",
		title: "Charge",
		range: "Long",
		description: "Charges towards the targeted player dealing critical damage on impact.",
	},
	jumpSwing: {
		id: "jump-swing",
		title: "Jump Swing",
		range: "Medium",
		description: "Jumps towards the player while swinging, dealing damage once within melee range.",
	},
	pointSteal: {
		id: "point-steal",
		title: "Point Steal",
		range: "Short",
		description:
			"Steals 2000 points per hit on a player, dealing normal damage if the player has no points available.",
	},
	flamethrower: {
		id: "flamethrower",
		title: "Flamethrower",
		range: "Short",
		description: "Shoots a flamethrower constantly burning players within close proximity.",
	},
	clawGrab: {
		id: "claw-grab",
		title: "Claw Grab",
		range: "Short",
		description:
			"Launches a Giant Claw that grabs players, slowly bringing them to the Panzer, as they are being burned by the Flamethrower. *Origins Only",
	},
	empLauncher: {
		id: "emp-launcher",
		title: "EMP Launcher",
		range: "Long",
		description:
			"Shoots a barrage of EMP Grenades, stunning and disorienting players hit by the projectile. *Der Eisendrache & Revelations Only",
	},
	projectileVomit: {
		id: "projectile-vomit",
		title: "Projectile Vomit",
		range: "Long",
		description: "Shoots a liquid out of its mouth towards the player, damaging them when hit.",
	},
	groundSlam: {
		id: "ground-slam",
		title: "Ground Slam",
		range: "Short",
		description: "Slams the ground, dealing critical damage to nearby players.",
	},
	skullSummon: {
		id: "skull-summon",
		title: "Skull Summon",
		range: "Long",
		description: "Summons a few giant skulls that chase the player dealing damage once hit.",
	},
	volcanoSummon: {
		id: "volcano-summon",
		title: "Volcano Summon",
		range: "Long",
		description:
			"Summons a bunch of mini-volcanos along the battlefield burning players that pass through them.",
	},
	electricBurst: {
		id: "electric-burst",
		title: "Electric Burst",
		range: "Long",
		description:
			"Channels electrical energy for a brief time in the center of the arena, instantly downing any player hit by the attack once it is fully charged.",
	},
	webProjectile: {
		id: "web-projectile",
		title: "Web Projectile",
		range: "Long",
		description: "Shoots a web at the targeted player, damaging them on hit.",
	},
	powerfulMelee: {
		id: "powerful-melee",
		title: "Powerful Melee",
		range: "Short",
		description: "Melee swing dealing critical damage to any player hit.",
	},
	toxicGas: {
		id: "toxic-gas",
		title: "Toxic Gas",
		range: "Short",
		description:
			"Releases toxic gas that cause players to begin coughing, disabling the ability to run, or fire weapons for a brief period.",
	},
	legStab: {
		id: "leg-stab",
		title: "Leg Stab",
		range: "Medium",
		description: "Uses its massive legs to stab players dealing critical damage if hit.",
	},
	vineSlam: {
		id: "vine-slam",
		title: "Vine Slam",
		range: "Medium",
		description:
			"Slams a vine down in the center of the room, dealing critical damage to any player hit.",
	},
	lightningBeam: {
		id: "lightning-beam",
		title: "Lightning Beam",
		range: "Medium",
		description:
			"Charges up lightning to unleash it as a beam towards the player, damaging them on hit.",
	},
	selfDestruct: {
		id: "self-destruct",
		title: "Self Destruct",
		range: "Short",
		description: "Charges the player self-destructing once within melee range.",
	},
	cannonBlast: {
		id: "cannon-blast",
		title: "Cannon Blast",
		range: "Long",
		description:
			"Charges and fires a homing arm cannon blast at the targeted player, dealing damage on hit.",
	},
	dragonFire: {
		id: "dragon-fire",
		title: "Dragon Fire",
		range: "Long",
		description:
			"Breathes dragon fire down on the battlefield engulfing the entire area in flames that damage players.",
	},
	harpoonBarrage: {
		id: "harpoon-barrage",
		title: "Harpoon Barrage",
		range: "Long",
		description:
			"Launches a barrage of harpoons at the targeted player that explode after a short time.",
	},
	zombieBuff: {
		id: "zombie-buff",
		title: "Zombie Buff",
		range: "Short",
		description:
			"Buffs nearby regular zombies, making them deal more damage, faster, and become more resistant to damage.",
	},
	poisonAura: {
		id: "poison-aura",
		title: "Poison Aura",
		range: "Short",
		description: "Deals poison damage to players when within close proximity.",
	},
	axeThrow: {
		id: "axe-throw",
		title: "Axe Throw",
		range: "Medium",
		description: "Launches one of its two axes at the targeted player dealing damage on hit.",
	},
	rapidSlashes: {
		id: "rapid-slashes",
		title: "Rapid Slashes",
		range: "Short",
		description:
			"Unleashes a barrage of rapid slashes from their metallic claws dealing quick damage.",
	},
	heavyLeap: {
		id: "heavy-leap",
		title: "Heavy Leap",
		range: "Medium",
		description:
			"Leaps towards the targeted player doing damage on hit and unleashes Rapid Slashes once landing.",
	},
	homingVomit: {
		id: "homing-vomit",
		title: "Homing Vomit",
		range: "Long",
		description:
			"Shoots a homing vomit projectile at the targeted player dealing damage on hit and overtime.",
	},
	tongueGrab: {
		id: "tongue-grab",
		title: "Tongue Grab",
		range: "Medium",
		description: "Releases its tongue, grabbing any player in range and slowly pulling them.",
	},
	fireball: {
		id: "fireball",
		title: "Fireball",
		range: "Long",
		description:
			"Shoots a fireball at the targeted player dealing damage on hit and leaving a patch of flames on the ground.",
	},
	eyeBeam: {
		id: "eye-beam",
		title: "Eye Beam",
		range: "Long",
		description:
			"Shoots a powerful laser beam from its eye dealing massive damage overtime to the player while being hit by the beam.",
	},
	vampiricMelee: {
		id: "vampiric-melee",
		title: "Vampiric Melee",
		range: "Short",
		description:
			"Swings at the targeted player when within range, temporarily stopping health regeneration.",
	},
	megaBite: {
		id: "mega-bite",
		title: "Mega Bite",
		range: "Short",
		description:
			"Latches onto the player and bites into them, dealing massive damage. *Crimson Nosferatu Only",
	},
	pounce: {
		id: "pounce",
		title: "Pounce",
		range: "Long",
		description:
			"Jumps onto the targeted player to gain a positional advantage dealing little damage to the player.",
	},
	swordSwing: {
		id: "sword-swing",
		title: "Sword Swing",
		range: "Short",
		description: "Swings their sword to deal damage to the player in close range.",
	},
	spearThrow: {
		id: "spear-throw",
		title: "Spear Throw",
		range: "Long",
		description:
			"Throws a spear at the targeted player exploding on contact dealing damage to anyone in the area of effect.",
	},
	shieldBlind: {
		id: "shield-blind",
		title: "Shield Blind",
		range: "Medium",
		description:
			"Sits behind its shield while charging up and releasing a flash temporarily blinding nearby players.",
	},
	lightningStrike: {
		id: "lightning-strike",
		title: "Lightning Strike",
		range: "Long",
		description: "Covers an entire island in lightning forcing all players to re-locate or die.",
	},
	flamingSpears: {
		id: "flaming-spears",
		title: "Flaming Spears",
		range: "Long",
		description:
			"Throws flaming spears onto the arena dealing damage to player, but also charging the players special weapon when taking damage.",
	},
	lightningBolts: {
		id: "lightning-bolts",
		title: "Lightning Bolts",
		range: "Long",
		description: "Shoots electric bolts at the targeted player dealing damage on impact.",
	},
	radioactiveBlast: {
		id: "radioactive-blast",
		title: "Radioactive Blast",
		range: "Long",
		description:
			"Shoots a single radioactive blast, dealing damage on impact and leaving a zone of toxic radiation that ignores armor. *Megaton Bomber Only",
	},
	radioactiveFlurry: {
		id: "radioactive-flurry",
		title: "Radioactive Flurry",
		range: "Long",
		description:
			"Shoots a flurry of three radioactive blasts dealing damage on impact. *Megaton Blaster Only",
	},
	tentacleGrab: {
		id: "tentacle-grab",
		title: "Tentacle Grab",
		range: "Medium",
		description:
			"Uses the tentacles on its back to grab a player out of melee range dealing damage before throwing them back out.",
	},
	shockBurst: {
		id: "shock-burst",
		title: "Shock Burst",
		range: "Long",
		description:
			"Releases a shock burst when destroying thrown equipment, damaging nearby players. *Shock Mimic Only",
	},
	fireballs: {
		id: "fireballs",
		title: "Fireballs",
		range: "Long",
		description:
			"Launches a barrage of fireballs that track the player, dealing damage and spawning a hellhound upon impact.",
	},
	lifeDrain: {
		id: "life-drain",
		title: "Life Drain",
		range: "Medium",
		description:
			"Shoots a beam at the targeted player ignoring armor and draining the life from the player simultaneously healing the Disciple.",
	},
	molotovCannon: {
		id: "molotov-cannon",
		title: "Molotov Cannon",
		range: "Medium",
		description:
			"Fires incendiary projectiles simlar to Molotovs dealing damage on impact and overtime.",
	},
	crystalBarrage: {
		id: "crystal-barrage",
		title: "Crystal Barrage",
		range: "Long",
		description:
			"Fires a barrage of orange crystals damaging only the players armor or their health if their armor is fully depleted.",
	},
	healSummon: {
		id: "heal-summon",
		title: "Heal Summon",
		range: "Short",
		description:
			"Summons a circle of zombies around her to drain life from and gain some health back.",
	},
	aetherRelease: {
		id: "aether-release",
		title: "Aether Release",
		range: "Long",
		description:
			"Charges up and releases a devasting blast of Aether energy instantly downing any player without line of sight of the attack.",
	},
	slowField: {
		id: "slow-field",
		title: "Slow Field",
		range: "Medium",
		description:
			"Spawns a slow field at a dedicated location in the arena, slowing any players within the field.",
	},
	energyOrbs: {
		id: "energy-orbs",
		title: "Energy Orbs",
		range: "Long",
		description: "Shoots tracking energy orbs that deal damage to players upon impact.",
	},
	electricalBolts: {
		id: "electrical-bolts",
		title: "Electrical Bolts",
		range: "Long",
		description:
			"Fire electric bolts at players damaging them on impact and leaving a shock field around the point of impact for a short duration.",
	},
	sweepingSlam: {
		id: "sweeping-slam",
		title: "Sweeping Slam",
		range: "Medium",
		description:
			"Slams the ground on the side of the arena, than sweeps across to the other side dealing critical damage to anyone hit.",
	},
	needleBarrage: {
		id: "needle-barrage",
		title: "Needle Barrage",
		range: "Medium",
		description: "Release a barrage of needles dealing damage and disorienting any player hit.",
	},
	lavaBalls: {
		id: "lava-balls",
		title: "Lava Balls",
		range: "Long",
		description:
			"Launches three fireballs that spread lava over an area dealing massive damage on impact and damage overtime via the lava.",
	},
	groundStomp: {
		id: "ground-stomp",
		title: "Ground Stomp",
		range: "Short",
		description:
			"Stomps the ground with its foot, dealing damage and knocking back players in close proximity.",
	},
	hammerSlam: {
		id: "hammer-slam",
		title: "Hammer Slam",
		range: "Long",
		description:
			"Slams his hammer down in front of him dealing damage to players nearby while also spawning a line of lava from the impact to the edge of the arena.",
	},
	leapingHammer: {
		id: "leaping-hammer",
		title: "Leaping Hammer",
		range: "Long",
		description:
			"Targets an area to leap to, slamming his hammer in the center of the zone dealing more damage the closer you are to the center, knocking back enemies.",
	},
	laser: {
		id: "laser",
		title: "Laser",
		range: "Long",
		description:
			"Emits a laser as it rotates slowly around the arena, with more lasers appearing the deeper in the fight.",
	},
	acidExplosion: {
		id: "acid-explosion",
		title: "Acid Explosion",
		range: "Short",
		description:
			"Release a powerful explosion upon death, leaving behind a pool of acid that damages the player over time.",
	},
	zombieEvolution: {
		id: "zombie-evolution",
		title: "Zombie Evolution",
		range: "Medium",
		description:
			"While nearby another zombie, it will send a beam to the zombie to force it to evolve to its next stage of evolution. Zombie into Vermin, Vermin into Parasite, Parasite into Doppleghast, Doppleghast into Amalgam.",
	},
	tailSlam: {
		id: "tail-slam",
		title: "Tail Slam",
		range: "Short",
		description:
			"Slams its tail on the ground three times in quick succession when the player is behind it within melee range.",
	},
	dinoLeap: {
		id: "dino-leap",
		title: "Dino Leap",
		range: "Long",
		description:
			"Leaps towards the targeted player, dealing damage on impact and knocking back all enemies.",
	},
	aetherBarrage: {
		id: "aether-barrage",
		title: "Aether Barrage",
		range: "Long",
		description:
			"Shoots a barrage of purple aether beams that deal significant damage on direct impact.",
	},
	wunderwaffeShot: {
		id: "wunderwaffe-shot",
		title: "Wunderwaffe Shot",
		range: "Long",
		description:
			"Fires the Wunderwaffe DG-2 at players, damaging and stunning them for a short time.",
	},
	aerialBomber: {
		id: "aerial-bomber",
		title: "Aerial Bomber",
		range: "Long",
		description:
			"Flys through the sky dropping bombs over the battlefield that explode upon impact or act as landmines when stepped near.",
	},
	generatorSiphon: {
		id: "generator-siphon",
		title: "Generator Siphon",
		range: "Short",
		description:
			"Siphons element 115 from the Conversion Generators, disabling them if fully drained.",
	},
	ravage: {
		id: "ravage",
		title: "Ravage",
		range: "Short",
		description:
			"Eats left over ground loot, sprinting and teleporting underground when full.",
	},
	maul: {
		id: "maul",
		title: "Maul",
		range: "Short",
		description:
			"Bites or claw swipes nearby enemies, dealing significant damage and leaving a Damage Over Time effect on the player.",
	},
	beeSwarm: {
		id: "bee-swarm",
		title: "Bee Swarm",
		range: "Long",
		description:
			"Launches a swarm of bees that follow the player until destroyed, dealing damage and slowing the affected player.",
	},
} as const satisfies Record<string, ZombieAttack>

/** Union type of all zombie attacks */
export type ZombieAttackKey = keyof typeof zombieAttacksRegistry
export const {
	maul,
	beeSwarm,
	ravage,
	meleeSwing,
	acidExplosion,
	aerialBomber,
	aetherBarrage,
	aetherRelease,
	aoeSlam,
	axeThrow,
	bite,
	cannonBlast,
	charge,
	clawGrab,
	crystalBarrage,
	dinoLeap,
	dragonFire,
	electricBurst,
	electricalBolts,
	empLauncher,
	energyOrbs,
	explosion,
	eyeBeam,
	fieryExplosion,
	fireball,
	fireballs,
	flamethrower,
	flamingAura,
	flamingSpears,
	fleshThrow,
	generatorSiphon,
	grab,
	groundSlam,
	groundStomp,
	hammerSlam,
	harpoonBarrage,
	healSummon,
	heavyLeap,
	homingVomit,
	jumpSwing,
	knockbackExplosion,
	laser,
	legStab,
	lightningBeam,
	lightningBolt,
	lavaBalls,
	leap,
	leapingHammer,
	lifeDrain,
	lightningBolts,
	lightningStrike,
	lunge,
	megaBite,
	molotovCannon,
	needleBarrage,
	novaGas,
	perkSteal,
	pointSteal,
	poisonAura,
	pounce,
	powerUpSteal,
	radioactiveBlast,
	radioactiveFlurry,
	tentacleGrab,
	shockBurst,
	powerfulMelee,
	projectileVomit,
	rallyCry,
	rapidSlashes,
	selfDestruct,
	shieldBlind,
	skullSummon,
	slowField,
	sonicScreech,
	spearThrow,
	sweepingSlam,
	swordSwing,
	tailSlam,
	tongueGrab,
	toxicGas,
	vampiricMelee,
	vineSlam,
	volcanoSummon,
	weaponSteal,
	webProjectile,
	wunderwaffeShot,
	zombieBuff,
	zombieEvolution,
} = zombieAttacksRegistry
