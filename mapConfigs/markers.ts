import type { MapMarker, MarkerType, Perks } from "@/types/InteractiveMap";

interface Marker extends Omit<MapMarker, "locations"> {}
type SharedMarkerType = Exclude<MarkerType, "perk" | "weapon-wall-buy" | "label"> | "der-wunderfizz"

// All default or static markers that every map is guaranteed to have
// or that do not require different fields besides location
export const sharedMarkers: Record<SharedMarkerType, Marker> = {
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
  }
}