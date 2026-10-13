/** @vitest-environment happy-dom */

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import { FeaturedImage } from "@/components/featured-image"

describe("FeaturedImage", () => {
	let container: HTMLDivElement | undefined
	let root: Root | undefined

	afterEach(() => {
		act(() => root?.unmount())
		root = undefined
		container?.remove()
		container = undefined
	})

	test("shows the placeholder without failed alternate sources after an image error", async () => {
		container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () => {
			root?.render(
				<FeaturedImage
					featuredImage="/maps/totenreich.webp"
					alt="Totenreich"
					width={1920}
					height={1080}
					sources={[{ media: "(max-width: 1200px)", srcSet: "/maps/totenreich-1200.webp" }]}
				/>,
			)
		})

		await act(async () => {
			container?.querySelector("img")?.dispatchEvent(new Event("error"))
		})

		expect(container.querySelector("img")?.getAttribute("src")).toBe("/article-img-placeholder.jpg")
		expect(container.querySelector("source")).toBeNull()
	})
})
