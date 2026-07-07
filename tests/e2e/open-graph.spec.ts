import { expect, test } from "@playwright/test"
import { dynamicRoutes, indexRoutes } from "./fixtures/routes"
import { expectImageUrlResponds, getMetaContent } from "./helpers/metadata"

const routesWithMetadata = [...indexRoutes, ...dynamicRoutes]

test.describe("Open Graph metadata", () => {
	for (const route of routesWithMetadata) {
		test(`${route} exposes usable social metadata`, async ({ page, request }) => {
			const response = await page.goto(route)
			expect(response?.ok(), `${route} should render HTML`).toBe(true)

			const html = await page.content()
			const ogImage = getMetaContent(html, { property: "og:image" })
			const twitterTitle = getMetaContent(html, { property: "twitter:title" })

			expect(ogImage, `${route} should include og:image`).toBeTruthy()
			expect(twitterTitle, `${route} should include twitter:title`).toBeTruthy()

			await expectImageUrlResponds(request, ogImage!)
		})
	}
})
