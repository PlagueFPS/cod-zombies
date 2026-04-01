import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Layer } from "effect"
import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { ImageOptimizationError, optimizeAssetsEffect } from "@/scripts/image-optimization"
import { expectCauseTaggedError, expectExitFailure, expectExitSuccess } from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

async function writePng(path: string, width: number, height: number) {
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
	writeFileSync(path, buf)
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

	test("optimizes small PNG to webp (optimize-only branch)", async () => {
		await writePng(join(root, "newassets", "small.png"), 100, 100)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: false,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const files = readdirSync(join(root, "out"))
		expect(files).toContain("small.webp")
		const meta = await sharp(readFileSync(join(root, "out", "small.webp"))).metadata()
		expect(meta.format).toBe("webp")
	})

	test("map flag produces 2048-wide webp", async () => {
		await writePng(join(root, "newassets", "map.png"), 3000, 500)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: true,
			noResize: false,
			preview: false,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "map.webp"))).metadata()
		expect(meta.width).toBe(2048)
	})

	test("preview flag resizes to 640x360", async () => {
		await writePng(join(root, "newassets", "pv.png"), 800, 600)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: true,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "pv.webp"))).metadata()
		expect(meta.width).toBe(640)
		expect(meta.height).toBe(360)
	})

	test("icon flag resizes to 128x128", async () => {
		await writePng(join(root, "newassets", "ic.png"), 400, 400)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: false,
			icon: true,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "ic.webp"))).metadata()
		expect(meta.width).toBe(128)
		expect(meta.height).toBe(128)
	})

	test("wide image without flags uses resize-and-optimize branch", async () => {
		await writePng(join(root, "newassets", "wide.png"), 2000, 800)
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: false,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		const meta = await sharp(readFileSync(join(root, "out", "wide.webp"))).metadata()
		expect(meta.width).toBe(1920)
	})

	test("skips non-image extensions", async () => {
		writeFileSync(join(root, "newassets", "readme.txt"), "nope")
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: false,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)
		expect(readdirSync(join(root, "out"))).toHaveLength(0)
	})

	test("fails with ImageOptimizationError when image is invalid", async () => {
		writeFileSync(join(root, "newassets", "bad.png"), Buffer.from("not a png"))
		const program = optimizeAssetsEffect({
			dir: "./out",
			source: "./newassets",
			map: false,
			noResize: false,
			preview: false,
			icon: false,
		}).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "ImageOptimizationError", (e: ImageOptimizationError) =>
			e.message.includes("Failed to read image metadata"),
		)
	})
})
