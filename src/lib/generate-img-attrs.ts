import { Array as Arr, String as Str, Predicate } from "effect"
import { variantWebPath, type ImageVariantMetadata } from "@/lib/image-variant-paths"
import { IMAGE_VARIANTS } from "@/types/generated/image-variants.gen"

export interface GenImgAttrs {
	src: string
	srcSet: string | undefined
	sizes: string | undefined
}

export type ImageVariantTable = {
	readonly [src: string]: ImageVariantMetadata | undefined
}

export function getImageVariants(
	src: string,
	imageVariants: ImageVariantTable = IMAGE_VARIANTS,
): ImageVariantMetadata | undefined {
	if (Str.startsWith("http://")(src) || Str.startsWith("https://")(src)) return undefined

	return imageVariants[src]
}

export function generateImgAttrs(
	src: string,
	sizes?: string,
	imageVariants: ImageVariantTable = IMAGE_VARIANTS,
): GenImgAttrs {
	const variants = getImageVariants(src, imageVariants)

	if (
		!(Predicate.isNotNullish(variants) && Predicate.isTruthy(variants)) ||
		variants.widths.length === 0
	) {
		return { src, srcSet: undefined, sizes }
	}

	const candidates = Arr.flatMap(variants.widths, width =>
		width === variants.sourceWidth ? [] : [`${variantWebPath(src, width)} ${width}w`],
	)

	candidates.push(`${src} ${variants.sourceWidth}w`)

	return {
		sizes,
		srcSet: Arr.join(candidates, ", "),
		src,
	}
}
