import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { NodeServices } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { TestClock } from "effect/testing"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { generateImagePaths } from "@/scripts/generate-image-paths"

const testLayers = Layer.mergeAll(TestClock.layer(), NodeServices.layer)

describe("scripts/generate-image-paths", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		vi.useFakeTimers({ now: new Date("2024-06-15T12:00:00.000Z") })
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gen-image-paths-"))
		process.chdir(tmpRoot)
	})

	afterEach(() => {
		vi.useRealTimers()
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("fails when the public directory is missing", async () => {
		await expect(
			Effect.runPromise(
				generateImagePaths().pipe(
					Effect.provide(testLayers),
					Effect.flip,
				),
			),
		).resolves.toMatch(/Public directory does not exist/)
	})

	it("emits RootImagePath, per-directory types in stable order, and a stable ImagePaths union", async () => {
		fs.mkdirSync(path.join(tmpRoot, "public", "icons"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "public", "root-a.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47]))
		fs.writeFileSync(path.join(tmpRoot, "public", "icons", "b.jpg"), Buffer.from([0xff, 0xd8, 0xff]))
		fs.writeFileSync(path.join(tmpRoot, "public", "icons", "a.webp"), Buffer.from([0x52, 0x49, 0x46, 0x46]))

		await Effect.runPromise(generateImagePaths().pipe(Effect.provide(testLayers)))

		const outPath = path.join(tmpRoot, "types", "generated", "image-paths.gen.ts")
		const written = fs.readFileSync(outPath, "utf-8")

		expect(written).toContain("public directory scanned: public")
		expect(written).toContain("export type RootImagePath =")
		expect(written).toContain("'/root-a.png'")
		expect(written).toContain("export type IconsImagePath =")
		expect(written).toContain("'/icons/a.webp'")
		expect(written).toContain("'/icons/b.jpg'")
		const iconsIdx = written.indexOf("export type IconsImagePath")
		const rootIdx = written.indexOf("export type RootImagePath")
		expect(rootIdx).toBeLessThan(iconsIdx)
		expect(written).toMatch(
			/export type ImagePaths = RootImagePath \| IconsImagePath;\n$/,
		)

		await Effect.runPromise(generateImagePaths().pipe(Effect.provide(testLayers)))
		expect(fs.readFileSync(outPath, "utf-8")).toBe(written)
	})

	it("escapes single quotes in path literals", async () => {
		fs.mkdirSync(path.join(tmpRoot, "public", "icons"), { recursive: true })
		fs.writeFileSync(
			path.join(tmpRoot, "public", "icons", "it's-fine.png"),
			Buffer.from([0x89, 0x50, 0x4e, 0x47]),
		)

		await Effect.runPromise(generateImagePaths().pipe(Effect.provide(testLayers)))

		const written = fs.readFileSync(
			path.join(tmpRoot, "types", "generated", "image-paths.gen.ts"),
			"utf-8",
		)
		expect(written).toContain("'/icons/it\\'s-fine.png'")
	})
})
