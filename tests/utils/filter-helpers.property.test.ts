import { it } from "@effect/vitest"
import { Arbitrary, Schema, Match } from "effect"
import { describe, expect } from "vitest"
import { paginate } from "@/utils/filter-helpers"

describe("paginate properties", () => {
	it.prop(
		"pages partition the list and out-of-range pages clamp to an endpoint",
		[
			Arbitrary.array(Arbitrary.schema(Schema.Int), { maxLength: 40 }),
			Arbitrary.schema(Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 12 }))),
			Arbitrary.schema(Schema.Int.check(Schema.isBetween({ minimum: -5, maximum: 20 }))),
		],
		([items, pageSize, rawPage]) => {
			const totalCount = items.length
			const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
			const concatenated: number[] = []

			for (let page = 1; page < totalPages; page++) {
				const result = paginate(items, page, pageSize)
				expect(result.totalCount).toBe(totalCount)
				expect(result.totalPages).toBe(totalPages)
				expect(result.page).toBe(page)
				expect(result.pageSize).toBe(pageSize)
				expect(result.items).toHaveLength(pageSize)
				concatenated.push(...result.items)
			}

			const lastPage = paginate(items, totalPages, pageSize)
			expect(lastPage.totalCount).toBe(totalCount)
			expect(lastPage.totalPages).toBe(totalPages)
			expect(lastPage.page).toBe(totalPages)
			expect(lastPage.pageSize).toBe(pageSize)
			expect(lastPage.items.length).toBeLessThanOrEqual(pageSize)
			concatenated.push(...lastPage.items)

			expect(concatenated).toEqual(items)

			const first = paginate(items, 1, pageSize)
			const last = paginate(items, totalPages, pageSize)
			const clamped = paginate(items, rawPage, pageSize)

			const endpoint = Match.value(rawPage).pipe(
				Match.when(
					page => page < 1,
					() => first,
				),
				Match.when(
					page => page > totalPages,
					() => last,
				),
				Match.orElse(() => clamped),
			)

			expect(clamped.page).toBe(Math.min(Math.max(rawPage, 1), totalPages))
			expect(clamped.items).toEqual(endpoint.items)
			expect(clamped.totalCount).toBe(totalCount)
		},
	)
})
