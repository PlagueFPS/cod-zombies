import { describe, expect, it } from "vitest"
import { generateImgAttrs } from "@/lib/generate-img-attrs"

const imageVariants = {
	"/maps/big.webp": { sourceWidth: 1917, widths: [384, 1200] },
	"/maps/medium.webp": { sourceWidth: 800, widths: [384] },
	"/maps/equal.webp": { sourceWidth: 1200, widths: [384, 1200] },
	"/content/map/shot.webp": { sourceWidth: 1773, widths: [1200] },
} as const

describe("generateImgAttrs", () => {
	it("returns base src only for external URLs", () => {
		expect(generateImgAttrs("https://example.com/x.png", undefined, imageVariants)).toEqual({
			src: "https://example.com/x.png",
			srcSet: undefined,
			sizes: undefined,
		})
	})

	it("returns base src only when no variants exist", () => {
		expect(generateImgAttrs("/perks/juggernog.webp", "64px", imageVariants)).toEqual({
			src: "/perks/juggernog.webp",
			srcSet: undefined,
			sizes: "64px",
		})
	})

	it("builds srcset from partial variant set", () => {
		expect(generateImgAttrs("/maps/medium.webp", "420px", imageVariants)).toEqual({
			src: "/maps/medium.webp",
			srcSet: "/maps/medium-384.webp 384w, /maps/medium.webp 800w",
			sizes: "420px",
		})
	})

	it("builds srcset from full variant set", () => {
		expect(generateImgAttrs("/maps/big.webp", "100vw", imageVariants)).toEqual({
			src: "/maps/big.webp",
			srcSet: "/maps/big-384.webp 384w, /maps/big-1200.webp 1200w, /maps/big.webp 1917w",
			sizes: "100vw",
		})
	})

	it("includes the actual source width alongside the remaining content variant", () => {
		expect(generateImgAttrs("/content/map/shot.webp", "100vw", imageVariants)).toEqual({
			src: "/content/map/shot.webp",
			srcSet: "/content/map/shot-1200.webp 1200w, /content/map/shot.webp 1773w",
			sizes: "100vw",
		})
	})

	it("uses the original when a variant has the same width, avoiding duplicate descriptors", () => {
		expect(generateImgAttrs("/maps/equal.webp", "100vw", imageVariants)).toEqual({
			src: "/maps/equal.webp",
			srcSet: "/maps/equal-384.webp 384w, /maps/equal.webp 1200w",
			sizes: "100vw",
		})
	})
})
