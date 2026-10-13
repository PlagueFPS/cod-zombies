import { expect, test } from "@playwright/test"

const captions = [
	"Core Foundry - in the corner next to the VS-Recon wall buy",
	"Dry Dock - behind the boat in the bottom right corner",
	"War Factory - in the corner just before heading into the admin room",
	"Fjord Road - at the end of the road",
]

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem(
			"react-scan-options",
			JSON.stringify({ enabled: false, showToolbar: false }),
		)
	})
	await page.goto("/main-quests/black-ops-7/totenreich", { waitUntil: "domcontentloaded" })
	await expect(page.getByRole("heading", { name: "Totenreich", exact: true })).toBeVisible({
		timeout: 15_000,
	})
	await expect(
		page.locator('[data-slot="carousel"]').first().getByRole("button", { name: "Next slide" }),
	).toBeEnabled({ timeout: 15_000 })
	await page.addStyleTag({
		content:
			"[data-react-scan], #react-scan-toolbar-root, #react-scan-root, canvas[style*='position: fixed'] { display: none !important; }",
	})
})

test("uses arrow keys immediately after expansion", async ({ page }) => {
	const carousel = page.locator('[data-slot="carousel"]').first()
	await carousel.getByRole("button", { name: captions[0] }).click()
	const dialog = page.getByRole("dialog", { name: "Image carousel" })
	await expect(dialog).toBeVisible()
	await expect(dialog.getByRole("button", { name: "Next slide" })).toBeEnabled()

	await page.keyboard.press("ArrowRight")
	await expect(dialog.getByRole("img", { name: captions[1], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
	await page.keyboard.press("ArrowLeft")
	await expect(dialog.getByRole("img", { name: captions[0], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
})

test("browses expanded slides and returns to the selected slide", async ({ page }, testInfo) => {
	const carousel = page.locator('[data-slot="carousel"]').first()
	await carousel.getByRole("button", { name: "Next slide" }).click()
	await expect(carousel.getByRole("button", { name: "Slide 2 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await carousel.getByRole("button", { name: captions[1] }).click()

	const dialog = page.getByRole("dialog", { name: "Image carousel" })
	await expect(dialog.getByRole("button", { name: "Close", exact: true })).toHaveCount(0)
	await expect(
		dialog.getByRole("tablist", { name: "Carousel slides" }).getByRole("button"),
	).toHaveCount(4)
	await expect(dialog.getByText(/Slide \d+ of \d+/)).toHaveCount(0)
	await expect(dialog.getByRole("img", { name: captions[1], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
	await expect(dialog.getByRole("button", { name: "Slide 2 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)

	await dialog.getByRole("button", { name: "Next slide" }).click()
	await expect(dialog.getByRole("button", { name: "Slide 3 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await expect(dialog.getByRole("img", { name: captions[2], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
	await page.keyboard.press("ArrowRight")
	await expect(dialog.getByRole("button", { name: "Slide 4 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await expect(dialog.getByRole("button", { name: "Next slide" })).toBeDisabled()
	await expect(dialog.getByRole("img", { name: captions[3], exact: true })).toBeInViewport({
		ratio: 0.999,
	})

	await dialog.getByRole("button", { name: "Previous slide" }).click()
	await expect(dialog.getByRole("button", { name: "Slide 3 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await expect(dialog.getByRole("img", { name: captions[2], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
	await expect(dialog.getByRole("img", { name: captions[2], exact: true })).toHaveCSS(
		"opacity",
		"1",
	)
	await page.screenshot({ path: testInfo.outputPath("expanded-carousel.png") })
	await page.keyboard.press("Escape")
	await expect(dialog).not.toBeVisible()
	await expect(carousel.getByRole("button", { name: "Slide 3 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await expect(carousel.getByRole("button", { name: captions[2] })).toBeFocused()

	await carousel.getByRole("button", { name: captions[2] }).click()
	await expect(dialog.getByRole("button", { name: "Slide 3 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await dialog.getByRole("button", { name: "Slide 1 of 4" }).click()
	await expect(dialog.getByRole("button", { name: "Slide 1 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await expect(dialog.getByRole("img", { name: captions[0], exact: true })).toBeInViewport({
		ratio: 0.999,
	})
	await dialog.getByRole("img", { name: captions[0], exact: true }).click()
	await expect(dialog).not.toBeVisible()
})

test("closes from the caption and backdrop while navigation keeps it open", async ({ page }) => {
	const carousel = page.locator('[data-slot="carousel"]').first()
	await carousel.getByRole("button", { name: captions[0] }).click()
	const dialog = page.getByRole("dialog", { name: "Image carousel" })
	await expect(dialog).toBeVisible()
	await dialog.locator("figcaption").filter({ hasText: captions[0] }).click()
	await expect(dialog).not.toBeVisible()

	await carousel.getByRole("button", { name: captions[0] }).click()
	await expect(dialog.getByRole("button", { name: "Next slide" })).toBeEnabled()
	await dialog.getByRole("button", { name: "Next slide" }).click()
	await expect(dialog.getByRole("button", { name: "Slide 2 of 4" })).toHaveAttribute(
		"aria-current",
		"true",
	)
	await page.locator('[data-slot="dialog-overlay"]').click({ position: { x: 8, y: 8 } })
	await expect(dialog).not.toBeVisible()
})

const themes: Array<"light" | "dark"> = ["light", "dark"]

for (const theme of themes) {
	test.describe(`${theme} theme`, () => {
		test.use({ colorScheme: theme })

		test("shows readable captions on an opaque background", async ({ page }, testInfo) => {
			const carousel = page.locator('[data-slot="carousel"]').first()
			await carousel.getByRole("button", { name: captions[0] }).click()
			const dialog = page.getByRole("dialog", { name: "Image carousel" })
			const image = dialog.getByRole("img", { name: captions[0], exact: true })
			const figure = dialog.locator("figure").filter({ hasText: captions[0] })
			const caption = figure.locator("figcaption")

			await expect(image).toBeInViewport({ ratio: 0.999 })
			await expect(image).toHaveCSS("opacity", "1")
			await expect(caption).toHaveCSS("font-size", "16px")

			const colors = await page.locator("body").evaluate(element => {
				const style = getComputedStyle(element)

				return { background: style.backgroundColor, foreground: style.color }
			})

			await expect(figure).toHaveCSS("background-color", colors.background)
			await expect(caption).toHaveCSS("color", colors.foreground)
			await page.screenshot({ path: testInfo.outputPath(`expanded-carousel-${theme}.png`) })
		})
	})
}

test("keeps standalone images independent of carousel expansion", async ({ page }) => {
	await page.getByRole("button", { name: "Crane Button" }).click()
	const dialog = page.getByRole("dialog", { name: "Crane Button" })
	await expect(dialog).toBeVisible()
	await expect(dialog.getByRole("button", { name: "Next slide" })).toHaveCount(0)
	await dialog.locator("img").click()
	await expect(dialog).not.toBeVisible()
})

test.describe("touch navigation", () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

	test("swipes between expanded images on a phone", async ({ page, context }, testInfo) => {
		const carousel = page.locator('[data-slot="carousel"]').first()
		await expect(carousel.getByRole("button", { name: "Next slide" })).toBeEnabled()
		await carousel.getByRole("button", { name: captions[0] }).tap()
		const dialog = page.getByRole("dialog", { name: "Image carousel" })
		await expect(dialog.getByRole("button", { name: "Slide 1 of 4" })).toHaveAttribute(
			"aria-current",
			"true",
		)
		await expect(dialog.getByRole("button", { name: "Previous slide" })).toBeDisabled()

		const viewport = await dialog.locator('[data-slot="carousel-content"]').boundingBox()

		if (!viewport) throw new Error("Expanded carousel has no visible viewport")

		const session = await context.newCDPSession(page)
		const startX = viewport.x + viewport.width * 0.8
		const y = viewport.y + viewport.height / 2

		await session.send("Input.dispatchTouchEvent", {
			type: "touchStart",
			touchPoints: [{ x: startX, y }],
		})

		for (let step = 1; step <= 10; step++) {
			await session.send("Input.dispatchTouchEvent", {
				type: "touchMove",
				touchPoints: [{ x: startX - viewport.width * 0.06 * step, y }],
			})
		}

		await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
		await session.detach()

		await expect(dialog.getByRole("button", { name: "Slide 2 of 4" })).toHaveAttribute(
			"aria-current",
			"true",
		)
		await expect(dialog.getByRole("img", { name: captions[1], exact: true })).toBeInViewport({
			ratio: 0.999,
		})
		await expect(dialog.getByRole("img", { name: captions[1], exact: true })).toHaveCSS(
			"opacity",
			"1",
		)
		await page.screenshot({ path: testInfo.outputPath("expanded-carousel-mobile.png") })
		await dialog.getByRole("img", { name: captions[1], exact: true }).tap()
		await expect(carousel.getByRole("button", { name: "Slide 2 of 4" })).toHaveAttribute(
			"aria-current",
			"true",
		)
	})
})
