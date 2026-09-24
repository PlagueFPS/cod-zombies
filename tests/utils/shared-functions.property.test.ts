import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import {
	formatEstimatedTimeMidpoint,
	formatEstimatedTimeRange,
	slugify,
} from "@/utils/shared-functions"

const SLUG = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*)$/

const minutesArb = fc.double({ min: 0, max: 10_000, noNaN: true })

/** Display label for one already-rounded minute count. */
function labelForRoundedMinutes(minutes: number): string {
	const rounded = Math.round(minutes)

	if (rounded < 60) return `${rounded}m`

	const hours = Math.floor(rounded / 60)
	const remainder = rounded % 60

	return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

describe("formatEstimatedTimeRange properties", () => {
	test("minute labels stay under 60 and identical rounded ends collapse to one label", () => {
		fc.assert(
			fc.property(minutesArb, minutesArb, (min, max) => {
				const minLabel = labelForRoundedMinutes(min)
				const maxLabel = labelForRoundedMinutes(max)
				const formatted = formatEstimatedTimeRange({ min, max })

				for (const [minutes, label] of [
					[min, minLabel],
					[max, maxLabel],
				] as const) {
					if (Math.round(minutes) < 60) {
						expect(label).toMatch(/^\d+m$/)
					} else {
						expect(label).not.toMatch(/^\d+m$/)
						const remainder = Math.round(minutes) % 60
						expect(remainder).toBeLessThan(60)
					}
				}

				if (minLabel === maxLabel) {
					const rounded = Math.round(min)
					expect(formatted).toBe(minLabel)
					expect(formatted).toBe(formatEstimatedTimeMidpoint({ min: rounded, max: rounded }))
				} else {
					expect(formatted).toBe(`${minLabel}-${maxLabel}`)
				}
			}),
		)
	})
})

describe("slugify properties", () => {
	test("is idempotent and only emits empty or lowercase slug characters", () => {
		fc.assert(
			fc.property(
				fc.string({ unit: "binary", maxLength: 40 }),
				fc.string({ unit: "grapheme", maxLength: 40 }),
				(binary, grapheme) => {
					for (const text of [binary, grapheme]) {
						const slug = slugify(text)
						expect(slugify(slug)).toBe(slug)
						expect(slug === "" || SLUG.test(slug)).toBe(true)
					}
				},
			),
		)
	})
})
