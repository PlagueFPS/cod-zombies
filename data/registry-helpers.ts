import type { GameKey } from "@/data/games"

import { Option } from "effect"

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
