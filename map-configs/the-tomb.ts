import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const theTomb: MapConfig = {
  id: "the-tomb",
  title: "The Tomb",
  game: "Black Ops 6",
  description: "Learn the locations for Dig Spots, Dark Aether Lanterns, and more with our in-depth interactive map for The Tomb.",
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
      id: "aether-lantern",
      type: "objective",
      title: "Dark Aether Lantern",
      description: "Creates a pool of fire underneath the lantern when shot, damaging zombies and players. Freezing three in quick succession is required for the Ice Staff upgrade quest.",
      icon: "/icons/objectives/aether-lantern.webp",
      locations: [
        { x: 0.246, y: 0.412 },
        { x: 0.318, y: 0.431 },
        { x: 0.318, y: 0.391 },
        { x: 0.359, y: 0.413 },
        { x: 0.475, y: 0.385 },
        { x: 0.628, y: 0.413 },
        { x: 0.626, y: 0.450 },
        { x: 0.626, y: 0.540 },
        { x: 0.532, y: 0.604 },
        { x: 0.335, y: 0.576 },
        { x: 0.254, y: 0.617 },
        { x: 0.812, y: 0.512 },
        { x: 0.812, y: 0.486 },
        { x: 0.461, y: 0.368 },
        { x: 0.502, y: 0.385 },
        { x: 0.516, y: 0.370 },
        { x: 0.347, y: 0.630 },
        { x: 0.526, y: 0.664 },
        { x: 0.640, y: 0.593 },
        { x: 0.559, y: 0.395 },
        { x: 0.286, y: 0.649 },
        { x: 0.485, y: 0.627 },
      ]
    },
    {
      id: "dig-spot",
      type: "objective",
      title: "Dig Spot",
      description: "Use a shovel to potentially get salvage, equipment, and other items. Digging with Death Perception allows you to get Ancient Gems for the Free Raygun side quest.",
      icon: "/icons/objectives/dig-site.webp",
      locations: [
        { x: 0.127, y: 0.502 },
        { x: 0.320, y: 0.625 },
        { x: 0.521, y: 0.623 },
        { x: 0.409, y: 0.653 },
        { x: 0.688, y: 0.571 },
        { x: 0.865, y: 0.488 },
        { x: 0.765, y: 0.450 },
        { x: 0.502, y: 0.424 },
        { x: 0.458, y: 0.335 },
        { x: 0.314, y: 0.378 },
      ]
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
        { x: 0.780, y: 0.542 },
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