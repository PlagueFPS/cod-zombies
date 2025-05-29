export interface MapConfig {
  id: string
  title: string
  image: string
  markers: MapMarker[]
}

export interface MapMarker {
  id: string
  title: string
  description: string
  type: MarkerType
  icon: string | null
  locations: Location[]
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface MapController {
  imageDimensions: ImageDimensions | null
  onZoomChange: (zoom: number) => void
}

export interface Location {
  x: number
  y: number
  title?: string
  description?: string
}

export type MarkerType = "perk" | "ammo-cache" | "weapon-wall-buy" | "pack-a-punch" 
| "door-buy" | "trap" | "armor-wall-buy" | "mystery-box" | "rampage-inducer" | "exfil" | "arsenal" 
| "crafting-table" | "gobblegum-machine" | "power-door" | "portal" | "workbench" | "label"

export type Perks = "quick-revive" | "speed-cola" | "juggernog" | "double-tap" | "phd-flopper" | "stamin-up" | "death-perception" | "elemental-pop"