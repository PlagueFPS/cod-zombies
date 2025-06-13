import type { MapConfig } from "@/types/InteractiveMap";
import { perks, sharedMarkers, weapons } from "./markers";

const libertyFalls: MapConfig = {
  id: "liberty-falls",
  title: "Liberty Falls",
  game: "Black Ops 6",
  description: "Learn the locations of everything you need, and more with our in-depth interactive map for Liberty Falls.",
  image: '/layers/liberty-falls.webp',
  markers: [
    {
      id: "abandoned-rooftop",
      title: "Abandoned Rooftop",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.858, y: 0.610 }]
    },
    {
      id: "pump-and-pay",
      title: "Pump & Pay",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.789, y: 0.617 }]
    },
    {
      id: "east-main-street",
      title: "East Main Street",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.723, y: 0.545 }]
    },
    {
      id: "motor-lodge",
      title: "Motor Lodge",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.653, y: 0.631 }]
    },
    {
      id: "motor-lodge-alley",
      title: "Motor Lodge Alley",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.616, y: 0.683 }]
    },
    {
      id: "fullers-liberty-lanes",
      title: "Fuller's Liberty Lanes",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.520, y: 0.727 }]
    },
    {
      id: "west-main-street",
      title: "West Main Street",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.527, y: 0.610 }]
    },
    {
      id: "hilltop-stairs",
      title: "Hilltop Stairs",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.387, y: 0.636 }]
    },
    {
      id: "hilltop",
      title: "Hilltop",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.331, y: 0.585 }]
    },
    {
      id: "forecourt",
      title: "Forecourt",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.259, y: 0.626 }]
    },
    {
      id: "dark-aether",
      title: "Dark Aether",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.170, y: 0.604 }]
    },
    {
      id: "cemetery",
      title: "Cemetery",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.219, y: 0.516 }]
    },
    {
      id: "riverside",
      title: "Riverside",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.716, y: 0.442 }]
    },
    {
      id: "radio-house",
      title: "Radio House",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.731, y: 0.354 }]
    },
    {
      id: "ollys-comics",
      title: "Olly's Comics",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.628, y: 0.371 }]
    },
    {
      id: "backstreet-parking",
      title: "Backstreet Parking",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.617, y: 0.444 }]
    },
    {
      id: "grease-trap-patio",
      title: "Grease Trap Patio",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.551, y: 0.401 }]
    },
    {
      id: "savings-and-loan",
      title: "Savings & Loan",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.565, y: 0.485 }]
    },
    {
      id: "washington-ave",
      title: "Washington Ave.",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.495, y: 0.457 }]
    },
    {
      id: "washington-ave-rooftops",
      title: "Washington Ave. Rooftops",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.455, y: 0.516 }]
    },
    {
      id: "hill-street",
      title: "Hill Street",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.377, y: 0.496 }]
    },
    {
      id: "groundskeepers-yard",
      title: "Groundskeeper's Yard",
      description: "",
      type: "label",
      icon: null,
      locations: [{ x: 0.351, y: 0.420 }]
    },
    {
      ...sharedMarkers["ammo-cache"],
      locations: [
        { x: 0.740, y: 0.559 },
        { x: 0.655, y: 0.317 },
        { x: 0.564, y: 0.749 },
        { x: 0.452, y: 0.669 },
        { x: 0.441, y: 0.379 },
        { x: 0.568, y: 0.431 },
        { x: 0.299, y: 0.665 },
        { x: 0.154, y: 0.477 },
        { x: 0.226, y: 0.582 }
      ]
    },
    {
      ...sharedMarkers["armor-wall-buy"],
      locations: [
        { x: 0.575, y: 0.624, title: "Tier II Armor" },
        { x: 0.124, y: 0.497, title: "Tier III Armor" },
      ]
    },
    {
      ...sharedMarkers.arsenal,
      locations: [
        { x: 0.674, y: 0.314 },
        { x: 0.370, y: 0.603 },
        { x: 0.615, y: 0.546 }
      ]
    },
    {
      ...sharedMarkers["crafting-table"],
      locations: [
        { x: 0.605, y: 0.699 },
        { x: 0.648, y: 0.470 },
        { x: 0.324, y: 0.403 }
      ]
    },
    {
      ...sharedMarkers["der-wunderfizz"],
      locations: [{ x: 0.596, y: 0.471 }]
    },
    {
      ...sharedMarkers["door-buy"],
      locations: [
        { x: 0.838, y: 0.589 },
        { x: 0.712, y: 0.488 },
        { x: 0.653, y: 0.675 },
        { x: 0.647, y: 0.529 },
        { x: 0.635, y: 0.484 },
        { x: 0.651, y: 0.345 },
        { x: 0.625, y: 0.406 },
        { x: 0.521, y: 0.390 },
        { x: 0.585, y: 0.441 },
        { x: 0.607, y: 0.505 },
        { x: 0.593, y: 0.555 },
        { x: 0.567, y: 0.558 },
        { x: 0.524, y: 0.453 },
        { x: 0.488, y: 0.529 },
        { x: 0.512, y: 0.650 },
        { x: 0.349, y: 0.641 },
        { x: 0.335, y: 0.663 },
        { x: 0.342, y: 0.521 },
        { x: 0.231, y: 0.618 },
        { x: 0.133, y: 0.556 },
        { x: 0.310, y: 0.502 },
      ]
    },
    {
      ...sharedMarkers.exfil,
      locations: [{ x: 0.842, y: 0.551 }]
    },
    {
      ...sharedMarkers["fast-travel"],
      locations: [
        { x: 0.833, y: 0.587, 
          title: "Zipline",
          description: "Use to travel to the roof of Savings & Loan."
        },
        { x: 0.591, y: 0.442, 
          title: "Zipline",
          description: "Use to travel to the Abandoned Rooftop."
        },
        { x: 0.316, y: 0.502, 
          title: "Zipline",
          description: "Use to travel to the roof of Savings & Loan."
        },
        { x: 0.494, y: 0.529, 
          title: "Zipline",
          description: "Use to travel to the roof of Savings & Loan."
        },
        { x: 0.567, y: 0.565,
          title: "Zipline",
          description: "Use to travel to from West Main Street to the roof of Savings & Loan, or from the roof down to West Main Street."
        },
        { x: 0.542, y: 0.520, 
          title: "Zipline",
          description: "Use to travel to the Washington Ave. Rooftops."
        },
        { x: 0.523, y: 0.447,
          title: "Zipline",
          description: "Use to travel to the Cemetery."
        }
      ]
    },
    {
      ...sharedMarkers["gobblegum-machine"],
      locations: [
        { x: 0.682, y: 0.645 },
        { x: 0.583, y: 0.619 },
        { x: 0.303, y: 0.579 },
        { x: 0.517, y: 0.432 },
      ]
    },
    {
      ...sharedMarkers["mystery-box"],
      locations: [
        { x: 0.810, y: 0.670 },
        { x: 0.754, y: 0.421 },
        { x: 0.550, y: 0.775 },
        { x: 0.536, y: 0.568 },
        { x: 0.410, y: 0.522 },
        { x: 0.250, y: 0.521 }
      ]
    },
    {
      ...sharedMarkers["pack-a-punch"],
      locations: [{ x: 0.116, y: 0.591 }]
    },
    {
      ...sharedMarkers["rampage-inducer"],
      locations: [{ x: 0.876, y: 0.581 }]
    },
    {
      ...sharedMarkers.trap,
      locations: [
        { x: 0.739, y: 0.627, title: "Dark Aether Field Generator" },
        { x: 0.452, y: 0.482, title: "Dark Aether Field Generator" },
      ]
    },
    {
      ...sharedMarkers.workbench,
      locations: [{ x: 0.650, y: 0.621, title: "Jetgun Workbench",
        description: "Workbench to craft the Jet Gun Wonder Weapon."
       }]
    },
    {
      ...sharedMarkers["audio-log"],
      locations: [
        { x: 0.644, y: 0.630, title: "The Scientist and The Moonshiner" },
        { x: 0.653, y: 0.359, title: "Quantum Mechnical Failure" },
        { x: 0.485, y: 0.511, title: "Conspiracy Theorist" },
        { x: 0.456, y: 0.736, title: "Steel Mountain Rescue" },
        { x: 0.223, y: 0.642, title: "Bear Witness" },
        { x: 0.138, y: 0.464, title: "The House Josiah Built" },
        { x: 0.541, y: 0.494, title: "Money Talks", description: "You must gain access to the vault for this audio log to appear." },
        { x: 0.614, y: 0.405, title: "Limited Run", description: "You must complete the Aetherella side quest for this audio log to appear." },
        { x: 0.368, y: 0.460, title: "One Lit Match", description: "You must activate the S.D.G. for this audio log to appear." }
      ]
    },
    {
      ...sharedMarkers.document,
      locations: [
        { x: 0.545, y: 0.486, title: "Politics, Politics", description: "Obtained from opening one of the vault safes." },
        { x: 0.321, y: 0.431, title: "We Only Take Cash", description: "Obtained from completing the Mister Peeks Car side quest." },
        { x: 0.652, y: 0.487, title: "Fine Man", description: "Obtained from shooting movie boxes off the shelves in the Fast Forward store." },
        { x: 0.629, y: 0.388, title: "Final Issue", description: "Obtained from interacting with white cardboard boxes in Olly's Comics. The document will drop out of one of these boxes." },
      ]
    },
    {
      ...perks.juggernog,
      locations: [{ x: 0.579, y: 0.420 }]
    },
    {
      ...perks["melee-macchiato"],
      locations: [{ x: 0.235, y: 0.650 }]
    },
    {
      ...perks["phd-flopper"],
      locations: [{ x: 0.392, y: 0.598 }]
    },
    {
      ...perks["quick-revive"],
      locations: [{ x: 0.661, y: 0.394 }]
    },
    {
      ...perks["speed-cola"],
      locations: [{ x: 0.481, y: 0.498 }]
    },
    {
      ...perks["stamin-up"],
      locations: [{ x: 0.580, y: 0.726 }]
    },
    {
      ...weapons["ak-74"],
      locations: [{ x: 0.364, y: 0.478 }]
    },
    {
      ...weapons["asg-89"],
      locations: [{ x: 0.538, y: 0.380 }]
    },
    {
      ...weapons.c9,
      locations: [{ x: 0.638, y: 0.517 }]
    },
    {
      ...weapons.gs45,
      locations: [{ x: 0.752, y: 0.520 }]
    },
    {
      ...weapons["lr-7.62"],
      locations: [{ x: 0.473, y: 0.545 }]
    },
    {
      ...weapons["marine-sp"],
      locations: [{ x: 0.546, y: 0.679 }]
    },
    {
      ...weapons["tanto.22"],
      locations: [{ x: 0.464, y: 0.606 }]
    },
    {
      ...weapons.xm4,
      locations: [{ x: 0.576, y: 0.450 }]
    },
    {
      ...weapons.xmg,
      locations: [{ x: 0.205, y: 0.535 }]
    },
    {
      ...weapons["dm-10"],
      locations: [{ x: 0.726, y: 0.680 }]
    }
  ]
}

export default libertyFalls