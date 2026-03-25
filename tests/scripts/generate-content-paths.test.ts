import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { NodeServices } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { TestClock } from "effect/testing"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { generateContentPaths } from "@/scripts/generate-content-paths"

const testLayers = Layer.mergeAll(TestClock.layer(), NodeServices.layer)

describe("scripts/generate-content-paths", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		vi.useFakeTimers({ now: new Date("2024-06-15T12:00:00.000Z") })
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gen-content-paths-"))
		process.chdir(tmpRoot)
	})

	afterEach(() => {
		vi.useRealTimers()
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("fails when the content directory is missing", async () => {
		await expect(
			Effect.runPromise(
				generateContentPaths().pipe(
					Effect.provide(testLayers),
					Effect.flip,
				),
			),
		).resolves.toMatch(/Content directory does not exist/)
	})

	it("writes sorted union types for each content subfolder and stable ContentPaths union order", async () => {
		fs.mkdirSync(path.join(tmpRoot, "types", "generated"), { recursive: true })
		fs.mkdirSync(path.join(tmpRoot, "content", "beta"), { recursive: true })
		fs.mkdirSync(path.join(tmpRoot, "content", "alpha", "nested"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "content", "beta", "second.mdx"), "# B")
		fs.writeFileSync(path.join(tmpRoot, "content", "alpha", "first.mdx"), "# A")
		fs.writeFileSync(path.join(tmpRoot, "content", "alpha", "nested", "deep.mdx"), "# Deep")

		await Effect.runPromise(generateContentPaths().pipe(Effect.provide(testLayers)))

		const outPath = path.join(tmpRoot, "types", "generated", "content-paths.gen.ts")
		const written = fs.readFileSync(outPath, "utf-8")

		expect(written).toContain("content directory scanned: content")
		expect(written).toContain("export type AlphaPaths =")
		expect(written).toContain("content/alpha/first")
		expect(written).toContain("content/alpha/nested/deep")
		expect(written).toContain("export type BetaPaths =")
		expect(written).toContain("content/beta/second")
		// Directories processed in localeCompare order: alpha before beta; literals sorted
		const alphaIdx = written.indexOf("export type AlphaPaths")
		const betaIdx = written.indexOf("export type BetaPaths")
		expect(alphaIdx).toBeLessThan(betaIdx)
		expect(written).toMatch(
			/export type ContentPaths = AlphaPaths \| BetaPaths;\n$/,
		)

		await Effect.runPromise(generateContentPaths().pipe(Effect.provide(testLayers)))
		const second = fs.readFileSync(outPath, "utf-8")
		expect(second).toBe(written)
	})

	it("strips .mdx extension and escapes double quotes in path literals", async () => {
		fs.mkdirSync(path.join(tmpRoot, "content", "q"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "content", 'q', 'say "hi".mdx'), "# x")

		await Effect.runPromise(generateContentPaths().pipe(Effect.provide(testLayers)))

		const written = fs.readFileSync(
			path.join(tmpRoot, "types", "generated", "content-paths.gen.ts"),
			"utf-8",
		)
		expect(written).toContain(String.raw`content/q/say \"hi\"`)
	})
})
