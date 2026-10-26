import { DateTime, Predicate } from "effect"

/** Current instant as a local-aware `Date`. `getFullYear` and `toLocaleDateString` stay local. */
export function nowDate(): Date {
	return DateTime.toDateUtc(DateTime.nowUnsafe())
}

/** Epoch milliseconds for the current instant. */
export function nowMillis(): number {
	return nowDate().getTime()
}

/**
 * Builds a `Date` from a timestamp, a `Date`, or a date string.
 * Date-only `YYYY-MM-DD` values match `Date`'s UTC midnight parsing.
 * `DateTime.makeUnsafe` would append `Z` to those strings and reject them.
 */
export function dateFrom(value: string | number | Date): Date {
	const input =
		Predicate.isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value)
			? `${value}T00:00:00.000Z`
			: value

	return DateTime.toDateUtc(DateTime.makeUnsafe(input))
}
