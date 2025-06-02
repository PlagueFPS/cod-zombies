import type { MapMarker, MarkerType, Perks, Weapons } from "@/types/InteractiveMap";

interface Marker extends Omit<MapMarker, "locations"> {}
type SharedMarkerType = Exclude<MarkerType, "perk" | "weapon-wall-buy" | "label" | "objective"> | "der-wunderfizz"

// All default or static markers that every map is guaranteed to have
// or that do not require different fields besides location
export const sharedMarkers: Record<SharedMarkerType, Marker> = {
  "vehicle-spawn": {
    id: "vehicle-spawn",
    type: "vehicle-spawn",
    title: "Vehicle Spawn",
    description: "Spawn a Boat.",
    icon: "/icons/boat.webp",
  },
  "fast-travel": {
    id: "fast-travel",
    type: "fast-travel",
    title: "Fast Travel",
    description: "Use to fast travel to another section of the map.",
    icon: "/icons/fast-travel.webp"
  },
  "pack-a-punch": {
    id: "pack-a-punch",
    type: "pack-a-punch",
    title: "Pack-a-Punch",
    description: "Upgrade your weapon up to three total times with points.",
    icon: "/icons/pack-a-punch.webp",
  },
  "exfil": {
    id: "exfil",
    type: "exfil",
    title: "Exfil",
    description: "Call for an exfil. First appears on Round 11, then every 5 rounds afterwards.",
    icon: "/icons/exfil.webp",
  },
  "portal": {
    id: "portal",
    type: "portal",
    title: "Portal",
    description: "Teleport to another section of the map.",
    icon: "/icons/portal.webp",
  },
  "crafting-table": {
    id: "crafting-table",
    type: "crafting-table",
    title: "Crafting Table",
    description: "Purchase scorestreaks, tacticals, and lethals for salvage.",
    icon: "/icons/crafting-table.webp",
  },
  "door-buy": {
    id: "door-buy",
    type: "door-buy",
    title: "Door Buy",
    description: "You must purchase this door to open it.",
    icon: "/icons/door-buy.webp",
  },
  "power-door": {
    id: "power-door",
    type: "power-door",
    title: "Power Door",
    description: "You must activate the power to open this door.",
    icon: "/icons/power-door.webp",
  },
  "rampage-inducer": {
    id: "rampage-inducer",
    type: "rampage-inducer",
    title: "Rampage Inducer",
    description: "Activate to make zombies faster and more aggresive until Round 55 or deactivated.",
    icon: "/icons/rampage-inducer.webp",
  },
  "trap": {
    id: "trap",
    type: "trap",
    title: "Trap",
    description: "Activate the trap to aid your survival against the undead.",
    icon: "/icons/trap.webp",
  },
  "arsenal": {
    id: "arsenal",
    type: "arsenal",
    title: "Arsenal",
    description: "Apply ammo mods or upgrade the rarity of your weapon with salvage.",
    icon: "/icons/arsenal.webp",
  },
  "gobblegum-machine": {
    id: "gobblegum-machine",
    type: "gobblegum-machine",
    title: "Gobblegum Machine",
    description: "Activate the Gobblegum Machine for a gobblegum in your pack.",
    icon: "/icons/gobblegum.webp",
  },
  "der-wunderfizz": {
    id: "der-wunderfizz",
    type: "perk",
    title: "Der Wunderfizz",
    description: "Single machine for all perks, appearing on Round 25.",
    icon: "/icons/der-wunderfizz.webp",
  },
  "armor-wall-buy": {
    id: "armor-wall-buy",
    type: "armor-wall-buy",
    title: "Armor Wall Buy",
    description: "Upgrade or repair your currently equipped armor.",
    icon: "/icons/armor-wall-buy.webp",
  },
  "mystery-box": {
    id: "mystery-box",
    title: 'Mystery Box Location',
    description: "Purchase a random weapon.",
    icon: "/icons/mystery-box.webp",
    type: "mystery-box",
  },
  "ammo-cache": {
    id: "ammo-cache",
    title: "Ammo Cache",
    description: "Purchase ammo for any weapon.",
    icon: "/icons/ammo-cache.webp",
    type: "ammo-cache",
  },
  "workbench": {
    id: "workbench",
    type: "workbench",
    title: "workbench",
    description: "Workbench for crafting buildables.",
    icon: "/icons/workbench.webp"
  },
}

