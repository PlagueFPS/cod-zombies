import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { Option } from "effect"
import { getAmmoModByKey } from "@/data/ammo-mods"
import { getAugmentByKey } from "@/data/augments"
import { getElixirByKey } from "@/data/elixirs"
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

const TAG_RE = new RegExp(`<(${TOOLTIP_COMPONENTS.join("|")})\\b([\\s\\S]*?)(?:/>|>)`, "g")

const ATTR_RE = new RegExp(
	`\\b(${CATALOG_KEY_PROPS.join("|")})\\s*=\\s*(?:["']([^"']+)["']|\\{\\s*["']([^"']+)["']\\s*\\})`,
	"g",
)

export function extractCatalogKeyRefs(content: string): CatalogKeyRef[] {
	const refs: CatalogKeyRef[] = []

	for (const tagMatch of content.matchAll(TAG_RE)) {
		const component = tagMatch[1]
		const attrs = tagMatch[2]
		const tagIndex = tagMatch.index

		if (!component || attrs == null || tagIndex == null) continue

		const attrsOffset = tagIndex + 1 + component.length

		for (const attrMatch of attrs.matchAll(new RegExp(ATTR_RE.source, "g"))) {
			const prop = attrMatch[1]
			const value = attrMatch[2] ?? attrMatch[3]
			const attrIndex = attrMatch.index

			if (!isCatalogKeyProp(prop) || !value || attrIndex == null) continue

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
	return loadMdxCorpus().map(file => ({ label: file.label, content: file.content }))
}

export function loadTsxTooltipSources(): TooltipSourceFile[] {
	return listTsxSourceFiles().map(absolutePath => ({
		label: absolutePath.slice(process.cwd().length + 1),
		content: readFileSync(absolutePath, "utf8"),
	}))
}

function listTsxSourceFiles(): string[] {
	const files: string[] = []

	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name)

			if (entry.isDirectory()) walk(path)
			else if (entry.name.endsWith(".tsx")) files.push(path)
		}
	}

	walk(SRC_DIR)

	return files.sort()
}

function isCatalogKeyProp(value: string | undefined): value is CatalogKeyProp {
	return CATALOG_KEY_PROPS.some(prop => prop === value)
}

function catalogKeyExists(prop: CatalogKeyProp, key: string): boolean {
	switch (prop) {
		case "perkKey":
			return Option.isSome(getPerkByKey(key))
		case "gobblegumKey":
			return Option.isSome(getGobblegumByKey(key))
		case "zombieKey":
			return Option.isSome(getZombieByKey(key))
		case "ammoModKey":
			return Option.isSome(getAmmoModByKey(key))
		case "augmentKey":
			return Option.isSome(getAugmentByKey(key))
		case "elixirKey":
			return Option.isSome(getElixirByKey(key))
		case "fieldUpgradeKey":
			return Option.isSome(getFieldUpgradeByKey(key))
		case "weaponBuildKey":
			return Option.isSome(getWeaponBuildByKey(key))
		case "game":
			return Option.isSome(getGameByKey(key))
	}
}

function lineNumberAt(content: string, index: number): number {
	return content.slice(0, index).split("\n").length
}
