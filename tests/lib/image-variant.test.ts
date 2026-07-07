import { describe, expect, test } from "vitest"
import { isVariantImagePath, toWebImagePath, variantWebPath } from "@/lib/image-variant-paths"
import {
	getCategoryFromRelativePath,
	getVariantWidths,
	shouldGenerateVariants,
	variantFileName,
} from "@/scripts/image-variant-policy"

describe("image-variant-paths", () => {
	test("toWebImagePath normalizes paths", () => {
		expect(toWebImagePath("maps/foo.webp")).toBe("/maps/foo.webp")
		expect(toWebImagePath("/maps/foo.webp")).toBe("/maps/foo.webp")
	})

	test("isVariantImagePath detects variant suffixes", () => {
		expect(isVariantImagePath("/maps/foo-384.webp")).toBe(true)
		expect(isVariantImagePath("maps/foo-1200.webp")).toBe(true)
		expect(isVariantImagePath("/maps/foo.webp")).toBe(false)
	})

	test("variantWebPath inserts width before extension", () => {
		expect(variantWebPath("/maps/foo.webp", 1200)).toBe("/maps/foo-1200.webp")
	})
})

describe("image-variant-policy", () => {
	test("getCategoryFromRelativePath returns first segment", () => {
		expect(getCategoryFromRelativePath("maps/foo.png")).toBe("maps")
		expect(getCategoryFromRelativePath("content/map/img.png")).toBe("content")
		expect(getCategoryFromRelativePath("foo.png")).toBeNull()
	})

	test("shouldGenerateVariants excludes listed categories", () => {
		expect(shouldGenerateVariants("perks")).toBe(false)
		expect(shouldGenerateVariants("maps")).toBe(true)
		expect(shouldGenerateVariants(null)).toBe(true)
	})

	test("getVariantWidths respects source dimensions", () => {
		expect(getVariantWidths(2000)).toEqual([384, 1200])
		expect(getVariantWidths(800)).toEqual([384])
		expect(getVariantWidths(300)).toEqual([])
	})

	test("variantFileName", () => {
		expect(variantFileName("foo", 384)).toBe("foo-384.webp")
	})
})
