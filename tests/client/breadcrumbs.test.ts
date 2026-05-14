import type { Route } from "next"
import { describe, expect, test } from "vitest"
import { trailAfterHome, type Link } from "@/components/client/breadcrumbs"

function L<const T extends string>(href: T, title: string): Link<T> {
	return { href: href as Route<T>, title }
}

function ellipsisCount<T extends string>(pieces: ReturnType<typeof trailAfterHome<T>>) {
	return pieces.filter(p => p.kind === "ellipsis").length
}

describe("trailAfterHome", () => {
	test("without ellipsis flag, maps every link in order", () => {
		const links = [L("/maps", "Maps"), L("/maps/bo6", "BO6")] as Link<string>[]
		expect(trailAfterHome(links, false, false)).toEqual([
			{ kind: "link", link: links[0] },
			{ kind: "link", link: links[1] },
		])
		expect(ellipsisCount(trailAfterHome(links, false, false))).toBe(0)
	})

	test("without ellipsis flag, empty links yields empty trail", () => {
		expect(trailAfterHome([], false, false)).toEqual([])
	})

	test("with ellipsis + standard collapse: first segment, single ellipsis, then last (3 links)", () => {
		const links = [
			L("/side-quests", "Side Quests"),
			L("/side-quests/bo6", "BO6"),
			L("/side-quests/bo6/street", "Street"),
		] as Link<string>[]
		const trail = trailAfterHome(links, true, false)
		expect(trail).toEqual([
			{ kind: "link", link: links[0] },
			{ kind: "ellipsis" },
			{ kind: "link", link: links[2] },
		])
		expect(ellipsisCount(trail)).toBe(1)
	})

	test("with ellipsis + standard collapse: first segment, single ellipsis, then last (4 links)", () => {
		const links = [
			L("/a", "A"),
			L("/a/b", "B"),
			L("/a/b/c", "C"),
			L("/a/b/c/d", "D"),
		] as Link<string>[]
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
		] as Link<string>[]
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
		] as Link<string>[]
		const trail = trailAfterHome(links, true, true)
		expect(trail).toEqual([{ kind: "ellipsis" }, { kind: "link", link: links[3] }])
		expect(ellipsisCount(trail)).toBe(1)
	})
})
