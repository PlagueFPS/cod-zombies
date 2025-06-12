import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const terminus: MapConfig = {
  id: 'terminus',
  title: "Terminus",
  game: "Black Ops 6",
  description: "Learn the locations for Boat Spawns, Fishing Spots, and more with our in-depth interactive map for Terminus.",
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
      id: "armory",
      type: "label",
      title: "Armory",
      description: "",
      icon: null,
      locations: [{ x: 0.539, y: 0.463 }]
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
      id: "aetherium-maturation-pod",
      title: "Aetherium Maturation Pod",
      type: "objective",
      description: "Activate and defend the A.M.P. to restore power to the area.",
      icon: "/icons/objectives/aetherium-maturation-pod.webp",
      locations: [
        { x: 0.490, y: 0.470 },
        { x: 0.498, y: 0.552 },
        { x: 0.863, y: 0.782 },
      ]
    },
    {
      id: "underwater-chest",
      title: "Underwater Chest",
      type: "objective",
      description: "Possible Location. Opening this chest will reward you with loot and potentially a Ray Gun, Perks, Aetherium Crystals, and Aether Tools. Open all chests on the map for a guaranteed Free Perk.",
      icon: "/icons/objectives/chest.webp",
      locations: [
        { x: 0.897, y: 0.767 },
        { x: 0.816, y: 0.778 },
        { x: 0.504, y: 0.723 },
        { x: 0.255, y: 0.586 },
        { x: 0.221, y: 0.602 },
        { x: 0.391, y: 0.267 },
        { x: 0.361, y: 0.312 },
        { x: 0.726, y: 0.495 },
        { x: 0.737, y: 0.434 },
        { x: 0.923, y: 0.836 },
        { x: 0.220, y: 0.578 },
        { x: 0.557, y: 0.793 },
        { x: 0.426, y: 0.712 },
      ]
    },
    {
      id: "fish-spawn",
      title: "Fish Spawn",
      type: "objective",
      description: "Possible Location. Killing these fish with an explosive will reward you with one loot item per fish. Killing a total of 50 fish will reward you with a Perkaholic.",
      icon: "/icons/objectives/fish.webp",
      locations: [
        // Bio Lab
        { x: 0.816, y: 0.763 },
        { x: 0.829, y: 0.764 },
        { x: 0.848, y: 0.747 },
        { x: 0.872, y: 0.746 },
        { x: 0.895, y: 0.765 },
        { x: 0.910, y: 0.767 },
        // Docks
        { x: 0.865, y: 0.931 },
        { x: 0.877, y: 0.923 },
        { x: 0.888, y: 0.903 },
        { x: 0.912, y: 0.892 },
        { x: 0.928, y: 0.911 },
        { x: 0.918, y: 0.930 },
        { x: 0.889, y: 0.945 },
        // Crab Island
        { x: 0.414, y: 0.703 },
        { x: 0.495, y: 0.731 },
        { x: 0.462, y: 0.730 },
        { x: 0.441, y: 0.714 },
        // Shipwreck
        { x: 0.307, y: 0.692 },
        { x: 0.273, y: 0.713 },
        { x: 0.255, y: 0.593 },
        { x: 0.224, y: 0.602 },
        { x: 0.208, y: 0.587 },
        { x: 0.246, y: 0.574 },
      ]
    },
    {
      id: "dig-spot",
      type: "objective",
      title: "Dig Spot",
      description: "Use a shovel to potentially get salvage, equipment, perks, and other items.",
      icon: "/icons/objectives/dig-site.webp",
      locations: [
        { x: 0.819, y: 0.826 },
        { x: 0.834, y: 0.833 },
        { x: 0.546, y: 0.781 },
        { x: 0.397, y: 0.748 },
        { x: 0.369, y: 0.277 },
        { x: 0.822, y: 0.864 },
        { x: 0.807, y: 0.813 },
        { x: 0.488, y: 0.777 },
        { x: 0.889, y: 0.867 },
        { x: 0.887, y: 0.839 },
        { x: 0.313, y: 0.323 },
        { x: 0.782, y: 0.473 },
        { x: 0.772, y: 0.448 },
        { x: 0.905, y: 0.833 },
        { x: 0.901, y: 0.807 },
      ]
    },
    {
      ...sharedMarkers.shovel,
      locations: [
        { x: 0.845, y: 0.883 },
        { x: 0.897, y: 0.825 },
        { x: 0.342, y: 0.330 },
        { x: 0.765, y: 0.439 },
      ]
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
        { x: 0.941, y: 0.835 },
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
      title: "Boat Spawn",
      description: "Spawns in a boat vehicle.",
      icon: "/icons/transportation/boat.webp",
      locations: [
        { x: 0.877, y: 0.933 },
        { x: 0.489, y: 0.743 },
        { x: 0.296, y: 0.700 },
        { x: 0.700, y: 0.474 },
        { x: 0.382, y: 0.283 },
        { x: 0.889, y: 0.753 },
      ]
    },
    {
      ...sharedMarkers["audio-log"],
      locations: [
        { x: 0.512, y: 0.555, title: "Working Theory" },
        { x: 0.524, y: 0.488, title: "Ship Manifest Destiny" },
        { x: 0.559, y: 0.520, title: "Doctor's Orders" },
        { x: 0.481, y: 0.466, title: "The Hard Way" },
        { x: 0.429, y: 0.538, title: "Food For Thought" },
        { x: 0.871, y: 0.732, title: "Onboarding" },
        { x: 0.852, y: 0.905, title: "I Hope You're Watching" },
        { x: 0.825, y: 0.804, title: "Red Tape" },
        { x: 0.899, y: 0.863, title: "Noble Purpose" },
        { x: 0.535, y: 0.619, title: "Listen..." },
        { x: 0.485, y: 0.483, title: "Pleasing Results" },
        { x: 0.342, y: 0.311, title: "Surveyor Says" },
        { x: 0.230, y: 0.558, title: "Numbers and Faces" },
        { x: 0.547, y: 0.429, title: "Tougher Than She Looks", description: "You must first acquire the A.M.P. Munition for the Beamsmasher before this audio log appears." },
        { x: 0.858, y: 0.780, title: "Code Words", description: "Only appears after giving the Hard Drive to Peck to locate Nathan." },
        { x: 0.231, y: 0.595, title: "Damning Evidence", description: "Only appears after defeating Nathan." }
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