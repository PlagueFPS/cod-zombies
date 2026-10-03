/** @vitest-environment happy-dom */

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import AotrtNumberTool from "@/components/aotrt-number-tool"

describe("AotrtNumberTool", () => {
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

	test("shows the O number for the entered M and top TV number", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<AotrtNumberTool />)
		})

		expect(container.textContent).toContain("Enter your M and top TV numbers")

		const mInput = asInput(container.querySelector("#aotrt-m"))
		const tvInput = asInput(container.querySelector("#aotrt-top-tv-number"))

		await act(async () => {
			setInputValue(mInput, "7")
			setInputValue(tvInput, "61")
		})

		expect(container.textContent).toContain("O number = 9")
		expect(container.textContent).toContain("TV Color = Middle")
	})

	test("shows the top TV color when O times M is below the top number", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<AotrtNumberTool />)
		})

		const mInput = asInput(container.querySelector("#aotrt-m"))
		const tvInput = asInput(container.querySelector("#aotrt-top-tv-number"))

		await act(async () => {
			setInputValue(mInput, "15")
			setInputValue(tvInput, "61")
		})

		expect(container.textContent).toContain("O number = 4")
		expect(container.textContent).toContain("TV Color = Top")
	})

	test("asks for positive whole numbers when an entry cannot be used", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<AotrtNumberTool />)
		})

		const mInput = asInput(container.querySelector("#aotrt-m"))
		const tvInput = asInput(container.querySelector("#aotrt-top-tv-number"))

		await act(async () => {
			setInputValue(mInput, "0")
			setInputValue(tvInput, "61")
		})

		expect(container.textContent).toContain("Enter positive whole numbers")
		expect(container.textContent).not.toContain("O number")
	})
})

// Helpers
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
