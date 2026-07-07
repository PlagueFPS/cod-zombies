import { expect, test } from "@playwright/test"

test.describe("bestiary grid", () => {
	test("loads the default grid", async ({ page }) => {
		await page.goto("/bestiary/")

		await expect(page.getByRole("heading", { name: "Bestiary" })).toBeVisible()
		await expect(page.getByRole("link", { name: /View details for/ }).first()).toBeVisible()
	})

	test("loads a representative filter and sort state without exhausting combinations", async ({
		page,
	}) => {
		await page.goto("/bestiary/?type=%5B%22boss%22%5D&sort=%22oldest%22")

		await expect(page).toHaveURL(/type=.*boss/)
		await expect(page).toHaveURL(/sort=.*oldest/)
		await expect(page.getByLabel("Boss")).toBeVisible()
		await expect(page.getByRole("link", { name: /View details for/ }).first()).toBeVisible()
	})
})
