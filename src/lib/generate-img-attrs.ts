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
	if (src.startsWith("http://") || src.startsWith("https://")) return undefined

	return imageVariants[src]
}

export function generateImgAttrs(
	src: string,
	sizes?: string,
	imageVariants: ImageVariantTable = IMAGE_VARIANTS,
): GenImgAttrs {
	const variants = getImageVariants(src, imageVariants)

	if (!variants || variants.widths.length === 0) {
		return { src, srcSet: undefined, sizes }
	}

	const candidates = variants.widths.flatMap(width =>
		width === variants.sourceWidth ? [] : [`${variantWebPath(src, width)} ${width}w`],
	)

	candidates.push(`${src} ${variants.sourceWidth}w`)

	return {
		sizes,
		srcSet: candidates.join(", "),
		src,
	}
}
