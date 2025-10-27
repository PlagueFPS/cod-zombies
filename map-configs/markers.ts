export interface MapMarker {
	id: string
	title: string
	description: string
	type?: MarkerType
	category: MarkerCategory
	icon: string | null
	locations: Location[]
}

export interface Location {
	x: number
	y: number
	title?: string
	description?: string
}

export type MarkerType = (typeof MARKER_TYPES)[number]

export type Perks =
	| "quick-revive"
	| "speed-cola"
	| "juggernog"
	| "double-tap"
	| "phd-flopper"
	| "stamin-up"
	| "death-perception"
	| "elemental-pop"
	| "deadshot-daiquiri"
	| "melee-macchiato"
	| "vulture-aid"
	| "der-wunderfizz"

export type Weapons =
	| "gs45"
	| "kompakt-92"
	| "tanto.22"
	| "marine-sp"
	| "ames-85"
	| "xm4"
	| "ak-74"
	| "aek-973"
	| "swat-5.56"
	| "lr-7.62"
	| "gpmg-7"
	| "asg-89"
	| "pu-21"
	| "as-val"
	| "ksv"
	| "c9"
	| "goblin-mk2"
	| "pp-919"
	| "tsarkov-7.62"
	| "svd"
	| "xmg"
	| "dm-10"

export type MarkerCategory =
	| "general"
	| "equipment"
	| "upgrades"
	| "objectives"
	| "transportation"
	| "intel"

type Marker = Omit<MapMarker, "locations">
type SharedMarkerType = Exclude<MarkerType, "perk" | "weapon-wall-buy" | "label">

// Every type of marker currently supported
export const MARKER_TYPES = [
	"perk",
	"ammo-cache",
	"weapon-wall-buy",
	"pack-a-punch",
	"door-buy",
	"trap",
	"armor-wall-buy",
	"mystery-box",
	"rampage-inducer",
	"exfil",
	"arsenal",
	"crafting-table",
	"gobblegum-machine",
	"power-door",
	"portal",
	"workbench",
	"label",
	"fast-travel",
	"vehicle-spawn",
	"shovel",
	"audio-log",
	"document",
	"janus-crate",
	"vaccum-seal-device",
	"loot-bin"
] as const

