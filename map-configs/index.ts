import type { MapMarker } from "./markers"

export type MapId = keyof typeof mapRegistry

export interface MapLayer {
	id: string
	title: string
	image: string
	markers: MapMarker[]
}

export interface MapConfig {
	id: string
	title: string
	state: "Coming Soon" | "New" | null
	description: string
	game: string
	layers: MapLayer[]
}

export const mapRegistry = {
	"ashes-of-the-damned": import("./ashes-of-the-damned").then(module => module.default),
	reckoning: import("./reckoning").then(module => module.default),
	"shattered-veil": import("./shattered-veil").then(module => module.default),
	"the-tomb": import("./the-tomb").then(module => module.default),
	"citadelle-des-morts": import("./citadelle-des-morts").then(module => module.default),
	terminus: import("./terminus").then(module => module.default),
	"liberty-falls": import("./liberty-falls").then(module => module.default),
} as const
