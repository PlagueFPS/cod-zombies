import { expect, type Page } from "@playwright/test"

export async function chooseComboboxOption(page: Page, placeholder: string, optionName: string) {
	const input = page.locator('[data-slot="combobox-chip-input"]').first()
	await page.getByRole("combobox", { name: `Filter: ${placeholder}` }).click()
	await input.fill(optionName)
	await page.keyboard.press("Enter")
	await expect(page.getByLabel(optionName)).toBeVisible()
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

export async function expectRouteReady(page: Page) {
	await expect(page.locator("body")).not.toBeEmpty()
}
