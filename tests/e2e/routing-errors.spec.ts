import { expect, test } from "@playwright/test"

test.describe("routing and error surfaces", () => {
	test("shows the global not-found UI for unknown routes", async ({ page }) => {
		await page.goto("/definitely-not-a-real-route")

		await expect(page.getByRole("heading", { name: "Page could not be found" })).toBeVisible()
		await expect(page.getByText("Back to Home")).toBeVisible()
	})

	test("shows route-specific not-found UI for missing dynamic content", async ({ page }) => {
		await page.goto("/bestiary/not-a-zombie")

		await expect(page).toHaveURL(/\/bestiary\/not-a-zombie$/)
		await expect(page.getByRole("heading", { name: "Zombie could not be found" })).toBeVisible()
		await expect(page.getByText("Not A Zombie").last()).toBeVisible()
		await expect(page.getByText("View Bestiary")).toBeVisible()
	})

	test("shows the subscription error route message", async ({ page }) => {
		await page.goto("/newsletter/subscribe/error?message=Test%20failure")

		await expect(page.getByRole("heading", { name: "Subscribe Failed" })).toBeVisible()
		await expect(page.getByText("Test failure")).toBeVisible()
		await expect(page.getByText("Return to Homepage")).toBeVisible()
	})
})
