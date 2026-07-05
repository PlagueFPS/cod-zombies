import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Exit, Layer } from "effect"
import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import {
	ImageOptimizationError,
	optimizeAssetsEffect,
	requireImageWidth,
} from "@/scripts/image-optimization"
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
		const meta = await sharp(readFileSync(join(root, "out", "perks", "foo.webp"))).metadata()
		expect(meta.format).toBe("webp")
	})

	test("large variant source produces base and both variants as webp", async () => {
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
		expect(meta1200.format).toBe("webp")
		const meta384 = await sharp(readFileSync(join(root, "out", "maps", "big-384.webp"))).metadata()
		expect(meta384.format).toBe("webp")
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
		expect(Exit.isFailure(exit)).toBe(true)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ImageOptimizationError", (e: ImageOptimizationError) =>
			e.message.includes("Failed to read image metadata"),
		)
	})

	test("requireImageWidth fails when metadata has no width", async () => {
		const exit = await Effect.runPromiseExit(requireImageWidth({}, "maps/missing.png"))
		expect(Exit.isFailure(exit)).toBe(true)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ImageOptimizationError", (e: ImageOptimizationError) =>
			e.message.includes("no width metadata"),
		)
	})

	test("keeps source file when source and output directories are the same", async () => {
		mkdirSync(join(root, "public", "maps"), { recursive: true })
		await writePng(join(root, "public", "maps", "big.png"), 2000, 800)
		const program = optimizeAssetsEffect({
			dir: "./public",
			source: "./public",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "public")).sort()
		expect(files).toEqual([
			"maps/big-1200.webp",
			"maps/big-384.webp",
			"maps/big.png",
			"maps/big.webp",
		])
		expect(existsSync(join(root, "oldassets"))).toBe(false)
	})

	test("does not reprocess existing variant files in place", async () => {
		mkdirSync(join(root, "public", "maps"), { recursive: true })
		await writePng(join(root, "public", "maps", "big.png"), 2000, 800)
		const buf384 = await sharp({
			create: { width: 384, height: 200, channels: 3, background: { r: 0, g: 0, b: 0 } },
		})
			.webp()
			.toBuffer()
		writeFileSync(join(root, "public", "maps", "big-384.webp"), buf384)

		const program = optimizeAssetsEffect({
			dir: "./public",
			source: "./public",
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		expect(listFilesRecursive(join(root, "public")).sort()).toEqual([
			"maps/big-1200.webp",
			"maps/big-384.webp",
			"maps/big.png",
			"maps/big.webp",
		])
	})

	test("preview mode resizes to 640w with no variants", async () => {
		mkdirSync(join(root, "newassets", "maps"), { recursive: true })
		await writePng(join(root, "newassets", "maps", "big.png"), 2000, 800)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			preview: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out"))
		expect(files).toEqual(["maps/big.webp"])
		const meta = await sharp(readFileSync(join(root, "out", "maps", "big.webp"))).metadata()
		expect(meta.width).toBe(640)
		expect(meta.format).toBe("webp")
	})

	test("preview mode upscales small images to 640w", async () => {
		mkdirSync(join(root, "newassets", "previews"), { recursive: true })
		await writePng(join(root, "newassets", "previews", "small.png"), 200, 200)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			preview: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "previews", "small.webp"))).metadata()
		expect(meta.width).toBe(640)
	})

	test("map mode resizes to 2048w with no variants", async () => {
		mkdirSync(join(root, "newassets", "maps"), { recursive: true })
		await writePng(join(root, "newassets", "maps", "huge.png"), 4000, 1600)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = listFilesRecursive(join(root, "out"))
		expect(files).toEqual(["maps/huge.webp"])
		const meta = await sharp(readFileSync(join(root, "out", "maps", "huge.webp"))).metadata()
		expect(meta.width).toBe(2048)
		expect(meta.format).toBe("webp")
	})

	test("map mode does not upscale images narrower than 2048w", async () => {
		mkdirSync(join(root, "newassets", "maps"), { recursive: true })
		await writePng(join(root, "newassets", "maps", "med.png"), 1500, 900)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "maps", "med.webp"))).metadata()
		expect(meta.width).toBe(1500)
	})

	test("fails when preview and map flags are both set", async () => {
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			preview: true,
			map: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expect(Exit.isFailure(exit)).toBe(true)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ImageOptimizationError", (e: ImageOptimizationError) =>
			e.message.includes("Cannot use --preview and --map together"),
		)
	})
})
