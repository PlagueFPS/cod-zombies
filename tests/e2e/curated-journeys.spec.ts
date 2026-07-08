import { expect, test } from "@playwright/test"
import { expectInteractiveMapReady } from "./helpers/ui"
test.describe("curated listing journeys", () => {
	test("filters and sorts main quests", async ({ page }) => {
		await page.goto("/main-quests/?game=%5B%22black-ops-7%22%5D&sort=%22oldest%22")

		await expect(page.getByRole("heading", { name: "Main Quests" })).toBeVisible()
		await expect(page).toHaveURL(/game=.*black-ops-7/)
		await expect(page).toHaveURL(/sort=.*oldest/)
		await expect(page.getByLabel("Black Ops 7")).toBeVisible()
		await expect(page.getByRole("link", { name: /View Guide for/ }).first()).toBeVisible()
	})

	test("filters relics through one representative type", async ({ page }) => {
		await page.goto("/relics/?type=%5B%22grim%22%5D&sort=%22type-asc%22")

		await expect(page.getByRole("heading", { name: "Relics" })).toBeVisible()
		await expect(page).toHaveURL(/type=.*grim/)
		await expect(page).toHaveURL(/sort=.*type-asc/)
		await expect(page.getByLabel("Grim")).toBeVisible()
		await expect(page.getByRole("link", { name: /View Guide for the/ }).first()).toBeVisible()
	})

	test("filters maps and opens a representative interactive map", async ({ page }) => {
		await page.goto("/maps/?game=%5B%22black-ops-6%22%5D")

		await expect(page.getByRole("heading", { name: "Interactive Maps" })).toBeVisible()
		await expect(page).toHaveURL(/game=.*black-ops-6/)
		await expect(page.getByLabel("Black Ops 6")).toBeVisible()

		await page.getByRole("link", { name: "View Terminus interactive map" }).click()
		await expect(page).toHaveURL(/\/maps\/terminus/)
		await expectInteractiveMapReady(page)
	})
})
