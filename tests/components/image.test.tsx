/** @vitest-environment happy-dom */

import { act, type ReactEventHandler } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Image } from "@/components/image"

const baseProps = {
	src: "https://example.com/x.png",
	alt: "x",
	height: 100,
	width: 100,
} as const

describe("Image onLoad", () => {
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

	it("fires onLoad once for a native load event", async () => {
		const onLoad = vi.fn<ReactEventHandler<HTMLImageElement>>()
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(<Image {...baseProps} onLoad={onLoad} />)
		})

		const img = container.querySelector("img")!
		await act(async () => {
			img.dispatchEvent(new Event("load", { bubbles: false }))
		})

		expect(onLoad).toHaveBeenCalledTimes(1)
	})

	it("fires onLoad when the image is already complete on attach (cached)", async () => {
		const onLoad = vi.fn<ReactEventHandler<HTMLImageElement>>()
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<Image
					{...baseProps}
					ref={el => {
						if (!el) return
						Object.defineProperty(el, "complete", { value: true, configurable: true })
						Object.defineProperty(el, "naturalWidth", { value: 100, configurable: true })
					}}
					onLoad={onLoad}
				/>,
			)
		})

		await act(async () => {
			await Promise.resolve()
			await Promise.resolve()
		})

		expect(onLoad).toHaveBeenCalledTimes(1)
	})

	it("does not fire onLoad for a broken but complete image", async () => {
		const onLoad = vi.fn<ReactEventHandler<HTMLImageElement>>()
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<Image
					{...baseProps}
					ref={el => {
						if (!el) return
						Object.defineProperty(el, "complete", { value: true, configurable: true })
						Object.defineProperty(el, "naturalWidth", { value: 0, configurable: true })
					}}
					onLoad={onLoad}
				/>,
			)
		})

		await act(async () => {
			await Promise.resolve()
			await Promise.resolve()
			await Promise.resolve()
		})

		expect(onLoad).not.toHaveBeenCalled()
	})

	it("does not double-fire onLoad when cached path and native load both occur", async () => {
		const onLoad = vi.fn<ReactEventHandler<HTMLImageElement>>()
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<Image
					{...baseProps}
					ref={el => {
						if (!el) return
						Object.defineProperty(el, "complete", { value: true, configurable: true })
						Object.defineProperty(el, "naturalWidth", { value: 100, configurable: true })
					}}
					onLoad={onLoad}
				/>,
			)
		})

		await act(async () => {
			await Promise.resolve()
		})

		const img = container.querySelector("img")!
		await act(async () => {
			img.dispatchEvent(new Event("load", { bubbles: false }))
		})

		expect(onLoad).toHaveBeenCalledTimes(1)
	})
})
