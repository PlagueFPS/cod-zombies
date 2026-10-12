import { describe, expect, test } from "vitest"
import {
	formatDravakarSwitchInteractions,
	formatDravakarSwitchSolution,
} from "@/data/dravakar-puzzle"

describe("formatDravakarSwitchInteractions", () => {
	test("omits switches that do not need to be interacted with", () => {
		expect(formatDravakarSwitchInteractions({ middle: 2, right: 3 })).toEqual([
			{ switch: "middle", label: "Middle", count: 2 },
			{ switch: "right", label: "Right", count: 3 },
		])
	})

	test("keeps left, middle, then right order", () => {
		expect(formatDravakarSwitchInteractions({ right: 1, left: 3, middle: 2 })).toEqual([
			{ switch: "left", label: "Left", count: 3 },
			{ switch: "middle", label: "Middle", count: 2 },
			{ switch: "right", label: "Right", count: 1 },
		])
	})
})

describe("formatDravakarSwitchSolution", () => {
	test("joins used switches into a single line", () => {
		expect(formatDravakarSwitchSolution({ middle: 2, right: 3 })).toBe("Middle 2x, Right 3x")
	})
})
