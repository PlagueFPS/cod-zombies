import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { NodeServices } from "@effect/platform-node"
import { Effect, Exit } from "effect"
import { Command } from "effect/unstable/cli"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { optimizeCommand } from "@/scripts/image-optimization"

const runOptimize = Command.runWith(optimizeCommand, { version: "1.0.0" })

const testLayer = NodeServices.layer

/** Minimal valid 1×1 PNG */
const tinyPng = Buffer.from(
	"89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000050001",
	"hex",
)

describe("scripts/image-optimization CLI", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "img-opt-"))
		process.chdir(tmpRoot)
	})

	afterEach(() => {
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("requires --output-dir", async () => {
		const exit = await Effect.runPromiseExit(runOptimize([]).pipe(Effect.provide(testLayer)))
		expect(Exit.isFailure(exit)).toBe(true)
	})

	it("optimizes a PNG into webp in the output dir and moves source to oldassets", async () => {
		fs.mkdirSync(path.join(tmpRoot, "newassets"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "newassets", "photo.png"), tinyPng)

		await Effect.runPromise(
			runOptimize(["--output-dir", "out"]).pipe(Effect.provide(testLayer)),
		)

		const outFiles = fs.readdirSync(path.join(tmpRoot, "out"))
		expect(outFiles).toEqual(["photo.webp"])
		expect(fs.existsSync(path.join(tmpRoot, "newassets", "photo.png"))).toBe(false)
		expect(fs.existsSync(path.join(tmpRoot, "oldassets", "photo.png"))).toBe(true)
	})

	it("is deterministic: same input produces identical output bytes", async () => {
		fs.mkdirSync(path.join(tmpRoot, "newassets"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "newassets", "photo.png"), tinyPng)

		await Effect.runPromise(
			runOptimize(["--output-dir", "out1", "--source-dir", "newassets"]).pipe(
				Effect.provide(testLayer),
			),
		)
		const first = fs.readFileSync(path.join(tmpRoot, "out1", "photo.webp"))

		fs.mkdirSync(path.join(tmpRoot, "newassets2"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "newassets2", "photo.png"), tinyPng)
		await Effect.runPromise(
			runOptimize(["--output-dir", "out2", "--source-dir", "newassets2"]).pipe(
				Effect.provide(testLayer),
			),
		)
		const second = fs.readFileSync(path.join(tmpRoot, "out2", "photo.webp"))

		expect(second.equals(first)).toBe(true)
	})

	it("accepts --map, --preview, and --no-resize flags without throwing", async () => {
		for (const extra of [
			["--map"],
			["--preview"],
			["--no-resize"],
		] as const) {
			const src = `newassets-${extra[0].replace(/^--/, "")}`
			fs.mkdirSync(path.join(tmpRoot, src), { recursive: true })
			fs.writeFileSync(path.join(tmpRoot, src, "photo.png"), tinyPng)
			const out = path.join(tmpRoot, `out-${extra[0]}`)
			fs.mkdirSync(out, { recursive: true })
			await Effect.runPromise(
				runOptimize(["--output-dir", out, "--source-dir", src, ...extra]).pipe(
					Effect.provide(testLayer),
				),
			)
			expect(fs.readdirSync(out).length).toBeGreaterThan(0)
		}
	})
})