// Not every map is guaranteed to have all of these perks
// but they all share the same DRY configuration regardless
export const perks: Record<Perks, Marker> = {
  "quick-revive": {
    id: "quick-revive",
    title: "Quick Revive",
    description: "Recover health and revive allies faster.",
    icon: "/icons/quick-revive.webp",
    type: "perk",
  },
  "speed-cola": {
    id: "speed-cola",
    title: "Speed Cola",
    description: "Increase reload speed.",
    icon: "/icons/speed-cola.webp",
    type: "perk",
  },
  "juggernog": {
    id: "Juggernog",
    title: "Juggernog",
    description: "Increase base health.",
    icon: "/icons/juggernog.webp",
    type: "perk",
  },
  "double-tap": {
    id: "double-tap",
    title: "Double Tap",
    description: "Increase rate of fire.",
    icon: "/icons/double-tap.webp",
    type: "perk",
  },
  "phd-flopper": {
    id: "phd-flopper",
    title: "PHD Flopper",
    description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
    icon: "/icons/phd-flopper.webp",
    type: "perk",
  },
  "stamin-up": {
    id: "stamin-up",
    title: "Stamin-Up",
    description: "Increase movement speed.",
    icon: "/icons/stamin-up.webp",
    type: "perk",
  },
  "death-perception": {
    id: "death-perception",
    title: "Death Perception",
    description: "Obscured enemies are keylined.",
    icon: "/icons/death-perception.webp",
    type: "perk",
  },
  "elemental-pop": {
    id: "elemental-pop",
    title: "Elemental Pop",
    description: "Attacks can trigger random Ammo Mods.",
    icon: "/icons/elemental-pop.webp",
    type: "perk",
  },
  "deadshot-daiquiri": {
    id: "deadshot-daiquiri",
    title: "Deadshot Daiquiri",
    description: "Improve ADS precision and increase critical damage.",
    icon: "/icons/deadshot-daiquiri.webp",
    type: "perk"
  },
  "melee-macchiato": {
    id: "melee-macchiato",
    title: "Melee Macchiato",
    description: "Replace weapon gun butt with a deadly punch.",
    icon: "/icons/melee-macchiato.webp",
    type: "perk"
  },
  "vulture-aid": {
    id: "vulture-aid",
    title: "Vulture Aid",
    description: "Increase the variety of loot dropped by enemies.",
    icon: "/icons/vulture-aid.webp",
    type: "perk"
  }
}

// All weapons appearing as wall-buys on any of the maps
export const weapons: Record<Weapons, Marker> = {
  "dm-10": {
    id: "dm-10",
    title: "DM-10",
    description: "Purchase a DM-10 Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy"
  },
  "xmg": {
    id: "xmg",
    title: "XMG",
    description: "Purchase a XMG Light Machine Gun off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "svd": {
    id: "svd",
    title: "SVD",
    description: "Purchase a SVD Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "tsarkov-7.62": {
    id: "tsarkov-7.62",
    title: "Tsarkov 7.62",
    description: "Purchase a Tsarkov 7.62 Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "pp-919": {
    id: "pp-919",
    title: "PP-919",
    description: "Purchase a PP-919 SMG off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "goblin-mk2": {
    id: "goblin-mk2",
    title: "Goblin MK2",
    description: "Purchase a Goblin MK2 Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "c9": {
    id: "c9",
    title: "C9",
    description: "Purchase a C9 SMG off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "ksv": {
    id: "ksv",
    title: "KSV",
    description: "Purchase a KSV SMG off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "as-val": {
    id: "as-val",
    title: "AS-VAL",
    description: "Purchase a AS-VAL Assault Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  gs45: {
    id: "gs45",
    title: "GS45",
    description: "Purchase a GS45 Pistol off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "tanto.22": {
    id: "tanto.22",
    title: "Tanto .22",
    description: "Purchase a Tanto .22 SMG off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "marine-sp": {
    id: "marine-sp",
    title: "Marine SP",
    description: "Purchase a Marine SP Shotgun off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "ames-85": {
    id: "ames-85",
    title: "AMES 85",
    description: "Purchase a AMES 85 Assault Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  xm4: {
    id: "xm4",
    title: "XM4",
    description: "Purchase a XM4 Assault Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "ak-74": {
    id: "ak-74",
    title: "AK-74",
    description: "Purchase a AK-74 Assault Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "aek-973": {
    id: "aek-973",
    title: "AEK-973",
    description: "Purchase a AEK-973 Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "lr-7.62": {
    id: "lr-7.62",
    title: "LR 7.62",
    description: "Purchase a LR 7.62 Sniper Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "gpmg-7": {
    id: "gpmg-7",
    title: "GPMG-7",
    description: "Purchase a GPMG-7 Light Machine Gun off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "asg-89": {
    id: "asg-89",
    title: "ASG-89",
    description: "Purchase a ASG-89 Shotgun off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "pu-21": {
    id: "pu-21",
    title: "PU-21",
    description: "Purchase a PU-21 Light Machine Gun off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "kompakt-92": {
    id: "kompakt-92",
    title: "Kompakt-92",
    description: "Purchase a Kompakt-92 SMG off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  },
  "swat-5.56": {
    id: "swat-5.56",
    title: "Swat 5.56",
    description: "Purchase a Swat 5.56 Marksman Rifle off the wall.",
    icon: "/icons/weapon-wall-buy.webp",
    type: "weapon-wall-buy",
  }
}