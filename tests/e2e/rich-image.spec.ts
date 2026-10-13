import { expect, test } from "@playwright/test"

const source = "/content/totenreich/totenreich-hidden-power-ups-max-ammo.webp"

const variant = "/content/totenreich/totenreich-hidden-power-ups-max-ammo-1200.webp"

const caption = "Fishery Island - on top of the stick hut in front of Juggernog"

for (const { width, deviceScaleFactor, expected } of [
	{ width: 1440, deviceScaleFactor: 1, expected: source },
	{ width: 1201, deviceScaleFactor: 1, expected: source },
	{ width: 1200, deviceScaleFactor: 2, expected: variant },
	{ width: 800, deviceScaleFactor: 1, expected: variant },
]) {
	test.describe(`expanded guide image at ${width}px and DPR ${deviceScaleFactor}`, () => {
		test.use({ viewport: { width, height: 900 }, deviceScaleFactor })

		test("loads the resolution selected for the viewport when opening and resizing", async ({
			page,
		}) => {
			await page.goto("/side-quests/black-ops-7/totenreich/hidden-power-ups-totenreich")
			await expect(
				page.getByRole("heading", { name: "Hidden Power-Ups", exact: true }).first(),
			).toBeVisible()
			await expect(page.getByRole("img", { name: caption, exact: true })).toHaveAttribute(
				"srcset",
				`${variant} 1200w, ${source} 1917w`,
			)
			await expect(async () => {
				await page.getByRole("button", { name: caption, exact: true }).click()
				await expect(page.getByRole("dialog", { name: caption, exact: true })).toBeVisible()
			}).toPass()

			const image = page.getByRole("dialog", { name: caption, exact: true }).locator("img")
			await expect(image).toBeVisible()
			await expect
				.poll(() =>
					image.evaluate((img: HTMLImageElement) => ({
						path: new URL(img.currentSrc).pathname,
						width: img.naturalWidth,
					})),
				)
				.toEqual({ path: expected, width: expected === source ? 1917 : 1200 })
			await expect(image).not.toHaveAttribute("srcset", /384w/)

			await page.setViewportSize({ width: 1440, height: 900 })
			await expect
				.poll(() => image.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname))
				.toBe(source)

			await page.setViewportSize({ width: 1200, height: 900 })
			await expect
				.poll(() => image.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname))
				.toBe(variant)
		})
	})
}
