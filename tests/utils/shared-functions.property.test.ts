import { it } from "@effect/vitest"
import { Arbitrary, Schema, Array as Arr } from "effect"
import { describe, expect } from "vitest"
import {
	formatEstimatedTimeMidpoint,
	formatEstimatedTimeRange,
	slugify,
} from "@/utils/shared-functions"

const SLUG = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*)$/

const minutesArb = Arbitrary.schema(
	Schema.Finite.check(Schema.isBetween({ minimum: 0, maximum: 10_000 })),
)

const underHourArb = Arbitrary.schema(
	Schema.Finite.check(Schema.isBetween({ minimum: 0, maximum: 59.5 })),
).pipe(Arbitrary.filter(value => Math.round(value) < 60))

/** Full range, with under-an-hour values included often enough to be asserted. */
const sideArb = Arbitrary.schema(
	Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 1 })),
).pipe(Arbitrary.flatMap(index => (index === 0 ? minutesArb : underHourArb)))

/** A value in the property domain that `Math.round` maps to `rounded`. */
function minutesRoundingTo(rounded: number): Arbitrary.Arbitrary<number> {
	const min = rounded === 0 ? 0 : rounded - 0.5
	const max = Math.min(10_000, rounded + 0.5)

	return Arbitrary.schema(
		Schema.Finite.check(Schema.isBetween({ minimum: min, maximum: max })),
	).pipe(Arbitrary.filter(value => Math.round(value) === rounded))
}

const sameRoundedPairArb = Arbitrary.schema(
	Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 10_000 })),
).pipe(
	Arbitrary.flatMap(rounded =>
		Arbitrary.all([minutesRoundingTo(rounded), minutesRoundingTo(rounded)]),
	),
)

/** Display label for one already-rounded minute count. */
function labelForRoundedMinutes(minutes: number): string {
	const rounded = Math.round(minutes)

	if (rounded < 60) return `${rounded}m`

	const hours = Math.floor(rounded / 60)
	const remainder = rounded % 60

	return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

describe("formatEstimatedTimeRange properties", () => {
	it.prop(
		"minute labels stay under 60 and identical rounded ends collapse to one label",
		[sideArb, sideArb],
		([min, max]) => {
			const minLabel = labelForRoundedMinutes(min)
			const maxLabel = labelForRoundedMinutes(max)
			const formatted = formatEstimatedTimeRange({ min, max })

			for (const [minutes, label] of [
				[min, minLabel],
				[max, maxLabel],
			] as const) {
				expect(/^\d+m$/.test(label)).toBe(Math.round(minutes) < 60)
			}

			for (const minutes of Arr.filter([min, max], value => Math.round(value) >= 60)) {
				expect(Math.round(minutes) % 60).toBeLessThan(60)
			}

			if (minLabel === maxLabel) return
			expect(formatted).toBe(`${minLabel}-${maxLabel}`)
		},
	)

	it.prop("identical rounded ends collapse to one label", [sameRoundedPairArb], ([[min, max]]) => {
		const minLabel = labelForRoundedMinutes(min)
		const maxLabel = labelForRoundedMinutes(max)
		const formatted = formatEstimatedTimeRange({ min, max })
		const roundedMin = Math.round(min)

		expect(minLabel).toBe(maxLabel)
		expect(formatted).toBe(minLabel)
		expect(formatted).toBe(formatEstimatedTimeMidpoint({ min: roundedMin, max: roundedMin }))
	})
})

describe("slugify properties", () => {
	it.prop(
		"is idempotent and only emits empty or lowercase slug characters",
		[
			Arbitrary.array(
				Arbitrary.schema(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 255 }))),
				{ maxLength: 40 },
			).pipe(Arbitrary.map(bytes => String.fromCharCode(...bytes))),
			Arbitrary.schema(Schema.String.check(Schema.isPattern(/^[\s\S]{0,40}$/u))),
		],
		([binary, grapheme]) => {
			for (const text of [binary, grapheme]) {
				const slug = slugify(text)
				expect(slugify(slug)).toBe(slug)
				expect(slug === "" || SLUG.test(slug)).toBe(true)
			}
		},
	)
})
