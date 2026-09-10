import { describe, expect, it } from "vitest"
import { generateImgAttrs } from "@/lib/generate-img-attrs"

const variantWidths = {
	"/maps/big.webp": [384, 1200],
	"/maps/medium.webp": [384],
	"/perks/juggernog.webp": [],
} as const

describe("generateImgAttrs", () => {
	it("returns base src only for external URLs", () => {
		expect(generateImgAttrs("https://example.com/x.png", false, undefined, variantWidths)).toEqual({
			src: "https://example.com/x.png",
			srcSet: undefined,
			sizes: undefined,
		})
	})

	it("returns base src only when no variants exist", () => {
		expect(generateImgAttrs("/perks/juggernog.webp", false, "64px", variantWidths)).toEqual({
			src: "/perks/juggernog.webp",
			srcSet: undefined,
			sizes: "64px",
		})
	})

	it("builds srcset from partial variant set", () => {
		expect(generateImgAttrs("/maps/medium.webp", false, "420px", variantWidths)).toEqual({
			src: "/maps/medium.webp",
			srcSet: "/maps/medium-384.webp 384w",
			sizes: "420px",
		})
	})

	it("builds srcset from full variant set", () => {
		expect(generateImgAttrs("/maps/big.webp", false, "100vw", variantWidths)).toEqual({
			src: "/maps/big.webp",
			srcSet: "/maps/big-384.webp 384w, /maps/big-1200.webp 1200w",
			sizes: "100vw",
		})
	})

	it("skips srcset when unoptimized", () => {
		expect(generateImgAttrs("/maps/big.webp", true, "100vw", variantWidths)).toEqual({
			src: "/maps/big.webp",
			srcSet: undefined,
			sizes: undefined,
		})
	})
})
