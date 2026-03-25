import { describe, expect, it } from "vitest"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"

describe("scripts/utils", () => {
	it("SUPPORTED_IMAGE_FORMATS includes expected extensions only", () => {
		expect([...SUPPORTED_IMAGE_FORMATS].sort()).toEqual([
			".avif",
			".jpeg",
			".jpg",
			".png",
			".webp",
		])
	})
})
