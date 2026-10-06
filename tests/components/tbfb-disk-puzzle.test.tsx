/** @vitest-environment happy-dom */

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import TbfbDiskPuzzle from "@/components/tbfb-disk-puzzle"

describe("TbfbDiskPuzzle", () => {
	let container: HTMLDivElement | undefined
	let root: Root | undefined

	afterEach(() => {
		act(() => {
			root?.unmount()
		})
		root = undefined
		container?.remove()
		container = undefined
	})

	test("shows the matching insertion order after four symbols are selected", async () => {
		await renderPuzzle()

		expect(container?.textContent).not.toContain("Insert the disks")

		for (const label of ["Three slashes", "Wings and diamond", "Eagle", "Lambda"]) {
			await clickSymbol(label)
		}

		expect(container?.textContent).toContain("Insert the disks from left to right.")
		expect(container?.textContent).not.toContain("A symbol may have been misread.")
		expect(orderLabels()).toEqual([["Three slashes", "Wings and diamond", "Eagle", "Lambda"]])
		expect(selectedLabels()).toEqual(["Wings and diamond", "Three slashes", "Eagle", "Lambda"])
	})

	test("stops at four selections", async () => {
		await renderPuzzle()

		for (const label of ["Three slashes", "Wings and diamond", "Eagle", "Lambda"]) {
			await clickSymbol(label)
		}

		const chevron = buttonByLabel("Chevron")

		expect(chevron?.getAttribute("aria-disabled")).toBe("true")
		expect(chevron?.className).toContain("opacity-40")

		await act(async () => {
			chevron?.click()
		})

		expect(selectedLabels()).toEqual(["Wings and diamond", "Three slashes", "Eagle", "Lambda"])
		expect(orderLabels()).toEqual([["Three slashes", "Wings and diamond", "Eagle", "Lambda"]])
	})

	test("orders X, N, chevron, and V-shield as N, chevron, X, V-shield", async () => {
		await renderPuzzle()

		for (const label of ["X", "Slanted N", "Chevron", "Wings and diamond"]) {
			await clickSymbol(label)
		}

		expect(container?.textContent).toContain("Insert the disks from left to right.")
		expect(orderLabels()).toEqual([["Slanted N", "Chevron", "X", "Wings and diamond"]])
	})

	test("shows every matching order when a symbol may have been misread", async () => {
		await renderPuzzle()

		for (const label of ["Slanted N", "Eagle", "Lambda", "Skewed plus"]) {
			await clickSymbol(label)
		}

		expect(container?.textContent).toContain(
			"These symbols match more than one order. A symbol may have been misread.",
		)
		expect(orderLabels()).toEqual([
			["Eagle", "Lambda", "Skewed plus", "Slanted N"],
			["Lambda", "Skewed plus", "Eagle", "Slanted N"],
		])
	})

	test("shows one order when two paths agree", async () => {
		await renderPuzzle()

		for (const label of ["Slanted N", "Four triangles", "X", "Wings and diamond"]) {
			await clickSymbol(label)
		}

		expect(container?.textContent).toContain("Insert the disks from left to right.")
		expect(container?.textContent).not.toContain("A symbol may have been misread.")
		expect(orderLabels()).toEqual([["Slanted N", "Four triangles", "X", "Wings and diamond"]])
	})

	test("asks the player to double-check symbols that fit no path", async () => {
		await renderPuzzle()

		for (const label of ["X", "Slanted N", "Skewed plus", "Eagle"]) {
			await clickSymbol(label)
		}

		expect(container?.textContent).toContain(
			"Double-check the symbols on your disks. No path contains all four of them.",
		)
		expect(orderLabels()).toEqual([])
	})

	async function renderPuzzle() {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<TbfbDiskPuzzle />)
		})
	}

	function buttonByLabel(label: string) {
		return [...(container?.querySelectorAll("button") ?? [])].find(
			entry => entry.getAttribute("aria-label") === label,
		)
	}

	async function clickSymbol(label: string) {
		const button = buttonByLabel(label)

		await act(async () => {
			button?.click()
		})
	}

	function selectedLabels() {
		return [...(container?.querySelectorAll("[aria-pressed=true]") ?? [])].map(button =>
			button.getAttribute("aria-label"),
		)
	}

	function orderLabels() {
		return [...(container?.querySelectorAll("ul li") ?? [])].map(item =>
			[...item.querySelectorAll(".sr-only")].map(node => node.textContent),
		)
	}
})