// All static markers that appear on multiple maps/layers
export const sharedMarkers: Record<SharedMarkerType, Marker> = {
	"loot-bin": {
		id: "loot-bin",
		title: "Loot Bin",
		category: "objectives",
		description: "Interacting with a loot bin has a chance to grant you any item, e.g. Perks, Aether Tools, Ray Guns, and Aetherium Crystals.",
		icon: "/icons/objectives/loot-bin.webp",
	},
	"vaccum-seal-device": {
		id: "vaccum-seal-device",
		category: "objectives",
		title: "Vacuum-Seal Device",
		description:
			"Opened and used during the Main Quest to capture the purple-glowing floating items, during the 'Power the Portal' step.",
		icon: "/icons/objectives/vacuum-seal-device.webp",
	},
	"janus-crate": {
		id: "janus-crate",
		category: "objectives",
		title: "Janus Crate",
		description: "Destory these crates to obtain salvage.",
		icon: "/icons/objectives/janus-crate.webp",
	},
	document: {
		id: "document",
		category: "intel",
		title: "Document",
		description: "Intel document revealing information on the map and storyline.",
		icon: "/icons/intel/document.webp",
	},
	"audio-log": {
		id: "audio-log",
		category: "intel",
		title: "Audio Log",
		description: "Audio recording revealing information on the map and storyline.",
		icon: "/icons/intel/audio-log.webp",
	},
	shovel: {
		id: "shovel",
		category: "equipment",
		title: "Shovel",
		description: "Required to begin digging up dig spots around the map.",
		icon: "/icons/equipment/shovel.webp",
	},
	"vehicle-spawn": {
		id: "vehicle-spawn",
		category: "transportation",
		title: "Vehicle Spawn",
		description: "",
		icon: null,
	},
	"fast-travel": {
		id: "fast-travel",
		category: "transportation",
		title: "Fast Travel",
		description: "Use to fast travel to another section of the map.",
		icon: "/icons/transportation/fast-travel.webp",
	},
	"pack-a-punch": {
		id: "pack-a-punch",
		category: "upgrades",
		title: "Pack-a-Punch",
		description: "Upgrade your weapon up to three total times with points.",
		icon: "/icons/upgrades/pack-a-punch.webp",
	},
	exfil: {
		id: "exfil",
		category: "general",
		title: "Exfil",
		description: "Call for an exfil. First appears on Round 11, then every 5 rounds afterwards.",
		icon: "/icons/general/exfil.webp",
	},
	portal: {
		id: "portal",
		category: "transportation",
		title: "Portal",
		description: "Teleport to another section of the map.",
		icon: "/icons/transportation/portal.webp",
	},
	"crafting-table": {
		id: "crafting-table",
		category: "equipment",
		title: "Crafting Table",
		description: "Purchase scorestreaks, tacticals, and lethals for salvage.",
		icon: "/icons/equipment/crafting-table.webp",
	},
	"door-buy": {
		id: "door-buy",
		category: "general",
		title: "Door Buy",
		description: "You must purchase this door to open it.",
		icon: "/icons/general/door-buy.webp",
	},
	"power-door": {
		id: "power-door",
		category: "general",
		title: "Power Door",
		description: "You must activate the power to open this door.",
		icon: "/icons/general/power-door.webp",
	},
	"rampage-inducer": {
		id: "rampage-inducer",
		category: "general",
		title: "Rampage Inducer",
		description:
			"Activate to make zombies faster and more aggresive until Round 55 or until deactivated.",
		icon: "/icons/general/rampage-inducer.webp",
	},
	trap: {
		id: "trap",
		category: "general",
		title: "Trap",
		description: "Activate the trap to aid your survival against the undead.",
		icon: "/icons/general/trap.webp",
	},
	arsenal: {
		id: "arsenal",
		category: "upgrades",
		title: "Arsenal",
		description: "Apply ammo mods or upgrade the rarity of your weapon with salvage.",
		icon: "/icons/upgrades/arsenal.webp",
	},
	"gobblegum-machine": {
		id: "gobblegum-machine",
		category: "upgrades",
		title: "Gobblegum Machine",
		description: "Activate the Gobblegum Machine for a gobblegum in your pack.",
		icon: "/icons/upgrades/gobblegum-machine.webp",
	},
	"armor-wall-buy": {
		id: "armor-wall-buy",
		category: "upgrades",
		title: "Armor Wall Buy",
		description: "Upgrade or repair your currently equipped armor.",
		icon: "/icons/upgrades/armor-wall-buy.webp",
	},
	"mystery-box": {
		id: "mystery-box",
		title: "Mystery Box Location",
		description: "Purchase a random weapon.",
		icon: "/icons/equipment/mystery-box.webp",
		category: "equipment",
	},
	"ammo-cache": {
		id: "ammo-cache",
		title: "Ammo Cache",
		description: "Purchase ammo for any weapon.",
		icon: "/icons/equipment/ammo-cache.webp",
		category: "equipment",
	},
	workbench: {
		id: "workbench",
		category: "equipment",
		title: "workbench",
		description: "Workbench for crafting buildables.",
		icon: "/icons/equipment/workbench.webp",
	},
}

// All perks appearing on any of the maps
export const perks: Record<Perks, Marker> = {
	"der-wunderfizz": {
		id: "der-wunderfizz",
		category: "upgrades",
		type: "perk",
		title: "Der Wunderfizz",
		description: "Single machine for all perks, appearing on Round 25.",
		icon: "/icons/upgrades/der-wunderfizz.webp",
	},
	"quick-revive": {
		id: "quick-revive",
		title: "Quick Revive",
		description: "Recover health and revive allies faster.",
		icon: "/icons/upgrades/quick-revive.webp",
		type: "perk",
		category: "upgrades",
	},
	"speed-cola": {
		id: "speed-cola",
		title: "Speed Cola",
		description: "Increase reload speed.",
		icon: "/icons/upgrades/speed-cola.webp",
		type: "perk",
		category: "upgrades",
	},
	juggernog: {
		id: "Juggernog",
		title: "Juggernog",
		description: "Increase base health.",
		icon: "/icons/upgrades/juggernog.webp",
		type: "perk",
		category: "upgrades",
	},
	"double-tap": {
		id: "double-tap",
		title: "Double Tap",
		description: "Increase rate of fire.",
		icon: "/icons/upgrades/double-tap.webp",
		type: "perk",
		category: "upgrades",
	},
	"phd-flopper": {
		id: "phd-flopper",
		title: "PHD Flopper",
		description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
		icon: "/icons/upgrades/phd-flopper.webp",
		type: "perk",
		category: "upgrades",
	},
	"stamin-up": {
		id: "stamin-up",
		title: "Stamin-Up",
		description: "Increase movement speed.",
		icon: "/icons/upgrades/stamin-up.webp",
		type: "perk",
		category: "upgrades",
	},
	"death-perception": {
		id: "death-perception",
		title: "Death Perception",
		description: "Obscured enemies are keylined.",
		icon: "/icons/upgrades/death-perception.webp",
		type: "perk",
		category: "upgrades",
	},
	"elemental-pop": {
		id: "elemental-pop",
		title: "Elemental Pop",
		description: "Attacks can trigger random Ammo Mods.",
		icon: "/icons/upgrades/elemental-pop.webp",
		type: "perk",
		category: "upgrades",
	},
	"deadshot-daiquiri": {
		id: "deadshot-daiquiri",
		title: "Deadshot Daiquiri",
		description: "Improve ADS precision and increase critical damage.",
		icon: "/icons/upgrades/deadshot-daiquiri.webp",
		type: "perk",
		category: "upgrades",
	},
	"melee-macchiato": {
		id: "melee-macchiato",
		title: "Melee Macchiato",
		description: "Replace weapon gun butt with a deadly punch.",
		icon: "/icons/upgrades/melee-macchiato.webp",
		type: "perk",
		category: "upgrades",
	},
	"vulture-aid": {
		id: "vulture-aid",
		title: "Vulture Aid",
		description: "Increase the variety of loot dropped by enemies.",
		icon: "/icons/upgrades/vulture-aid.webp",
		type: "perk",
		category: "upgrades",
	},
}

