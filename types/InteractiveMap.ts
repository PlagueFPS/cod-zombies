export interface MapConfig {
  id: string
  title: string
  image: string
  markers: MapMarker[]
}

export interface MapMarker {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: MarkerType
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface MapController {
  imageDimensions: ImageDimensions | null
  onZoomChange: (zoom: number) => void
}

export type MarkerType = "perk" | "ammo-cache" | "weapon-wall-buy" | "objective" | "pack-a-punch" 
| "door-buy" | "trap" | "armor-wall-buy" | "mystery-box" | "rampage-inducer" | "exfil" | "arsenal" | "crafting-table"