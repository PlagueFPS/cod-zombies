import { Effect, Option } from "effect"
import { describe, expect, test } from "vitest"

import { getAmmoModByKey } from "@/data/ammo-mods"
import { getAugmentByKey } from "@/data/augments"
import { getFieldUpgradeByKey } from "@/data/field-upgrades"
import { getGames } from "@/data/games"
import { getGobblegumByKey } from "@/data/gobblegum"
import {
	getInteractiveMapByKey,
	getInteractiveMapConfig,
	getInteractiveMaps,
	getTotalMaps,
	type InteractiveMapKey,
} from "@/data/interactive-map"
import {
	getAdjacentMaps,
	getMapByKey,
	getMaps,
	getMapsWithMainQuest,
	type MapKey,
} from "@/data/maps"
import { getPerkByKey } from "@/data/perks"
import { getAdjacentRelics, getRelics, type RelicKey } from "@/data/relics"
import { getAdjacentSideQuests, getSideQuests, type SideQuestKey } from "@/data/side-quests"
import { getAdjacentZombies, getZombies, type ZombieKey } from "@/data/zombies"

const assertSortedDescByDate = (dates: readonly Date[]) => {
	for (let i = 0; i < dates.length - 1; i++) {
		expect(dates[i]!.getTime()).toBeGreaterThanOrEqual(dates[i + 1]!.getTime())
	}
}

describe("data/games", () => {
	test("getGames sorted by release date descending", () => {
		assertSortedDescByDate(getGames().map(g => g.releaseDate))
	})
})

describe("data/maps", () => {
	test("getMaps sorted by release date descending", () => {
		assertSortedDescByDate(getMaps().map(m => m.releaseDate))
	})

	test("getMapsWithMainQuest is subset of getMaps and every entry has a main quest path", () => {
		const allIds = new Set(getMaps().map(m => m.id))
		const withMq = getMapsWithMainQuest()
		expect(withMq.length).toBeGreaterThan(0)
		for (const m of withMq) {
			expect(allIds.has(m.id)).toBe(true)
			expect(Option.isSome(m.mainQuest)).toBe(true)
		}
	})

	test("getAdjacentMaps matches ordering of getMapsWithMainQuest", () => {
		const maps = getMapsWithMainQuest()
		const mid = maps[Math.floor(maps.length / 2)]!
		const { prev, next } = getAdjacentMaps(mid.id as MapKey)
		const idx = maps.findIndex(m => m.id === mid.id)
		expect(idx).toBeGreaterThanOrEqual(0)
		if (idx < maps.length - 1) {
			expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(maps[idx + 1]!.id))
		}
		if (idx > 0) {
			expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(maps[idx - 1]!.id))
		}
	})
})

describe("data/zombies", () => {
	test("getZombies sorted by release date descending", () => {
		assertSortedDescByDate(getZombies().map(z => z.releaseDate))
	})

	test("getAdjacentZombies matches getZombies order", () => {
		const zombies = getZombies()
		const z1 = zombies[1]!
		const { prev, next } = getAdjacentZombies(z1.id as ZombieKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(zombies[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(zombies[2]!.id))
	})
})

describe("data/relics", () => {
	test("getRelics sorted by discovered date descending", () => {
		assertSortedDescByDate(getRelics().map(r => r.discoveredDate))
	})

	test("getAdjacentRelics matches getRelics order", () => {
		const relics = getRelics()
		const r1 = relics[1]!
		const { prev, next } = getAdjacentRelics(r1.id as RelicKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(relics[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(relics[2]!.id))
	})
})

describe("data/side-quests", () => {
	test("getSideQuests sorted by map release date descending", () => {
		const quests = getSideQuests()
		for (let i = 0; i < quests.length - 1; i++) {
			const mapA = getMapByKey(quests[i]!.map).pipe(Option.getOrThrow)
			const mapB = getMapByKey(quests[i + 1]!.map).pipe(Option.getOrThrow)
			expect(mapA.releaseDate.getTime()).toBeGreaterThanOrEqual(mapB.releaseDate.getTime())
		}
	})

	test("getAdjacentSideQuests matches getSideQuests order", () => {
		const quests = getSideQuests()
		const q1 = quests[1]!
		const { prev, next } = getAdjacentSideQuests(q1.id as SideQuestKey)
		expect(next.pipe(Option.map(n => n.id))).toEqual(Option.some(quests[0]!.id))
		expect(prev.pipe(Option.map(p => p.id))).toEqual(Option.some(quests[2]!.id))
	})
})

describe("data/perks", () => {
	test("getPerkByKey merges black-ops-cold-war variant for Juggernog", () => {
		const p = getPerkByKey("juggernog", "black-ops-cold-war").pipe(Option.getOrThrow)
		expect(p.description).toBe("Increase Max Health by 100.")
		expect(p.image).toBe("/perks/juggernog-bo6.webp")
	})
})

describe("data/augments", () => {
	test("getAugmentByKey merges black-ops-7 variant", () => {
		const a = getAugmentByKey("double-jeopardy", "black-ops-7").pipe(Option.getOrThrow)
		expect(a.image).toBe("/augments/bo7/dead-first-major-augment-bo7.webp")
	})
})

describe("data/ammo-mods", () => {
	test("getAmmoModByKey merges game variant for Brain Rot", () => {
		const m = getAmmoModByKey("brain-rot", "black-ops-cold-war").pipe(Option.getOrThrow)
		expect(m.description).toBe(
			"Bullets deal toxic damage. Each bullet has a chance to turn a normal enemy into an ally for 15 seconds before dying (40 second cooldown).",
		)
	})

	test("getAmmoModByKey merges black-ops-7 augments for Light Mend", () => {
		const m = getAmmoModByKey("light-mend", "black-ops-7").pipe(Option.getOrThrow)
		const aug = m.augments.pipe(Option.getOrThrow)
		expect(aug).toContain("booster-shot")
	})
})

describe("data/gobblegum", () => {
	test("getGobblegumByKey merges black-ops-6 variant for Anywhere But Here", () => {
		const g = getGobblegumByKey("anywhere-but-here", "black-ops-6").pipe(Option.getOrThrow)
		expect(g.type).toBe("Instant")
		expect(g.rarity).toBe("Rare")
		expect(g.image).toBe("/gobblegums/anywhere-but-here-bo6.webp")
	})
})

describe("data/field-upgrades", () => {
	test("getFieldUpgradeByKey merges black-ops-7 augments for Aether Shroud", () => {
		const fu = getFieldUpgradeByKey("aether-shroud", "black-ops-7").pipe(Option.getOrThrow)
		const aug = fu.augments.pipe(Option.getOrThrow)
		expect(aug).toContain("afterimage")
	})
})

describe("data/interactive-map", () => {
	test("getInteractiveMaps length matches getTotalMaps and getInteractiveMapByKey stays aligned", () => {
		const maps = getInteractiveMaps()
		expect(maps.length).toBe(getTotalMaps())
		for (const m of maps) {
			expect(
				getInteractiveMapByKey(m.id as InteractiveMapKey).pipe(Option.map(x => x.title)),
			).toEqual(Option.some(m.title))
		}
	})

	test("getInteractiveMapConfig resolves for every registered map id", async () => {
		for (const m of getInteractiveMaps()) {
			const config = await Effect.runPromise(getInteractiveMapConfig(m.id as InteractiveMapKey))
			expect(Array.isArray(config.layers)).toBe(true)
		}
	})
})
