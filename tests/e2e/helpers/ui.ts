import { type Page } from "@playwright/test"

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
