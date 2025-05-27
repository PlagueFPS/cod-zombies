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
      type: "perk",
      x: 0.231,
      y: 0.473,
    },
    {
      id: "speed-cola",
      title: "Speed Cola",
      description: "Increase reload speed.",
      type: "perk",
      x: 0.415,
      y: 0.626
    },
    {
      id: "Juggernog",
      title: "Juggernog",
      description: "Increase base health.",
      type: "perk",
      x: 0.446,
      y: 0.407,
    },
    {
      id: "double-tap",
      title: "Double Tap",
      description: "Increase rate of fire.",
      type: "perk",
      x: 0.481,
      y: 0.211
    },
    {
      id: "phd-flopper",
      title: "PHD Flopper",
      description: "Explosive dive to prone and immunity to self-inflicted explosive damage.",
      type: "perk",
      x: 0.371,
      y: 0.396
    },
    {
      id: "stamin-up",
      title: "Stamin-Up",
      description: "Increase movement speed.",
      type: "perk",
      x: 0.550,
      y: 0.348
    },
    {
      id: "death-perception",
      title: "Death Perception",
      description: "Obscured enemies are keylined.",
      type: "perk",
      x: 0.439,
      y: 0.277
    },
    {
      id: "elemental-pop",
      title: "Elemental Pop",
      description: "Attacks can trigger random Ammo Mods.",
      type: "perk",
      x: 0.575,
      y: 0.223
    }, 
  ],
}

export default shatteredVeil;