import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Exit, Layer, String as Str, Option } from "effect"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { generateContentPaths } from "@/scripts/generate-content-paths"
import { expectCauseHasString, expectExitFailure, expectExitSuccess } from "@/tests/helpers"

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
		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("sorts subdirectories and path literals deterministically", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-content-"))
		mkdirSync(join(root, "src", "content", "zebra"), { recursive: true })
		mkdirSync(join(root, "src", "content", "alpha"), { recursive: true })
		writeFileSync(join(root, "src", "content", "zebra", "z.mdx"), "# Z")
		writeFileSync(join(root, "src", "content", "alpha", "b.mdx"), "# B")
		writeFileSync(join(root, "src", "content", "alpha", "a.mdx"), "# A")

		mkdirSync(join(root, "src", "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateContentPaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(
			join(root, "src", "types", "generated", "content-paths.gen.ts"),
			"utf-8",
		)

		const alphaBlock = Option.getOrElse(Str.indexOf("export type AlphaPaths")(out), () => -1)
		const zebraBlock = Option.getOrElse(Str.indexOf("export type ZebraPaths")(out), () => -1)
		expect(alphaBlock).toBeGreaterThan(-1)
		expect(zebraBlock).toBeGreaterThan(-1)
		expect(alphaBlock).toBeLessThan(zebraBlock)

		expect(out).toContain('"content/alpha/a"')
		expect(out).toContain('"content/alpha/b"')
		const aIdx = Option.getOrElse(Str.indexOf('"content/alpha/a"')(out), () => -1)
		const bIdx = Option.getOrElse(Str.indexOf('"content/alpha/b"')(out), () => -1)
		expect(aIdx).toBeLessThan(bIdx)

		const unionIdx = Option.getOrElse(Str.indexOf("export type ContentPaths =")(out), () => -1)
		expect(Str.slice(unionIdx)(out)).toMatch(/AlphaPaths\s*\|\s*ZebraPaths/)

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})

	test("empty mdx subtree yields never type for that directory", async () => {
		const root = mkdtempSync(join(tmpdir(), "codz-content-"))
		mkdirSync(join(root, "src", "content", "emptydir"), { recursive: true })
		mkdirSync(join(root, "src", "types", "generated"), { recursive: true })
		process.chdir(root)

		const program = generateContentPaths(root).pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		expectExitSuccess(exit)

		const out = readFileSync(
			join(root, "src", "types", "generated", "content-paths.gen.ts"),
			"utf-8",
		)

		expect(out).toContain("export type EmptydirPaths = never;")

		process.chdir(prevCwd)
		rmSync(root, { recursive: true, force: true })
	})
})
