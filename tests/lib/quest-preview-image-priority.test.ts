import { describe, expect, test } from "vitest"
import { shouldPreloadPreviewCardImage } from "@/utils/shared-functions"

describe("shouldPreloadPreviewCardImage", () => {
	test("mobile: only the first card preloads", () => {
		expect(shouldPreloadPreviewCardImage(true, 0)).toBe(true)
		expect(shouldPreloadPreviewCardImage(true, 1)).toBe(false)
		expect(shouldPreloadPreviewCardImage(true, 3)).toBe(false)
	})

	test("desktop: the first four cards preload", () => {
		expect(shouldPreloadPreviewCardImage(false, 0)).toBe(true)
		expect(shouldPreloadPreviewCardImage(false, 3)).toBe(true)
		expect(shouldPreloadPreviewCardImage(false, 4)).toBe(false)
	})
})
