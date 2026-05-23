import { describe, expect, test } from "vitest"
import {
	extractLinksFromMdx,
	findUnclosedMarkdownLinks,
	isInternalHref,
	resolveFragment,
	resolveInternalPath,
	splitHref,
	type SiteRouteIndex,
} from "@/tests/mdx/mdx-link-validation"

const sampleIndex: SiteRouteIndex = {
	paths: new Set(["/main-quests", "/main-quests/black-ops-7/totenreich"]),
	headingsByPath: new Map([
		["/main-quests/black-ops-7/totenreich", new Set(["step-one", "boss-fight"])],
	]),
	routesByContentPath: new Map([
		["content/main-quests/totenreich", ["/main-quests/black-ops-7/totenreich"]],
	]),
}

describe("splitHref", () => {
	test("splits pathname and hash, stripping query strings", () => {
		expect(splitHref("/maps?tab=1#overview")).toEqual({
			pathname: "/maps",
			hash: "overview",
		})
	})

	test("hash-only hrefs have an empty pathname", () => {
		expect(splitHref("#boss-fight")).toEqual({ pathname: "", hash: "boss-fight" })
	})
})

describe("isInternalHref", () => {
	test("treats site-root and fragment links as internal", () => {
		expect(isInternalHref("/main-quests")).toBe(true)
		expect(isInternalHref("#step-one")).toBe(true)
	})

	test("rejects external URLs", () => {
		expect(isInternalHref("https://example.com")).toBe(false)
	})
})

describe("extractLinksFromMdx", () => {
	test("collects markdown and videoLink hrefs with line numbers", () => {
		const content = `# Guide\n\nSee [boss](#boss-fight).\n\n<Video videoLink="/clips/boss.mp4" />`
		expect(extractLinksFromMdx(content)).toEqual([
			{ href: "#boss-fight", line: 3 },
			{ href: "/clips/boss.mp4", line: 5 },
		])
	})
})

describe("findUnclosedMarkdownLinks", () => {
	test("flags markdown links missing a closing parenthesis", () => {
		const content = "Broken [link](/path-without-close\n\nNext paragraph."
		const issues = findUnclosedMarkdownLinks(content)
		expect(issues).toHaveLength(1)
		expect(issues[0]?.line).toBe(1)
		expect(issues[0]?.excerpt).toContain("[link](/path-without-close")
	})
})

describe("resolveInternalPath", () => {
	test("accepts registered routes and main-quest shortcut patterns", () => {
		expect(resolveInternalPath("/main-quests", sampleIndex)).toBe(true)
		expect(resolveInternalPath("/black-ops-7/totenreich", sampleIndex)).toBe(true)
	})

	test("rejects unknown paths", () => {
		expect(resolveInternalPath("/not-a-route", sampleIndex)).toBe(false)
	})
})

describe("resolveFragment", () => {
	test("allows empty fragments", () => {
		expect(resolveFragment("/main-quests/black-ops-7/totenreich", "", sampleIndex)).toBe(true)
	})

	test("resolves same-page anchors via the source content path", () => {
		expect(
			resolveFragment("", "boss-fight", sampleIndex, "content/main-quests/totenreich"),
		).toBe(true)
		expect(
			resolveFragment("", "missing-anchor", sampleIndex, "content/main-quests/totenreich"),
		).toBe(false)
	})

	test("maps shortcut routes to main-quest headings", () => {
		expect(
			resolveFragment("/black-ops-7/totenreich", "step-one", sampleIndex),
		).toBe(true)
	})
})
