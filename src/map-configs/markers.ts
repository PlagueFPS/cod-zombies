import type { FieldUpgradesImagePath, IconsImagePath, PerksImagePath } from "@/types/generated/image-paths.gen"
import { Option } from "effect"

export interface MapMarker {
	/** The unique identifier for this marker */
	id: string
	/** The title of this marker */
	title: string
	/** The description of this marker */
	description: string
	/** The type of this marker */
	type?: MarkerType
	/** The category of this marker */
	category: MarkerCategory
	/** The icon of this marker */
	icon: Option.Option<PerksImagePath | IconsImagePath | FieldUpgradesImagePath>
	/** The locations of this marker */
	locations: Location[]
}

export interface Location {
	/** The x-coordinate of this location */
	x: number
	/** The y-coordinate of this location */
	y: number
	/** The title of this location */
	title?: string
	/** The description of this location */
	description?: string
}

/** Union of every type of marker currently supported */
export type MarkerType = (typeof MARKER_TYPES)[number]

/** Union of every type of marker category currently supported */
export type MarkerCategory =
	| "general"
	| "equipment"
	| "upgrades"
	| "objectives"
	| "transportation"
	| "intel"

type Marker = Omit<MapMarker, "locations">
type SharedMarkerType = Exclude<MarkerType, "perk" | "weapon-wall-buy" | "label">

/**
 * An array of every type of marker currently supported
 */
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
	"vacuum-seal-device",
	"loot-bin",
	"aether-crystal",
	"mister-peeks",
] as const

/** Handlers for mapping markers ids or types to their category */
export const categoryHandlers = {
	general: (m: MapMarker) => (m.type === "label" ? m.type : m.id),
	equipment: (m: MapMarker) => (m.type === "weapon-wall-buy" ? m.type : m.id),
	upgrades: (m: MapMarker) => (m.type === "perk" ? m.type : m.id),
	objectives: (m: MapMarker) => m.id,
	transportation: (m: MapMarker) => m.id,
	intel: (m: MapMarker) => m.id,
} as const

