import type { MapConfig } from "@/types/InteractiveMap";
import { sharedMarkers, perks, weapons } from "./markers";

const shatteredVeil: MapConfig = {
  id: "shattered-veil",
  title: "Shattered Veil",
  image: "/layers/shattered-veil.webp",
  markers: [
    {
      id: "garden-pond",
      type: "label",
      title: "Garden Pond",
      description: "",
      icon: null,
      locations: [{ x: 0.212, y: 0.607 }]
    },
    {
      id: "lower-terrace",
      type: "label",
      title: "Lower Terrace",
      description: "",
      icon: null,
      locations: [{ x: 0.287, y: 0.550 }]
    },
    {
      id: "upper-terrace",
      type: "label",
      title: "Upper Terrace",
      description: "",
      icon: null,
      locations: [{ x: 0.373, y: 0.558 }]
    },
    {
      id: "shems-henge",
      type: "label",
      title: "Shem's Henge",
      description: "",
      icon: null,
      locations: [{ x: 0.342, y: 0.617 }]
    },
    {
      id: "conservatory",
      type: "label",
      title: "Conservatory",
      description: "",
      icon: null,
      locations: [{ x: 0.263, y: 0.477 }]
    },
    {
      id: "motor-court",
      type: "label",
      title: "Motor Court",
      description: "",
      icon: null,
      locations: [{ x: 0.463, y: 0.514 }]
    },
    {
      id: "grand-foyer",
      type: "label",
      title: "Grand Foyer",
      description: "",
      icon: null,
      locations: [{ x: 0.471, y: 0.396 }]
    },
    {
      id: "overlook",
      type: "label",
      title: "Overlook",
      description: "",
      icon: null,
      locations: [{ x: 0.472, y: 0.351 }]
    },
    {
      id: "east-foyer",
      type: "label",
      title: "East Foyer",
      description: "",
      icon: null,
      locations: [{ x: 0.541, y: 0.373 }]
    },
    {
      id: "library",
      type: "label",
      title: "Library",
      description: "",
      icon: null,
      locations: [{ x: 0.590, y: 0.320 }]
    },
    {
      id: "study",
      type: "label",
      title: "Study",
      description: "",
      icon: null,
      locations: [{ x: 0.573, y: 0.264 }]
    },
    {
      id: "east-balcony",
      type: "label",
      title: "East Balcony",
      description: "",
      icon: null,
      locations: [{ x: 0.554, y: 0.233 }]
    },
    {
      id: "rear-patio",
      type: "label",
      title: "Rear Patio",
      description: "",
      icon: null,
      locations: [{ x: 0.481, y: 0.199 }]
    },
    {
      id: "kitchen",
      type: "label",
      title: "Kitchen",
      description: "",
      icon: null,
      locations: [{ x: 0.505, y: 0.245 }]
    },
    {
      id: "banquet-hall",
      type: "label",
      title: "Banquet Hall",
      description: "",
      icon: null,
      locations: [{ x: 0.472, y: 0.272 }]
    },
    {
      id: "west-balcony",
      type: "label",
      title: "West Balcony",
      description: "",
      icon: null,
      locations: [{ x: 0.398, y: 0.230 }]
    },
    {
      id: "bottlery",
      type: "label",
      title: "Bottlery",
      description: "",
      icon: null,
      locations: [{ x: 0.428, y: 0.250 }]
    },
    {
      id: "directors-quarters",
      type: "label",
      title: "Director's Quarters",
      description: "",
      icon: null,
      locations: [{ x: 0.400, y: 0.302 }]
    },
    {
      id: "nursery",
      type: "label",
      title: "Nursery",
      description: "",
      icon: null,
      locations: [{ x: 0.391, y: 0.383 }],
    },
    {
      id: "south-west-balcony",
      type: "label",
      title: "South West Balcony",
      description: "",
      icon: null,
      locations: [{ x: 0.357, y: 0.389 }]
    },
    {
      id: "west-hallways",
      type: "label",
      title: "West Hallways",
      description: "",
      icon: null,
      locations: [{ x: 0.419, y: 0.328 }]
    },
    {
      id: "mainframe-chamber",
      type: "label",
      title: "Mainframe Chamber",
      description: "",
      icon: null,
      locations: [{ x: 0.810, y: 0.404 }]
    },
    {
      id: "security-overlook",
      type: "label",
      title: "Security Overlook",
      description: "",
      icon: null,
      locations: [{ x: 0.810, y: 0.459 }]
    },
    {
      id: "service-tunnel",
      type: "label",
      title: "Service Tunnel",
      description: "",
      icon: null,
      locations: [{ x: 0.710, y: 0.515 }]
    },
    {
      id: "supply-depot",
      type: "label",
      title: "Supply Depot",
      description: "",
      icon: null,
      locations: [{ x: 0.704, y: 0.597 }]
    },
    {
      id: "armory",
      type: "label",
      title: "Armory",
      description: "",
      icon: null,
      locations: [{ x: 0.671, y: 0.597 }]
    },
    {
      id: "serpent-mound",
      type: "label",
      title: "Serpent Mound",
      description: "",
      icon: null,
      locations: [{ x: 0.641, y: 0.414 }]
    },
    {
      id: "distillery",
      type: "label",
      title: "Distillery",
      description: "",
      icon: null,
      locations: [{ x: 0.245, y: 0.344 }]
    },
    {
      id: "ravine",
      type: "label",
      title: "Ravine",
      description: "",
      icon: null,
      locations: [{ x: 0.559, y: 0.657 }]
    },
    {
      ...perks["quick-revive"],
      locations: [{ x: 0.231, y: 0.473 }]
    },
    {
      ...perks["speed-cola"],
      locations: [{ x: 0.415, y: 0.626 }]
    },
    {
      ...perks.juggernog,
      locations: [{ x: 0.446, y: 0.407 }]
    },
    {
      ...perks["double-tap"],
      locations: [{ x: 0.481, y: 0.210 }]
    },
    {
      ...perks["phd-flopper"],
      locations: [{ x: 0.371, y: 0.396 }]
    },
    {
      ...perks["stamin-up"],
      locations: [{ x: 0.550, y: 0.348 }]
    },
    {
      ...perks["death-perception"],
      locations: [{ x: 0.439, y: 0.277 }]
    },
    {
      ...perks["elemental-pop"],
      locations: [{ x: 0.575, y: 0.223 }]
    },
    {
      ...sharedMarkers["ammo-cache"],
      locations: [
        { x: 0.172, y: 0.599 },
        { x: 0.355, y: 0.595 },
        { x: 0.341, y: 0.495 },
        { x: 0.428, y: 0.474 },
        { x: 0.395, y: 0.332 },
        { x: 0.575, y: 0.328 },
        { x: 0.492, y: 0.184 },
        { x: 0.772, y: 0.378 },
        { x: 0.631, y: 0.510 },
        { x: 0.561, y: 0.702 },
        { x: 0.557, y: 0.609 },
        { x: 0.658, y: 0.457 }
      ]
    },
    {
      ...sharedMarkers["mystery-box"],
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
      ...sharedMarkers["armor-wall-buy"],
      locations: [
        { x: 0.376, y: 0.368,
          title: "Tier II Armor"
        },
        { x: 0.593, y: 0.345, 
          title: "Tier II Armor"
        },
        { x: 0.460, y: 0.281, 
          title: "Tier III Armor"
        },
        { x: 0.745, y: 0.474, 
          title: "Tier III Armor"
        }
      ]
    },
    {
      ...sharedMarkers["der-wunderfizz"],
      locations: [{ x: 0.745, y: 0.507 }]
    },
    {
     ...sharedMarkers["gobblegum-machine"],
      locations: [
        { x: 0.246, y: 0.559 },
        { x: 0.381, y: 0.552 },
        { x: 0.346, y: 0.324 },
        { x: 0.591, y: 0.292 },
        { x: 0.479, y: 0.255 },
        { x: 0.823, y: 0.529 }
      ]
    },
    {
      ...sharedMarkers.arsenal,
      locations: [
        { x: 0.501, y: 0.400 },
        { x: 0.728, y: 0.614 },
        { x: 0.434, y: 0.206 }
      ]
    },
    {
      ...sharedMarkers.trap,
      locations: [
        { x: 0.177, y: 0.571,
          title: "Dark Aether Field Generator",
        },
        { x: 0.276, y: 0.490,
          title: "Microwave Trap"
        },
        { x: 0.531, y: 0.353,
          title: "Microwave Trap"
        },
        { x: 0.390, y: 0.371,
          title: "Microwave Trap"
        },
        { x: 0.764, y: 0.530,
          title: "Dark Aether Field Generator"
        }
      ]
    },
    {
      ...sharedMarkers["rampage-inducer"],
      locations: [{ x: 0.259, y: 0.614 }]
    },
    {
      ...sharedMarkers["power-door"],
      locations: [{ x: 0.422, y: 0.336 }]
    },
    {
      ...sharedMarkers["door-buy"],
      locations: [
        { x: 0.263, y: 0.523 },
        { x: 0.314, y: 0.573 },
        { x: 0.334, y: 0.514 },
        { x: 0.405, y: 0.602 },
        { x: 0.473, y: 0.447 },
        { x: 0.504, y: 0.388 },
        { x: 0.517, y: 0.379 },
        { x: 0.429, y: 0.352 },
        { x: 0.359, y: 0.360 },
        { x: 0.598, y: 0.280 },
        { x: 0.531, y: 0.226 },
        { x: 0.437, y: 0.226 },
        { x: 0.681, y: 0.557 }
      ]
    },
    {
      ...sharedMarkers["crafting-table"],
      locations: [
        { x: 0.492, y: 0.576 },
        { x: 0.486, y: 0.231 },
        { x: 0.850, y: 0.379 }
      ]
    },
    {
      ...sharedMarkers["pack-a-punch"],
      locations: [{ x: 0.810, y: 0.447 }]
    },
    {
      ...sharedMarkers.exfil,
      locations: [{ x: 0.299, y: 0.551 }]
    },
    {
      ...sharedMarkers.portal,
      locations: [
        { x: 0.238, y: 0.638,
          title: "Garden Pond Portal",
          description: "Teleport to the Supply Depot"
        },
        { x: 0.706, y: 0.626, 
          title: "Supply Depot Portal",
          description: "Teleport to the Garden Pond"
        }
      ]
    },
    {
      ...sharedMarkers.workbench,
      locations: [
        { 
          x: 0.162, y: 0.629, 
          title: "Ray Gun MKII-R Workbench",
          description: "Craft the Ray Gun MKII-Rot Blight upgrade at this workbench."
        },
        {
          x: 0.394, y: 0.315,
          title: "Ray Gun MKII-P Workbench",
          description: "Craft the Ray Gun MKII-Perservation upgrade at this workbench."
        },
        {
          x: 0.719, y: 0.575,
          title: "Ray Gun MKII-W Workbench",
          description: "Craft the Ray Gun MKII-Wraith Fire upgrade at this workbench."
        }
      ]
    },
    {
      ...weapons.gs45,
      locations: [{ x: 0.230, y: 0.597 }]
    },
    {
      ...weapons["kompakt-92"],
      locations: [{ x: 0.318, y: 0.630 }]
    },
    {
      ...weapons["tanto.22"],
      locations: [{ x: 0.302, y: 0.452 }]
    },
    {
      ...weapons["marine-sp"],
      locations: [{ x: 0.488, y: 0.517 }]
    },
    {
      ...weapons["ames-85"],
      locations: [{ x: 0.473, y: 0.360 }]
    },
    {
      ...weapons.xm4,
      locations: [{ x: 0.417, y: 0.370 }]
    },
    {
      ...weapons["ak-74"],
      locations: [{ x: 0.530, y: 0.380 }]
    },
    {
      ...weapons["aek-973"],
      locations: [{ x: 0.443, y: 0.327 }]
    },
    {
      ...weapons["swat-5.56"],
      locations: [{ x: 0.602, y: 0.252 }]
    },
    {
      ...weapons["lr-7.62"],
      locations: [{ x: 0.481, y: 0.184 }]
    },
    {
      ...weapons["gpmg-7"],
      locations: [{ x: 0.850, y: 0.450 }]
    },
    {
      ...weapons["asg-89"],
      locations: [{ x: 0.7015, y: 0.590 }]
    },
    {
      ...weapons["pu-21"],
      locations: [{ x: 0.607, y: 0.425 }]
    }
  ]
}

export default shatteredVeil;