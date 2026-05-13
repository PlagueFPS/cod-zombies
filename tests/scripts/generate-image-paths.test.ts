import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Exit, Layer } from "effect"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { generateImagePaths } from "@/scripts/generate-image-paths"
import { expectCauseHasString, expectExitFailure, expectExitSuccess } from "@/tests/helpers"

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
		// Root images (unsorted names)
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

		// Excluded top-level dirs should not appear as per-dir unions
		mkdirSync(join(root, "public", "content"), { recursive: true })
		writeFileSync(
			join(root, "public", "content", "x.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		)

		mkdirSync(join(root, "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "types", "generated", "image-paths.gen.ts"), "utf-8")

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
		mkdirSync(join(root, "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateImagePaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "types", "generated", "image-paths.gen.ts"), "utf-8")
		expect(out).toContain("\\'")

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})
})
