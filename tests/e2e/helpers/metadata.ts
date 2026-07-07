import { expect, type APIRequestContext } from "@playwright/test"

export function getMetaContent(html: string, selector: { property?: string; name?: string }) {
	const attrName = selector.property ? "property" : "name"
	const attrValue = selector.property ?? selector.name
	const pattern = new RegExp(
		`<meta\\s+[^>]*${attrName}=["']${escapeRegExp(attrValue!)}["'][^>]*content=["']([^"']+)["'][^>]*>`,
		"i",
	)
	const reversedPattern = new RegExp(
		`<meta\\s+[^>]*content=["']([^"']+)["'][^>]*${attrName}=["']${escapeRegExp(attrValue!)}["'][^>]*>`,
		"i",
	)

	return pattern.exec(html)?.[1] ?? reversedPattern.exec(html)?.[1]
}

export async function expectImageUrlResponds(request: APIRequestContext, url: string) {
	const imageUrl = new URL(url)
	const response = await request.get(`${imageUrl.pathname}${imageUrl.search}`)
	expect(response.ok(), `${url} should respond successfully`).toBe(true)
	expect(response.headers()["content-type"]).toMatch(/^image\//)
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
