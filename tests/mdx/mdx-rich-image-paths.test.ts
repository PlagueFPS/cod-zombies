import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, test } from "vitest"
import {
	extractRichImageRefs,
	loadMdxRichImageSources,
	missingRichImageMessages,
	type RichImageSourceFile,
} from "@/tests/mdx/mdx-rich-image-paths"

describe("extractRichImageRefs", () => {
	test("collects quoted image paths with line numbers", () => {
		const content = [
			"Intro.",
			'<RichImage image="/content/map/shot.webp" caption="On the table" />',
			"<RichImage image='/content/map/other.webp' caption='Shelf' />",
		].join("\n")

		expect(extractRichImageRefs(content)).toEqual([
			{ image: "/content/map/shot.webp", line: 2 },
			{ image: "/content/map/other.webp", line: 3 },
		])
	})

	test("collects image paths from multiline tags and JSX string literals", () => {
		const content = [
			"<RichImage",
			'  image={"/content/map/coin.webp"}',
			'  caption="Under the stairs"',
			"/>",
		].join("\n")

		expect(extractRichImageRefs(content)).toEqual([{ image: "/content/map/coin.webp", line: 1 }])
	})

	test("ignores image attributes on other components", () => {
		const content = '<FeaturedImage featuredImage="/content/map/shot.webp" />'

		expect(extractRichImageRefs(content)).toEqual([])
	})

	test("records a missing static image path", () => {
		const content = '<RichImage caption="No source" />'

		expect(extractRichImageRefs(content)).toEqual([{ image: undefined, line: 1 }])
	})
})

describe("missingRichImageMessages", () => {
	let publicDir: string | undefined

	afterEach(() => {
		if (publicDir) rmSync(publicDir, { recursive: true, force: true })
		publicDir = undefined
	})

	test("returns empty when every static image exists in public", () => {
		publicDir = createPublicImage("content/map/shot.webp")
		const content = '<RichImage image="/content/map/shot.webp" caption="Shot" />'

		expect(missingRichImageMessages("src/content/example.mdx", content, publicDir)).toEqual([])
	})

	test("reports images that are not files in public", () => {
		publicDir = mkdtempSync(join(tmpdir(), "codz-rich-image-"))

		const content = [
			'<RichImage image="/content/map/missing.webp" caption="Missing" />',
			'<RichImage image="../package.json" caption="Escapes public" />',
			'<RichImage caption="No source" />',
		].join("\n")

		expect(missingRichImageMessages("src/content/example.mdx", content, publicDir)).toEqual([
			'src/content/example.mdx:1 <RichImage image="/content/map/missing.webp" /> does not exist in public/',
			'src/content/example.mdx:2 <RichImage image="../package.json" /> does not exist in public/',
			"src/content/example.mdx:3 <RichImage /> is missing a static image path",
		])
	})
})

describe("MDX RichImage path integrity", () => {
	test("every RichImage image path exists in public", () => {
		const sources: RichImageSourceFile[] = loadMdxRichImageSources()
		const failures: string[] = []
		let imageCount = 0

		for (const file of sources) {
			const refs = extractRichImageRefs(file.content)
			imageCount += refs.length
			failures.push(...missingRichImageMessages(file.label, file.content))
		}

		expect(imageCount).toBeGreaterThan(0)
		expect(failures).toEqual([])
	})
})

// Helpers

function createPublicImage(relativePath: string): string {
	const publicDir = mkdtempSync(join(tmpdir(), "codz-rich-image-"))
	const filePath = join(publicDir, relativePath)
	mkdirSync(join(filePath, ".."), { recursive: true })
	writeFileSync(filePath, "")

	return publicDir
}
