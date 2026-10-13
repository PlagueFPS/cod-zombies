import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Exit, Layer } from "effect"
import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { generateImagePaths, ImageMetadataError } from "@/scripts/generate-image-paths"
import {
	expectCauseHasString,
	expectCauseTaggedError,
	expectExitFailure,
	expectExitSuccess,
} from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

describe("generateImagePaths", () => {
	let prevCwd: string

	beforeEach(() => {
		prevCwd = process.cwd()
	})

	afterEach(() => {
		process.chdir(prevCwd)
	})

	test("fails with Exit when public directory is missing", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const cause = expectExitFailure(exit)
		expectCauseHasString(cause, "Public directory does not exist")
		expect(Exit.isFailure(exit)).toBe(true)
		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("sorts root and per-dir image paths; excludes content and opengraph-images", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		mkdirSync(join(root, "public"), { recursive: true })
		writeFileSync(
			join(root, "public", "zebra.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)
		writeFileSync(
			join(root, "public", "alpha.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)

		mkdirSync(join(root, "public", "maps"), { recursive: true })
		writeFileSync(
			join(root, "public", "maps", "b.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)
		writeFileSync(
			join(root, "public", "maps", "a.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)

		mkdirSync(join(root, "public", "content"), { recursive: true })
		writeFileSync(
			join(root, "public", "content", "x.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)

		mkdirSync(join(root, "src", "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "src", "types", "generated", "image-paths.gen.ts"), "utf-8")

		expect(out).toContain("export type RootImagePath =")
		const rootA = out.indexOf("'/alpha.png'")
		const rootZ = out.indexOf("'/zebra.png'")
		expect(rootA).toBeLessThan(rootZ)

		expect(out).toContain("export type MapsImagePath =")
		const mapsA = out.indexOf("'/maps/a.png'")
		const mapsB = out.indexOf("'/maps/b.png'")
		expect(mapsA).toBeLessThan(mapsB)

		expect(out).not.toContain("ContentImagePath")
		expect(out).not.toContain("OpengraphImagesImagePath")

		const variantsOut = readFileSync(
			join(root, "src", "types", "generated", "image-variants.gen.ts"),
			"utf-8",
		)

		expect(variantsOut).toContain("export const IMAGE_VARIANTS")
		expect(variantsOut).not.toContain("sourceWidth:")

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("excludes variant suffix files from ImagePaths and records actual base widths", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		mkdirSync(join(root, "public", "maps"), { recursive: true })
		await writeWebp(join(root, "public", "maps", "big.webp"), 1917)
		await writeWebp(join(root, "public", "maps", "big-384.webp"), 384)
		await writeWebp(join(root, "public", "maps", "big-1200.webp"), 1200)
		mkdirSync(join(root, "public", "content", "map"), { recursive: true })
		await writeWebp(join(root, "public", "content", "map", "shot.webp"), 1773)
		await writeWebp(join(root, "public", "content", "map", "shot-1200.webp"), 1200)
		mkdirSync(join(root, "src", "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "src", "types", "generated", "image-paths.gen.ts"), "utf-8")
		expect(out).toContain("'/maps/big.webp'")
		expect(out).not.toContain("big-384.webp")
		expect(out).not.toContain("big-1200.webp")

		const variantsOut = readFileSync(
			join(root, "src", "types", "generated", "image-variants.gen.ts"),
			"utf-8",
		)

		expect(variantsOut).toContain("'/maps/big.webp': { sourceWidth: 1917, widths: [384, 1200] }")
		expect(variantsOut).toContain("'/content/map/shot.webp': { sourceWidth: 1773, widths: [1200] }")

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("escapes single quotes in path literals", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		mkdirSync(join(root, "public", "maps"), { recursive: true })
		writeFileSync(
			join(root, "public", "maps", "it's-a-trap.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)
		mkdirSync(join(root, "src", "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "src", "types", "generated", "image-paths.gen.ts"), "utf-8")
		expect(out).toContain("\\'")

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("records the source width after EXIF orientation", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		const mapsDir = join(root, "public", "maps")
		mkdirSync(mapsDir, { recursive: true })

		try {
			await sharp({ create: { width: 900, height: 1700, channels: 3, background: "orange" } })
				.withMetadata({ orientation: 6 })
				.webp()
				.toFile(join(mapsDir, "rotated.webp"))
			await writeWebp(join(mapsDir, "rotated-1200.webp"), 1200)

			const exit = await Effect.runPromiseExit(
				generateImagePaths(root).pipe(Effect.provide(testLayer)),
			)

			expectExitSuccess(exit)

			const manifest = readFileSync(
				join(root, "src/types/generated/image-variants.gen.ts"),
				"utf-8",
			)

			expect(manifest).toContain("'/maps/rotated.webp': { sourceWidth: 1700, widths: [1200] }")
		} finally {
			rmSync(root, { recursive: true, force: true })
		}
	})

	test("fails without overwriting the manifest when base image metadata cannot be read", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-pub-"))
		const mapsDir = join(root, "public", "maps")
		const outDir = join(root, "src/types/generated")
		mkdirSync(mapsDir, { recursive: true })
		mkdirSync(outDir, { recursive: true })

		try {
			writeFileSync(join(mapsDir, "bad.webp"), "invalid image")
			await writeWebp(join(mapsDir, "bad-384.webp"), 384)
			writeFileSync(join(outDir, "image-variants.gen.ts"), "existing manifest")

			const exit = await Effect.runPromiseExit(
				generateImagePaths(root).pipe(Effect.provide(testLayer)),
			)

			const cause = expectExitFailure(exit)
			expectCauseTaggedError(cause, "ImageMetadataError", (error: ImageMetadataError) =>
				error.message.includes("/maps/bad.webp"),
			)
			expect(readFileSync(join(outDir, "image-variants.gen.ts"), "utf-8")).toBe("existing manifest")
		} finally {
			rmSync(root, { recursive: true, force: true })
		}
	})
})

async function writeWebp(filePath: string, width: number) {
	await sharp({ create: { width, height: 100, channels: 3, background: "orange" } })
		.webp()
		.toFile(filePath)
}