// All weapons appearing as wall-buys on any of the maps
export const weapons: Record<Weapons, Marker> = {
	"dm-10": {
		id: "dm-10",
		title: "DM-10",
		description: "Purchase a DM-10 Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	xmg: {
		id: "xmg",
		title: "XMG",
		description: "Purchase a XMG Light Machine Gun off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		category: "equipment",
		type: "weapon-wall-buy",
	},
	svd: {
		id: "svd",
		title: "SVD",
		description: "Purchase a SVD Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"tsarkov-7.62": {
		id: "tsarkov-7.62",
		title: "Tsarkov 7.62",
		description: "Purchase a Tsarkov 7.62 Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"pp-919": {
		id: "pp-919",
		title: "PP-919",
		description: "Purchase a PP-919 SMG off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"goblin-mk2": {
		id: "goblin-mk2",
		title: "Goblin MK2",
		description: "Purchase a Goblin MK2 Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	c9: {
		id: "c9",
		title: "C9",
		description: "Purchase a C9 SMG off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	ksv: {
		id: "ksv",
		title: "KSV",
		description: "Purchase a KSV SMG off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"as-val": {
		id: "as-val",
		title: "AS-VAL",
		description: "Purchase a AS-VAL Assault Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	gs45: {
		id: "gs45",
		title: "GS45",
		description: "Purchase a GS45 Pistol off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"tanto.22": {
		id: "tanto.22",
		title: "Tanto .22",
		description: "Purchase a Tanto .22 SMG off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"marine-sp": {
		id: "marine-sp",
		title: "Marine SP",
		description: "Purchase a Marine SP Shotgun off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ames-85": {
		id: "ames-85",
		title: "AMES 85",
		description: "Purchase a AMES 85 Assault Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	xm4: {
		id: "xm4",
		title: "XM4",
		description: "Purchase a XM4 Assault Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ak-74": {
		id: "ak-74",
		title: "AK-74",
		description: "Purchase a AK-74 Assault Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"aek-973": {
		id: "aek-973",
		title: "AEK-973",
		description: "Purchase a AEK-973 Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"lr-7.62": {
		id: "lr-7.62",
		title: "LR 7.62",
		description: "Purchase a LR 7.62 Sniper Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"gpmg-7": {
		id: "gpmg-7",
		title: "GPMG-7",
		description: "Purchase a GPMG-7 Light Machine Gun off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"asg-89": {
		id: "asg-89",
		title: "ASG-89",
		description: "Purchase a ASG-89 Shotgun off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"pu-21": {
		id: "pu-21",
		title: "PU-21",
		description: "Purchase a PU-21 Light Machine Gun off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"kompakt-92": {
		id: "kompakt-92",
		title: "Kompakt-92",
		description: "Purchase a Kompakt-92 SMG off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"swat-5.56": {
		id: "swat-5.56",
		title: "Swat 5.56",
		description: "Purchase a Swat 5.56 Marksman Rifle off the wall.",
		icon: "/icons/equipment/weapon-wall-buy.webp",
		type: "weapon-wall-buy",
		category: "equipment",
	},
}

export const generateMarkerKey = (layerId: string, markerId: string, location: Location) =>
	`${layerId}-${markerId}-${location.x}-${location.y}-${location.title}-${location.description}`
