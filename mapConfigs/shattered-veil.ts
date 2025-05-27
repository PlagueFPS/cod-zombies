import { MapConfig } from "@/types/InteractiveMap";

const shatteredVeil: MapConfig = {
  id: "shattered-veil",
  title: "Shattered Veil",
  image: "/layers/shattered-veil.webp",
  markers: [
    {
      id: "quick-revive",
      title: "Quick Revive",
      description: "Recover health and revive allies faster.",
      icon: "/icons/quick-revive.webp",
      type: "perk",
      locations: [{ x: 0.231, y: 0.473 }]
    },
    {
      id: "speed-cola",
      title: "Speed Cola",
      description: "Increase reload speed.",
      icon: "/icons/speed-cola.webp",
      type: "perk",
      locations: [{ x: 0.415, y: 0.626 }]
    },
    {
      id: "Juggernog",
      title: "Juggernog",
      description: "Increase base health.",
      icon: "/icons/juggernog.webp",
      type: "perk",
      locations: [{ x: 0.446, y: 0.407 }]
    },
    {
      id: "double-tap",
      title: "Double Tap",
      description: "Increase rate of fire.",
      icon: "/icons/double-tap.webp",
      type: "perk",
      locations: [{ x: 0.481, y: 0.210 }]
    },
    {
      id: "phd-flopper",
      title: "PHD Flopper",
      description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
      icon: "/icons/phd-flopper.webp",
      type: "perk",
      locations: [{ x: 0.371, y: 0.396 }]
    },
    {
      id: "stamin-up",
      title: "Stamin-Up",
      description: "Increase movement speed.",
      icon: "/icons/stamin-up.webp",
      type: "perk",
      locations: [{ x: 0.550, y: 0.348 }]
    },
    {
      id: "death-perception",
      title: "Death Perception",
      description: "Obscured enemies are keylined.",
      icon: "/icons/death-perception.webp",
      type: "perk",
      locations: [{ x: 0.439, y: 0.277 }]
    },
    {
      id: "elemental-pop",
      title: "Elemental Pop",
      description: "Attacks can trigger random Ammo Mods.",
      icon: "/icons/elemental-pop.webp",
      type: "perk",
      locations: [{ x: 0.575, y: 0.223 }]
    },
    {
      id: "ammo-cache",
      title: "Ammo Cache",
      description: "Purchase ammo for any weapon.",
      icon: "/icons/ammo-cache.webp",
      type: "ammo-cache",
      locations: [
        { x: 0.172, y: 0.599 },
        { x: 0.355, y: 0.595 },
        { x: 0.341, y: 0.495 },
        { x: 0.428, y: 0.474 },
        { x: 0.395, y: 0.332 },
        { x: 0.575, y: 0.328 },
        { x: 0.492, y: 0.184 },
        { x: 0.772, y: 0.378 },
        { x: 0.631, y: 0.510 }
      ]
    },
    {
      id: "gs45-wall-buy",
      title: "GS45",
      description: "Purchase a GS45 Pistol off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.230, y: 0.597 }]
    },
    {
      id: "kompakt-92",
      title: "Kompakt-92",
      description: "Purchase a Kompakt-92 SMG off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.318, y: 0.630 }]
    },
    {
      id: "tanto.22",
      title: "Tanto .22",
      description: "Purchase a Tanto .22 SMG off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.302, y: 0.452 }]
    },
    {
      id: "marine-sp",
      title: "Marine SP",
      description: "Purchase a Marine SP Shotgun off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.488, y: 0.517 }]
    },
    {
      id: "ames-85",
      title: "AMES 85",
      description: "Purchase a AMES 85 Assault Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.473, y: 0.360 }]
    },
    {
      id: "xm4",
      title: "XM4",
      description: "Purchase a XM4 Assault Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.417, y: 0.370 }]
    },
    {
      id: "ak-74",
      title: "AK-74",
      description: "Purchase a AK-74 Assault Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.530, y: 0.380 }]
    },
    {
      id: "aek-973",
      title: "AEK-973",
      description: "Purchase a AEK-973 Marksman Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.443, y: 0.327 }]
    },
    {
      id: "swat-5.56",
      title: "Swat 5.56",
      description: "Purchase a Swat 5.56 Marksman Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.602, y: 0.252 }]
    },
    {
      id: "lr-7.62",
      title: "LR 7.62",
      description: "Purchase a LR 7.62 Sniper Rifle off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.481, y: 0.184 }]
    },
    {
      id: "gpmg-7",
      title: "GPMG-7",
      description: "Purchase a GPMG-7 Light Machine Gun off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.850, y: 0.450 }]
    },
    {
      id: "asg-89",
      title: "ASG-89",
      description: "Purchase a ASG-89 Shotgun off the wall.",
      icon: "/icons/weapon-wall-buy.webp",
      type: "weapon-wall-buy",
      locations: [{ x: 0.7015, y: 0.590 }]
    },
    {
      id: "mystery-box",
      title: 'Mystery Box Location',
      description: "Spin the Mystery Box for a random weapon.",
      icon: "/icons/mystery-box.webp",
      type: "mystery-box",
      locations: [
        { x: 0.268, y: 0.593 },
        { x: 0.270, y: 0.431 },
        { x: 0.379, y: 0.666 },
        { x: 0.436, y: 0.559 },
        { x: 0.439, y: 0.435 },
        { x: 0.602, y: 0.330 },
        { x: 0.406, y: 0.208 },
        { x: 0.339, y: 0.341 },
        { x: 0.674, y: 0.492 }
      ]
    },
    {
      id: "armor-wall-buy",
      type: "armor-wall-buy",
      title: "Armor Wall Buy",
      description: "Upgrade or repair your currently equipped armor.",
      icon: "/icons/armor-wall-buy.webp",
      locations: [
        { x: 0.376, y: 0.368 },
        { x: 0.593, y: 0.345 },
        { x: 0.460, y: 0.281 },
        { x: 0.745, y: 0.474 }
      ]
    },
    {
      id: "der-wunderfizz",
      type: "perk",
      title: "Der Wunderfizz",
      description: "Single machine for all perks, appearing on Round 25.",
      icon: "/icons/der-wunderfizz.webp",
      locations: [{ x: 0.745, y: 507 }]
    }
  ]
}

export default shatteredVeil;