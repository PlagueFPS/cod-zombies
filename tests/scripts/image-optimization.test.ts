import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Layer } from "effect"
import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { ImageOptimizationError, optimizeAssetsEffect } from "@/scripts/image-optimization"
import {
	getCategoryFromRelativePath,
	getVariantWidths,
	shouldGenerateVariants,
	variantFileName,
	variantWebPath,
} from "@/scripts/image-optimization-utils"
import { expectCauseTaggedError, expectExitFailure, expectExitSuccess } from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

async function writePng(filePath: string, width: number, height: number) {
	const buf = await sharp({
		create: {
			width,
			height,
			channels: 3,
			background: { r: 200, g: 100, b: 50 },
		},
	})
		.png()
		.toBuffer()
	writeFileSync(filePath, buf)
}

function listFilesRecursive(dir: string, base = dir): string[] {
	const entries = readdirSync(dir, { withFileTypes: true })
	const files: string[] = []
	for (const entry of entries) {
		const full = join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...listFilesRecursive(full, base))
		} else {
			files.push(full.slice(base.length + 1))
		}
	}
	return files
}

describe("image-optimization-utils", () => {
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

	test("variantFileName and variantWebPath", () => {
		expect(variantFileName("foo", 384)).toBe("foo-384.webp")
		expect(variantWebPath("/maps/foo.webp", 1200)).toBe("/maps/foo-1200.webp")
	})
})

describe("optimizeAssetsEffect", () => {
	let prevCwd: string
	let root: string

	beforeEach(async () => {
		prevCwd = process.cwd()
		root = mkdtempSync(join(tmpdir(), "codz-opt-"))
		mkdirSync(join(root, "newassets"), { recursive: true })
		mkdirSync(join(root, "out"), { recursive: true })
		process.chdir(root)
	})

	afterEach(() => {
		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("excluded category produces single webp", async () => {
		mkdirSync(join(root, "newassets", "perks"), { recursive: true })
		await writePng(join(root, "newassets", "perks", "foo.png"), 400, 400)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out"))
		expect(files).toEqual(["perks/foo.webp"])
	})

	test("large variant source produces base and both variants", async () => {
		mkdirSync(join(root, "newassets", "maps"), { recursive: true })
		await writePng(join(root, "newassets", "maps", "big.png"), 2000, 800)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out")).sort()
		expect(files).toEqual(["maps/big-1200.webp", "maps/big-384.webp", "maps/big.webp"])
		const meta1200 = await sharp(
			readFileSync(join(root, "out", "maps", "big-1200.webp")),
		).metadata()
		expect(meta1200.width).toBe(1200)
	})

	test("medium variant source produces base and 384 only", async () => {
		mkdirSync(join(root, "newassets", "zombies"), { recursive: true })
		await writePng(join(root, "newassets", "zombies", "med.png"), 800, 600)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out")).sort()
		expect(files).toEqual(["zombies/med-384.webp", "zombies/med.webp"])
	})

	test("small variant source produces base only", async () => {
		mkdirSync(join(root, "newassets", "previews"), { recursive: true })
		await writePng(join(root, "newassets", "previews", "small.png"), 200, 200)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out"))
		expect(files).toEqual(["previews/small.webp"])
	})

	test("nested content path preserves directory structure", async () => {
		mkdirSync(join(root, "newassets", "content", "map"), { recursive: true })
		await writePng(join(root, "newassets", "content", "map", "img.png"), 1500, 900)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out")).sort()
		expect(files).toEqual([
			"content/map/img-1200.webp",
			"content/map/img-384.webp",
			"content/map/img.webp",
		])
	})

	test("does not upscale small images in variant categories", async () => {
		mkdirSync(join(root, "newassets", "maps"), { recursive: true })
		await writePng(join(root, "newassets", "maps", "tiny.png"), 300, 200)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out"))
		expect(files).toEqual(["maps/tiny.webp"])
	})

	test("skips non-image extensions", async () => {
		writeFileSync(join(root, "newassets", "readme.txt"), "nope")
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		expect(listFilesRecursive(join(root, "out"))).toHaveLength(0)
	})

	test("fails with ImageOptimizationError when image is invalid", async () => {
		writeFileSync(join(root, "newassets", "bad.png"), Buffer.from("not a png"))
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ImageOptimizationError", (e: ImageOptimizationError) =>
			e.message.includes("Failed to read image metadata"),
		)
	})
})
