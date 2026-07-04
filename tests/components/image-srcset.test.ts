import { describe, expect, it, vi } from "vitest"
import { generateImgAttrs } from "@/lib/generate-img-attrs"

vi.mock("@/types/generated/image-variants.gen", () => ({
	VARIANT_WIDTHS: {
		"/maps/big.webp": [384, 1200],
		"/maps/medium.webp": [384],
		"/perks/juggernog.webp": [],
	},
}))

describe("generateImgAttrs", () => {
	it("returns base src only for external URLs", () => {
		expect(generateImgAttrs("https://example.com/x.png", false)).toEqual({
			src: "https://example.com/x.png",
			srcSet: undefined,
			sizes: undefined,
		})
	})

	it("returns base src only when no variants exist", () => {
		expect(generateImgAttrs("/perks/juggernog.webp", false, "64px")).toEqual({
			src: "/perks/juggernog.webp",
			srcSet: undefined,
			sizes: "64px",
		})
	})

	it("builds srcset from partial variant set", () => {
		expect(generateImgAttrs("/maps/medium.webp", false, "420px")).toEqual({
			src: "/maps/medium-384.webp",
			srcSet: "/maps/medium-384.webp 384w",
			sizes: "420px",
		})
	})

	it("builds srcset from full variant set", () => {
		expect(generateImgAttrs("/maps/big.webp", false, "100vw")).toEqual({
			src: "/maps/big-1200.webp",
			srcSet: "/maps/big-384.webp 384w, /maps/big-1200.webp 1200w",
			sizes: "100vw",
		})
	})

	it("skips srcset when unoptimized", () => {
		expect(generateImgAttrs("/maps/big.webp", true, "100vw")).toEqual({
			src: "/maps/big.webp",
			srcSet: undefined,
			sizes: undefined,
		})
	})
})
