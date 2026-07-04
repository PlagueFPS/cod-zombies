import { HashSet } from "effect"
import { VARIANT_WIDTHS_LIST, type VariantWidth } from "@/lib/image-variant-paths"

/** Top-level `public/` dirs that skip responsive width variants during optimization. */
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

/**
 * Top-level `public/` dirs omitted from `image-paths.gen.ts` union types.
 * `content` still gets variants and `VARIANT_WIDTHS` entries — paths are typed via `content-paths.gen.ts`.
 */
export const EXCLUDED_FROM_IMAGE_PATH_TYPES = HashSet.make("content", "opengraph-images")

export function getCategoryFromRelativePath(relativePath: string): string | null {
	const segment = relativePath.split("/")[0]
	return segment && !segment.includes(".") ? segment : null
}

export function shouldGenerateVariants(category: string | null): boolean {
	if (category === null) return true
	return !HashSet.has(NO_VARIANT_CATEGORIES, category)
}

export function getVariantWidths(sourceWidth: number): readonly VariantWidth[] {
	return VARIANT_WIDTHS_LIST.filter(width => sourceWidth > width)
}

export function variantFileName(baseName: string, width: VariantWidth): string {
	return `${baseName}-${width}.webp`
}
