import { layer as BunFileSystemLayer } from "@effect/platform-bun/BunFileSystem"
import { layer as BunPathLayer } from "@effect/platform-bun/BunPath"
import { it } from "@effect/vitest"
import {
	Arbitrary,
	Schema,
	Match,
	Effect,
	Layer,
	MutableHashSet,
	Array as Arr,
	Record as Rec,
} from "effect"
import { describe, expect } from "vitest"
import { parseGitBatchOutput } from "@/scripts/generate-last-modified"
import { expectExitSuccess } from "@/tests/helpers"

const testLayer = Layer.mergeAll(BunFileSystemLayer, BunPathLayer)

const RelPath = Schema.String.check(Schema.isPattern(/^[a-j]{1,5}\/[a-j]{1,5}\.mdx$/))

const relPathArb = Arbitrary.schema(RelPath)

const timestampArb = Arbitrary.schema(
	Schema.Int.check(Schema.isBetween({ minimum: 1_400_000_000, maximum: 1_700_000_000 })),
)

type GitLine =
	| { kind: "touch"; path: string; timestamp: number; op: "A" | "M" }
	| { kind: "rename"; from: string; to: string; timestamp: number }
	| { kind: "noise"; path: string; timestamp: number }

const renderLine = Match.type<GitLine>().pipe(
	Match.when({ kind: "touch" }, line => `${line.timestamp}\n${line.op}\tsrc/content/${line.path}`),
	Match.when(
		{ kind: "rename" },
		line => `${line.timestamp}\nR100\tsrc/content/${line.from}\tsrc/content/${line.to}`,
	),
	Match.when({ kind: "noise" }, line => `${line.timestamp}\nA\tsrc/content/${line.path}`),
	Match.exhaustive,
)

const Paths = Schema.UniqueArray(RelPath).check(Schema.isMinLength(1), Schema.isMaxLength(4))

const scenarioArb = Arbitrary.schema(Paths).pipe(
	Arbitrary.flatMap(paths => {
		const path = Arbitrary.schema(Schema.Literals(paths))

		const touch = Arbitrary.all({
			kind: Arbitrary.Constant("touch"),
			path,
			timestamp: timestampArb,
			op: Arbitrary.schema(Schema.Literals(["A", "M"])),
		})

		const rename = Arbitrary.all({
			kind: Arbitrary.Constant("rename"),
			from: path,
			to: path,
			timestamp: timestampArb,
		})

		const noise = Arbitrary.all({
			kind: Arbitrary.Constant("noise"),
			path: relPathArb.pipe(Arbitrary.filter(path => !paths.includes(path))),
			timestamp: timestampArb,
		})

		const line = Arbitrary.schema(
			Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 5 })),
		).pipe(
			Arbitrary.flatMap((index): Arbitrary.Arbitrary<GitLine> =>
				index < 3 ? touch : index < 5 ? rename : noise,
			),
		)

		return Arbitrary.all({
			paths: Arbitrary.Constant(paths),
			lines: Arbitrary.array(line, { minLength: 1, maxLength: 8 }),
		})
	}),
)

describe("parseGitBatchOutput properties", () => {
	it.effect.prop(
		"keeps the first timestamp, ignores unknown paths, and records rename targets",
		[scenarioArb],
		([{ paths, lines }]) =>
			Effect.gen(function* () {
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

				const git = `${Arr.join(Arr.map(lines, renderLine), "\n")}\n`

				const exit = yield* Effect.exit(
					parseGitBatchOutput(git, all, "/repo").pipe(Effect.provide(testLayer)),
				)

				const result = expectExitSuccess(exit)

				expect(Rec.keys(result).sort()).toEqual([...paths].sort())

				for (const [path, timestamp] of firstSeen) {
					expect(result[path]?.lastModified).toBe(timestamp * 1000)
				}

				for (const line of Arr.filter(
					lines,
					(line): line is Extract<GitLine, { kind: "noise" }> => line.kind === "noise",
				)) {
					expect(result[line.path]).toBeUndefined()
				}

				for (const line of Arr.filter(
					lines,
					(line): line is Extract<GitLine, { kind: "rename" }> =>
						line.kind === "rename" && line.from !== line.to && !firstSeen.has(line.from),
				)) {
					expect(result[line.from]?.lastModified).not.toBe(line.timestamp * 1000)
				}
			}),
		{ arbitrary: { runs: 40 } },
	)
})
