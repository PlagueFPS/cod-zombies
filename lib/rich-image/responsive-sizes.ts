import type { ImagePaths } from "@/types/generated/image-paths.gen"
import type { ImageProps } from "@/types/images"

/** Inline guide image `sizes` — bumped in #341 for sharper responsive loading. */
export const RICH_IMAGE_INLINE_SIZES = "(max-width: 828px) 100vw, 1200px"

/** Lightbox / zoom dialog image `sizes`. */
export const RICH_IMAGE_LIGHTBOX_SIZES = "(max-width: 1920px) 100vw, 1920px"

export function buildRichImageInlineProps(image: ImagePaths): ImageProps {
	return {
		featuredImage: image,
		sizes: RICH_IMAGE_INLINE_SIZES,
	}
}
