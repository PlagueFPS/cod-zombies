import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { formatRelativeTimeAgo, MS_DAY } from "@/utils/last-updated-format"

const MINUTE_FLOOR_MS = 120_000

const UNIT_SECONDS = {
	minute: 60,
	hour: 3_600,
	day: 86_400,
	week: 7 * 86_400,
	month: 31 * 86_400,
	year: 12 * 31 * 86_400,
} as const

const UNIT_LIMIT = {
	minute: 60,
	hour: 24,
	day: 7,
} as const

type RelativeUnit = keyof typeof UNIT_SECONDS

const RELATIVE_UNITS = [
	"minute",
	"hour",
	"day",
	"week",
	"month",
	"year",
] as const satisfies readonly RelativeUnit[]

const RELATIVE_TIME = /^(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago$/

interface RelativeReading {
	readonly count: number
	readonly unit: RelativeUnit
	readonly seconds: number
}

function isRelativeUnit(value: string): value is RelativeUnit {
	return RELATIVE_UNITS.some(unit => unit === value)
}

const ageMsArb = fc.oneof(
	fc.constant(MINUTE_FLOOR_MS),
	fc.constant(59.6 * 60 * 1000),
	fc.constant(23.6 * 3_600_000),
	fc.constant(6.6 * MS_DAY),
	fc.double({
		min: MINUTE_FLOOR_MS,
		max: 800 * MS_DAY,
		noNaN: true,
	}),
)

function readRelative(label: string): RelativeReading {
	const match = RELATIVE_TIME.exec(label)
	expect(match).not.toBeNull()

	const countText = match?.[1]
	const unitText = match?.[2]

	if (!countText || !unitText || !isRelativeUnit(unitText)) {
		throw new Error(`unparsed relative time: ${label}`)
	}

	const count = Number(countText)

	return { count, unit: unitText, seconds: count * UNIT_SECONDS[unitText] }
}

describe("formatRelativeTimeAgo properties", () => {
	const now = Date.parse("2026-03-15T12:00:00.000Z")

	test("rounded unit counts stay inside the unit and do not move backward as age grows", () => {
		fc.assert(
			fc.property(ageMsArb, ageMsArb, (earlierAge, laterAge) => {
				const [younger, older] =
					earlierAge <= laterAge ? [earlierAge, laterAge] : [laterAge, earlierAge]

				const youngerLabel = formatRelativeTimeAgo(now - younger, now, "en-US", "FALLBACK")
				const olderLabel = formatRelativeTimeAgo(now - older, now, "en-US", "FALLBACK")
				const youngerTime = readRelative(youngerLabel)
				const olderTime = readRelative(olderLabel)

				expect(olderTime.seconds).toBeGreaterThanOrEqual(youngerTime.seconds)

				const boundedReadings = [youngerTime, olderTime].filter(
					(reading): reading is RelativeReading & { readonly unit: keyof typeof UNIT_LIMIT } =>
						reading.unit === "minute" || reading.unit === "hour" || reading.unit === "day",
				)

				for (const { count, unit } of boundedReadings) {
					expect(count).toBeGreaterThan(0)
					expect(count).toBeLessThan(UNIT_LIMIT[unit])
				}
			}),
		)
	})
})
