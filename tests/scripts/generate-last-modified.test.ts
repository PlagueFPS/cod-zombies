import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Cause, Effect, Exit, FileSystem, Layer, MutableHashSet, Option } from "effect"
import { describe, expect, test, vi } from "vitest"
import {
	DuplicateFilenameError,
	getAllContentFiles,
	parseGitBatchOutput,
	populateFilePaths,
} from "@/scripts/generate-last-modified"
import { expectExitFailure, expectExitSuccess } from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

describe("populateFilePaths", () => {
	test("normalizes Windows separators and strips content prefix", () => {
		const all = MutableHashSet.empty<string>()
		MutableHashSet.add(all, "C:\\repo\\src\\content\\maps\\a.mdx")
		const out = populateFilePaths(all, "C:/repo")
		expect(Array.from(out).sort()).toEqual(["maps/a.mdx"])
	})
})

describe("parseGitBatchOutput", () => {
	test("parses timestamp and A line and assigns metadata", async () => {
		const all = MutableHashSet.empty<string>()
		MutableHashSet.add(all, "/repo/src/content/maps/foo.mdx")
		const git = `1700000000
A\tsrc/content/maps/foo.mdx
`
		const program = parseGitBatchOutput(git, all, "/repo").pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const result = expectExitSuccess(exit)
		expect(result["maps/foo.mdx"]?.lastModified).toBe(1700000000000)
	})

	test("parses R rename lines using the new path", async () => {
		const all = MutableHashSet.empty<string>()
		MutableHashSet.add(all, "/repo/src/content/maps/new.mdx")
		const git = `1600000000
R100\tsrc/content/maps/old.mdx\tsrc/content/maps/new.mdx
`
		const program = parseGitBatchOutput(git, all, "/repo").pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const result = expectExitSuccess(exit)
		expect(result["maps/new.mdx"]?.lastModified).toBe(1600000000000)
	})

	test("uses current date for files missing from git history", async () => {
		vi.useFakeTimers()
		const fixed = new Date("2025-03-15T10:00:00.000Z")
		vi.setSystemTime(fixed)
		const all = MutableHashSet.empty<string>()
		MutableHashSet.add(all, "/repo/src/content/maps/orphan.mdx")
		const program = parseGitBatchOutput("", all, "/repo").pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const result = expectExitSuccess(exit)
		expect(result["maps/orphan.mdx"]?.lastModified).toBe(fixed.getTime())
		vi.useRealTimers()
	})

	test("skips R lines with fewer than three tab parts; missing files use current date", async () => {
		vi.useFakeTimers()
		const fixed = new Date("2024-06-01T12:00:00.000Z")
		vi.setSystemTime(fixed)
		const all = MutableHashSet.empty<string>()
		MutableHashSet.add(all, "/repo/src/content/x.mdx")
		const git = `1700000000
R100\tshort
`
		const program = parseGitBatchOutput(git, all, "/repo").pipe(Effect.provide(testLayer))
		const exit = await Effect.runPromiseExit(program)
		const result = expectExitSuccess(exit)
		expect(result["x.mdx"]?.lastModified).toBe(fixed.getTime())
		vi.useRealTimers()
	})
})

describe("getAllContentFiles", () => {
	test("fails with DuplicateFilenameError when duplicate relative paths are reported", async () => {
		const mockFs = FileSystem.layerNoop({
			readDirectory: p => {
				const n = p.replace(/\\/g, "/")
				if (n.endsWith("/content")) return Effect.succeed(["dup"])
				if (n.endsWith("/content/dup")) return Effect.succeed(["a.mdx", "a.mdx"])
				return Effect.succeed([])
			},
		})
		const program = getAllContentFiles("/tmp/workspace/content").pipe(
			Effect.provide(Layer.mergeAll(mockFs, BunPathLayer)),
		)
		const exit = await Effect.runPromiseExit(program)
		const cause = expectExitFailure(exit)
		expect(Exit.isFailure(exit)).toBe(true)
		const errOpt = Cause.findErrorOption(cause)
		expect(Option.isSome(errOpt)).toBe(true)
		if (Option.isSome(errOpt)) {
			const e = errOpt.value as DuplicateFilenameError
			expect(e._tag).toBe("DuplicateFilenameError")
			expect(e.message).toContain("Duplicate file paths")
		}
	})
})
