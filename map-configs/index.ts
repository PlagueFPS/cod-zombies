import type { MapMarker } from "./markers"

export type MapId = keyof typeof mapRegistry

export interface MapConfig {
	id: string
	title: string
	isComingSoon?: boolean
	isNew?: boolean
	description: string
	game: string
	image: string
	markers: MapMarker[]
}

export const mapRegistry = {
	reckoning: import("./reckoning").then(module => module.default),
	"shattered-veil": import("./shattered-veil").then(module => module.default),
	"the-tomb": import("./the-tomb").then(module => module.default),
	"citadelle-des-morts": import("./citadelle-des-morts").then(module => module.default),
	terminus: import("./terminus").then(module => module.default),
	"liberty-falls": import("./liberty-falls").then(module => module.default),
} as const
