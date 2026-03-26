import type { InteractiveMap, MapConfig, MapConfigLayer } from "@/data/interactive-map"
import type { MapEntry } from "@/data/maps"
import type { Relic } from "@/data/relics"
import type { SideQuest } from "@/data/side-quests"
import type { Zombie } from "@/data/zombies"
import type { MapMarker } from "@/map-configs/markers";
import { Option } from "effect"

export type EncodedMapEntry = Omit<
	EncodedFields<MapEntry, "difficulty" | "state" | "estimatedTimeMins">,
	"mainQuest"
>
export type EncodedSideQuest = Omit<EncodedFields<SideQuest, "state">, "content">
export type EncodedRelic = Omit<EncodedFields<Relic, "state">, "content">
export type EncodedZombie = Omit<EncodedFields<Zombie, "state">, "combatStrategy">
export type EncodedInteractiveMap = EncodedFields<InteractiveMap, "state">
export type EncodedMapMarker = EncodedFields<MapMarker, "icon">
export interface EncodedMapConfigLayer extends Omit<MapConfigLayer, "markers"> {
	markers: EncodedMapMarker[]
} 
export interface EncodedMapConfig extends Omit<MapConfig, "layers"> {
	layers: EncodedMapConfigLayer[]
}
export type EncodedFields<T, K extends keyof T> = Omit<T, K> & {
	[P in K]: T[P] extends Option.Option<infer A> ? A | null : never
}

export function encodeMap(map: MapEntry): EncodedMapEntry {
	const { mainQuest, difficulty, state, estimatedTimeMins, ...rest } = map
	return {
		...rest,
		difficulty: Option.getOrNull(difficulty),
		state: Option.getOrNull(state),
		estimatedTimeMins: Option.getOrNull(estimatedTimeMins),
	}
}

export function encodeSideQuest(quest: SideQuest): EncodedSideQuest {
	const { content, state, ...rest } = quest
	return { ...rest, state: Option.getOrNull(state) }
}

export function encodeRelic(relic: Relic): EncodedRelic {
	const { content, state, ...rest } = relic
	return { ...rest, state: Option.getOrNull(state) }
}

export function encodeZombie(zombie: Zombie): EncodedZombie {
	const { combatStrategy, state, ...rest } = zombie
	return { ...rest, state: Option.getOrNull(state) }
}

export function encodeInteractiveMap(map: InteractiveMap): EncodedInteractiveMap {
	return { ...map, state: Option.getOrNull(map.state) }
}

export function encodeMapMarker(marker: MapMarker): EncodedMapMarker {
	return {
		...marker,
		icon: Option.getOrNull(marker.icon),
	}
}

export function encodeMapConfigLayer(layer: MapConfigLayer): EncodedMapConfigLayer {
	return {
		...layer,
		markers: layer.markers.map(encodeMapMarker),
	}
}

export function encodeMapConfig(config: MapConfig): EncodedMapConfig {
	return {
		...config,
		layers: config.layers.map(encodeMapConfigLayer),
	}
}

export function decodeMap(encoded: EncodedMapEntry): Omit<MapEntry, "mainQuest"> {
	return {
		...encoded,
		difficulty: Option.fromNullOr(encoded.difficulty),
		state: Option.fromNullOr(encoded.state),
		estimatedTimeMins: Option.fromNullOr(encoded.estimatedTimeMins),
	}
}

export function decodeSideQuest(encoded: EncodedSideQuest): Omit<SideQuest, "content"> {
	return { ...encoded, state: Option.fromNullOr(encoded.state) }
}

export function decodeRelic(encoded: EncodedRelic): Omit<Relic, "content"> {
	return { ...encoded, state: Option.fromNullOr(encoded.state) }
}

export function decodeZombie(encoded: EncodedZombie): Omit<Zombie, "combatStrategy"> {
	return { ...encoded, state: Option.fromNullOr(encoded.state) }
}

export function decodeInteractiveMap(encoded: EncodedInteractiveMap): InteractiveMap {
	return { ...encoded, state: Option.fromNullOr(encoded.state) }
}

export function decodeMapMarker(encoded: EncodedMapMarker): MapMarker {
	return { ...encoded, icon: Option.fromNullOr(encoded.icon) }
}

export function decodeMapConfigLayer(encoded: EncodedMapConfigLayer): MapConfigLayer {
	return { ...encoded, markers: encoded.markers.map(decodeMapMarker) }
}

export function decodeMapConfig(encoded: EncodedMapConfig): MapConfig {
	return { ...encoded, layers: encoded.layers.map(decodeMapConfigLayer) }
}

export const isSideQuest = <M extends { _tag: "MapEntry" }, S extends { _tag: "SideQuest" }>(
	quest: M | S,
): quest is S => quest._tag === "SideQuest"
export const isMapQuest = <M extends { _tag: "MapEntry" }, S extends { _tag: "SideQuest" }>(
	quest: M | S,
): quest is M => quest._tag === "MapEntry"
