// @vitest-environment happy-dom

import { afterEach, describe, expect, test, vi } from "vitest"
import { copyTextToClipboard } from "@/utils/copy-to-clipboard"

describe("copyTextToClipboard", () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("returns true when clipboard.writeText succeeds", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		vi.stubGlobal("navigator", { clipboard: { writeText } })

		await expect(copyTextToClipboard("https://example.com/guide")).resolves.toBe(true)
		expect(writeText).toHaveBeenCalledWith("https://example.com/guide")
	})

	test("returns false when clipboard.writeText rejects", async () => {
		vi.stubGlobal("navigator", {
			clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
		})

		await expect(copyTextToClipboard("https://example.com/guide")).resolves.toBe(false)
	})
})
