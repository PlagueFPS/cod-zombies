import { describe, expect, test } from "vitest"
import {
	extractLinksFromMdx,
	findUnclosedMarkdownLinks,
	resolveFragment,
	resolveInternalPath,
	splitHref,
	type SiteRouteIndex,
} from "@/tests/mdx/mdx-link-validation"
import { isInternalHref } from "@/utils/shared-functions"

describe("splitHref", () => {
	test("splits pathname, query, and hash", () => {
		expect(splitHref("/main-quests/foo?tab=1#step-two")).toEqual({
			pathname: "/main-quests/foo",
			hash: "step-two",
		})
	})

	test("hash-only href has empty pathname", () => {
		expect(splitHref("#my-heading")).toEqual({ pathname: "", hash: "my-heading" })
	})

	test("pathname without hash or query", () => {
		expect(splitHref("/side-quests/black-ops-6/reckoning/free-perk")).toEqual({
			pathname: "/side-quests/black-ops-6/reckoning/free-perk",
			hash: "",
		})
	})
})

describe("isInternalHref", () => {
	test("treats site paths and same-page anchors as internal", () => {
		expect(isInternalHref("/maps")).toBe(true)
		expect(isInternalHref("#heading")).toBe(true)
	})

	test("treats external URLs as not internal", () => {
		expect(isInternalHref("https://example.com")).toBe(false)
		expect(isInternalHref("mailto:hi@example.com")).toBe(false)
	})
})

describe("extractLinksFromMdx", () => {
	test("collects markdown and videoLink hrefs with line numbers", () => {
		const content = [
			"Intro paragraph.",
			"",
			"See [Quest step](/main-quests/black-ops-6/reckoning#step-one).",
			'<Video videoLink="/videos/foo" />',
		].join("\n")

		expect(extractLinksFromMdx(content)).toEqual([
			{ href: "/main-quests/black-ops-6/reckoning#step-one", line: 3 },
			{ href: "/videos/foo", line: 4 },
		])
	})
})

describe("findUnclosedMarkdownLinks", () => {
	test("flags links missing a closing parenthesis", () => {
		const content = "Broken [link](/path-without-close"
		const issues = findUnclosedMarkdownLinks(content)
		expect(issues).toHaveLength(1)
		expect(issues[0]?.line).toBe(1)
		expect(issues[0]?.excerpt).toContain("[link](/path-without-close")
	})

	test("returns empty for well-formed links", () => {
		expect(findUnclosedMarkdownLinks("[ok](/path)")).toEqual([])
	})
})

describe("resolveInternalPath", () => {
	const index: SiteRouteIndex = {
		paths: new Set(["/", "/maps", "/main-quests/black-ops-6/reckoning"]),
		headingsByPath: new Map(),
		routesByContentPath: new Map(),
	}

	test("accepts registered routes and trailing-slash variants", () => {
		expect(resolveInternalPath("/maps", index)).toBe(true)
		expect(resolveInternalPath("/maps/", index)).toBe(true)
	})

	test("accepts main-quest shortcut paths", () => {
		expect(resolveInternalPath("/black-ops-6/reckoning", index)).toBe(true)
	})

	test("rejects unknown paths", () => {
		expect(resolveInternalPath("/not-a-route", index)).toBe(false)
	})
})

describe("resolveFragment", () => {
	const index: SiteRouteIndex = {
		paths: new Set(["/main-quests/black-ops-6/reckoning"]),
		headingsByPath: new Map([
			["/main-quests/black-ops-6/reckoning", new Set(["step-one", "boss-fight"])],
		]),
		routesByContentPath: new Map([
			["content/main-quests/reckoning", ["/main-quests/black-ops-6/reckoning"]],
		]),
	}

	test("allows empty hash", () => {
		expect(resolveFragment("/maps", "", index)).toBe(true)
	})

	test("resolves hash on explicit pathname", () => {
		expect(resolveFragment("/main-quests/black-ops-6/reckoning", "step-one", index)).toBe(true)
		expect(resolveFragment("/main-quests/black-ops-6/reckoning", "missing", index)).toBe(false)
	})

	test("resolves same-page hash against source content routes", () => {
		expect(resolveFragment("", "boss-fight", index, "content/main-quests/reckoning")).toBe(true)
		expect(resolveFragment("", "not-on-page", index, "content/main-quests/reckoning")).toBe(false)
	})

	test("maps main-quest shortcut paths when resolving target headings", () => {
		expect(resolveFragment("/black-ops-6/reckoning", "step-one", index)).toBe(true)
	})
})
