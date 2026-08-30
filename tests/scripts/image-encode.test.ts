import sharp from "sharp"
import { describe, expect, it } from "vitest"
import { encodeWebp } from "@/scripts/image-optimization"

describe("encodeWebp", () => {
	it("encodes base images as webp", async () => {
		const image = sharp({
			create: { width: 100, height: 100, channels: 3, background: { r: 10, g: 20, b: 30 } },
		})
		const buffer = await encodeWebp(image)
		const meta = await sharp(buffer).metadata()
		expect(meta.format).toBe("webp")
	})

	it("encodes resized variants as webp", async () => {
		const image = sharp({
			create: { width: 800, height: 600, channels: 3, background: { r: 10, g: 20, b: 30 } },
		})
		const buffer = await encodeWebp(image, 384)
		const meta = await sharp(buffer).metadata()
		expect(meta.format).toBe("webp")
		expect(meta.width).toBe(384)
	})

	it("encodes square icons when height is provided", async () => {
		const image = sharp({
			create: { width: 400, height: 300, channels: 3, background: { r: 10, g: 20, b: 30 } },
		})
		const buffer = await encodeWebp(image, 256, { height: 256, withoutEnlargement: false })
		const meta = await sharp(buffer).metadata()
		expect(meta.format).toBe("webp")
		expect(meta.width).toBe(256)
		expect(meta.height).toBe(256)
	})
})
