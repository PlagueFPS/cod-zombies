import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import {
	formatEstimatedTimeMidpoint,
	formatEstimatedTimeRange,
	slugify,
} from "@/utils/shared-functions"

const SLUG = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*)$/

const minutesArb = fc.double({ min: 0, max: 10_000, noNaN: true })

const underHourArb = fc
	.double({ min: 0, max: 59.5, noNaN: true })
	.filter(value => Math.round(value) < 60)

/** Full range, with under-an-hour values included often enough to be asserted. */
const sideArb = fc.oneof(minutesArb, underHourArb)

/** A value in the property domain that `Math.round` maps to `rounded`. */
function minutesRoundingTo(rounded: number): fc.Arbitrary<number> {
	const min = rounded === 0 ? 0 : rounded - 0.5
	const max = Math.min(10_000, rounded + 0.5)

	return fc.double({ min, max, noNaN: true }).filter(value => Math.round(value) === rounded)
}

const sameRoundedPairArb = fc
	.integer({ min: 0, max: 10_000 })
	.chain(rounded => fc.tuple(minutesRoundingTo(rounded), minutesRoundingTo(rounded)))

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
			fc.property(sideArb, sideArb, (min, max) => {
				const minLabel = labelForRoundedMinutes(min)
				const maxLabel = labelForRoundedMinutes(max)
				const formatted = formatEstimatedTimeRange({ min, max })

				for (const [minutes, label] of [
					[min, minLabel],
					[max, maxLabel],
				] as const) {
					expect(/^\d+m$/.test(label)).toBe(Math.round(minutes) < 60)
				}

				for (const minutes of [min, max].filter(value => Math.round(value) >= 60)) {
					expect(Math.round(minutes) % 60).toBeLessThan(60)
				}

				fc.pre(minLabel !== maxLabel)
				expect(formatted).toBe(`${minLabel}-${maxLabel}`)
			}),
		)

		fc.assert(
			fc.property(sameRoundedPairArb, ([min, max]) => {
				const minLabel = labelForRoundedMinutes(min)
				const maxLabel = labelForRoundedMinutes(max)
				const formatted = formatEstimatedTimeRange({ min, max })
				const roundedMin = Math.round(min)

				expect(minLabel).toBe(maxLabel)
				expect(formatted).toBe(minLabel)
				expect(formatted).toBe(formatEstimatedTimeMidpoint({ min: roundedMin, max: roundedMin }))
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
