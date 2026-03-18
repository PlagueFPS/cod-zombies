import type { MapConfig, MapConfigMetadata } from "@/map-configs"
import { Effect, Option } from "effect"

/** Union type of all available interactive map IDs */
export type MapId = keyof typeof mapRegistry

interface MapEntry {
	metadata: Effect.Effect<MapConfigMetadata, never, never>
	config: Effect.Effect<MapConfig, never, never>
}

const mapRegistry = {
	"paradox-junction": {
		metadata: Effect.promise(() =>
			import("@/map-configs/paradox-junction").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/paradox-junction").then(module => module.config),
		),
	},
	"astra-malorum": {
		metadata: Effect.promise(() =>
			import("@/map-configs/astra-malorum").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/astra-malorum").then(module => module.config),
		),
	},
	"ashes-of-the-damned": {
		metadata: Effect.promise(() =>
			import("@/map-configs/ashes-of-the-damned").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/ashes-of-the-damned").then(module => module.config),
		),
	},
	reckoning: {
		metadata: Effect.promise(() =>
			import("@/map-configs/reckoning").then(module => module.metadata),
		),
		config: Effect.promise(() => import("@/map-configs/reckoning").then(module => module.config)),
	},
	"shattered-veil": {
		metadata: Effect.promise(() =>
			import("@/map-configs/shattered-veil").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/shattered-veil").then(module => module.config),
		),
	},
	"the-tomb": {
		metadata: Effect.promise(() =>
			import("@/map-configs/the-tomb").then(module => module.metadata),
		),
		config: Effect.promise(() => import("@/map-configs/the-tomb").then(module => module.config)),
	},
	"citadelle-des-morts": {
		metadata: Effect.promise(() =>
			import("@/map-configs/citadelle-des-morts").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/citadelle-des-morts").then(module => module.config),
		),
	},
	terminus: {
		metadata: Effect.promise(() =>
			import("@/map-configs/terminus").then(module => module.metadata),
		),
		config: Effect.promise(() => import("@/map-configs/terminus").then(module => module.config)),
	},
	"liberty-falls": {
		metadata: Effect.promise(() =>
			import("@/map-configs/liberty-falls").then(module => module.metadata),
		),
		config: Effect.promise(() =>
			import("@/map-configs/liberty-falls").then(module => module.config),
		),
	},
} as const satisfies Record<string, MapEntry>

/**
 * Gets the interactive map configuration for a given map ID.
 * @param mapId - The ID of the map to retrieve the configuration for.
 * @returns An effect that resolves to the map configuration if it exists, or null if it does not.
 */
export const getMapConfig = Effect.fn("getMapConfig")(function* (mapId: MapId) {
	const map = mapRegistry[mapId]
	// handle case where provided mapId does not exist
	if (!map) {
		yield* Effect.logWarning(`Map ID ${mapId} does not exist`)
		return Option.none()
	}

	return Option.some(yield* map.config)
})

/**
 * Gets the metadata for a given interactive map ID.
 * @param mapId - The ID of the map to retrieve the metadata for.
 * @returns An effect that resolves to the map metadata.
 */
export const getMapConfigMetadata = Effect.fn("getMapConfigMetadata")(function* (mapId: MapId) {
	const map = mapRegistry[mapId]
	// handle case where provided mapId does not exist
	if (!map) {
		yield* Effect.logWarning(`Map ID ${mapId} does not exist`)
		return Option.none()
	}

	return Option.some(yield* map.metadata)
})

/**
 * Gets a list of all interactive maps in the registry
 * @returns An array of the existing interactive map metadata
 */
export const getInteractiveMaps = () =>
	Effect.forEach(Object.values(mapRegistry), map => map.metadata, { concurrency: "unbounded" })

/**
 * Gets the total number of interactive maps in the registry. This is useful for initial loading states
 * @returns The total number of interactive maps
 */
export const getTotalMaps = () => Object.values(mapRegistry).length
