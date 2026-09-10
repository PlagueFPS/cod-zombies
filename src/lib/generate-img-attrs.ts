import { variantWebPath, type VariantWidth } from "@/lib/image-variant-paths"
import { VARIANT_WIDTHS } from "@/types/generated/image-variants.gen"

export interface GenImgAttrs {
	src: string
	srcSet: string | undefined
	sizes: string | undefined
}

export type VariantWidthTable = {
	readonly [src: string]: readonly VariantWidth[] | undefined
}

function getAvailableVariantWidths(
	src: string,
	variantWidths: VariantWidthTable,
): readonly VariantWidth[] {
	if (src.startsWith("http://") || src.startsWith("https://")) return []

	return variantWidths[src] ?? []
}

export function generateImgAttrs(
	src: string,
	unoptimized: boolean,
	sizes?: string,
	variantWidths: VariantWidthTable = VARIANT_WIDTHS,
): GenImgAttrs {
	if (unoptimized) return { srcSet: undefined, sizes: undefined, src }

	const available = getAvailableVariantWidths(src, variantWidths)

	if (available.length === 0) {
		return { src, srcSet: undefined, sizes }
	}

	const srcSet = available.map(w => `${variantWebPath(src, w)} ${w}w`).join(", ")

	return {
		sizes,
		srcSet,
		src,
	}
}
