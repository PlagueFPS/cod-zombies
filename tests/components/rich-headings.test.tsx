/** @vitest-environment happy-dom */

import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRouter,
} from "@tanstack/react-router"
import { String as Str } from "effect"
import { act, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vite-plus/test"
import { Heading2, Heading3, Heading4 } from "@/components/rich-headings"

async function renderWithRouter(ui: ReactNode): Promise<{
	container: HTMLDivElement
	unmount: () => void
}> {
	const rootRoute = createRootRoute({
		component: () => ui,
	})

	const router = createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	})

	await router.load()

	const container = document.createElement("div")
	document.body.appendChild(container)
	const root: Root = createRoot(container)

	await act(async () => {
		root.render(<RouterProvider router={router} />)
	})

	return {
		container,
		unmount: () => {
			act(() => root.unmount())
			container.remove()
		},
	}
}

describe("Rich headings", () => {
	let cleanup: (() => void) | undefined

	afterEach(() => {
		cleanup?.()
		cleanup = undefined
	})

	test.each([
		{ name: "Heading2", tag: "h2", iconClass: "h-5 w-5", Component: Heading2 },
		{ name: "Heading3", tag: "h3", iconClass: "h-4 w-4", Component: Heading3 },
		{ name: "Heading4", tag: "h4", iconClass: "h-4 w-4", Component: Heading4 },
	])(
		"$name wraps inline children inside one span and keeps hover LinkSVG",
		async ({ tag, iconClass, Component }) => {
			const rendered = await renderWithRouter(
				<Component id="ray-gun-mkii-wraith-fire">
					Ray Gun <strong>MKII</strong> <code>Wraith Fire</code>
				</Component>,
			)

			cleanup = rendered.unmount

			const heading = rendered.container.querySelector(tag)
			expect(heading?.id).toBe("ray-gun-mkii-wraith-fire")

			const link = heading?.querySelector("a")
			expect(link).not.toBeNull()
			expect(link?.getAttribute("href")).toBe("/#ray-gun-mkii-wraith-fire")
			expect(link?.className).toContain("group")
			expect(link?.className).toContain("flex")
			expect(link?.children).toHaveLength(2)

			const contentSpan = link?.children.item(0)
			expect(contentSpan?.tagName).toBe("SPAN")
			expect(contentSpan?.textContent).toBe("Ray Gun MKII Wraith Fire")
			expect(contentSpan?.querySelector("strong")?.textContent).toBe("MKII")
			expect(contentSpan?.querySelector("code")?.textContent).toBe("Wraith Fire")

			const iconSpan = link?.children.item(1)
			expect(iconSpan?.tagName).toBe("SPAN")
			expect(iconSpan?.className).toContain("hidden")
			expect(iconSpan?.className).toContain("group-hover:block")

			const svg = iconSpan?.querySelector("svg")
			expect(svg?.getAttribute("aria-label")).toBe("Link")

			for (const token of Str.split(iconClass, " ")) {
				expect(svg?.getAttribute("class")).toContain(token)
			}
		},
	)
})
