import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { Effect, Layer, MutableHashSet } from "effect"
import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { parseGitBatchOutput } from "@/scripts/generate-last-modified"
import { expectExitSuccess } from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

const letter = fc.constantFrom(..."abcdefghij".split(""))

const relPathArb = fc
	.tuple(
		fc.string({ unit: letter, minLength: 1, maxLength: 5 }),
		fc.string({ unit: letter, minLength: 1, maxLength: 5 }),
	)
	.map(([dir, file]) => `${dir}/${file}.mdx`)

const timestampArb = fc.integer({ min: 1_400_000_000, max: 1_700_000_000 })

type GitLine =
	| { kind: "touch"; path: string; timestamp: number; op: "A" | "M" }
	| { kind: "rename"; from: string; to: string; timestamp: number }
	| { kind: "noise"; path: string; timestamp: number }

function renderLine(line: GitLine): string {
	switch (line.kind) {
		case "touch":
			return `${line.timestamp}\n${line.op}\tsrc/content/${line.path}`
		case "rename":
			return `${line.timestamp}\nR100\tsrc/content/${line.from}\tsrc/content/${line.to}`
		case "noise":
			return `${line.timestamp}\nA\tsrc/content/${line.path}`
		default: {
			const unreachable: never = line

			return unreachable
		}
	}
}

const scenarioArb = fc.uniqueArray(relPathArb, { minLength: 1, maxLength: 4 }).chain(paths =>
	fc.record({
		paths: fc.constant(paths),
		lines: fc.array(
			fc.oneof(
				{
					weight: 3,
					arbitrary: fc.record({
						kind: fc.constant("touch" as const),
						path: fc.constantFrom(...paths),
						timestamp: timestampArb,
						op: fc.constantFrom("A" as const, "M" as const),
					}),
				},
				{
					weight: 2,
					arbitrary: fc.record({
						kind: fc.constant("rename" as const),
						from: fc.constantFrom(...paths),
						to: fc.constantFrom(...paths),
						timestamp: timestampArb,
					}),
				},
				{
					weight: 1,
					arbitrary: fc.record({
						kind: fc.constant("noise" as const),
						path: relPathArb.filter(path => !paths.includes(path)),
						timestamp: timestampArb,
					}),
				},
			),
			{ minLength: 1, maxLength: 8 },
		),
	}),
)

describe("parseGitBatchOutput properties", () => {
	test("keeps the first timestamp, ignores unknown paths, and records rename targets", async () => {
		await fc.assert(
			fc.asyncProperty(scenarioArb, async ({ paths, lines }) => {
				const pathSet = new Set(paths)
				const all = MutableHashSet.empty<string>()

				for (const path of paths) {
					MutableHashSet.add(all, `/repo/src/content/${path}`)
				}

				const firstSeen = new Map<string, number>()

				for (const line of lines) {
					if (line.kind === "touch" && pathSet.has(line.path) && !firstSeen.has(line.path)) {
						firstSeen.set(line.path, line.timestamp)
					}

					if (line.kind === "rename" && pathSet.has(line.to) && !firstSeen.has(line.to)) {
						firstSeen.set(line.to, line.timestamp)
					}
				}

				const git = `${lines.map(renderLine).join("\n")}\n`

				const exit = await Effect.runPromiseExit(
					parseGitBatchOutput(git, all, "/repo").pipe(Effect.provide(testLayer)),
				)

				const result = expectExitSuccess(exit)

				expect(Object.keys(result).sort()).toEqual([...paths].sort())

				for (const [path, timestamp] of firstSeen) {
					expect(result[path]?.lastModified).toBe(timestamp * 1000)
				}

				for (const line of lines.filter(
					(line): line is Extract<GitLine, { kind: "noise" }> => line.kind === "noise",
				)) {
					expect(result[line.path]).toBeUndefined()
				}

				for (const line of lines.filter(
					(line): line is Extract<GitLine, { kind: "rename" }> =>
						line.kind === "rename" && line.from !== line.to && !firstSeen.has(line.from),
				)) {
					expect(result[line.from]?.lastModified).not.toBe(line.timestamp * 1000)
				}
			}),
			{ numRuns: 40 },
		)
	})
})
