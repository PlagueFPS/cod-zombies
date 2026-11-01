import { afterEach, describe, expect, it, vi } from "vitest"
import { DATE_OPTIONS } from "@/utils/constants"
import { getLastModified } from "@/utils/functions.server"
import { dateFrom } from "@/utils/system-time"

describe("getLastModified", () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it("should return current date for non-existing file", () => {
		const mockDate = dateFrom("2025-03-15T10:00:00.000Z")
		vi.useFakeTimers()
		vi.setSystemTime(mockDate)
		const result = getLastModified("content/main-quests/not-in-data")
		expect(result).toStrictEqual({
			lastModified: mockDate.getTime(),
			lastModifiedFormatted: mockDate.toLocaleDateString(undefined, DATE_OPTIONS),
		})
	})
})
