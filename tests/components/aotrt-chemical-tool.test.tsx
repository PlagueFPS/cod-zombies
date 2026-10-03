/** @vitest-environment happy-dom */

import type { AotrtChemical } from "@/utils/aotrt-chemical"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import AotrtChemicalTool from "@/components/aotrt-chemical-tool"
import AotrtNumberTool from "@/components/aotrt-number-tool"
import { AOTRT_O_NUMBER_STORAGE_KEY } from "@/utils/aotrt-o-number-storage"
import { slugify } from "@/utils/shared-functions"

let container: HTMLDivElement | undefined

let root: Root | undefined

describe("AotrtChemicalTool", () => {
	afterEach(() => {
		act(() => {
			root?.unmount()
		})
		root = undefined
		container?.remove()
		container = undefined
		sessionStorage.removeItem(AOTRT_O_NUMBER_STORAGE_KEY)
	})

	test("subtracts the saved O number from the 1,7 phenol column", async () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "4")
		await renderChemical("1,3,5-Tera-Nitra-Phenol")

		expect(container?.textContent).toContain(
			"Enter the Top and Left numbers from the Acetaldehyde diamond",
		)

		await enterDiamond("1,3,5-Tera-Nitra-Phenol", "1", "7")

		expect(container?.textContent).not.toContain("O number")
		expect(container?.textContent).toContain("Step 1 = 24")
		expect(container?.textContent).toContain("Step 2 = 22")
		expect(container?.textContent).toContain("Step 3 = 15")
	})

	test("prints four steps for 3,4-Di-Nitroxy-Methyl-Propane", async () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "4")
		await renderChemical("3,4-Di-Nitroxy-Methyl-Propane")
		await enterDiamond("3,4-Di-Nitroxy-Methyl-Propane", "8", "1")

		expect(container?.textContent).toContain("Step 1 = 20")
		expect(container?.textContent).toContain("Step 2 = 21")
		expect(container?.textContent).toContain("Step 3 = 25")
		expect(container?.textContent).toContain("Step 4 = 15")
		expect(container?.textContent).not.toContain("Step 5")
	})

	test("asks for a remembered O number when none is saved", async () => {
		await renderChemical("1,3,5-Tera-Nitra-Phenol")

		expect(
			container?.querySelector(`#aotrt-${slugify("1,3,5-Tera-Nitra-Phenol")}-o`),
		).toBeInstanceOf(HTMLInputElement)
		expect(container?.textContent).toContain("Enter your O number and the Top and Left")

		await enterDiamond("1,3,5-Tera-Nitra-Phenol", "1", "7")

		expect(container?.textContent).toContain("Enter your O number.")
		expect(container?.textContent).not.toContain("Step 1")

		await enterONumber("1,3,5-Tera-Nitra-Phenol", "4")

		expect(sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)).toBe("4")
		expect(container?.textContent).toContain("Step 1 = 24")
		expect(container?.textContent).toContain("Step 2 = 22")
		expect(container?.textContent).toContain("Step 3 = 15")
		expect(container?.textContent).not.toContain("O number")
		expect(container?.querySelector(`#aotrt-${slugify("1,3,5-Tera-Nitra-Phenol")}-o`)).toBeNull()
	})

	test("rejects an O number the number tool cannot produce", async () => {
		await renderChemical("1,3,5-Tera-Nitra-Phenol")
		await enterDiamond("1,3,5-Tera-Nitra-Phenol", "1", "7")
		await enterONumber("1,3,5-Tera-Nitra-Phenol", "3")

		expect(container?.textContent).toContain("O number must be 2, 4, 5, 6, 8, 9, 11, or 15.")
		expect(container?.textContent).not.toContain("Step 1")
		expect(sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)).toBeNull()
	})

	test("uses the O number saved by the number tool without asking again", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<>
					<AotrtNumberTool />
					<AotrtChemicalTool chemical="1,3,5-Tera-Nitra-Phenol" />
				</>,
			)
		})

		await enterDiamond("1,3,5-Tera-Nitra-Phenol", "1", "7")
		expect(container.textContent).toContain("Enter your O number.")

		const mInput = asInput(container.querySelector("#aotrt-m"))
		const tvInput = asInput(container.querySelector("#aotrt-top-tv-number"))

		await act(async () => {
			setInputValue(mInput, "15")
			setInputValue(tvInput, "61")
		})

		expect(sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)).toBe("4")
		expect(container.textContent).toContain("Step 1 = 24")
		expect(container.textContent).toContain("Step 2 = 22")
		expect(container.textContent).toContain("Step 3 = 15")
	})

	test("solves a reversed diamond as the proper pair", async () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "4")
		await renderChemical("Octahydro-2,5-Nitro-3,4,7-Parazokine")
		await enterDiamond("Octahydro-2,5-Nitro-3,4,7-Parazokine", "7", "1")

		expect(container?.textContent).toContain("Step 1 = 22")
		expect(container?.textContent).toContain("Step 2 = 26")
		expect(container?.textContent).toContain("Step 3 = 23")
		expect(container?.textContent).not.toContain("swapped")
	})

	test("says to view the board in the TV color for any other pair", async () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "4")
		await renderChemical("3-Methyl-2,4-Dinitro Benzene")
		await enterDiamond("3-Methyl-2,4-Dinitro Benzene", "2", "2")

		expect(container?.textContent).toContain("View the board in your TV color")
		expect(container?.textContent).not.toContain("Step 1")
	})

	test("asks for positive whole numbers when an entry cannot be used", async () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "4")
		await renderChemical("1,3,5-Tera-Nitra-Phenol")
		await enterDiamond("1,3,5-Tera-Nitra-Phenol", "0", "7")

		expect(container?.textContent).toContain("Enter positive whole numbers")
		expect(container?.textContent).not.toContain("Step 1")
	})
})

// Helpers
async function renderChemical(chemical: AotrtChemical) {
	container = document.createElement("div")
	document.body.appendChild(container)
	root = createRoot(container)

	await act(async () => {
		root?.render(<AotrtChemicalTool chemical={chemical} />)
	})
}

async function enterONumber(chemical: AotrtChemical, oNumber: string) {
	const input = asInput(container?.querySelector(`#aotrt-${slugify(chemical)}-o`) ?? null)

	await act(async () => {
		setInputValue(input, oNumber)
	})
}

async function enterDiamond(chemical: AotrtChemical, top: string, left: string) {
	const prefix = `aotrt-${slugify(chemical)}`
	const topInput = asInput(container?.querySelector(`#${prefix}-top`) ?? null)
	const leftInput = asInput(container?.querySelector(`#${prefix}-left`) ?? null)

	await act(async () => {
		setInputValue(topInput, top)
		setInputValue(leftInput, left)
	})
}

function asInput(element: Element | null) {
	if (!(element instanceof HTMLInputElement)) {
		throw new Error("Expected an input element")
	}

	return element
}

function setInputValue(input: HTMLInputElement, value: string) {
	const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
	descriptor?.set?.call(input, value)
	input.dispatchEvent(new Event("input", { bubbles: true }))
	input.dispatchEvent(new Event("change", { bubbles: true }))
}
