import { expect, type Page } from "@playwright/test"

export async function expectInteractiveMapReady(page: Page) {
	await expect(page.getByRole("button", { name: "Hide All Markers" })).toBeVisible({
		timeout: 15_000,
	})
}

export async function chooseSelectOption(
	page: Page,
	triggerText: string | RegExp,
	optionName: string,
) {
	await page
		.locator('[data-slot="select-trigger"]')
		.filter({ hasText: triggerText })
		.first()
		.click()
	await page.locator('[data-slot="select-item"]').filter({ hasText: optionName }).first().click()
}
