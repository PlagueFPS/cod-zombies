// @vitest-environment happy-dom

import { describe, expect, test } from "vitest"
import { firstSlideEl, firstSlideImg } from "@/utils/carousel-first-slide"

describe("firstSlideEl", () => {
	test("prefers first slideNodes entry when it is an HTMLElement", () => {
		const preferred = document.createElement("div")
		const root = document.createElement("div")
		const api = { slideNodes: () => [preferred] }
		expect(firstSlideEl(root, api)).toBe(preferred)
	})

	test("falls back to first [data-slot=carousel-item] when slideNodes first node is not an element", () => {
		const root = document.createElement("div")
		const slide = document.createElement("div")
		slide.setAttribute("data-slot", "carousel-item")
		root.appendChild(slide)
		const api = { slideNodes: () => [document.createTextNode("x")] }
		expect(firstSlideEl(root, api)).toBe(slide)
	})

	test("falls back when api is undefined", () => {
		const root = document.createElement("div")
		const slide = document.createElement("div")
		slide.setAttribute("data-slot", "carousel-item")
		root.appendChild(slide)
		expect(firstSlideEl(root, undefined)).toBe(slide)
	})

	test("returns null when Embla has no usable node and DOM has no carousel item", () => {
		const root = document.createElement("div")
		const api = { slideNodes: () => [null] }
		expect(firstSlideEl(root, api)).toBeNull()
	})
})

describe("firstSlideImg", () => {
	test("returns the first HTMLImageElement inside the resolved slide", () => {
		const root = document.createElement("div")
		const slide = document.createElement("div")
		slide.setAttribute("data-slot", "carousel-item")
		const img = document.createElement("img")
		img.alt = "test"
		slide.appendChild(img)
		root.appendChild(slide)
		expect(firstSlideImg(root, undefined)).toBe(img)
	})

	test("returns undefined when the slide has no img element", () => {
		const root = document.createElement("div")
		const slide = document.createElement("div")
		slide.setAttribute("data-slot", "carousel-item")
		root.appendChild(slide)
		expect(firstSlideImg(root, undefined)).toBeUndefined()
	})
})
