/** @vitest-environment happy-dom */

import { afterEach, describe, expect, test } from "vitest"
import {
	AOTRT_O_NUMBER_STORAGE_KEY,
	readAotrtONumber,
	subscribeAotrtONumber,
	writeAotrtONumber,
} from "@/utils/aotrt-o-number-storage"

describe("readAotrtONumber", () => {
	afterEach(() => {
		sessionStorage.removeItem(AOTRT_O_NUMBER_STORAGE_KEY)
	})

	test("returns null when nothing is stored", () => {
		expect(readAotrtONumber()).toBeNull()
	})

	test("returns null when the stored value is not an O number", () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "3")
		expect(readAotrtONumber()).toBeNull()

		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "nope")
		expect(readAotrtONumber()).toBeNull()
	})
})

describe("writeAotrtONumber", () => {
	afterEach(() => {
		sessionStorage.removeItem(AOTRT_O_NUMBER_STORAGE_KEY)
	})

	test("stores an O number that can be read back", () => {
		writeAotrtONumber(4)

		expect(sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)).toBe("4")
		expect(readAotrtONumber()).toBe(4)
	})

	test("notifies subscribers when the stored O number changes", () => {
		const seen: Array<number | null> = []

		const unsubscribe = subscribeAotrtONumber(() => {
			seen.push(readAotrtONumber())
		})

		writeAotrtONumber(4)
		writeAotrtONumber(4)
		writeAotrtONumber(9)
		unsubscribe()
		writeAotrtONumber(11)

		expect(seen).toEqual([4, 9])
	})
})
