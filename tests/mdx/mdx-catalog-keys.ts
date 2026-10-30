import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { Match, Schema, Option, Array as Arr, String as Str, Predicate } from "effect"
import { getAmmoModByKey } from "@/data/ammo-mods"
import { getAugmentByKey } from "@/data/augments"
import { getElixirByKey } from "@/data/elixirs"
import { getFateAndFortuneCardByKey } from "@/data/fate-and-fortune-cards"
import { getFieldUpgradeByKey } from "@/data/field-upgrades"
import { getGameByKey } from "@/data/games"
import { getGobblegumByKey } from "@/data/gobblegum"
import { getPerkByKey } from "@/data/perks"
import { getWeaponBuildByKey } from "@/data/weapon-builds"
import { getZombieByKey } from "@/data/zombies"
import { loadMdxCorpus } from "@/tests/mdx/mdx-link-validation"

const SRC_DIR = join(process.cwd(), "src")

const TOOLTIP_COMPONENTS = [
	"PerkTooltip",
	"GobbleGumTooltip",
	"GobblegumTooltip",
	"ZombieTooltip",
	"AmmoModTooltip",
	"AugmentTooltip",
	"ElixirTooltip",
	"FateAndFortuneCardTooltip",
	"FieldUpgradeTooltip",
	"WeaponBuildTooltip",
] as const

const CATALOG_KEY_PROPS = [
	"perkKey",
	"gobblegumKey",
	"zombieKey",
	"ammoModKey",
	"augmentKey",
	"elixirKey",
	"cardKey",
	"fieldUpgradeKey",
	"weaponBuildKey",
	"game",
] as const

export type CatalogKeyProp = (typeof CATALOG_KEY_PROPS)[number]

export interface CatalogKeyRef {
	readonly component: string
	readonly prop: CatalogKeyProp
	readonly value: string
	readonly line: number
}

export interface TooltipSourceFile {
	readonly label: string
	readonly content: string
}

const TAG_RE = new RegExp(`<(${Arr.join(TOOLTIP_COMPONENTS, "|")})\\b([\\s\\S]*?)(?:/>|>)`, "g")

const ATTR_RE = new RegExp(
	`\\b(${Arr.join(CATALOG_KEY_PROPS, "|")})\\s*=\\s*(?:["']([^"']+)["']|\\{\\s*["']([^"']+)["']\\s*\\})`,
	"g",
)

export function extractCatalogKeyRefs(content: string): CatalogKeyRef[] {
	const refs: CatalogKeyRef[] = []

	for (const tagMatch of Str.matchAll(TAG_RE)(content)) {
		const component = tagMatch[1]
		const attrs = tagMatch[2]
		const tagIndex = tagMatch.index

		if (
			!(Predicate.isNotNullish(component) && Predicate.isTruthy(component)) ||
			Predicate.isNullish(attrs) ||
			Predicate.isNullish(tagIndex)
		)
			continue

		const attrsOffset = tagIndex + 1 + component.length

		for (const attrMatch of Str.matchAll(new RegExp(ATTR_RE.source, "g"))(attrs)) {
			const prop = attrMatch[1]
			const value = attrMatch[2] ?? attrMatch[3]
			const attrIndex = attrMatch.index

			if (
				!isCatalogKeyProp(prop) ||
				!(Predicate.isNotNullish(value) && Predicate.isTruthy(value)) ||
				Predicate.isNullish(attrIndex)
			)
				continue

			refs.push({
				component,
				prop,
				value,
				line: lineNumberAt(content, attrsOffset + attrIndex),
			})
		}
	}

	return refs
}

export function catalogKeyFailureMessage(label: string, ref: CatalogKeyRef): string {
	return `${label}:${ref.line} <${ref.component} ${ref.prop}="${ref.value}" /> is not a valid catalog key`
}

export function invalidCatalogKeyMessages(label: string, content: string): string[] {
	const messages: string[] = []

	for (const ref of extractCatalogKeyRefs(content)) {
		if (!catalogKeyExists(ref.prop, ref.value)) {
			messages.push(catalogKeyFailureMessage(label, ref))
		}
	}

	return messages
}

export function loadMdxTooltipSources(): TooltipSourceFile[] {
	return Arr.map(loadMdxCorpus(), file => ({ label: file.label, content: file.content }))
}

export function loadTsxTooltipSources(): TooltipSourceFile[] {
	return Arr.map(listTsxSourceFiles(), absolutePath => ({
		label: Str.slice(process.cwd().length + 1)(absolutePath),
		content: readFileSync(absolutePath, "utf8"),
	}))
}

function listTsxSourceFiles(): string[] {
	const files: string[] = []

	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name)

			if (entry.isDirectory()) walk(path)
			else if (Str.endsWith(".tsx")(entry.name)) files.push(path)
		}
	}

	walk(SRC_DIR)

	return files.sort()
}

function isCatalogKeyProp(value: string | undefined): value is CatalogKeyProp {
	return Schema.is(Schema.Literals(CATALOG_KEY_PROPS))(value)
}

function catalogKeyExists(prop: CatalogKeyProp, key: string): boolean {
	return Match.value(prop).pipe(
		Match.when("perkKey", () => Option.isSome(getPerkByKey(key))),
		Match.when("gobblegumKey", () => Option.isSome(getGobblegumByKey(key))),
		Match.when("zombieKey", () => Option.isSome(getZombieByKey(key))),
		Match.when("ammoModKey", () => Option.isSome(getAmmoModByKey(key))),
		Match.when("augmentKey", () => Option.isSome(getAugmentByKey(key))),
		Match.when("elixirKey", () => Option.isSome(getElixirByKey(key))),
		Match.when("cardKey", () => Option.isSome(getFateAndFortuneCardByKey(key))),
		Match.when("fieldUpgradeKey", () => Option.isSome(getFieldUpgradeByKey(key))),
		Match.when("weaponBuildKey", () => Option.isSome(getWeaponBuildByKey(key))),
		Match.when("game", () => Option.isSome(getGameByKey(key))),
		Match.exhaustive,
	)
}

function lineNumberAt(content: string, index: number): number {
	return Str.split(Str.slice(0, index)(content), "\n").length
}
