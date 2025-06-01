import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const terminus: MapConfig = {
  id: 'terminus',
  title: "Terminus",
  image: "/layers/terminus.webp",
  markers: [
    {
      id: "elevator",
      title: "Elevator",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.538, y: 0.429 }]
    },
    {
      id: "holding-cells",
      title: "Holding Cells",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.526, y: 0.445 }]
    },
    {
      id: "guard-station",
      title: "Guard Station",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.498, y: 0.462 }]
    },
    {
      id: "interrogation-rooms",
      title: "Interrogation Rooms",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.470, y: 0.465 }]
    },
    {
      id: "security-overlook",
      title: "Security Overlook",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.498, y: 0.483 }]
    },
    {
      id: "control-center",
      title: "Control Center",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.531, y: 0.481 }]
    },
    {
      id: "communications",
      title: "Communications",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.554, y: 0.518 }]
    },
    {
      id: "engineering",
      title: "Engineering",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.545, y: 0.558 }]
    },
    {
      id: "living-quarters",
      title: "Living Quarters",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.505, y: 0.553 }]
    },
    {
      id: "rec-yard",
      title: "Rec Yard",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.477, y: 0.557 }]
    },
    {
      id: "storage-area",
      title: "Storage Area",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.471, y: 0.519 }]
    },
    {
      id: "mess-hall",
      title: "Mess Hall",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.435, y: 0.554 }]
    },
    {
      id: "gun-platform",
      title: "Gun Platform",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.470, y: 0.604 }]
    },
    {
      id: "seaside-path",
      title: "Seaside Path",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.435, y: 0.612 }, { x: 0.807, y: 0.909 }]
    },
    {
      id: "sea-tower",
      title: "Sea Tower",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.542, y: 0.619 }, { x: 0.903, y: 0.919 }]
    },
    {
      id: "crab-island",
      title: "Crab Island",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.460, y: 0.766 }]
    },
    {
      id: "castle-rock-island",
      title: "Castle Rock Island",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.758, y: 0.479 }]
    },
    {
      id: "temple-island",
      title: "Temple Island",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.335, y: 0.304 }]
    },
    {
      id: "shipwreck",
      title: "Shipwreck",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.252, y: 0.641 }]
    },
    {
      id: "workshop",
      title: "Workshop",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.228, y: 0.585 }]
    },
    {
      id: "docks",
      title: "Docks",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.868, y: 0.911 }]
    },
    {
      id: "sea-caves",
      title: "Sea Caves",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.815, y: 0.843 }]
    },
    {
      id: "mining-tunnels",
      title: "Mining Tunnels",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.896, y: 0.843 }]
    },
    {
      id: "bio-lab",
      title: "Bio Lab",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.863, y: 0.770 }]
    },
    {
      id: "submarine-pier",
      title: "Submarine Pier",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.493, y: 0.347 }]
    },
    {
      ...sharedMarkers["ammo-cache"],
      locations: [
        { x: 0.485, y: 0.489 },
        { x: 0.459, y: 0.517 },
        { x: 0.539, y: 0.527 },
        { x: 0.512, y: 0.560 },
        { x: 0.423, y: 0.613 },
        { x: 0.535, y: 0.601 },
        { x: 0.472, y: 0.772 },
        { x: 0.225, y: 0.576 },
        { x: 0.760, y: 0.450 },
        { x: 0.350, y: 0.295 },
        { x: 0.910, y: 0.758 },
        { x: 0.815, y: 0.786 }
      ]
    },
    {
      ...sharedMarkers["armor-wall-buy"],
      locations: [
        { x: 0.526, y: 0.617, title: "Tier II Armor" },
        { x: 0.448, y: 0.640, title: "Tier II Armor" },
        { x: 0.818, y: 0.936, title: "Tier II Armor" },
        { x: 0.530, y: 0.783, title: "Tier III Armor" },
        { x: 0.836, y: 0.738, title: "Tier III Armor" }
      ]
    },
    {
      ...sharedMarkers.arsenal,
      locations: [
        { x: 0.435, y: 0.571 },
        { x: 0.899, y: 0.787 },
        { x: 0.868, y: 0.925 },
      ]
    },
    {
      ...sharedMarkers["crafting-table"],
      locations: [
        { x: 0.543, y: 0.547 },
        { x: 0.825, y: 0.762 },
        { x: 0.365, y: 0.780 },
      ]
    },
    {
      ...sharedMarkers["der-wunderfizz"],
      locations: [{ x: 0.212, y: 0.550 }]
    },
    {
      ...sharedMarkers["door-buy"],
      locations: [
        { x: 0.537, y: 0.492 },
        { x: 0.478, y: 0.486 },
        { x: 0.514, y: 0.565 },
        { x: 0.542, y: 0.573 },
        { x: 0.542, y: 0.598 },
        { x: 0.428, y: 0.573 },
        { x: 0.839, y: 0.887 },
        { x: 0.878, y: 0.876 },
        { x: 0.822, y: 0.798 },
        { x: 0.903, y: 0.798 },
      ]
    },
    {
      ...sharedMarkers.exfil,
      locations: [{ x: 0.535, y: 0.478 }]
    },
    {
      ...sharedMarkers["fast-travel"],
      locations: [
        { x: 0.544, y: 0.424, title: "Elevator",
          description: "Use to Fast Travel to the Bio Lab."
        },
        { x: 0.527, y: 0.635, title: "Zipline", 
          description: "Use to Fast Travel to the Docks."
        },
        { x: 0.905, y: 0.744, title: "Elevator", 
          description: "Use to Fast Travel to the Holding Cells."
        },
        { x: 0.497, y: 0.518, title: "Inclined Lift", 
          description: "Use to Fast Travel to the Bio Lab."
        },
        { x: 0.863, y: 0.802, title: "Inclined Lift",
          description: "Use to Fast Travel to the Storage Area."
        }
      ]
    },
    {
      ...sharedMarkers["gobblegum-machine"],
      locations: [
        { x: 0.502, y: 0.490 },
        { x: 0.424, y: 0.554 },
        { x: 0.903, y: 0.863 },
        { x: 0.757, y: 0.507 },
      ]
    },
    {
      ...sharedMarkers["mystery-box"],
      locations: [
        { x: 0.431, y: 0.527 },
        { x: 0.561, y: 0.545 },
        { x: 0.275, y: 0.639 },
        { x: 0.335, y: 0.321 },
        { x: 0.868, y: 0.894 },
        { x: 0.425, y: 0.635 },
      ]
    },
    {
      ...sharedMarkers["pack-a-punch"],
      locations: [{ x: 0.863, y: 0.809 }, { x: 0.497, y: 0.525 }]
    },
    {
      ...sharedMarkers["power-door"],
      locations: [
        { x: 0.483, y: 0.460 },
        { x: 0.513, y: 0.485 },
        { x: 0.531, y: 0.553 },
        { x: 0.435, y: 0.535 },
        { x: 0.449, y: 0.553 },
        { x: 0.486, y: 0.620 },
        { x: 0.518, y: 0.620 },
        { x: 0.852, y: 0.889 },
      ]
    },
    {
      ...sharedMarkers["rampage-inducer"],
      locations: [{ x: 0.521, y: 0.435 }]
    },
    {
      ...sharedMarkers.trap,
      locations: [
        { x: 0.512, y: 0.459, title: "Tentacle Trap" },
        { x: 0.497, y: 0.557, title: "Tentacle Trap" },
        { x: 0.819, y: 0.798, title: "Tentacle Trap" },
        { x: 0.902, y: 0.801, title: "Tentacle Trap" },
        { x: 0.487, y: 0.592, title: "Void Cannon" },
      ]
    },
    {
      ...sharedMarkers.workbench,
      locations: [{ x: 0.494, y: 0.529 }]
    },
    {
      ...sharedMarkers["vehicle-spawn"],
      locations: [
        { x: 0.877, y: 0.933 },
        { x: 0.489, y: 0.743 },
        { x: 0.296, y: 0.700 },
        { x: 0.700, y: 0.474 },
        { x: 0.382, y: 0.283 },
      ]
    },
    {
      ...perks["deadshot-daiquiri"],
      locations: [{ x: 0.468, y: 0.641 }, { x: 0.838, y: 0.937 }]
    },
    {
      ...perks["elemental-pop"],
      locations: [{ x: 0.555, y: 0.630 }]
    },
    {
      ...perks.juggernog,
      locations: [{ x: 0.499, y: 0.571 }]
    },
    {
      ...perks["melee-macchiato"],
      locations: [{ x: 0.863, y: 0.732 }]
    },
    {
      ...perks["phd-flopper"],
      locations: [{ x: 0.878, y: 0.853 }]
    },
    {
      ...perks["quick-revive"],
      locations: [{ x: 0.481, y: 0.469 }]
    },
    {
      ...perks["speed-cola"],
      locations: [{ x: 0.813, y: 0.832 }]
    },
    {
      ...perks["stamin-up"],
      locations: [{ x: 0.547, y: 0.475 }]
    },
    {
      ...weapons.gs45,
      locations: [{ x: 0.528, y: 0.459 }]
    },
    {
      ...weapons["tanto.22"],
      locations: [{ x: 0.458, y: 0.458 }]
    },
    {
      ...weapons["asg-89"],
      locations: [{ x: 0.518, y: 0.472 }]
    },
    {
      ...weapons.c9,
      locations: [{ x: 0.525, y: 0.534 }]
    },
    {
      ...weapons["goblin-mk2"],
      locations: [{ x: 0.450, y: 0.622 }]
    },
    {
      ...weapons["pp-919"],
      locations: [{ x: 0.542, y: 0.604 }]
    },
    {
      ...weapons["tsarkov-7.62"],
      locations: [{ x: 0.419, y: 0.779 }]
    },
    {
      ...weapons["svd"],
      locations: [{ x: 0.241, y: 0.655 }]
    },
    {
      ...weapons["xmg"],
      locations: [{ x: 0.746, y: 0.493 }]
    },
    {
      ...weapons["pu-21"],
      locations: [{ x: 0.326, y: 0.287 }]
    },
    {
      ...weapons["as-val"],
      locations: [{ x: 0.840, y: 0.876 }]
    },
    {
      ...weapons["ak-74"],
      locations: [{ x: 0.914, y: 0.805 }]
    },
    {
      ...weapons.xm4,
      locations: [{ x: 0.880, y: 0.731 }]
    }
  ]
}

export default terminus