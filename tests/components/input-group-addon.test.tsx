/** @vitest-environment happy-dom */

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it } from "vitest"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"

describe("InputGroupAddon click", () => {
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

	async function renderGroup() {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<InputGroup>
					<input aria-label="email" />
					<InputGroupAddon>
						<button type="button">
							<svg data-testid="icon">
								<path d="M0 0h10v10H0z" />
							</svg>
							Subscribe
						</button>
					</InputGroupAddon>
				</InputGroup>,
			)
		})
	}

	it("does not focus the input when clicking an SVG inside a nested button", async () => {
		await renderGroup()
		const input = container!.querySelector("input")!
		const svg = container!.querySelector("svg")!

		expect(svg instanceof HTMLElement).toBe(false)

		await act(async () => {
			svg.dispatchEvent(new MouseEvent("click", { bubbles: true }))
		})

		expect(document.activeElement).not.toBe(input)
	})

	it("does not focus the input when clicking an SVG path inside a nested button", async () => {
		await renderGroup()
		const input = container!.querySelector("input")!
		const path = container!.querySelector("path")!

		expect(path instanceof HTMLElement).toBe(false)

		await act(async () => {
			path.dispatchEvent(new MouseEvent("click", { bubbles: true }))
		})

		expect(document.activeElement).not.toBe(input)
	})

	it("does not focus the input when clicking the nested button itself", async () => {
		await renderGroup()
		const input = container!.querySelector("input")!
		const button = container!.querySelector("button")!

		await act(async () => {
			button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
		})

		expect(document.activeElement).not.toBe(input)
	})

	it("focuses the input when clicking addon space outside a button", async () => {
		await renderGroup()
		const input = container!.querySelector("input")!
		const addon = container!.querySelector("[data-slot=input-group-addon]")!

		await act(async () => {
			addon.dispatchEvent(new MouseEvent("click", { bubbles: true }))
		})

		expect(document.activeElement).toBe(input)
	})
})
