import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Exit, Layer } from "effect"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { generateContentPaths } from "@/scripts/generate-content-paths"
import { expectCauseHasString, expectExitFailure, expectExitSuccess } from "./exit-helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

describe("generateContentPaths", () => {
	let prevCwd: string

	beforeEach(() => {
		prevCwd = process.cwd()
	})

	afterEach(() => {
		process.chdir(prevCwd)
	})

	test("fails with Exit when content directory is missing", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-content-"))
		process.chdir(root)

		const program = generateContentPaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const cause = expectExitFailure(exit)
		expectCauseHasString(cause, "Content directory does not exist")
		expect(Exit.isFailure(exit)).toBe(true)
		rmSync(root, { recursive: true, force: true })
	})

	test("sorts subdirectories and path literals deterministically", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-content-"))
		mkdirSync(join(root, "content", "zebra"), { recursive: true })
		mkdirSync(join(root, "content", "alpha"), { recursive: true })
		// Intentionally unsorted creation order; output must sort
		writeFileSync(join(root, "content", "zebra", "z.mdx"), "# Z")
		writeFileSync(join(root, "content", "alpha", "b.mdx"), "# B")
		writeFileSync(join(root, "content", "alpha", "a.mdx"), "# A")

		mkdirSync(join(root, "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateContentPaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "types", "generated", "content-paths.gen.ts"), "utf-8")

		const alphaBlock = out.indexOf("export type AlphaPaths")
		const zebraBlock = out.indexOf("export type ZebraPaths")
		expect(alphaBlock).toBeGreaterThan(-1)
		expect(zebraBlock).toBeGreaterThan(-1)
		expect(alphaBlock).toBeLessThan(zebraBlock)

		expect(out).toContain('"content/alpha/a"')
		expect(out).toContain('"content/alpha/b"')
		const aIdx = out.indexOf('"content/alpha/a"')
		const bIdx = out.indexOf('"content/alpha/b"')
		expect(aIdx).toBeLessThan(bIdx)

		const unionIdx = out.indexOf("export type ContentPaths =")
		expect(out.slice(unionIdx)).toMatch(/AlphaPaths\s*\|\s*ZebraPaths/)

		rmSync(root, { recursive: true, force: true })
	})

	test("empty mdx subtree yields never type for that directory", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-content-"))
		mkdirSync(join(root, "content", "emptydir"), { recursive: true })
		mkdirSync(join(root, "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateContentPaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(join(root, "types", "generated", "content-paths.gen.ts"), "utf-8")
		expect(out).toContain("export type EmptydirPaths = never;")

		rmSync(root, { recursive: true, force: true })
	})
})
