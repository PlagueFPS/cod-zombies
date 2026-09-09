import type { GameKey } from "@/data/games"
import { Option } from "effect"

/** A `[id, value]` pair used to build a registry `Map`. */
type RegistryEntry = readonly [string, unknown]

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
	return new Map(entries as unknown as Iterable<readonly [Entries[number][0], Entries[number][1]]>)
}

/** Minimal shape for entities with optional per-game partial overlays in `variants`. */
type WithGameVariantMap = {
	readonly variants: Option.Option<Partial<Record<GameKey, object>>>
}

/**
 * If `entry` is present and `game` is set, merges `entry.value.variants[game]` when defined.
 * Otherwise returns `entry` unchanged (including when variants are missing or none for that game).
 */
export const resolveGameVariantOption = <T extends WithGameVariantMap>(
	entry: Option.Option<T>,
	game?: GameKey,
): Option.Option<T> => {
	if (Option.isNone(entry)) return entry
	if (!game || Option.isNone(entry.value.variants)) return entry
	const variant = entry.value.variants.value[game]
	if (!variant) return entry
	return Option.some({ ...entry.value, ...variant } as T)
}

/** Applies the same merge as {@link resolveGameVariantOption} to each item. */
export const mapWithGameVariant = <T extends WithGameVariantMap>(items: T[], game?: GameKey): T[] =>
	items.map(item => {
		if (!game || Option.isNone(item.variants)) return item
		const variant = item.variants.value[game]
		if (!variant) return item
		return { ...item, ...variant } as T
	})