/** All static markers that appear on multiple maps/layers */
export const sharedMarkers: Record<SharedMarkerType, Marker> = {
	"mister-peeks": {
		id: "mister-peeks",
		category: "objectives",
		title: "Mister Peeks",
		description: "(Cursed Only) Has a 10% chance to spawn every round for 60 seconds, when shot, grants a Bronze Egg (Tier 1), Silver Egg (Tier 2), or Gold Egg (Tier 3) containing perks, points, salvage, and even Wonder Weapons.",
		icon: Option.some("/field-upgrades/mister-peeks.webp"),
	},
	"aether-crystal": {
		id: "aether-crystal",
		category: "objectives",
		title: "Aether Crystal",
		description: "Dark Aether Crystal that can be destroyed for a variety of loot.",
		icon: Option.some("/icons/objectives/aether-crystal.webp"),
	},
	"loot-bin": {
		id: "loot-bin",
		title: "Loot Bin",
		category: "objectives",
		description:
			"Interacting with a loot bin has a chance to grant you any item, e.g. Perks, Aether Tools, Ray Guns, and Aetherium Crystals.",
		icon: Option.some("/icons/objectives/loot-bin.webp"),
	},
	"vacuum-seal-device": {
		id: "vacuum-seal-device",
		category: "objectives",
		title: "Vacuum-Seal Device",
		description:
			"Opened and used during the Main Quest to capture the purple-glowing floating items, during the 'Power the Portal' step.",
		icon: Option.some("/icons/objectives/vacuum-seal-device.webp"),
	},
	"janus-crate": {
		id: "janus-crate",
		category: "objectives",
		title: "Janus Crate",
		description: "Destroy these crates to obtain salvage.",
		icon: Option.some("/icons/objectives/janus-crate.webp"),
	},
	document: {
		id: "document",
		category: "intel",
		title: "Document",
		description: "Intel document revealing information on the map and storyline.",
		icon: Option.some("/icons/intel/document.webp"),
	},
	"audio-log": {
		id: "audio-log",
		category: "intel",
		title: "Audio Log",
		description: "Audio recording revealing information on the map and storyline.",
		icon: Option.some("/icons/intel/audio-log.webp"),
	},
	shovel: {
		id: "shovel",
		category: "equipment",
		title: "Shovel",
		description: "Required to begin digging up dig spots around the map.",
		icon: Option.some("/icons/equipment/shovel.webp"),
	},
	"vehicle-spawn": {
		id: "vehicle-spawn",
		category: "transportation",
		title: "Vehicle Spawn",
		description: "",
		icon: Option.none(),
	},
	"fast-travel": {
		id: "fast-travel",
		category: "transportation",
		title: "Fast Travel",
		description: "Use to fast travel to another section of the map.",
		icon: Option.some("/icons/transportation/fast-travel.webp"),
	},
	"pack-a-punch": {
		id: "pack-a-punch",
		category: "upgrades",
		title: "Pack-a-Punch",
		description: "Upgrade your weapon's damage with points.",
		icon: Option.some("/icons/upgrades/pack-a-punch.webp"),
	},
	exfil: {
		id: "exfil",
		category: "general",
		title: "Exfil",
		description: "Call for an exfil. First appears on Round 11, then every 5 rounds afterwards.",
		icon: Option.some("/icons/general/exfil.webp"),
	},
	portal: {
		id: "portal",
		category: "transportation",
		title: "Portal",
		description: "Teleport to another section of the map.",
		icon: Option.some("/icons/transportation/portal.webp"),
	},
	"crafting-table": {
		id: "crafting-table",
		category: "equipment",
		title: "Crafting Table",
		description: "Purchase scorestreaks, tacticals, and lethals for salvage.",
		icon: Option.some("/icons/equipment/crafting-table.webp"),
	},
	"door-buy": {
		id: "door-buy",
		category: "general",
		title: "Door Buy",
		description: "You must purchase this door to open it.",
		icon: Option.some("/icons/general/door-buy.webp"),
	},
	"power-door": {
		id: "power-door",
		category: "general",
		title: "Power Door",
		description: "You must activate the power to open this door.",
		icon: Option.some("/icons/general/power-door.webp"),
	},
	"rampage-inducer": {
		id: "rampage-inducer",
		category: "general",
		title: "Rampage Inducer",
		description:
			"Activate to make zombies faster and more aggressive until Round 55 or until deactivated.",
		icon: Option.some("/icons/general/rampage-inducer.webp"),
	},
	trap: {
		id: "trap",
		category: "general",
		title: "Trap",
		description: "Activate the trap to aid your survival against the undead.",
		icon: Option.some("/icons/general/trap.webp"),
	},
	arsenal: {
		id: "arsenal",
		category: "upgrades",
		title: "Arsenal",
		description: "Apply ammo mods or upgrade the rarity of your weapon with salvage.",
		icon: Option.some("/icons/upgrades/arsenal.webp"),
	},
	"gobblegum-machine": {
		id: "gobblegum-machine",
		category: "upgrades",
		title: "Gobblegum Machine",
		description: "Activate the Gobblegum Machine for a gobblegum in your pack.",
		icon: Option.some("/icons/upgrades/gobblegum-machine.webp"),
	},
	"armor-wall-buy": {
		id: "armor-wall-buy",
		category: "upgrades",
		title: "Armor Wall Buy",
		description: "Upgrade or repair your currently equipped armor.",
		icon: Option.some("/icons/upgrades/armor-wall-buy.webp"),
	},
	"mystery-box": {
		id: "mystery-box",
		title: "Mystery Box Location",
		description: "Purchase a random weapon.",
		icon: Option.some("/icons/equipment/mystery-box.webp"),
		category: "equipment",
	},
	"ammo-cache": {
		id: "ammo-cache",
		title: "Ammo Cache",
		description: "Purchase ammo for any weapon.",
		icon: Option.some("/icons/equipment/ammo-cache.webp"),
		category: "equipment",
	},
	workbench: {
		id: "workbench",
		category: "equipment",
		title: "workbench",
		description: "Workbench for crafting buildables.",
		icon: Option.some("/icons/equipment/workbench.webp"),
	},
}

