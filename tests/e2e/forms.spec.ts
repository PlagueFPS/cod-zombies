import { expect, test } from "@playwright/test"

test.describe("forms", () => {
	test("surfaces newsletter validation for invalid input", async ({ page }) => {
		await page.goto("/newsletter/unsubscribe/")

		const form = page.locator("#unsubscribe-form")
		await expect(page.getByRole("heading", { name: "Unsubscribe from Newsletter" })).toBeVisible()

		const emailInput = form.getByPlaceholder("you@example.com")
		await emailInput.fill("not-an-email")
		await form.getByRole("button", { name: "Send Unsubscribe Link" }).click()

		await expect(emailInput).toBeFocused()
		await expect
			.poll(() => emailInput.evaluate(input => (input as HTMLInputElement).validationMessage))
			.toContain("email")
	})

	test("submits the newsletter form with valid input", async ({ page }) => {
		await page.goto("/")

		const form = page.locator("#newsletter-form")
		await form.getByPlaceholder("you@example.com").fill("reader@example.com")
		await form.getByRole("button", { name: "Subscribe" }).click()

		await expect(form.getByPlaceholder("you@example.com")).toHaveValue("")
	})
})
