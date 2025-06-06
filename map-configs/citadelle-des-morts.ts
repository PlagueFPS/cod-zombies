import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const citadelleDesMorts: MapConfig = {
  id: "citadelle-des-morts",
  title: "Citadelle Des Morts",
  game: "Black Ops 6",
  description: "Learn the locations for Points of Power Traps, Fast Travels, and more with our in-depth interactive map for Citadelle Des Morts.",
  image: "/layers/citadelle-des-morts.webp",
  markers: [
    {
      id: "town-square",
      type: "label",
      title: "Town Square",
      description: "",
      icon: null,
      locations: [{ x: 0.500, y: 0.729 }]
    },
    {
      id: "tavern",
      type: "label",
      title: "Tavern",
      description: "",
      icon: null,
      locations: [{ x: 0.450, y: 0.645 }]
    },
    {
      id: "tavern-cellar",
      type: "label",
      title: "Tavern Cellar",
      description: "",
      icon: null,
      locations: [{ x: 0.494, y: 0.643 }]
    },
    {
      id: "nature-path",
      type: "label",
      title: "Nature Path",
      description: "",
      icon: null,
      locations: [{ x: 0.350, y: 0.640 }]
    },
    {
      id: "hilltop",
      type: "label",
      title: "Hilltop",
      description: "",
      icon: null,
      locations: [{ x: 0.365, y: 0.560 }]
    },
    {
      id: "village-ascent",
      type: "label",
      title: "Village Ascent",
      description: "",
      icon: null,
      locations: [{ x: 0.658, y: 0.625 }]
    },
    {
      id: "upper-village",
      type: "label",
      title: "Upper Village",
      description: "",
      icon: null,
      locations: [{ x: 0.650, y: 0.540 }]
    },
    {
      id: "courtyard",
      type: "label",
      title: "Courtyard",
      description: "",
      icon: null,
      locations: [{ x: 0.502, y: 0.438 }]
    },
    {
      id: "hillside-ramparts",
      type: "label",
      title: "Hillside Ramparts",
      description: "",
      icon: null,
      locations: [{ x: 0.400, y: 0.458 }]
    },
    {
      id: "village-ramparts",
      type: "label",
      title: "Village Ramparts",
      description: "",
      icon: null,
      locations: [{ x: 0.600, y: 0.458 }]
    },
    {
      id: "entrance-hall",
      type: "label",
      title: "Entrance Hall",
      description: "",
      icon: null,
      locations: [{ x: 0.500, y: 0.295 }]
    },
    {
      id: "dining-hall",
      type: "label",
      title: "Dining Hall",
      description: "",
      icon: null,
      locations: [{ x: 0.560, y: 0.148 }]
    },
    {
      id: "alchemical-lab",
      type: "label",
      title: "Alchemical Lab",
      description: "",
      icon: null,
      locations: [{ x: 0.485, y: 0.146 }]
    },
    {
      id: "sitting-rooms",
      type: "label",
      title: "Sitting Rooms",
      description: "",
      icon: null,
      locations: [{ x: 0.412, y: 0.192 }]
    },
    {
      id: "undercroft",
      type: "label",
      title: "Undercroft",
      description: "",
      icon: null,
      locations: [{ x: 0.694, y: 0.287 }]
    },
    {
      id: "dungeon",
      type: "label",
      title: "Dungeon",
      description: "",
      icon: null,
      locations: [{ x: 0.885, y: 0.271 }]
    },
    {
      id: "oubilette-room",
      type: "label",
      title: "Oubilette Room",
      description: "",
      icon: null,
      locations: [{ x: 0.789, y: 0.336 }]
    },
    {
      ...sharedMarkers["ammo-cache"],
      locations: [
        { x: 0.553, y: 0.724 },
        { x: 0.332, y: 0.549 },
        { x: 0.475, y: 0.452 },
        { x: 0.552, y: 0.498 },
        { x: 0.500, y: 0.265 },
        { x: 0.527, y: 0.191 },
        { x: 0.428, y: 0.215 },
        { x: 0.698, y: 0.256 },
        { x: 0.926, y: 0.283 },
        { x: 0.755, y: 0.337 },
        { x: 0.660, y: 0.602 },
      ]
    },
    {
      ...sharedMarkers["armor-wall-buy"],
      locations: [
        { x: 0.435, y: 0.673, 
          title: "Tier II Armor"
        },
        { x: 0.485, y: 0.310, 
          title: "Tier II Armor"
        },
        { x: 0.468, y: 0.115, 
          title: "Tier III Armor"
        },
        { x: 0.801, y: 0.312, 
          title: "Tier III Armor"
        }
      ]
    },
    {
      ...sharedMarkers.arsenal,
      locations: [
        { x: 0.500, y: 0.631 },
        { x: 0.530, y: 0.451 },
        { x: 0.481, y: 0.170 },
      ]
    },
    {
      ...sharedMarkers["crafting-table"],
      locations: [
        { x: 0.486, y: 0.663 },
        { x: 0.466, y: 0.282 }
      ]
    },
    {
      ...sharedMarkers["der-wunderfizz"],
      locations: [{ x: 0.420, y: 0.619 }]
    },
    {
      ...sharedMarkers["door-buy"],
      locations: [
        { x: 0.435, y: 0.718 },
        { x: 0.564, y: 0.706 },
        { x: 0.404, y: 0.481 },
        { x: 0.595, y: 0.481 },
        { x: 0.421, y: 0.376 },
        { x: 0.579, y: 0.376 },
        { x: 0.538, y: 0.260 },
        { x: 0.525, y: 0.228 },
        { x: 0.472, y: 0.228 },
        { x: 0.450, y: 0.212 },
        { x: 0.563, y: 0.198 },
        { x: 0.596, y: 0.133 },
        { x: 0.385, y: 0.149 },
        { x: 0.664, y: 0.241 },
        { x: 0.725, y: 0.302 },
        { x: 0.751, y: 0.302 },
        { x: 0.827, y: 0.359 },
        { x: 0.856, y: 0.328 },
        { x: 0.931, y: 0.227 }
      ]
    },
    {
      ...sharedMarkers.exfil,
      locations: [{ x: 0.475, y: 0.644 }]
    },
    {
      ...sharedMarkers["fast-travel"],
      locations: [
        { x: 0.500, y: 0.495, 
          title: "Lion Cannon",
          description: "Use to Fast Travel to the Town Square after opening the Entrance Hall."
        },
        { x: 0.500, y: 0.354, 
          title: "Entrance Hall Door",
          description: "Blow open the door using the Lion Cannon to gain access."
        },
        { x: 0.787, y: 0.394,
          title: "Cave Slide",
          description: "Use to Fast Travel to the Tavern Cellar."
        }
      ]
    },
    {
      ...sharedMarkers["gobblegum-machine"],
      locations: [
        { x: 0.465, y: 0.701 },
        { x: 0.532, y: 0.360 },
        { x: 0.778, y: 0.285 }
      ]
    },
    {
      ...sharedMarkers["mystery-box"],
      locations: [
        { x: 0.447, y: 0.777 },
        { x: 0.663, y: 0.662 },
        { x: 0.426, y: 0.566 },
        { x: 0.534, y: 0.300 },
        { x: 0.666, y: 0.301 },
        { x: 0.896, y: 0.290 }
      ]
    },
    {
      ...sharedMarkers["pack-a-punch"],
      locations: [{ x: 0.775, y: 0.365 }]
    },
    {
      ...sharedMarkers.portal,
      locations: [{ x: 0.508, y: 0.619,
        title: "Tavern Cellar Portal",
        description: "Teleport to the Entrance Hall."
       }]
    },
    {
      ...sharedMarkers["rampage-inducer"],
      locations: [{ x: 0.541, y: 0.787 }]
    },
    { 
      ...sharedMarkers.trap,
      locations: [
        { x: 0.347, y: 0.554, 
          title: "Points of Power Trap"
        },
        { x: 0.630, y: 0.615, 
          title: "Points of Power Trap"
        },
        { x: 0.500, y: 0.448, 
          title: "Points of Power Trap"
        },
        { x: 0.580, y: 0.481, 
          title: "Oil Trap"
        },
        { x: 0.604, y: 0.470,
          title: "Oil Trap"
        },
        { x: 0.414, y: 0.481,
          title: "Oil Trap"
        },
        { x: 0.402, y: 0.470, 
          title: "Oil Trap"
        },
        { x: 0.403, y: 0.183, 
          title: "Points of Power Trap"
        },
        { x: 0.788, y: 0.329, 
          title: "Points of Power Trap"
        },
        { x: 0.909, y: 0.272, 
          title: "Points of Power Trap"
        }
      ]
    },
    {
      ...perks["deadshot-daiquiri"],
      locations: [{ x: 0.378, y: 0.583 }]
    },
    {
      ...perks["elemental-pop"],
      locations: [{ x: 0.377, y: 0.370 }]
    },
    {
      ...perks.juggernog,
      locations: [{ x: 0.511, y: 0.310 }]
    },
    {
      ...perks["melee-macchiato"],
      locations: [{ x: 0.622, y: 0.369 }]
    },
    {
      ...perks["quick-revive"],
      locations: [{ x: 0.866, y: 0.244 }]
    },
    {
      ...perks["speed-cola"],
      locations: [{ x: 0.646, y: 0.507 }]
    },
    {
      ...perks["stamin-up"],
      locations: [{ x: 0.381, y: 0.171 }]
    },
    {
      ...perks["vulture-aid"],
      locations: [{ x: 0.558, y: 0.084 }]
    },
    {
      ...weapons.gs45,
      locations: [{ x: 0.513, y: 0.668 }]
    },
    {
      ...weapons["kompakt-92"],
      locations: [{ x: 0.361, y: 0.603 }]
    },
    {
      ...weapons.xm4,
      locations: [{ x: 0.618, y: 0.535 }]
    },
    {
      ...weapons["lr-7.62"],
      locations: [{ x: 0.448, y: 0.499 }]
    },
    {
      ...weapons["as-val"],
      locations: [{ x: 0.525, y: 0.406 }]
    },
    {
      ...weapons["tanto.22"],
      locations: [{ x: 0.524, y: 0.144 }]
    },
    {
      ...weapons["marine-sp"],
      locations: [{ x: 0.413, y: 0.225 }]
    },
    {
      ...weapons["gpmg-7"],
      locations: [{ x: 0.700, y: 0.226 }]
    },
    {
      ...weapons.ksv,
      locations: [{ x: 0.914, y: 0.228 }]
    }
  ]
}

export default citadelleDesMorts