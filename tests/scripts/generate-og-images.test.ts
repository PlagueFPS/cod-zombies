import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { NodeServices } from "@effect/platform-node"
import { Effect } from "effect"
import { Command } from "effect/unstable/cli"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { generateOgCommand } from "@/scripts/generate-og-images"

const runOg = Command.runWith(generateOgCommand, { version: "1.0.0" })
const testLayer = NodeServices.layer
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")

describe("scripts/generate-og-images CLI", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "og-cli-"))
		process.chdir(tmpRoot)
	})

	afterEach(() => {
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("fails when no mode is selected", async () => {
		const err = await Effect.runPromise(
			runOg([]).pipe(Effect.provide(testLayer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when multiple modes are selected", async () => {
		const err = await Effect.runPromise(
			runOg(["--maps", "--zombies"]).pipe(Effect.provide(testLayer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when --zombies and --zombie are both used", async () => {
		const err = await Effect.runPromise(
			runOg(["--zombies", "--zombie", "some-zombie"]).pipe(Effect.provide(testLayer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when --map is used with --zombie (single)", async () => {
		const err = await Effect.runPromise(
			runOg(["--zombie", "some-zombie", "--map", "ascension"]).pipe(
				Effect.provide(testLayer),
				Effect.flip,
			),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when --quests and --quest are both used", async () => {
		const err = await Effect.runPromise(
			runOg(["--quests", "--quest", "some-quest"]).pipe(Effect.provide(testLayer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when --map is used with --quest (single)", async () => {
		const err = await Effect.runPromise(
			runOg(["--quest", "some-quest", "--map", "ascension"]).pipe(
				Effect.provide(testLayer),
				Effect.flip,
			),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

	it("fails when --maps and --map are combined", async () => {
		const err = await Effect.runPromise(
			runOg(["--maps", "--map", "ascension"]).pipe(Effect.provide(testLayer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "OgCliError" })
	})

})

describe("scripts/generate-og-images CLI (repo root)", () => {
	let prevCwd: string

	beforeEach(() => {
		prevCwd = process.cwd()
		process.chdir(repoRoot)
	})

	afterEach(() => {
		process.chdir(prevCwd)
	})

	it("writes a main-quest OG image for --map ascension", async () => {
		const out = fs.mkdtempSync(path.join(os.tmpdir(), "og-out-"))
		await Effect.runPromise(
			runOg(["--map", "ascension", "--output-dir", out]).pipe(Effect.provide(testLayer)),
		)
		const jpg = path.join(out, "main-quests", "opengraph-ascension.jpg")
		expect(fs.existsSync(jpg)).toBe(true)
		expect(fs.statSync(jpg).size).toBeGreaterThan(0)
		const first = fs.readFileSync(jpg)

		await Effect.runPromise(
			runOg(["--map", "ascension", "--output-dir", out]).pipe(Effect.provide(testLayer)),
		)
		expect(fs.readFileSync(jpg).equals(first)).toBe(true)

		fs.rmSync(out, { recursive: true, force: true })
	})
})
