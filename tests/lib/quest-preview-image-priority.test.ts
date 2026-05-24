import { describe, expect, test } from "vitest"
import { shouldPreloadQuestPreviewImage } from "@/lib/quest-preview/image-priority"

describe("shouldPreloadQuestPreviewImage", () => {
	test("mobile: only the first card preloads", () => {
		expect(shouldPreloadQuestPreviewImage(true, 0)).toBe(true)
		expect(shouldPreloadQuestPreviewImage(true, 1)).toBe(false)
		expect(shouldPreloadQuestPreviewImage(true, 3)).toBe(false)
	})

	test("desktop: first four cards preload (indices 0–3)", () => {
		expect(shouldPreloadQuestPreviewImage(false, 0)).toBe(true)
		expect(shouldPreloadQuestPreviewImage(false, 3)).toBe(true)
		expect(shouldPreloadQuestPreviewImage(false, 4)).toBe(false)
	})
})
