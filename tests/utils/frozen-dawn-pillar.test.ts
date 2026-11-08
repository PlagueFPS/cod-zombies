import { Match, Option, Array as Arr } from "effect"
import { describe, expect, it } from "vitest"
import {
	PILLAR_IDS,
	solvePillars,
	type PillarDirection,
	type PillarState,
} from "@/utils/frozen-dawn-pillar"

describe("Frozen Dawn pillars", () => {
	it("requires no shots when every block faces front", () => {
		expect(Option.getOrThrow(solvePillars([0, 0, 0, 0]))).toEqual([0, 0, 0, 0])
	})

	it("solves every arrangement using 180° on the target and 90° on touching blocks", () => {
		const facings: PillarDirection[] = [0, 1, 2, 3]

		for (const a of facings)
			for (const b of facings)
				for (const c of facings)
					for (const d of facings) {
						const initial: PillarState = [a, b, c, d]
						const counts = Option.getOrThrow(solvePillars(initial))
						const actual: [number, number, number, number] = [...initial]

						for (const target of PILLAR_IDS) {
							for (let shot = 0; shot < counts[target]; shot++) {
								for (const block of PILLAR_IDS) {
									const distance = Math.abs(block - target)
									actual[block] =
										(actual[block] +
											Match.value(distance).pipe(
												Match.when(0, () => 2),
												Match.when(1, () => 1),
												Match.orElse(() => 0),
											)) %
										4
								}
							}
						}

						expect(actual, `Starting facings: ${Arr.join(Arr.map(initial, String), ",")}`).toEqual([
							0, 0, 0, 0,
						])
					}
	})
})
