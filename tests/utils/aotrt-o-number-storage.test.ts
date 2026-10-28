/** @vitest-environment happy-dom */

import { Option } from "effect"
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

	test("returns None when nothing is stored", () => {
		expect(readAotrtONumber()).toEqual(Option.none())
	})

	test("returns None when the stored value is not an O number", () => {
		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "3")
		expect(readAotrtONumber()).toEqual(Option.none())

		sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, "nope")
		expect(readAotrtONumber()).toEqual(Option.none())
	})
})

describe("writeAotrtONumber", () => {
	afterEach(() => {
		sessionStorage.removeItem(AOTRT_O_NUMBER_STORAGE_KEY)
	})

	test("stores an O number that can be read back", () => {
		writeAotrtONumber(4)

		expect(sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)).toBe("4")
		expect(readAotrtONumber()).toEqual(Option.some(4))
	})

	test("notifies subscribers when the stored O number changes", () => {
		const seen: Array<Option.Option<number>> = []

		const unsubscribe = subscribeAotrtONumber(() => {
			seen.push(readAotrtONumber())
		})

		writeAotrtONumber(4)
		writeAotrtONumber(4)
		writeAotrtONumber(9)
		unsubscribe()
		writeAotrtONumber(11)

		expect(seen).toEqual([Option.some(4), Option.some(9)])
	})
})
