import type { ImagePaths } from "@/types/generated/image-paths.gen"
import { describe, expect, test } from "vitest"
import {
	buildRichImageInlineProps,
	RICH_IMAGE_INLINE_SIZES,
	RICH_IMAGE_LIGHTBOX_SIZES,
} from "@/lib/rich-image/responsive-sizes"

describe("RichImage responsive sizes", () => {
	test("inline sizes use full viewport width up to 1200px (regression guard for #341)", () => {
		expect(RICH_IMAGE_INLINE_SIZES).toBe("(max-width: 828px) 100vw, 1200px")
		expect(RICH_IMAGE_INLINE_SIZES).not.toContain("calc(100vw - 16px)")
		expect(RICH_IMAGE_INLINE_SIZES).not.toContain("776px")
	})

	test("lightbox sizes use full viewport width up to 1920px", () => {
		expect(RICH_IMAGE_LIGHTBOX_SIZES).toBe("(max-width: 1920px) 100vw, 1920px")
		expect(RICH_IMAGE_LIGHTBOX_SIZES).not.toContain("calc(100vw - 16px)")
	})

	test("buildRichImageInlineProps wires featured image and inline sizes", () => {
		const image = "/content/ashes-of-the-damned/aotd-war-hero.webp" as ImagePaths
		expect(buildRichImageInlineProps(image)).toEqual({
			featuredImage: image,
			sizes: RICH_IMAGE_INLINE_SIZES,
		})
	})
})
