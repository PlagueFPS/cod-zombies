/** Pixels above the `<img>` bottom edge (inside the image area). */
export const CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX = 12

/** Ignore bbox reads before layout resolves (FeaturedImage fades in; lazy decode). */
export const CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX = 4

/** `bottom` offset for slide indicators anchored to the first slide image. */
export function carouselIndicatorBottomPx(
	rootRect: Pick<DOMRectReadOnly, "bottom">,
	imgRect: Pick<DOMRectReadOnly, "bottom">,
	insetPx = CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
): number {
	return rootRect.bottom - imgRect.bottom + insetPx
}
