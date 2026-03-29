import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Effect, Redacted } from "effect"
import { Command } from "effect/unstable/cli"

vi.mock("@/env", () => ({
	env: {
		RESEND_API_KEY: Redacted.make("test-key"),
		RESEND_AUDIENCE_ID: Redacted.make("test-audience"),
		HASH_SALT: Redacted.make("test-salt"),
		LINEAR_API_KEY: Redacted.make("test-linear-key"),
		LINEAR_WORKSPACE: Redacted.make("test-workspace"),
		LINEAR_USER_FEEDBACK_LABEL: Redacted.make("00000000-0000-4000-8000-000000000000"),
		LINEAR_DEFAULT_ASSIGNEE_ID: Redacted.make("test-assignee"),
		VERCEL_ENV: Redacted.make("development"),
		VERCEL_URL: Redacted.make("localhost:3000"),
		VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("example.com"),
	},
}))
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import {
	generateOgCommand,
	OG_IMAGE_SIZE,
	OgCliError,
	writeOgFile,
} from "@/scripts/generate-og-images"
import { decodeOpengraphManifest } from "@/utils/validation-schemas"
import { expectCauseTaggedError, expectExitFailure, expectExitSuccess } from "./exit-helpers"

const testLayer = BunServicesLayer

const runOg = Command.runWith(generateOgCommand, { version: "1.0.0" })

describe("writeOgFile", () => {
	test("writes v1 then v2 and updates manifest", async () => {
		const tmp = mkdtempSync(join(tmpdir(), "codz-og-w-"))
		const manifestPath = join(tmp, "opengraph-manifest.json")
		writeFileSync(
			manifestPath,
			JSON.stringify({ "main-quests": {}, "side-quests": {}, zombies: {} }),
			"utf-8",
		)
		const outBase = join(tmp, "out")
		const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0])

		const p1 = writeOgFile(outBase, "main-quests", "slug-x", bytes, { manifestPath }).pipe(
			Effect.provide(testLayer),
		)
		const e1 = await Effect.runPromiseExit(p1)
		expectExitSuccess(e1)

		const mainDir = join(outBase, "main-quests")
		const files1 = readdirSync(mainDir).filter(f => f.startsWith("opengraph-slug-x-v"))
		expect(files1).toContain("opengraph-slug-x-v1.jpg")

		let manifest = await Effect.runPromise(
			decodeOpengraphManifest(readFileSync(manifestPath, "utf-8")),
		)
		expect(manifest["main-quests"]["slug-x"]).toBe(1)

		const p2 = writeOgFile(outBase, "main-quests", "slug-x", bytes, { manifestPath }).pipe(
			Effect.provide(testLayer),
		)
		const e2 = await Effect.runPromiseExit(p2)
		expectExitSuccess(e2)

		const files2 = readdirSync(mainDir).filter(f => f.startsWith("opengraph-slug-x-v"))
		expect(files2).toContain("opengraph-slug-x-v2.jpg")

		manifest = await Effect.runPromise(decodeOpengraphManifest(readFileSync(manifestPath, "utf-8")))
		expect(manifest["main-quests"]["slug-x"]).toBe(2)

		rmSync(tmp, { recursive: true, force: true })
	})
})

describe("generateOgCommand CLI (OgCliError)", () => {
	test("empty argv yields OgCliError", async () => {
		const exit = await Effect.runPromiseExit(runOg([]).pipe(Effect.provide(testLayer)))
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("Specify exactly one target"),
		)
	})

	test("--maps with --map yields OgCliError", async () => {
		const exit = await Effect.runPromiseExit(
			runOg(["--maps", "--map", "die-maschine"]).pipe(Effect.provide(testLayer)),
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("--maps already generates"),
		)
	})

	test("--zombies and --zombie together yield OgCliError", async () => {
		const exit = await Effect.runPromiseExit(
			runOg(["--zombies", "--zombie", "zombie"]).pipe(Effect.provide(testLayer)),
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("Use either --zombies or --zombie"),
		)
	})

	test("--zombie with --map yields OgCliError", async () => {
		const exit = await Effect.runPromiseExit(
			runOg(["--zombie", "zombie", "--map", "die-maschine"]).pipe(Effect.provide(testLayer)),
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("--map is only valid with --zombies"),
		)
	})

	test("--quests and --quest together yield OgCliError", async () => {
		const exit = await Effect.runPromiseExit(
			runOg(["--quests", "--quest", "free-perk"]).pipe(Effect.provide(testLayer)),
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("Use either --quests or --quest"),
		)
	})

	test("--quest with --map yields OgCliError", async () => {
		const exit = await Effect.runPromiseExit(
			runOg(["--quest", "free-perk", "--map", "die-maschine"]).pipe(Effect.provide(testLayer)),
		)
		const cause = expectExitFailure(exit)
		expectCauseTaggedError(cause, "OgCliError", (e: OgCliError) =>
			e.message.includes("--map is only valid with --quests"),
		)
	})
})

