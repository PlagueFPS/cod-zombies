import { variantWebPath, type VariantWidth } from "@/lib/image-variant-paths"
import { VARIANT_WIDTHS } from "@/types/generated/image-variants.gen"

export interface GenImgAttrs {
	src: string
	srcSet: string | undefined
	sizes: string | undefined
}

function getAvailableVariantWidths(src: string): readonly VariantWidth[] {
	if (src.startsWith("http://") || src.startsWith("https://")) return []
	const widths = VARIANT_WIDTHS[src as keyof typeof VARIANT_WIDTHS]
	return widths ?? []
}

export function generateImgAttrs(src: string, unoptimized: boolean, sizes?: string): GenImgAttrs {
	if (unoptimized) return { srcSet: undefined, sizes: undefined, src }

	const available = getAvailableVariantWidths(src)
	if (available.length === 0) {
		return { src, srcSet: undefined, sizes }
	}

	const srcSet = available.map(w => `${variantWebPath(src, w)} ${w}w`).join(", ")
	const largest = available.at(-1)!

	return {
		sizes,
		srcSet,
		src: variantWebPath(src, largest),
	}
}
