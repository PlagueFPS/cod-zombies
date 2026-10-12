import type { FileRoutesByTo } from "@/routeTree.gen"
import { describe, expect, test } from "vitest"
import { trailAfterHome, type Link } from "@/components/breadcrumbs"

function L(href: string, title: string): Link {
	// SAFETY: breadcrumb tests use path strings as `Link.href`; trail helpers only read `title`/`href` structurally.
	return { href: href as keyof FileRoutesByTo, title }
}

function ellipsisCount(pieces: ReturnType<typeof trailAfterHome>) {
	return pieces.filter(p => p.kind === "ellipsis").length
}

describe("trailAfterHome", () => {
	test("without ellipsis flag, maps every link in order", () => {
		const links = [L("/maps", "Maps"), L("/maps/bo6", "BO6")]
		expect(trailAfterHome(links, false, false)).toEqual([
			{ kind: "link", link: links[0] },
			{ kind: "link", link: links[1] },
		])
		expect(ellipsisCount(trailAfterHome(links, false, false))).toBe(0)
	})

	test("without ellipsis flag, empty links yields empty trail", () => {
		expect(trailAfterHome([], false, false)).toEqual([])
	})

	test("with ellipsis flag but no links, yields empty trail (invalid caller contract)", () => {
		expect(trailAfterHome([], true, false)).toEqual([])
		expect(trailAfterHome([], true, true)).toEqual([])
	})

	test("with ellipsis + standard collapse: first segment, single ellipsis, then last (3 links)", () => {
		const links = [
			L("/side-quests", "Side Quests"),
			L("/side-quests/bo6", "BO6"),
			L("/side-quests/bo6/street", "Street"),
		]

		const trail = trailAfterHome(links, true, false)
		expect(trail).toEqual([
			{ kind: "link", link: links[0] },
			{ kind: "ellipsis" },
			{ kind: "link", link: links[2] },
		])
		expect(ellipsisCount(trail)).toBe(1)
	})

	test("with ellipsis + standard collapse: first segment, single ellipsis, then last (4 links)", () => {
		const links = [L("/a", "A"), L("/a/b", "B"), L("/a/b/c", "C"), L("/a/b/c/d", "D")]
		const trail = trailAfterHome(links, true, false)
		expect(trail).toEqual([
			{ kind: "link", link: links[0] },
			{ kind: "ellipsis" },
			{ kind: "link", link: links[3] },
		])
		expect(ellipsisCount(trail)).toBe(1)
	})

	test("with ellipsis + aggressive collapse: only ellipsis then last (3 links)", () => {
		const links = [
			L("/relics", "Relics"),
			L("/relics/bo6", "BO6"),
			L("/relics/bo6/dead-wire", "Super Long Relic Name Here"),
		]

		const trail = trailAfterHome(links, true, true)
		expect(trail).toEqual([{ kind: "ellipsis" }, { kind: "link", link: links[2] }])
		expect(ellipsisCount(trail)).toBe(1)
	})

	test("with ellipsis + aggressive collapse: only ellipsis then last (4 links)", () => {
		const links = [
			L("/m", "M"),
			L("/m/a", "A"),
			L("/m/a/b", "B"),
			L("/m/a/b/c", "VeryLongFinalSegmentTitle"),
		]

		const trail = trailAfterHome(links, true, true)
		expect(trail).toEqual([{ kind: "ellipsis" }, { kind: "link", link: links[3] }])
		expect(ellipsisCount(trail)).toBe(1)
	})
})