/** All perks appearing on any of the maps */
export const perks = {
	"random-perk": {
		id: "random-perk",
		title: "Random Perk Location",
		description: "A random perk machine will spawn here.",
		icon: Option.some("/perks/mystery-perk.webp"),
		type: "perk",
		category: "upgrades",
	},
	"mule-kick": {
		id: "mule-kick",
		title: "Mule Kick",
		description: "Carry an extra weapon.",
		icon: Option.some("/perks/mule-kick-cold-war.webp"),
		type: "perk",
		category: "upgrades",
	},
	"wisp-tea": {
		id: "wisp-tea",
		title: "Wisp Tea",
		description: "Summon a companion wisp after killing zombies.",
		icon: Option.some("/perks/wisp-tea.webp"),
		type: "perk",
		category: "upgrades",
	},
	"der-wunderfizz": {
		id: "der-wunderfizz",
		category: "upgrades",
		type: "perk",
		title: "Der Wunderfizz",
		description: "Single machine for all perks, appearing on Round 25.",
		icon: Option.some("/icons/upgrades/der-wunderfizz.webp"),
	},
	"quick-revive": {
		id: "quick-revive",
		title: "Quick Revive",
		description: "Recover health and revive allies faster.",
		icon: Option.some("/perks/quick-revive-cold-war.webp"),
		type: "perk",
		category: "upgrades",
	},
	"speed-cola": {
		id: "speed-cola",
		title: "Speed Cola",
		description: "Increase reload speed.",
		icon: Option.some("/perks/speed-cola.webp"),
		type: "perk",
		category: "upgrades",
	},
	juggernog: {
		id: "Juggernog",
		title: "Juggernog",
		description: "Increase base health.",
		icon: Option.some("/perks/juggernog-bo6.webp"),
		type: "perk",
		category: "upgrades",
	},
	"double-tap": {
		id: "double-tap",
		title: "Double Tap",
		description: "Increase rate of fire.",
		icon: Option.some("/perks/double-tap.webp"),
		type: "perk",
		category: "upgrades",
	},
	"phd-flopper": {
		id: "phd-flopper",
		title: "PHD Flopper",
		description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
		icon: Option.some("/perks/phd-flopper.webp"),
		type: "perk",
		category: "upgrades",
	},
	"stamin-up": {
		id: "stamin-up",
		title: "Stamin-Up",
		description: "Increase movement speed.",
		icon: Option.some("/perks/stamin-up-cold-war.webp"),
		type: "perk",
		category: "upgrades",
	},
	"death-perception": {
		id: "death-perception",
		title: "Death Perception",
		description: "Obscured enemies are keylined.",
		icon: Option.some("/perks/death-perception-bo6.webp"),
		type: "perk",
		category: "upgrades",
	},
	"elemental-pop": {
		id: "elemental-pop",
		title: "Elemental Pop",
		description: "Attacks can trigger random Ammo Mods.",
		icon: Option.some("/perks/elemental-pop.webp"),
		type: "perk",
		category: "upgrades",
	},
	"deadshot-daiquiri": {
		id: "deadshot-daiquiri",
		title: "Deadshot Daiquiri",
		description: "Improve ADS precision and increase critical damage.",
		icon: Option.some("/perks/deadshot-daiquiri-cold-war.webp"),
		type: "perk",
		category: "upgrades",
	},
	"melee-macchiato": {
		id: "melee-macchiato",
		title: "Melee Macchiato",
		description: "Replace weapon gun butt with a deadly punch.",
		icon: Option.some("/perks/melee-macchiato.webp"),
		type: "perk",
		category: "upgrades",
	},
	"vulture-aid": {
		id: "vulture-aid",
		title: "Vulture Aid",
		description: "Increase the variety of loot dropped by enemies.",
		icon: Option.some("/perks/vulture-aid.webp"),
		type: "perk",
		category: "upgrades",
	},
} as const satisfies Record<string, Marker>

