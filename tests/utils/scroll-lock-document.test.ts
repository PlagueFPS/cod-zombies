// @vitest-environment happy-dom

import { afterEach, describe, expect, test } from "vitest"
import {
	lockDocumentScroll,
	resetDocumentScrollLockForTests,
	unlockDocumentScroll,
} from "@/utils/scroll-lock/document-lock"

describe("document scroll lock ref counting", () => {
	afterEach(() => {
		resetDocumentScrollLockForTests()
	})

	test("locks overflow on first acquire and restores on final release", () => {
		const html = document.documentElement
		html.style.overflow = "scroll"
		html.style.paddingRight = "8px"

		lockDocumentScroll()
		expect(html.style.overflow).toBe("hidden")

		unlockDocumentScroll()
		expect(html.style.overflow).toBe("scroll")
		expect(html.style.paddingRight).toBe("8px")
	})

	test("nested locks keep document locked until the last release", () => {
		const html = document.documentElement

		lockDocumentScroll()
		lockDocumentScroll()
		expect(html.style.overflow).toBe("hidden")

		unlockDocumentScroll()
		expect(html.style.overflow).toBe("hidden")

		unlockDocumentScroll()
		expect(html.style.overflow).toBe("")
	})

	test("extra unlock calls do not throw or underflow", () => {
		lockDocumentScroll()
		unlockDocumentScroll()
		unlockDocumentScroll()
		expect(document.documentElement.style.overflow).toBe("")
	})
})
