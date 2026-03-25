import type * as ChildProcess from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import * as NodePath from "@effect/platform-node/NodePath"
import { NodeServices } from "@effect/platform-node"
import { Effect, FileSystem, Layer, MutableHashSet } from "effect"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { decodeLastModifiedData } from "@/utils/validation-schemas"

const { mockExecSync } = vi.hoisted(() => ({
	mockExecSync: vi.fn(() => ""),
}))

vi.mock("node:child_process", () => ({
	execSync: mockExecSync as unknown as typeof ChildProcess.execSync,
}))

import { generateLastModified, getAllContentFiles, parseGitBatchOutput } from "@/scripts/generate-last-modified"

const testLayer = NodeServices.layer

describe("scripts/generate-last-modified parseGitBatchOutput", () => {
	it("maps added/modified lines to git timestamps and fills missing files with current time", async () => {
		const repoRoot = "/repo"
		const allFiles = MutableHashSet.empty<string>()
		MutableHashSet.add(allFiles, `${repoRoot}/content/maps/foo.mdx`)
		MutableHashSet.add(allFiles, `${repoRoot}/content/zombies/bar.mdx`)

		const gitOut = `1700000000
A\tcontent/maps/foo.mdx
`

		const result = await Effect.runPromise(
			parseGitBatchOutput(gitOut, allFiles, repoRoot).pipe(Effect.provide(testLayer)),
		)

		expect(result["maps/foo.mdx"]?.lastModified).toBe(1700000000 * 1000)
		expect(result["zombies/bar.mdx"]).toBeDefined()
		expect(result["zombies/bar.mdx"]!.lastModified).not.toBe(result["maps/foo.mdx"]!.lastModified)
	})

	it("is deterministic for the same git output", async () => {
		const repoRoot = "/repo"
		const allFiles = MutableHashSet.empty<string>()
		MutableHashSet.add(allFiles, `${repoRoot}/content/a/x.mdx`)
		const gitOut = `1600000000
M\tcontent/a/x.mdx
`
		const a = await Effect.runPromise(
			parseGitBatchOutput(gitOut, allFiles, repoRoot).pipe(Effect.provide(testLayer)),
		)
		const b = await Effect.runPromise(
			parseGitBatchOutput(gitOut, allFiles, repoRoot).pipe(Effect.provide(testLayer)),
		)
		expect(a).toEqual(b)
	})
})

describe("scripts/generate-last-modified getAllContentFiles", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gen-last-mod-"))
		process.chdir(tmpRoot)
		fs.mkdirSync(path.join(tmpRoot, "content", "maps"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "content", "maps", "a.mdx"), "# a")
	})

	afterEach(() => {
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("collects mdx paths under content subfolders", async () => {
		const files = await Effect.runPromise(
			getAllContentFiles(path.join(tmpRoot, "content")).pipe(Effect.provide(testLayer)),
		)
		const arr = [...files].map(p => p.replace(/\\/g, "/"))
		expect(arr).toEqual([`${tmpRoot}/content/maps/a.mdx`.replace(/\\/g, "/")])
	})

})

describe("scripts/generate-last-modified getAllContentFiles duplicate detection", () => {
	it("fails when the same relative mdx path is counted more than once", async () => {
		const dupFs = FileSystem.layerNoop({
			readDirectory: (p: string) => {
				const n = p.replace(/\\/g, "/")
				if (n.endsWith("/content")) return Effect.succeed(["maps"])
				if (n.endsWith("/content/maps")) return Effect.succeed(["a.mdx", "a.mdx"])
				return Effect.succeed([])
			},
		})
		const layer = Layer.mergeAll(dupFs, NodePath.layer)

		const err = await Effect.runPromise(
			getAllContentFiles("/tmp/content").pipe(Effect.provide(layer), Effect.flip),
		)
		expect(err).toMatchObject({ _tag: "DuplicateFilenameError" })
	})
})

describe("scripts/generate-last-modified integration (mocked git)", () => {
	let prevCwd: string
	let tmpRoot: string

	beforeEach(() => {
		prevCwd = process.cwd()
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gen-last-mod-int-"))
		process.chdir(tmpRoot)
		fs.mkdirSync(path.join(tmpRoot, "content", "maps"), { recursive: true })
		fs.mkdirSync(path.join(tmpRoot, "data"), { recursive: true })
		fs.writeFileSync(path.join(tmpRoot, "content", "maps", "a.mdx"), "# hello")
		mockExecSync.mockReturnValue(
			`1704067200
M\tcontent/maps/a.mdx
`,
		)
	})

	afterEach(() => {
		mockExecSync.mockReset()
		process.chdir(prevCwd)
		fs.rmSync(tmpRoot, { recursive: true, force: true })
	})

	it("writes valid last-modified.json with encoded file metadata", async () => {
		await Effect.runPromise(generateLastModified.pipe(Effect.provide(testLayer)))

		const raw = fs.readFileSync(path.join(tmpRoot, "data", "last-modified.json"), "utf-8")
		const decoded = await Effect.runPromise(decodeLastModifiedData(raw))
		expect(decoded.version).toBe("1.0")
		expect(decoded.files["maps/a.mdx"]?.lastModified).toBe(1704067200 * 1000)
	})
})
