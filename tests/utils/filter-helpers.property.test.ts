import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { paginate } from "@/utils/filter-helpers"

describe("paginate properties", () => {
	test("pages partition the list and out-of-range pages clamp to an endpoint", () => {
		fc.assert(
			fc.property(
				fc.array(fc.integer(), { maxLength: 40 }),
				fc.integer({ min: 1, max: 12 }),
				fc.integer({ min: -5, max: 20 }),
				(items, pageSize, rawPage) => {
					const totalCount = items.length
					const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
					const concatenated: number[] = []

					for (let page = 1; page <= totalPages; page++) {
						const result = paginate(items, page, pageSize)
						expect(result.totalCount).toBe(totalCount)
						expect(result.totalPages).toBe(totalPages)
						expect(result.page).toBe(page)
						expect(result.pageSize).toBe(pageSize)

						if (page < totalPages) {
							expect(result.items).toHaveLength(pageSize)
						} else {
							expect(result.items.length).toBeLessThanOrEqual(pageSize)
						}

						concatenated.push(...result.items)
					}

					expect(concatenated).toEqual(items)

					const first = paginate(items, 1, pageSize)
					const last = paginate(items, totalPages, pageSize)
					const clamped = paginate(items, rawPage, pageSize)
					const endpoint = rawPage < 1 ? first : rawPage > totalPages ? last : clamped

					expect(clamped.page).toBe(Math.min(Math.max(rawPage, 1), totalPages))
					expect(clamped.items).toEqual(endpoint.items)
					expect(clamped.totalCount).toBe(totalCount)
				},
			),
		)
	})
})
