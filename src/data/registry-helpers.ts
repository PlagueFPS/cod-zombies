import type { GameKey } from "@/data/games"
import { Option } from "effect"

/** A `[id, value]` pair used to build a registry `Map`. */
type RegistryEntry = readonly [string, {}]

/** Tuple of ids from a registry entry list, preserving order. */
type RegistryIds<Entries extends readonly RegistryEntry[]> = {
	[I in keyof Entries]: Entries[I] extends readonly [infer Id extends string, unknown] ? Id : never
}

/**
 * Ids that appear more than once in `Ids`. `never` when every id is unique.
 * Tail-recursive so registries with hundreds of entries stay within TS instantiation limits.
 */
type DuplicateIds<
	Ids extends readonly string[],
	Seen extends string = never,
	Dupes extends string = never,
> = Ids extends readonly [infer Head extends string, ...infer Tail extends string[]]
	? Head extends Seen
		? DuplicateIds<Tail, Seen, Dupes | Head>
		: DuplicateIds<Tail, Seen | Head, Dupes>
	: Dupes

/**
 * `Entries` when all ids are unique; otherwise duplicate slots become a string
 * literal naming the id so `tsc` errors on those entries instead of the whole tuple.
 */
type UniqueRegistryEntries<Entries extends readonly RegistryEntry[]> =
	DuplicateIds<Extract<RegistryIds<Entries>, readonly string[]>> extends infer D
		? [D] extends [never]
			? Entries
			: {
					[I in keyof Entries]: Entries[I] extends readonly [infer Id extends string, unknown]
						? Id extends D
							? `Duplicate registry id: ${Id}`
							: Entries[I]
						: Entries[I]
				}
		: never

/**
 * Builds a `Map` from `[id, value]` entries. Duplicate ids are a type error;
 * at runtime this is `new Map(entries)` with no extra scans or throws.
 */
export function uniqueMap<const Entries extends readonly RegistryEntry[]>(
	entries: UniqueRegistryEntries<Entries>,
): Map<Entries[number][0], Entries[number][1]> {
	// SAFETY: UniqueRegistryEntries is `Entries` when ids are unique; duplicate ids fail at the call site.
	return new Map(entries as Iterable<readonly [Entries[number][0], Entries[number][1]]>)
}

/** Looks up a string key in a registry whose keys are a narrower string union. */
export function registryGet<K extends string, V>(registry: ReadonlyMap<K, V>, key: string) {
	// SAFETY: `K` extends `string`; Map.get is a membership lookup and missing keys are `Option.none`.
	return Option.fromUndefinedOr(registry.get(key as K))
}

/** Entities with optional per-game partial overlays in `variants`. */
type WithGameVariantMap<T> = {
	readonly variants: Option.Option<Partial<Record<GameKey, Partial<Omit<T, "variants">>>>>
}

/**
 * If `entry` is present and `game` is set, merges `entry.value.variants[game]` when defined.
 * Otherwise returns `entry` unchanged (including when variants are missing or none for that game).
 */
export const resolveGameVariantOption = <T extends WithGameVariantMap<T>>(
	entry: Option.Option<T>,
	game?: string,
): Option.Option<T> => {
	if (Option.isNone(entry)) return entry

	if (!game || Option.isNone(entry.value.variants)) return entry
	// SAFETY: variant maps are keyed by GameKey; a non-member string is a missing overlay.
	const variant = entry.value.variants.value[game as GameKey]

	if (!variant) return entry

	return Option.some({ ...entry.value, ...variant })
}

/** Applies the same merge as {@link resolveGameVariantOption} to each item. */
export const mapWithGameVariant = <T extends WithGameVariantMap<T>>(
	items: T[],
	game?: string,
): T[] =>
	items.map(item => {
		if (!game || Option.isNone(item.variants)) return item
		// SAFETY: variant maps are keyed by GameKey; a non-member string is a missing overlay.
		const variant = item.variants.value[game as GameKey]

		if (!variant) return item

		return { ...item, ...variant }
	})
