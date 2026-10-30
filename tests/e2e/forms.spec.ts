import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() =>
		localStorage.setItem(
			"react-scan-options",
			JSON.stringify({ enabled: false, showToolbar: false }),
		),
	)
})

test.describe("forms", () => {
	test("surfaces newsletter validation for invalid input", async ({ page }) => {
		await page.goto("/newsletter/unsubscribe/")

		const form = page.locator("#unsubscribe-form")
		await expect
			.poll(
				() =>
					form.evaluate(element =>
						Object.keys(element).some(key => key.startsWith("__reactProps$")),
					),
				{ timeout: 20_000 },
			)
			.toBe(true)
		await expect(page.getByRole("heading", { name: "Unsubscribe from Newsletter" })).toBeVisible()

		const emailInput = form.getByPlaceholder("you@example.com")
		await emailInput.fill("not-an-email")
		await form.getByRole("button", { name: "Send Unsubscribe Link" }).click()

		await expect(emailInput).toHaveAttribute("aria-invalid", "true")
		await expect
			.poll(() => emailInput.evaluate((input: HTMLInputElement) => input.validationMessage))
			.toContain("email")
	})

	test("submits the newsletter form with valid input", async ({ page }) => {
		await page.goto("/")

		const form = page.locator("#newsletter-form")
		await expect
			.poll(
				() =>
					form.evaluate(element =>
						Object.keys(element).some(key => key.startsWith("__reactProps$")),
					),
				{ timeout: 20_000 },
			)
			.toBe(true)
		await form.getByPlaceholder("you@example.com").fill("reader@example.com")
		await form.getByRole("button", { name: "Subscribe" }).click()

		await expect(page.getByText("Request received", { exact: true })).toBeVisible()
		await expect(
			page.getByText(
				"If this request applies to your subscription, you will receive an email with the next steps.",
				{ exact: true },
			),
		).toBeVisible()
		await expect(form.getByPlaceholder("you@example.com")).toHaveValue("")
	})
	test("acknowledges an unsubscribe request neutrally", async ({ page }) => {
		await page.goto("/newsletter/unsubscribe/")
		const form = page.locator("#unsubscribe-form")
		await expect
			.poll(
				() =>
					form.evaluate(element =>
						Object.keys(element).some(key => key.startsWith("__reactProps$")),
					),
				{ timeout: 20_000 },
			)
			.toBe(true)
		await form.getByPlaceholder("you@example.com").fill("reader@example.com")
		await form.getByRole("button", { name: "Send Unsubscribe Link" }).click()
		await expect(page.getByText("Request received", { exact: true })).toBeVisible()
		await expect(
			page.getByText(
				"If this request applies to your subscription, you will receive an email with the next steps.",
				{ exact: true },
			),
		).toBeVisible()
	})
})
