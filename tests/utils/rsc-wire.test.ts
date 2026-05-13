import type { InteractiveMap } from "@/data/interactive-map"
import type { MapEntry } from "@/data/maps"
import type { Relic } from "@/data/relics"
import type { SideQuest } from "@/data/side-quests"
import type { Zombie } from "@/data/zombies"
import { Option } from "effect"
import { describe, expect, test } from "vitest"
import {
	decodeInteractiveMap,
	decodeMap,
	decodeRelic,
	decodeSideQuest,
	decodeZombie,
	encodeInteractiveMap,
	encodeMap,
	encodeRelic,
	encodeSideQuest,
	encodeZombie,
	isMapQuest,
	isSideQuest,
} from "@/utils/rsc-wire"

const sampleMap: MapEntry = {
	_tag: "MapEntry",
	id: "test-map",
	title: "Test Map",
	releaseDate: "2020-01-15",
	description: "A test map",
	image: "/maps/nacht-der-untoten.webp",
	game: "world-at-war",
	mainQuest: Option.some("content/main-quests/paradox-junction"),
	difficulty: Option.some("Hard"),
	state: Option.some("New"),
	estimatedTimeMins: Option.some({ min: 30, max: 60, reason: "estimate" }),
}

const sampleSideQuest: SideQuest = {
	_tag: "SideQuest",
	id: "test-quest",
	title: "Test Quest",
	state: Option.some("Coming Soon"),
	map: "nacht-der-untoten",
	description: "Side quest description",
	content: "content/side-quests/115-clock-tower",
}

const sampleRelic: Relic = {
	_tag: "Relic",
	id: "test-relic",
	title: "Test Relic",
	state: Option.none(),
	type: "Grim",
	image: "/relics/blood-vials-relic.webp",
	description: "Relic description",
	map: "nacht-der-untoten",
	discoveredDate: "2021-06-01",
	estimatedTimeMins: { min: 10, max: 20 },
	content: "content/relics/blood-vials",
}

const sampleZombie: Zombie = {
	_tag: "Zombie",
	id: "test-zombie",
	title: "Test Zombie",
	description: "Zombie description",
	state: Option.some("New"),
	releaseDate: "2019-03-01",
	image: "/zombies/abomination.webp",
	games: ["world-at-war"],
	maps: ["nacht-der-untoten"],
	type: "Normal",
	speed: "Slow",
	weakPoints: [],
	elementalWeakness: [],
	attacks: [],
	spawnBehavior: "waves",
	combatStrategy: "content/zombies/abomination",
}

const sampleInteractiveMap: InteractiveMap = {
	_tag: "InteractiveMap",
	id: "paradox-junction",
	title: "Paradox Junction",
	state: Option.some("Coming Soon"),
	image: "/previews/paradox-junction-preview.webp",
	game: "black-ops-7",
	description: "Interactive map description",
}

describe("encodeMap / decodeMap", () => {
	test("round-trips all fields except mainQuest", () => {
		const { mainQuest: _, ...withoutMain } = sampleMap
		expect(decodeMap(encodeMap(sampleMap))).toEqual(withoutMain)
	})

	test("omits mainQuest and replaces Option fields with plain values", () => {
		const encoded = encodeMap(sampleMap)
		expect(encoded).not.toHaveProperty("mainQuest")
		expect(encoded.difficulty).toBe("Hard")
		expect(encoded.state).toBe("New")
		expect(encoded.estimatedTimeMins).toEqual({ min: 30, max: 60, reason: "estimate" })
	})

	test("encodes absent Options as null", () => {
		const map: MapEntry = {
			...sampleMap,
			mainQuest: Option.none(),
			difficulty: Option.none(),
			state: Option.none(),
			estimatedTimeMins: Option.none(),
		}
		const encoded = encodeMap(map)
		expect(encoded.difficulty).toBeNull()
		expect(encoded.state).toBeNull()
		expect(encoded.estimatedTimeMins).toBeNull()
		const { mainQuest: _, ...withoutMain } = map
		expect(decodeMap(encoded)).toEqual(withoutMain)
	})
})

describe("encodeSideQuest / decodeSideQuest", () => {
	test("round-trips all fields except content", () => {
		const { content: _, ...withoutContent } = sampleSideQuest
		expect(decodeSideQuest(encodeSideQuest(sampleSideQuest))).toEqual(withoutContent)
	})

	test("omits content and encodes state", () => {
		const encoded = encodeSideQuest(sampleSideQuest)
		expect(encoded).not.toHaveProperty("content")
		expect(encoded.state).toBe("Coming Soon")
	})
})

describe("encodeRelic / decodeRelic", () => {
	test("round-trips all fields except content", () => {
		const { content: _, ...withoutContent } = sampleRelic
		expect(decodeRelic(encodeRelic(sampleRelic))).toEqual(withoutContent)
	})

	test("omits content and encodes state as null when none", () => {
		const encoded = encodeRelic(sampleRelic)
		expect(encoded).not.toHaveProperty("content")
		expect(encoded.state).toBeNull()
	})
})

describe("encodeZombie / decodeZombie", () => {
	test("round-trips all fields except combatStrategy", () => {
		const { combatStrategy: _, ...withoutStrategy } = sampleZombie
		expect(decodeZombie(encodeZombie(sampleZombie))).toEqual(withoutStrategy)
	})

	test("omits combatStrategy", () => {
		const encoded = encodeZombie(sampleZombie)
		expect(encoded).not.toHaveProperty("combatStrategy")
		expect(encoded.state).toBe("New")
	})
})

describe("encodeInteractiveMap / decodeInteractiveMap", () => {
	test("round-trips the full record", () => {
		expect(decodeInteractiveMap(encodeInteractiveMap(sampleInteractiveMap))).toEqual(
			sampleInteractiveMap,
		)
	})

	test("encodes state to null when none", () => {
		const map: InteractiveMap = { ...sampleInteractiveMap, state: Option.none() }
		const encoded = encodeInteractiveMap(map)
		expect(encoded.state).toBeNull()
		expect(decodeInteractiveMap(encoded)).toEqual(map)
	})
})

describe("isSideQuest / isMapQuest", () => {
	test("narrows on _tag", () => {
		const side = { _tag: "SideQuest" as const, id: "q" }
		const map = { _tag: "MapEntry" as const, id: "m" }
		expect(isSideQuest(side)).toBe(true)
		expect(isSideQuest(map)).toBe(false)
		expect(isMapQuest(map)).toBe(true)
		expect(isMapQuest(side)).toBe(false)
	})
})
