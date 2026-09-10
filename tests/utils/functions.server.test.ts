import { Option } from "effect"
import { describe, expect, it, vi } from "vitest"
import { withStartRequest } from "@/tests/with-start-request"
import { DATE_OPTIONS, SITE_ORIGIN } from "@/utils/constants"
import { getLastModified, getOpengraphImageUrl } from "@/utils/functions.server"
import { getServerUrl } from "@/utils/request.server"

function expectOpengraphPath(href: string | undefined, kind: string, id: string) {
	expect(href).toBeDefined()

	if (href === undefined) return

	const url = new URL(href)
	expect(url.origin).toBe(getServerUrl())
	expect(url.pathname).toMatch(
		new RegExp(`^/opengraph-images/${kind}/opengraph-${id}-v\\d+\\.jpg$`),
	)
}

describe("getLastModified", () => {
	it("should return last modified data for existing file", () => {
		const result = getLastModified("content/main-quests/paradox-junction")
		expect(result).toBeDefined()
	})

	it("should normalize paths to posix-style", () => {
		const result = getLastModified("content\\main-quests\\paradox-junction")
		expect(result).toBeDefined()
	})

	it("should return current date for non-existing file", () => {
		const mockDate = new Date("2025-03-15T10:00:00.000Z")
		vi.useFakeTimers()
		vi.setSystemTime(mockDate)
		const result = getLastModified("content/main-quests/not-in-data")
		expect(result).toStrictEqual({
			lastModified: mockDate.getTime(),
			lastModifiedFormatted: mockDate.toLocaleDateString(undefined, DATE_OPTIONS),
		})
		vi.useRealTimers()
	})

	it("should handle full relative and absolute paths", () => {
		const paths = [
			"content/main-quests/paradox-junction",
			"./content/main-quests/paradox-junction",
			"cod-zombies/content/main-quests/paradox-junction",
		] as const

		for (const p of paths) {
			expect(getLastModified(p)).toBeDefined()
		}
	})
})

describe("getOpengraphImageUrl", () => {
	it("should return `Some` with a versioned URL when the id exists in the manifest", async () => {
		await withStartRequest(new Request(`${SITE_ORIGIN}/`), async () => {
			const result = await getOpengraphImageUrl("main-quests", "paradox-junction")
			expect(Option.isSome(result)).toBe(true)
			expectOpengraphPath(result.valueOrUndefined, "main-quests", "paradox-junction")
		})
	})

	it("should build URLs for side-quests and zombies kinds", async () => {
		await withStartRequest(new Request(`${SITE_ORIGIN}/`), async () => {
			const sideQuests = await getOpengraphImageUrl("side-quests", "free-perk")
			const zombies = await getOpengraphImageUrl("zombies", "zombie")
			expect(Option.isSome(sideQuests)).toBe(true)
			expect(Option.isSome(zombies)).toBe(true)
			expectOpengraphPath(sideQuests.valueOrUndefined, "side-quests", "free-perk")
			expectOpengraphPath(zombies.valueOrUndefined, "zombies", "zombie")
		})
	})

	it("derives the image origin from the current request", async () => {
		const request = new Request("https://abc.cod-zombies.workers.dev/bestiary")
		await withStartRequest(request, async () => {
			const result = await getOpengraphImageUrl("zombies", "zombie")
			expectOpengraphPath(result.valueOrUndefined, "zombies", "zombie")
			expect(getServerUrl()).toBe(new URL(request.url).origin)
		})
	})

	it("should return `None` when the id is missing from the manifest", async () => {
		const result = await getOpengraphImageUrl("main-quests", "no-such-map")
		expect(result).toEqual(Option.none())
	})
})
