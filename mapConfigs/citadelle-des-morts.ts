import type { MapConfig } from "@/types/InteractiveMap";

const citadelleDesMorts: MapConfig = {
  id: "citadelle-des-morts",
  title: "Citadelle Des Morts",
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
      locations: [{ x: 0.452, y: 0.645 }]
    },
    {
      id: "nature-path",
      type: "label",
      title: "Nature Path",
      description: "",
      icon: null,
      locations: [{ x: 0.352, y: 0.620 }]
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
      locations: [{ x: 0.658, y: 0.588 }]
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
    }
  ]
}

export default citadelleDesMorts