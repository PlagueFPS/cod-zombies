import { describe, expect, test } from "vitest"
import {
	CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
	carouselIndicatorBottomPx,
} from "@/lib/embla-carousel/carousel-indicator-position"

describe("carouselIndicatorBottomPx", () => {
	test("anchors indicators above the image bottom by the configured inset", () => {
		const rootRect = { bottom: 500 }
		const imgRect = { bottom: 400 }
		expect(carouselIndicatorBottomPx(rootRect, imgRect)).toBe(
			100 + CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
		)
	})

	test("uses a taller image box closer to the carousel root bottom", () => {
		const rootRect = { bottom: 600 }
		const imgRect = { bottom: 580 }
		expect(carouselIndicatorBottomPx(rootRect, imgRect)).toBe(
			20 + CAROUSEL_INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
		)
	})

	test("accepts a custom inset override", () => {
		expect(carouselIndicatorBottomPx({ bottom: 100 }, { bottom: 80 }, 4)).toBe(24)
	})
})
