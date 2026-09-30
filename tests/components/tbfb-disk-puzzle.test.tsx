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
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<TbfbDiskPuzzle />)
		})

		expect(container.textContent).not.toContain("Path 2")

		for (const label of ["Three slashes", "Wings and diamond", "Eagle", "Lambda"]) {
			const button = [...container.querySelectorAll("button")].find(
				entry => entry.getAttribute("aria-label") === label,
			)

			await act(async () => {
				button?.click()
			})
		}

		expect(container.textContent).toContain("Path 2")
		expect(container.textContent).toContain("Insert the disks from left to right.")
		expect(container.textContent).not.toContain("Path 3")
		expect(
			[...container.querySelectorAll("[aria-pressed=true]")].map(button =>
				button.getAttribute("aria-label"),
			),
		).toEqual(["Wings and diamond", "Three slashes", "Eagle", "Lambda"])
	})

	test("stops at four selections and keeps only the unbroken path", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<TbfbDiskPuzzle />)
		})

		for (const label of ["Slanted N", "Eagle", "Lambda", "Skewed plus"]) {
			const button = [...container.querySelectorAll("button")].find(
				entry => entry.getAttribute("aria-label") === label,
			)

			await act(async () => {
				button?.click()
			})
		}

		const chevron = [...container.querySelectorAll("button")].find(
			entry => entry.getAttribute("aria-label") === "Chevron",
		)

		expect(chevron?.getAttribute("aria-disabled")).toBe("true")

		await act(async () => {
			chevron?.click()
		})

		expect(
			[...container.querySelectorAll("[aria-pressed=true]")].map(button =>
				button.getAttribute("aria-label"),
			),
		).toEqual(["Slanted N", "Skewed plus", "Eagle", "Lambda"])
		expect(container.textContent).toContain("Path 2")
		expect(container.textContent).toContain("Insert the disks from left to right.")
		expect(container.textContent).not.toContain("Path 3")
	})
})
