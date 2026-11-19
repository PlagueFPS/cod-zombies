/** @vitest-environment happy-dom */

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vite-plus/test"
import RichImage from "@/components/rich-image"

describe("RichImage", () => {
	let container: HTMLDivElement | undefined
	let root: Root | undefined

	afterEach(() => {
		act(() => root?.unmount())
		root = undefined
		container?.remove()
		container = undefined
	})

	test("renders a block-level figure with caption when caption is provided", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<RichImage image="/maps/totenreich.webp" caption="Totenreich" />)
		})

		expect(container.querySelector("figure")).not.toBeNull()
		expect(container.querySelector("figcaption")?.textContent).toBe("Totenreich")
		expect(container.querySelector("button")?.getAttribute("class")).toContain("w-full")
	})

	test("renders inline dotted blue text without a figure when children are provided and opens the image dialog on click", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<p>
					Pick up the <RichImage image="/maps/totenreich.webp">Floppy Disk</RichImage> from the
					desk.
				</p>,
			)
		})

		const paragraph = container.querySelector("p")
		const trigger = paragraph?.querySelector("button")
		const label = trigger?.querySelector("span")
		const icon = trigger?.querySelector("svg")

		expect(paragraph?.querySelector("div")).toBeNull()
		expect(paragraph?.querySelector("figure")).toBeNull()
		expect(trigger?.textContent).toBe("Floppy Disk")
		expect(trigger?.className).toContain("inline")
		expect(trigger?.className).toContain("text-blue-700")
		expect(trigger?.className).toContain("dark:text-blue-300")
		expect(label?.className).toContain("decoration-dotted")
		expect(icon?.getAttribute("aria-hidden")).toBe("true")
		expect(trigger?.firstElementChild).toBe(icon)
		expect(document.body.querySelector("[role='dialog']")).toBeNull()

		await act(async () => {
			trigger?.click()
		})

		const dialog = document.body.querySelector("[role='dialog']")

		expect(dialog).not.toBeNull()
		expect(dialog?.querySelector("img")).not.toBeNull()
	})
})
