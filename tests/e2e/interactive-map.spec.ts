import { expect, test } from "@playwright/test"
import { chooseSelectOption } from "./helpers/ui"

test.describe("interactive map", () => {
	test("toggles marker filters and switches layers", async ({ page }) => {
		await page.goto("/maps/totenreich")

		await expect(page.getByText("Current Map")).toBeVisible()
		await expect(page.getByRole("button", { name: "Hide All Markers" })).toBeVisible()

		await page.getByRole("button", { name: "Hide All Markers" }).click()
		await expect(page).toHaveURL(/exclude=/)

		await page.getByRole("button", { name: "Show All Markers" }).click()
		await expect(page).not.toHaveURL(/exclude=/)

		await chooseSelectOption(page, "Eidskallen", "Boss Fight Arena")
		await expect(page).toHaveURL(/layer=.*boss-fight-arena/)
		await expect(page.getByText("Current Layer")).toBeVisible()
	})
})
