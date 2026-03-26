import type { GameKey } from "@/data/games"
import type { MapMarker } from "@/map-configs/markers"
import type { ContentState } from "@/types/data"
import type { LayersImagePath, PreviewsImagePath } from "@/types/generated/image-paths.gen"
import { Effect, HashMap, Option, Schema } from "effect"
import { getMapByKey, type MapKey } from "@/data/maps"
import { sortReleaseDate } from "@/utils/shared-functions"

class ConfigNotFoundError extends Schema.TaggedErrorClass<ConfigNotFoundError>()(
	"ConfigNotFoundError",
	{
		cause: Schema.Unknown,
	},
) {}

/** Union type of all available interactive map IDs */
export type InteractiveMapKey = HashMap.HashMap.Key<typeof interactiveMapHashMap>

export interface InteractiveMap {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "InteractiveMap"
	/** The unique identifier of the interactive map */
	readonly id: string
	/** The title of the interactive map */
	readonly title: string
	/** The state of the interactive map */
	readonly state: Option.Option<ContentState>
	/** The image of the interactive map */
	readonly image: PreviewsImagePath
	/** The game the interactive map is from */
	readonly game: GameKey
	/** The description of the interactive map */
	readonly description: string
}

export interface MapConfigLayer {
	/** The unique identifier of the map config layer */
	readonly id: string
	/** The title of the map config layer */
	readonly title: string
	/** The image of the map config layer */
	readonly image: LayersImagePath
	/** The markers of the map config layer */
	readonly markers: MapMarker[]
}

export interface MapConfig {
	/** The layers of the map config */
	readonly layers: MapConfigLayer[]
}

/**
 * Gets the interactive map configuration for a given map key.
 */
export const getInteractiveMapConfig = Effect.fn("getInteractiveMapConfig")(function* (
	key: InteractiveMapKey,
) {
	const config = yield* Effect.tryPromise({
		try: () => import(`@/map-configs/${key}.ts`).then(module => module.config),
		catch: cause => new ConfigNotFoundError({ cause }),
	})
	return config as MapConfig
})

/**
 * Gets an interactive map by its key.
 */
export const getInteractiveMapByKey = (key: InteractiveMapKey) =>
	HashMap.get(interactiveMapHashMap, key)

/**
 * Gets a list of all interactive maps in the registry
 * @returns An array of the existing interactive map metadata
 */
export const getInteractiveMaps = () =>
	HashMap.toValues(interactiveMapHashMap).sort((a, b) => {
		const mapA = getMapByKey(a.id as MapKey).pipe(Option.getOrThrow)
		const mapB = getMapByKey(b.id as MapKey).pipe(Option.getOrThrow)
		return sortReleaseDate(mapB.releaseDate, mapA.releaseDate)
	})

/**
 * Gets the total number of interactive maps in the registry. This is useful for initial loading states
 */
export const getTotalMaps = () => HashMap.size(interactiveMapHashMap)

const makeMapEntry = <T extends string>(
	identifier: T,
	map: Omit<InteractiveMap, "_tag" | "id">,
): [T, InteractiveMap] => [
	identifier,
	{
		_tag: "InteractiveMap" as const,
		id: identifier,
		...map,
	},
]

const interactiveMapHashMap = HashMap.make(
	makeMapEntry("paradox-junction", {
		title: "Paradox Junction",
		state: Option.some("New"),
		image: "/previews/paradox-junction-preview.webp",
		game: "black-ops-7",
		description:
			"Explore Paradox Junction in Black Ops 7 Zombies. Find all locations for all weapons, intel, and more with our interactive map.",
	}),
	makeMapEntry("astra-malorum", {
		title: "Astra Malorum",
		state: Option.none(),
		image: "/previews/astra-malorum-preview.webp",
		game: "black-ops-7",
		description:
			"Explore Astra Malorum in Black Ops 7 Zombies. Find locations for all Aether Crystals, weapons, intel, and more with our interactive map.",
	}),
	makeMapEntry("ashes-of-the-damned", {
		title: "Ashes of the Damned",
		state: Option.none(),
		image: "/previews/ashes-of-the-damned-preview.webp",
		game: "black-ops-7",
		description:
			"Explore Ashes of the Damned in Black Ops 7 Zombies. Find locations for all Overgrown Hoard Husks, Aether Plants, Plant Sprays, weapons, and more with our interactive map.",
	}),
	makeMapEntry("reckoning", {
		title: "Reckoning",
		state: Option.none(),
		image: "/previews/reckoning-preview.webp",
		game: "black-ops-6",
		description:
			"Find all Janus Crates, Loot Bins, C.A.S.T.E.R. Turrets, Intel, and more with our Reckoning interactive map in Black Ops 6 Zombies.",
	}),
	makeMapEntry("shattered-veil", {
		title: "Shattered Veil",
		state: Option.none(),
		image: "/previews/shattered-veil-preview.webp",
		game: "black-ops-6",
		description:
			"Explore Shattered Veil in BO6 Zombies. Find all Janus Crates, Aether Plants, Aether Crystals, Intel, and more with our interactive map.",
	}),
	makeMapEntry("the-tomb", {
		title: "The Tomb",
		state: Option.none(),
		image: "/previews/the-tomb-preview.webp",
		game: "black-ops-6",
		description:
			"Explore The Tomb in BO6 Zombies. Find all Dark Aether Lanterns, Dig Spots, intel, and more with our interactive map.",
	}),
	makeMapEntry("citadelle-des-morts", {
		title: "Citadelle des Morts",
		state: Option.none(),
		image: "/previews/citadelle-des-morts-preview.webp",
		game: "black-ops-6",
		description:
			"Explore Citadelle Des Morts in BO6 Zombies. Find all Points of Power & Oil Traps, Fast Travels, intel, and more with our interactive map.",
	}),
	makeMapEntry("terminus", {
		title: "Terminus",
		state: Option.none(),
		image: "/previews/terminus-preview.webp",
		game: "black-ops-6",
		description:
			"Explore Terminus in BO6 Zombies. Find all Boat Spawns, Fishing Spots, Underwater Chests, Dig Spots, intel, and more with our interactive map.",
	}),
	makeMapEntry("liberty-falls", {
		title: "Liberty Falls",
		state: Option.none(),
		image: "/previews/liberty-falls-preview.webp",
		game: "black-ops-6",
		description:
			"Explore Liberty Falls in Black Ops 6 Zombies. Find all perks, Pack-a-Punch, Mystery Box, wall buys, intel, and more with our interactive map.",
	}),
)
