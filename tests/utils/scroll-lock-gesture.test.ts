// @vitest-environment happy-dom

import { describe, expect, test } from "vitest"
import {
	consumeHorizontalDelta,
	consumeVerticalDelta,
	findOverflowScrollParent,
	gestureAllowsScroll,
	overflowAllowsScroll,
	resolveGestureScrollParent,
	type ScrollAxesFn,
} from "@/utils/scroll-lock/gesture-scroll"

function scrollableBox(contentHeight: number, clientHeight: number, scrollTop = 0) {
	const el = document.createElement("div")
	Object.defineProperty(el, "scrollHeight", { value: contentHeight, configurable: true })
	Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true })
	Object.defineProperty(el, "scrollTop", { value: scrollTop, writable: true, configurable: true })
	Object.defineProperty(el, "scrollWidth", { value: 100, configurable: true })
	Object.defineProperty(el, "clientWidth", { value: 100, configurable: true })
	Object.defineProperty(el, "scrollLeft", { value: 0, configurable: true })
	el.style.overflowY = "auto"
	return el
}

describe("overflowAllowsScroll", () => {
	test("treats auto, scroll, and overlay as scrollable", () => {
		expect(overflowAllowsScroll("auto")).toBe(true)
		expect(overflowAllowsScroll("scroll")).toBe(true)
		expect(overflowAllowsScroll("overlay")).toBe(true)
	})

	test("rejects hidden and visible", () => {
		expect(overflowAllowsScroll("hidden")).toBe(false)
		expect(overflowAllowsScroll("visible")).toBe(false)
	})
})

describe("consumeVerticalDelta", () => {
	test("allows downward scroll when not at bottom", () => {
		const el = scrollableBox(200, 100, 0)
		expect(consumeVerticalDelta(el, 10)).toBe(true)
	})

	test("blocks downward scroll at bottom edge", () => {
		const el = scrollableBox(200, 100, 100)
		expect(consumeVerticalDelta(el, 10)).toBe(false)
	})

	test("allows upward scroll when not at top", () => {
		const el = scrollableBox(200, 100, 50)
		expect(consumeVerticalDelta(el, -10)).toBe(true)
	})

	test("blocks upward scroll at top", () => {
		const el = scrollableBox(200, 100, 0)
		expect(consumeVerticalDelta(el, -10)).toBe(false)
	})
})

describe("consumeHorizontalDelta", () => {
	test("mirrors vertical rules on the horizontal axis", () => {
		const el = document.createElement("div")
		Object.defineProperty(el, "scrollWidth", { value: 200, configurable: true })
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true })
		Object.defineProperty(el, "scrollLeft", { value: 0, configurable: true })
		expect(consumeHorizontalDelta(el, 10)).toBe(true)

		Object.defineProperty(el, "scrollLeft", { value: 100, configurable: true })
		expect(consumeHorizontalDelta(el, 10)).toBe(false)
		expect(consumeHorizontalDelta(el, -10)).toBe(true)
	})
})

describe("gestureAllowsScroll axis tie-breaking", () => {
	test("touch prefers vertical when |deltaY| > |deltaX|", () => {
		const el = scrollableBox(200, 100, 50)
		expect(gestureAllowsScroll(el, 20, 10, "touch", { vy: true, hx: false })).toBe(true)
	})

	test("touch treats equal axis magnitudes as horizontal-dominant", () => {
		const el = scrollableBox(100, 100, 0)
		Object.defineProperty(el, "scrollWidth", { value: 300, configurable: true })
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true })
		expect(gestureAllowsScroll(el, 10, 10, "touch", { vy: false, hx: true })).toBe(true)
	})

	test("wheel treats equal axis magnitudes as vertical-dominant", () => {
		const el = scrollableBox(200, 100, 50)
		expect(gestureAllowsScroll(el, 10, 10, "wheel", { vy: true, hx: true })).toBe(true)
	})

	test("wheel ignores horizontal scroll when vertical and horizontal deltas tie", () => {
		const el = scrollableBox(100, 100, 0)
		Object.defineProperty(el, "scrollWidth", { value: 300, configurable: true })
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true })
		expect(gestureAllowsScroll(el, 10, 10, "wheel", { vy: false, hx: true })).toBe(false)
	})
})

describe("findOverflowScrollParent", () => {
	test("returns the nearest scrollable ancestor within the boundary", () => {
		const boundary = document.createElement("div")
		const scrollParent = document.createElement("div")
		const child = document.createElement("span")
		boundary.appendChild(scrollParent)
		scrollParent.appendChild(child)

		const getAxes: ScrollAxesFn = el =>
			el === scrollParent ? { vy: true, hx: false } : { vy: false, hx: false }

		expect(findOverflowScrollParent(child, boundary, getAxes)).toBe(scrollParent)
	})

	test("returns null when no scrollable ancestor exists inside boundary", () => {
		const boundary = document.createElement("div")
		const child = document.createElement("span")
		boundary.appendChild(child)
		const getAxes: ScrollAxesFn = () => ({ vy: false, hx: false })
		expect(findOverflowScrollParent(child, boundary, getAxes)).toBeNull()
	})
})

describe("resolveGestureScrollParent", () => {
	test("locks gestures inside the root when there is no inner scroll parent", () => {
		const root = document.createElement("div")
		const target = document.createElement("p")
		root.appendChild(target)
		const getAxes: ScrollAxesFn = () => ({ vy: false, hx: false })
		expect(resolveGestureScrollParent(target, root, new Set(), getAxes)).toEqual({ kind: "lock" })
	})

	test("passes through targets inside another active scroll-lock root", () => {
		const root = document.createElement("div")
		const otherRoot = document.createElement("div")
		const target = document.createElement("p")
		otherRoot.appendChild(target)
		expect(resolveGestureScrollParent(target, root, new Set([otherRoot]))).toEqual({
			kind: "pass",
		})
	})

	test("scrolls an external overflow parent outside the lock root", () => {
		const root = document.createElement("div")
		const external = document.createElement("div")
		const target = document.createElement("span")
		document.body.appendChild(external)
		external.appendChild(target)

		const getAxes: ScrollAxesFn = el =>
			el === external ? { vy: true, hx: false } : { vy: false, hx: false }

		const resolved = resolveGestureScrollParent(target, root, new Set(), getAxes)
		expect(resolved).toEqual({ kind: "scroll", el: external })
		external.remove()
	})
})
