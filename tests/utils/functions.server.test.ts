import type { ContentPaths } from "@/types/generated/content-paths.gen"
import { Option } from "effect"
import { describe, expect, it, vi } from "vitest"
import { DATE_OPTIONS } from "@/utils/constants"
import { getLastModified, getOpengraphImageUrl } from "@/utils/functions.server"

describe("getLastModified", () => {
	it("should return last modified data for existing file", () => {
		const result = getLastModified("content/main-quests/paradox-junction")
		expect(result).toBeDefined()
	})

	it("should normalize paths to posix-style", () => {
		const result = getLastModified("content\\main-quests\\paradox-junction" as ContentPaths)
		expect(result).toBeDefined()
	})

	it("should return current date for non-existing file", () => {
		const mockDate = new Date("2025-03-15T10:00:00.000Z")
		vi.useFakeTimers()
		vi.setSystemTime(mockDate)
		const result = getLastModified("content/main-quests/not-in-data" as ContentPaths)
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
			expect(getLastModified(p as ContentPaths)).toBeDefined()
		}
	})
})

describe("getOpengraphImageUrl", () => {
	it("should return `Some` with a versioned URL when the id exists in the manifest", async () => {
		const result = await getOpengraphImageUrl("main-quests", "paradox-junction")
		expect(Option.isSome(result)).toBe(true)
		expect(result.valueOrUndefined).toMatch(
			/http:\/\/localhost:3000\/opengraph-images\/main-quests\/opengraph-paradox-junction-v\d+\.jpg/,
		)
	})

	it("should build URLs for side-quests and zombies kinds", async () => {
		const sideQuests = await getOpengraphImageUrl("side-quests", "free-perk")
		const zombies = await getOpengraphImageUrl("zombies", "zombie")
		expect(sideQuests.valueOrUndefined).toMatch(
			/http:\/\/localhost:3000\/opengraph-images\/side-quests\/opengraph-free-perk-v\d+\.jpg/,
		)
		expect(zombies.valueOrUndefined).toMatch(
			/http:\/\/localhost:3000\/opengraph-images\/zombies\/opengraph-zombie-v\d+\.jpg/,
		)
	})

	it("should return `None` when the id is missing from the manifest", async () => {
		const result = await getOpengraphImageUrl("main-quests", "no-such-map")
		expect(result).toEqual(Option.none())
	})
})
