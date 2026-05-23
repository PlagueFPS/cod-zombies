import {
	CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX,
	carouselIndicatorBottomPx,
} from "@/lib/embla-carousel/carousel-indicator-position"

export type CarouselIndicatorLayoutDecision =
	| { type: "defer" }
	| { type: "fallback" }
	| { type: "anchored"; bottomPx: number }

/**
 * Decides slide-indicator placement from the first slide image layout box.
 * Returns `defer` while a tiny bbox may still be settling (lazy decode / fade-in).
 */
export function resolveCarouselIndicatorLayout(
	img: Pick<HTMLImageElement, "complete"> | null | undefined,
	rootRect: Pick<DOMRectReadOnly, "bottom">,
	imgRect: Pick<DOMRectReadOnly, "bottom" | "width" | "height">,
	minBoxPx = CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX,
): CarouselIndicatorLayoutDecision {
	if (img == null) return { type: "fallback" }

	const boxTooSmall = imgRect.height < minBoxPx || imgRect.width < minBoxPx
	if (boxTooSmall) {
		return img.complete ? { type: "fallback" } : { type: "defer" }
	}

	return {
		type: "anchored",
		bottomPx: carouselIndicatorBottomPx(rootRect, imgRect),
	}
}
