export interface MapConfig {
  id: string
  title: string
  layers: MapLayer[]
}

export interface MapMarker {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: MarkerType
}

export interface MapLayer {
  id: string
  name: string
  image: string
  markers: MapMarker[]
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface MapController {
  currentLayer: MapLayer
  imageDimensions: ImageDimensions | null
  onZoomChange: (zoom: number) => void
  currentImageDimensions: ImageDimensions | null
}

export type MarkerType = "perk" | "ammo-cache" | "weapon-wall-buy" | "objective" | "pack-a-punch" 
| "door-buy" | "trap" | "armor-wall-buy" | "mystery-box" | "rampage-inducer" | "exfil" | "arsenal" | "crafting-table"