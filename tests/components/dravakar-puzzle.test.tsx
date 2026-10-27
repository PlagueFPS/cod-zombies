/** @vitest-environment happy-dom */

import { Predicate, String as Str, Array as Arr, Option } from "effect"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import DravakarPuzzle from "@/components/dravakar-puzzle"

describe("DravakarPuzzle", () => {
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

	test("reveals switch interactions for the selected phrase", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<DravakarPuzzle />)
		})

		expect(container.textContent).not.toContain("Solution")

		const quoteButton = Option.getOrUndefined(
			Arr.findFirst(
				[...container.querySelectorAll("button")],
				button =>
					Predicate.isNotNullish(button.textContent) &&
					Str.includes("I remember the runner that travels to stars")(button.textContent),
			),
		)

		expect(quoteButton).toBeDefined()

		await act(async () => {
			quoteButton?.click()
		})

		expect(container.textContent).toContain("Solution: Middle 2x, Right 3x")
		expect(container.textContent).not.toContain("Left")
	})
})
