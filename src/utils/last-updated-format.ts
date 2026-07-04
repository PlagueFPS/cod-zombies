/** Past deltas under this many seconds are shown as "1 minute ago" (no seconds). */
const MINUTE_FLOOR_SECONDS = 120
export const MS_HOUR = 3_600_000
export const MS_DAY = MS_HOUR * 24
export const MS_WEEK = 7 * MS_DAY
export const MS_MONTH = MS_DAY * 31
export const WEEKS_PER_MEAN_MONTH = MS_MONTH / MS_WEEK

interface RelativeDivision {
	/** Maximum amount of time in the given unit. */
	amount: number
	/** Unit of time. */
	unit: Intl.RelativeTimeFormatUnit
}

const RELATIVE_DIVISIONS: RelativeDivision[] = [
	{ amount: 60, unit: "minute" },
	{ amount: 24, unit: "hour" },
	{ amount: 7, unit: "day" },
	{ amount: WEEKS_PER_MEAN_MONTH, unit: "week" },
]

/**
 * Human-readable relative time (e.g. "3 days ago", "1 month ago").
 */
export function formatRelativeTimeAgo(
	pastMs: number,
	nowMs: number,
	locale?: string,
	absoluteFallback = "",
): string {
	if (!Number.isFinite(pastMs) || !Number.isFinite(nowMs)) {
		return absoluteFallback
	}

	const durationSec = (pastMs - nowMs) / 1000

	if (durationSec > 0) {
		return absoluteFallback
	}

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" })

	if (Math.abs(durationSec) < MINUTE_FLOOR_SECONDS) {
		return rtf.format(-1, "minute")
	}

	const ageMs = nowMs - pastMs
	const monthsElapsed = ageMs / MS_MONTH

	if (monthsElapsed >= 24) {
		return rtf.format(-Math.floor(monthsElapsed / 12), "year")
	}
	if (monthsElapsed >= 12) {
		return rtf.format(-1, "year")
	}
	if (monthsElapsed >= 1) {
		return rtf.format(-Math.max(1, Math.floor(monthsElapsed)), "month")
	}

	let duration = durationSec / 60

	for (const { amount, unit } of RELATIVE_DIVISIONS) {
		if (Math.abs(duration) < amount) {
			return rtf.format(Math.round(duration), unit)
		}
		duration /= amount
	}

	return rtf.format(-1, "minute")
}