describe("generateOgCommand success (real assets)", () => {
	let prevManifest: string | undefined
	let tmpRoot: string

	beforeEach(() => {
		tmpRoot = mkdtempSync(join(tmpdir(), "codz-og-cli-"))
		const manifestPath = join(tmpRoot, "opengraph-manifest.json")
		writeFileSync(
			manifestPath,
			JSON.stringify({ "main-quests": {}, "side-quests": {}, zombies: {} }),
			"utf-8",
		)
		prevManifest = process.env.OG_TEST_MANIFEST_PATH
		process.env.OG_TEST_MANIFEST_PATH = manifestPath
	})

	afterEach(() => {
		if (prevManifest === undefined) {
			delete process.env.OG_TEST_MANIFEST_PATH
		} else {
			process.env.OG_TEST_MANIFEST_PATH = prevManifest
		}
		rmSync(tmpRoot, { recursive: true, force: true })
	})

	test("--map die-maschine writes JPEG with OG dimensions", async () => {
		const outDir = join(tmpRoot, "og-out")
		mkdirSync(outDir, { recursive: true })
		const exit = await Effect.runPromiseExit(
			runOg(["--map", "die-maschine", "-o", outDir]).pipe(Effect.provide(testLayer)),
		)
		expectExitSuccess(exit)

		const dir = join(outDir, "main-quests")
		const jpg = readdirSync(dir).find(
			f => f.startsWith("opengraph-die-maschine-v") && f.endsWith(".jpg"),
		)
		expect(jpg).toBeDefined()
		const meta = await sharp(readFileSync(join(dir, jpg!))).metadata()
		expect(meta.format).toBe("jpeg")
		expect(meta.width).toBe(OG_IMAGE_SIZE.width)
		expect(meta.height).toBe(OG_IMAGE_SIZE.height)
	}, 120_000)

	test("--quest free-perk writes JPEG with OG dimensions", async () => {
		const outDir = join(tmpRoot, "og-q")
		mkdirSync(outDir, { recursive: true })
		const exit = await Effect.runPromiseExit(
			runOg(["--quest", "free-perk", "-o", outDir]).pipe(Effect.provide(testLayer)),
		)
		expectExitSuccess(exit)

		const dir = join(outDir, "side-quests")
		const jpg = readdirSync(dir).find(
			f => f.startsWith("opengraph-free-perk-v") && f.endsWith(".jpg"),
		)
		expect(jpg).toBeDefined()
		const meta = await sharp(readFileSync(join(dir, jpg!))).metadata()
		expect(meta.format).toBe("jpeg")
		expect(meta.width).toBe(OG_IMAGE_SIZE.width)
		expect(meta.height).toBe(OG_IMAGE_SIZE.height)
	}, 120_000)

	test("--zombie zombie writes JPEG with OG dimensions", async () => {
		const outDir = join(tmpRoot, "og-z")
		mkdirSync(outDir, { recursive: true })
		const exit = await Effect.runPromiseExit(
			runOg(["--zombie", "zombie", "-o", outDir]).pipe(Effect.provide(testLayer)),
		)
		expectExitSuccess(exit)

		const dir = join(outDir, "zombies")
		const jpg = readdirSync(dir).find(f => f.startsWith("opengraph-zombie-v") && f.endsWith(".jpg"))
		expect(jpg).toBeDefined()
		const meta = await sharp(readFileSync(join(dir, jpg!))).metadata()
		expect(meta.format).toBe("jpeg")
		expect(meta.width).toBe(OG_IMAGE_SIZE.width)
		expect(meta.height).toBe(OG_IMAGE_SIZE.height)
	}, 120_000)
})
