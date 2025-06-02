import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const theTomb: MapConfig = {
  id: "the-tomb",
  title: "The Tomb",
  description: "",
  image: "/layers/the-tomb.webp",
  markers: [
    {
      id: "dig-site",
      type: "label",
      title: "Dig Site",
      description: "",
      icon: null,
      locations: [{ x: 0.168, y: 0.514 }]
    },
    {
      id: "roman-mausoleum",
      type: "label",
      title: "Roman Mausoleum",
      description: "",
      icon: null,
      locations: [{ x: 0.303, y: 0.492 }]
    },
    {
      id: "tombs",
      type: "label",
      title: "Tombs",
      description: "",
      icon: null,
      locations: [{ x: 0.305, y: 0.413 }]
    },
    {
      id: "shrine-of-the-hierophants",
      type: "label",
      title: "Shrine of the Hierophants",
      description: "",
      icon: null,
      locations: [{ x: 0.488, y: 0.370 }]
    },
    {
      id: "neolithic-catacombs",
      type: "label",
      title: "Neolithic Catacombs",
      description: "",
      icon: null,
      locations: [{ x: 0.325, y: 0.630 }]
    },
    {
      id: "ossurary",
      type: "label",
      title: "Ossurary",
      description: "",
      icon: null,
      locations: [{ x: 0.493, y: 0.604 }]
    },
    {
      id: "subterranean-temple",
      type: "label",
      title: "Subterranean Temple",
      description: "",
      icon: null,
      locations: [{ x: 0.636, y: 0.500 }]
    },
    {
      id: "deep-excavation",
      type: "label",
      title: "Deep Excavation",
      description: "",
      icon: null,
      locations: [{ x: 0.813, y: 0.500 }]
    },
    {
      id: "dark-aether-nexus",
      type: "label",
      title: "Dark Aether Nexus",
      description: "",
      icon: null,
      locations: [{ x: 0.772, y: 0.776 }]
    },
    {
      ...sharedMarkers["ammo-cache"],
      locations: [
        { x: 0.157, y: 0.573 },
        { x: 0.291, y: 0.427 },
        { x: 0.443, y: 0.412 },
        { x: 0.257, y: 0.592 },
        { x: 0.491, y: 0.629 },
        { x: 0.608, y: 0.557 },
        { x: 0.798, y: 0.431 },
        { x: 0.745, y: 0.888 },
        { x: 0.878, y: 0.768 },
        { x: 0.758, y: 0.673 },
      ]
    },
    {
      ...sharedMarkers["armor-wall-buy"],
      locations: [
        { x: 0.216, y: 0.509, 
          title: "Tier II Armor",
        },
        { x: 0.807, y: 0.512, 
          title: "Tier III Armor"
        },
        { x: 0.323, y: 0.500, 
          title: "Golden Armor",
          description: "Available after completing the Golden Armor side quest."
        }
      ]
    },
    {
      ...sharedMarkers.arsenal,
      locations: [
        { x: 0.219, y: 0.558 },
        { x: 0.773, y: 0.549 },
      ]
    },
    {
      ...sharedMarkers["crafting-table"],
      locations: [
        { x: 0.362, y: 0.578 },
        { x: 0.567, y: 0.381 },
        { x: 0.677, y: 0.762 },
      ]
    },
    {
      ...sharedMarkers["der-wunderfizz"],
      locations: [{ x: 0.665, y: 0.814 }]
    },
    {
      ...sharedMarkers["door-buy"],
      locations: [
        { x: 0.201, y: 0.595 },
        { x: 0.217, y: 0.419 },
        { x: 0.367, y: 0.413 },
        { x: 0.375, y: 0.613 },
        { x: 0.574, y: 0.404 },
        { x: 0.609, y: 0.591 },
      ]
    },
    {
      ...sharedMarkers.exfil,
      locations: [{ x: 0.281, y: 0.541 }]
    },
    {
      ...sharedMarkers["gobblegum-machine"],
      locations: [
        { x: 0.139, y: 0.461 },
        { x: 0.500, y: 0.387 },
        { x: 0.514, y: 0.612 },
      ]
    },
    {
      ...sharedMarkers["mystery-box"],
      locations: [
        { x: 0.179, y: 0.417 },
        { x: 0.292, y: 0.456 },
        { x: 0.319, y: 0.679 },
        { x: 0.558, y: 0.593 },
        { x: 0.528, y: 0.416 }
      ]
    },
    {
      ...sharedMarkers["pack-a-punch"],
      locations: [
        { x: 0.318, y: 0.482 },
        { x: 0.748, y: 0.796 }
      ]
    },
    {
      ...sharedMarkers.portal,
      locations: [
        { x: 0.307, y: 0.528, 
          title: "Dark Aether Nexus Portal",
          description: "Teleport to the Dark Aether Nexus"
        },
        { x: 0.489, y: 0.423, 
          title: "Dark Aether Nexus Portal",
          description: "Teleport to the Dark Aether Nexus"
        },
        { x: 0.498, y: 0.542, 
          title: "Dark Aether Nexus Portal",
          description: "Teleport to the Dark Aether Nexus"
        },
        { x: 0.574, y: 0.498, 
          title: "Dark Aether Nexus Portal",
          description: "Teleport to the Dark Aether Nexus"
        },
        { x: 0.600, y: 0.776,
          title: "Ossurary Portal",
          description: "Teleport to the Ossurary"
        },
        { x: 0.768, y: 0.626, 
          title: "Dig Site Portal",
          description: "Teleport to the Dig Site"
        },
        { x: 0.942, y: 0.772, 
          title: "Shrine of the Hierophants Portal",
          description: "Teleport to the Shrine of the Hierophants."
        },
        { x: 0.775, y: 0.953, 
          title: "Subterranean Temple Portal",
          description: "Teleport to the Subterranean Temple"
        }
      ]
    },
    {
      ...sharedMarkers["rampage-inducer"],
      locations: [{ x: 0.098, y: 0.500 }]
    },
    {
      ...sharedMarkers.trap,
      locations: [
        { x: 0.398, y: 0.419, 
          title: "Arrow Trap"
        },
        { x: 0.420, y: 0.397, 
          title: "Arrow Trap"
        },
        { x: 0.420, y: 0.592, 
          title: "Arrow Trap"
        },
        { x: 0.456, y: 0.598, 
          title: "Arrow Trap"
        },
        { x: 0.415, y: 0.655,
          title: "Arrow Trap"
        },
        { x: 0.455, y: 0.666, 
          title: "Arrow Trap"
        }
      ]
    },
    {
      ...perks["phd-flopper"],
      locations: [{ x: 0.148, y: 0.601 }]
    },
    {
      ...perks["death-perception"],
      locations: [{ x: 0.291, y: 0.370 }]
    },
    {
      ...perks.juggernog,
      locations: [{ x: 0.864, y: 0.738 }]
    },
    {
      ...perks["quick-revive"],
      locations: [{ x: 0.897, y: 0.496 }]
    },
    {
      ...perks["speed-cola"],
      locations: [{ x: 0.592, y: 0.656 }]
    },
    {
      ...perks["stamin-up"],
      locations: [{ x: 0.487, y: 0.314 }]
    },
    {
      ...perks["deadshot-daiquiri"],
      locations: [{ x: 0.281, y: 0.618 }]
    },
    {
      ...weapons["marine-sp"],
      locations: [{ x: 0.272, y: 0.477 }]
    },
    {
      ...weapons["tanto.22"],
      locations: [{ x: 0.316, y: 0.407 }]
    },
    {
      ...weapons["ak-74"],
      locations: [{ x: 0.432, y: 0.347 }]
    },
    {
      ...weapons["kompakt-92"],
      locations: [{ x: 0.322, y: 0.609 }]
    },
    {
      ...weapons.xm4,
      locations: [{ x: 0.505, y: 0.682 }]
    },
    {
      ...weapons["gpmg-7"],
      locations: [{ x: 0.680, y: 0.476 }]
    }
  ]
}

export default theTomb