/** All weapons appearing as wall-buys on any of the maps */
export const weapons = {
	"rk-9": {
		id: "rk-9",
		title: "RK-9",
		description: "Purchase a RK-9 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"mpc-25": {
		id: "mpc-25",
		title: "MPC-25",
		description: "Purchase a MPC-25 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"mxr-17": {
		id: "mxr-17",
		title: "MXR-17",
		description: "Purchase a MXR-17 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"velox-5.7": {
		id: "velox-5.7",
		title: "Velox 5.7",
		description: "Purchase a Velox 5.7 Pistol off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"razor-9mm": {
		id: "razor-9mm",
		title: "Razor 9mm",
		description: "Purchase a Razor 9mm SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"dm-10": {
		id: "dm-10",
		title: "DM-10",
		description: "Purchase a DM-10 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	xmg: {
		id: "xmg",
		title: "XMG",
		description: "Purchase a XMG Light Machine Gun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		category: "equipment",
		type: "weapon-wall-buy",
	},
	svd: {
		id: "svd",
		title: "SVD",
		description: "Purchase a SVD Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"tsarkov-7.62": {
		id: "tsarkov-7.62",
		title: "Tsarkov 7.62",
		description: "Purchase a Tsarkov 7.62 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"pp-919": {
		id: "pp-919",
		title: "PP-919",
		description: "Purchase a PP-919 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"goblin-mk2": {
		id: "goblin-mk2",
		title: "Goblin MK2",
		description: "Purchase a Goblin MK2 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	c9: {
		id: "c9",
		title: "C9",
		description: "Purchase a C9 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	ksv: {
		id: "ksv",
		title: "KSV",
		description: "Purchase a KSV SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"as-val": {
		id: "as-val",
		title: "AS-VAL",
		description: "Purchase a AS-VAL Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	gs45: {
		id: "gs45",
		title: "GS45",
		description: "Purchase a GS45 Pistol off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"tanto.22": {
		id: "tanto.22",
		title: "Tanto .22",
		description: "Purchase a Tanto .22 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"marine-sp": {
		id: "marine-sp",
		title: "Marine SP",
		description: "Purchase a Marine SP Shotgun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ames-85": {
		id: "ames-85",
		title: "AMES 85",
		description: "Purchase a AMES 85 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	xm4: {
		id: "xm4",
		title: "XM4",
		description: "Purchase a XM4 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ak-74": {
		id: "ak-74",
		title: "AK-74",
		description: "Purchase a AK-74 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"aek-973": {
		id: "aek-973",
		title: "AEK-973",
		description: "Purchase a AEK-973 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"lr-7.62": {
		id: "lr-7.62",
		title: "LR 7.62",
		description: "Purchase a LR 7.62 Sniper Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"gpmg-7": {
		id: "gpmg-7",
		title: "GPMG-7",
		description: "Purchase a GPMG-7 Light Machine Gun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"asg-89": {
		id: "asg-89",
		title: "ASG-89",
		description: "Purchase a ASG-89 Shotgun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"pu-21": {
		id: "pu-21",
		title: "PU-21",
		description: "Purchase a PU-21 Light Machine Gun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"kompakt-92": {
		id: "kompakt-92",
		title: "Kompakt-92",
		description: "Purchase a Kompakt-92 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"swat-5.56": {
		id: "swat-5.56",
		title: "Swat 5.56",
		description: "Purchase a Swat 5.56 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"warden-308": {
		id: "warden-308",
		title: "Warden 308",
		description: "Purchase a Warden 308 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"coda-9": {
		id: "coda-9",
		title: "CODA 9",
		description: "Purchase a Coda-9 Pistol off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	m8a1: {
		id: "m8a1",
		title: "M8A1",
		description: "Purchase a M8A1 Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"m34-novaline": {
		id: "m34-novaline",
		title: "M34 Novaline",
		description: "Purchase a M34 Novaline Marksman Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"m15-mod-0": {
		id: "m15-mod-0",
		title: "M15 Mod 0",
		description: "Purchase a M15 Mod 0 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"peacekeeper-mk1": {
		id: "peacekeeper-mk1",
		title: "Peacekeeper MK1",
		description: "Purchase a Peacekeeper MK1 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"x9-maverick": {
		id: "x9-maverick",
		title: "X9 Maverick",
		description: "Purchase a X9 Maverick Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ds20-mirage": {
		id: "ds20-mirage",
		title: "DS20 Mirage",
		description: "Purchase a DS20 Mirage Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ak-27": {
		id: "ak-27",
		title: "AK-27",
		description: "Purchase a AK-27 Assault Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"ryden-45k": {
		id: "ryden-45k",
		title: "Ryden 45K",
		description: "Purchase a Ryden 45K SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"dravec-45": {
		id: "dravec-45",
		title: "Dravec 45",
		description: "Purchase a Dravec 45 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"m10-breacher": {
		id: "m10-breacher",
		title: "M10 Breacher",
		description: "Purchase a M10 Breacher Shotgun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"echo-12": {
		id: "echo-12",
		title: "Echo 12",
		description: "Purchase a Echo 12 Shotgun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	akita: {
		id: "akita",
		title: "Akita",
		description: "Purchase a Akita Shotgun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"mk-78": {
		id: "mk-78",
		title: "MK.78",
		description: "Purchase a MK.78 Light Machine Gun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	xm325: {
		id: "xm325",
		title: "XM325",
		description: "Purchase a XM325 Light Machine Gun off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"vs-recon": {
		id: "vs-recon",
		title: "VS Recon",
		description: "Purchase a VS Recon Sniper Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"xr3-ion": {
		id: "xr3-ion",
		title: "XR-3 Ion",
		description: "Purchase a XR-3 Ion Sniper Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"shadow-sk": {
		id: "shadow-sk",
		title: "Shadow Sk",
		description: "Purchase a Shadow Sk Sniper Rifle off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"jaeger-45": {
		id: "jaeger-45",
		title: "Jaeger .45",
		description: "Purchase a Jaeger .45 Pistol off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
	"carbon-57": {
		id: "carbon-57",
		title: "Carbon 57",
		description: "Purchase a Carbon 57 SMG off the wall.",
		icon: Option.some("/icons/equipment/weapon-wall-buy.webp"),
		type: "weapon-wall-buy",
		category: "equipment",
	},
} as const satisfies Record<string, Marker>

/**
 * Generates a unique marker key based on the provided parameters.
 * @param layerId - The unique identifier of the layer
 * @param markerId - The unique identifier of the marker
 * @param location - The location of the marker
 */
export const generateMarkerKey = (layerId: string, markerId: string, location: Location) =>
	`${layerId}-${markerId}-${location.x}-${location.y}`
