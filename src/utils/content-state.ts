import type { ContentState } from "@/types/data"
import { Option } from "effect"

/** True when catalog state is the unpublished `"Coming Soon"` placeholder. */
export function isComingSoon(state: Option.Option<ContentState>): boolean {
	return Option.getOrUndefined(state) === "Coming Soon"
}

/** Stored `"New"` is surfaced only this many full UTC calendar days after the anchor date (`YYYY-MM-DD`). */
export const NEW_CONTENT_BADGE_MAX_AGE_DAYS = 14

const MS_PER_DAY = 86_400_000

export function calendarDaysSinceIsoDate(isoDateOnly: string, nowMs: number): number {
	const start = Date.parse(`${isoDateOnly}T00:00:00.000Z`)
	return Math.floor((nowMs - start) / MS_PER_DAY)
}

/**
 * Resolves display state for records flagged with `"New"`: the badge appears only while
 * `calendarDaysSinceIsoDate(anchorIsoDate, nowMs) < NEW_CONTENT_BADGE_MAX_AGE_DAYS`.
 */
export function resolveNewContentState(
	state: Option.Option<ContentState>,
	anchorIsoDate: string,
	nowMs: number,
): Option.Option<ContentState> {
	return Option.match(state, {
		onNone: () => Option.none(),
		onSome: s => {
			if (s === "Coming Soon") return Option.some(s)
			return calendarDaysSinceIsoDate(anchorIsoDate, nowMs) < NEW_CONTENT_BADGE_MAX_AGE_DAYS
				? Option.some("New")
				: Option.none()
		},
	})
}
