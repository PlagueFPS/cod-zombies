import { HashSet } from "effect"

export const NO_VARIANT_CATEGORIES = HashSet.make(
	"ammo-mods",
	"augments",
	"elixirs",
	"field-upgrades",
	"games",
	"gobblegums",
	"icons",
	"layers",
	"opengraph-images",
	"perks",
	"relics",
	"weapons",
)

export const VARIANT_WIDTHS_LIST = [384, 1200] as const
export type VariantWidth = (typeof VARIANT_WIDTHS_LIST)[number]

const VARIANT_SUFFIX_RE = /-(384|1200)\.webp$/i

export function getCategoryFromRelativePath(relativePath: string): string | null {
	const segment = relativePath.split("/")[0]
	return segment && !segment.includes(".") ? segment : null
}

export function shouldGenerateVariants(category: string | null): boolean {
	if (category === null) return true
	return !HashSet.has(NO_VARIANT_CATEGORIES, category)
}

export function getVariantWidths(sourceWidth: number): readonly VariantWidth[] {
	if (sourceWidth > 1200) return [384, 1200]
	if (sourceWidth > 384) return [384]
	return []
}

export function variantFileName(baseName: string, width: VariantWidth): string {
	return `${baseName}-${width}.webp`
}

export function isVariantImagePath(webPath: string): boolean {
	return VARIANT_SUFFIX_RE.test(webPath)
}

export function variantWebPath(baseWebPath: string, width: VariantWidth): string {
	const dot = baseWebPath.lastIndexOf(".")
	if (dot === -1) return `${baseWebPath}-${width}`
	return `${baseWebPath.slice(0, dot)}-${width}${baseWebPath.slice(dot)}`
}

export function buildVariantUrl(src: string, width: number): string {
	if (width === 384 || width === 1200) {
		return variantWebPath(src, width)
	}
	return variantWebPath(src, width as VariantWidth)
}
