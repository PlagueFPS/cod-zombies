import { MARKER_TYPES } from "@/map-configs/markers"

export interface MapConfig {
  id: string
  title: string
  description: string
  game: string
  image: string
  markers: MapMarker[]
}

export interface MapMarker {
  id: string
  title: string
  description: string
  type?: MarkerType
  category: MarkerCategory
  icon: string | null
  locations: Location[]
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface MapController {
  imageDimensions: ImageDimensions | null
}

export interface Location {
  x: number
  y: number
  title?: string
  description?: string
}

export type MarkerType = typeof MARKER_TYPES[number]

export type Perks = "quick-revive" | "speed-cola" | "juggernog" | "double-tap" | "phd-flopper" 
| "stamin-up" | "death-perception" | "elemental-pop" | "deadshot-daiquiri" | "melee-macchiato"
| "vulture-aid" | "der-wunderfizz"

export type Weapons = "gs45" | "kompakt-92" | "tanto.22" | "marine-sp" | "ames-85" | "xm4" 
| "ak-74" | "aek-973" | "swat-5.56" | "lr-7.62" | "gpmg-7" | "asg-89" | "pu-21" | "as-val"
| "ksv" | "c9" | "goblin-mk2" | "pp-919" | "tsarkov-7.62" | "svd" | "xmg" | "dm-10"

export type MarkerCategory =
  | "general"
  | "equipment" 
  | "upgrades" 
  | "objectives"
  | "transportation"
  | "intel"