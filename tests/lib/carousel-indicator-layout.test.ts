import { describe, expect, test } from "vitest"
import { resolveCarouselIndicatorLayout } from "@/lib/embla-carousel/carousel-indicator-layout"
import { CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX } from "@/lib/embla-carousel/carousel-indicator-position"

describe("resolveCarouselIndicatorLayout", () => {
	test("uses fallback when the first slide has no image", () => {
		expect(
			resolveCarouselIndicatorLayout(undefined, { bottom: 500 }, { bottom: 0, width: 0, height: 0 }),
		).toEqual({ type: "fallback" })
	})

	test("defers while bbox is tiny and the image has not finished loading", () => {
		expect(
			resolveCarouselIndicatorLayout(
				{ complete: false },
				{ bottom: 500 },
				{ bottom: 400, width: 2, height: 2 },
			),
		).toEqual({ type: "defer" })
	})

	test("uses fallback when bbox stays tiny after the image reports complete", () => {
		expect(
			resolveCarouselIndicatorLayout(
				{ complete: true },
				{ bottom: 500 },
				{ bottom: 400, width: 2, height: 2 },
			),
		).toEqual({ type: "fallback" })
	})

	test("anchors to the image bottom when layout box is large enough", () => {
		const rootRect = { bottom: 500 }
		const imgRect = { bottom: 400, width: 320, height: 180 }
		expect(resolveCarouselIndicatorLayout({ complete: true }, rootRect, imgRect)).toEqual({
			type: "anchored",
			bottomPx: 100 + CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
		})
	})
})
