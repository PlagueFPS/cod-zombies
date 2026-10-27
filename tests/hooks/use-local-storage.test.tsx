// @vitest-environment happy-dom
import { Schema } from "effect"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import { useLocalStorage } from "@/hooks/use-local-storage"

const PreferenceSchema = Schema.Struct({ size: Schema.Finite })

const initialPreference = { size: 32 }

let root: Root | undefined

afterEach(async () => {
	await act(async () => root?.unmount())
	root = undefined
	localStorage.clear()
})

describe("useLocalStorage", () => {
	test.each(["null", "[]", "42", '"large"', '{"size":"large"}', "{}", "{invalid"])(
		"falls back when the saved value does not match its schema: %s",
		async stored => {
			localStorage.setItem("preference", stored)
			const container = document.createElement("div")
			document.body.appendChild(container)
			root = createRoot(container)

			await act(async () => root?.render(<Preference />))

			expect(container.textContent).toBe("32")
		},
	)

	test("loads validated data and persists functional updates", async () => {
		localStorage.setItem("preference", JSON.stringify({ size: 48 }))
		const container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => root?.render(<Preference />))
		expect(container.textContent).toBe("48")

		await act(async () => container.querySelector("button")?.click())

		expect(container.textContent).toBe("49")
		expect(JSON.parse(localStorage.getItem("preference") ?? "null")).toEqual({ size: 49 })
	})
})

function Preference() {
	const [value, setValue] = useLocalStorage("preference", initialPreference, PreferenceSchema)

	return (
		<button onClick={() => setValue(previous => ({ size: previous.size + 1 }))}>
			{value.size}
		</button>
	)
}
