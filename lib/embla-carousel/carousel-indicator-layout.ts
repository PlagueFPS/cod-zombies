import {
	CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX,
	carouselIndicatorBottomPx,
} from "@/lib/embla-carousel/carousel-indicator-position"

export type CarouselIndicatorLayout =
	| { readonly kind: "fallback" }
	| { readonly kind: "wait" }
	| { readonly kind: "anchored"; readonly bottomPx: number }

/**
 * Decides whether carousel slide indicators use fallback placement, wait for layout,
 * or anchor to the first slide image (see {@link CustomCarousel}).
 */
export function resolveCarouselIndicatorLayout(args: {
	readonly hasImage: boolean
	readonly imageBox: Pick<DOMRectReadOnly, "width" | "height" | "bottom"> | null
	readonly imageComplete: boolean
	readonly rootBottom: number
}): CarouselIndicatorLayout {
	if (!args.hasImage) return { kind: "fallback" }

	const box = args.imageBox
	if (!box) return { kind: "fallback" }

	if (
		box.height < CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX ||
		box.width < CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX
	) {
		return args.imageComplete ? { kind: "fallback" } : { kind: "wait" }
	}

	return {
		kind: "anchored",
		bottomPx: carouselIndicatorBottomPx({ bottom: args.rootBottom }, { bottom: box.bottom }),
	}
}
