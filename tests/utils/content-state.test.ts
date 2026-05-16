import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	NEW_CONTENT_BADGE_MAX_AGE_DAYS,
	calendarDaysSinceIsoDate,
	resolveNewContentState,
} from "@/utils/content-state"

describe("calendarDaysSinceIsoDate", () => {
	test("returns 0 for timestamps on the anchor UTC calendar day", () => {
		const anchor = "2020-06-15"
		const startOfDay = Date.parse(`${anchor}T00:00:00.000Z`)
		expect(calendarDaysSinceIsoDate(anchor, startOfDay)).toBe(0)
		expect(calendarDaysSinceIsoDate(anchor, startOfDay + 12 * 60 * 60 * 1000)).toBe(0)
	})

	test("increments at the start of each following UTC calendar day", () => {
		const anchor = "2020-01-01"
		expect(calendarDaysSinceIsoDate(anchor, Date.parse("2020-01-01T23:59:59.999Z"))).toBe(0)
		expect(calendarDaysSinceIsoDate(anchor, Date.parse("2020-01-02T00:00:00.000Z"))).toBe(1)
		expect(calendarDaysSinceIsoDate(anchor, Date.parse("2020-01-15T00:00:00.000Z"))).toBe(14)
	})
})

describe("resolveNewContentState", () => {
	const anchor = "2026-01-01"

	test("preserves none", () => {
		expect(resolveNewContentState(Option.none(), anchor, Date.now())).toEqual(Option.none())
	})

	test("always preserves Coming Soon", () => {
		const farFuture = Date.parse("2099-12-31T00:00:00.000Z")
		expect(resolveNewContentState(Option.some("Coming Soon"), anchor, farFuture)).toEqual(
			Option.some("Coming Soon"),
		)
	})

	test("shows New while calendar age is strictly below the max window", () => {
		const now = Date.parse("2026-01-14T23:59:59.999Z")
		expect(calendarDaysSinceIsoDate(anchor, now)).toBe(13)
		expect(resolveNewContentState(Option.some("New"), anchor, now)).toEqual(Option.some("New"))
	})

	test("clears New once calendar age reaches the max day count", () => {
		const now = Date.parse("2026-01-15T00:00:00.000Z")
		expect(calendarDaysSinceIsoDate(anchor, now)).toBe(NEW_CONTENT_BADGE_MAX_AGE_DAYS)
		expect(resolveNewContentState(Option.some("New"), anchor, now)).toEqual(Option.none())
	})
})
