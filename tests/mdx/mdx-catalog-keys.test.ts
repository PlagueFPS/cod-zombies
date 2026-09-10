import { beforeAll, describe, expect, test } from "vitest"
import {
	extractCatalogKeyRefs,
	invalidCatalogKeyMessages,
	loadMdxTooltipSources,
	loadTsxTooltipSources,
	type TooltipSourceFile,
} from "@/tests/mdx/mdx-catalog-keys"

describe("extractCatalogKeyRefs", () => {
	test("collects quoted tooltip keys with line numbers", () => {
		const content = [
			"Intro.",
			'<PerkTooltip perkKey="juggernog" game="black-ops-6" />',
			'<ZombieTooltip zombieKey="mimic" />',
		].join("\n")

		expect(extractCatalogKeyRefs(content)).toEqual([
			{ component: "PerkTooltip", prop: "perkKey", value: "juggernog", line: 2 },
			{ component: "PerkTooltip", prop: "game", value: "black-ops-6", line: 2 },
			{ component: "ZombieTooltip", prop: "zombieKey", value: "mimic", line: 3 },
		])
	})

	test("collects keys from multiline tags and JSX string literals", () => {
		const content = [
			"<AmmoModTooltip",
			'  ammoModKey={"shatter-blast"}',
			"  game={'black-ops-7'}",
			"/>",
		].join("\n")

		expect(extractCatalogKeyRefs(content)).toEqual([
			{
				component: "AmmoModTooltip",
				prop: "ammoModKey",
				value: "shatter-blast",
				line: 2,
			},
			{ component: "AmmoModTooltip", prop: "game", value: "black-ops-7", line: 3 },
		])
	})

	test("skips dynamic JSX expressions", () => {
		const content = "<AmmoModTooltip ammoModKey={weakness} game={mostRecentGame.id} />"

		expect(extractCatalogKeyRefs(content)).toEqual([])
	})
})

describe("invalidCatalogKeyMessages", () => {
	test("returns empty when every static key exists", () => {
		const content = '<PerkTooltip perkKey="juggernog" game="black-ops-6" />'

		expect(invalidCatalogKeyMessages("src/content/example.mdx", content)).toEqual([])
	})

	test("reports unknown static keys", () => {
		const content = '<PerkTooltip perkKey="not-a-perk" game="not-a-game" />'

		expect(invalidCatalogKeyMessages("src/content/example.mdx", content)).toEqual([
			'src/content/example.mdx:1 <PerkTooltip perkKey="not-a-perk" /> is not a valid catalog key',
			'src/content/example.mdx:1 <PerkTooltip game="not-a-game" /> is not a valid catalog key',
		])
	})
})

describe("MDX catalog key integrity", () => {
	let sources: TooltipSourceFile[]

	beforeAll(() => {
		sources = loadMdxTooltipSources()
	})

	test("every static tooltip key is a valid catalog id", () => {
		const failures: string[] = []

		for (const file of sources) {
			failures.push(...invalidCatalogKeyMessages(file.label, file.content))
		}

		expect(failures).toEqual([])
	})
})

describe("TSX catalog key integrity", () => {
	let sources: TooltipSourceFile[]

	beforeAll(() => {
		sources = loadTsxTooltipSources()
	})

	test("every static tooltip key is a valid catalog id", () => {
		const failures: string[] = []

		for (const file of sources) {
			failures.push(...invalidCatalogKeyMessages(file.label, file.content))
		}

		expect(failures).toEqual([])
	})
})
