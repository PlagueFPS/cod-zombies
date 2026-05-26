import { describe, expect, test } from "vitest"
import { resolveCarouselIndicatorLayout } from "@/lib/embla-carousel/carousel-indicator-layout"
import { CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX } from "@/lib/embla-carousel/carousel-indicator-position"

describe("resolveCarouselIndicatorLayout", () => {
	test("uses fallback when the slide has no image", () => {
		expect(
			resolveCarouselIndicatorLayout({
				hasImage: false,
				imageBox: null,
				imageComplete: false,
				rootBottom: 500,
			}),
		).toEqual({ kind: "fallback" })
	})

	test("waits when the image bbox is too small and loading is incomplete", () => {
		expect(
			resolveCarouselIndicatorLayout({
				hasImage: true,
				imageBox: {
					width: CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX - 1,
					height: 100,
					bottom: 400,
				},
				imageComplete: false,
				rootBottom: 500,
			}),
		).toEqual({ kind: "wait" })
	})

	test("uses fallback when the image bbox stays too small after load completes", () => {
		expect(
			resolveCarouselIndicatorLayout({
				hasImage: true,
				imageBox: {
					width: 100,
					height: CAROUSEL_MIN_IMG_BOX_FOR_LAYOUT_PX - 1,
					bottom: 400,
				},
				imageComplete: true,
				rootBottom: 500,
			}),
		).toEqual({ kind: "fallback" })
	})

	test("anchors to the image bottom when layout box is usable", () => {
		expect(
			resolveCarouselIndicatorLayout({
				hasImage: true,
				imageBox: { width: 200, height: 120, bottom: 380 },
				imageComplete: true,
				rootBottom: 500,
			}),
		).toEqual({ kind: "anchored", bottomPx: 132 })
	})
})
