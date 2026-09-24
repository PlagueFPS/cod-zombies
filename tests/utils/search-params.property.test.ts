import { Predicate } from "effect"
import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import {
	normalizeParsedSearch,
	parseSearch,
	type ParsedSearchParams,
	type SearchParamScalar,
	type SearchParamValue,
} from "@/utils/search-params"
import { decodeMainQuestSearchParams } from "@/utils/validation-schemas"

const slugChar = fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-".split(""))

const tokenArb = fc.oneof(
	fc.string({ unit: slugChar, minLength: 1, maxLength: 12 }),
	fc.constantFrom("true", "false", "null", "0", "1", "01", "1e2", "2.5", "1.0"),
)

const scalarArb: fc.Arbitrary<SearchParamScalar> = fc.oneof(
	fc.string({ maxLength: 8, unit: "grapheme-ascii" }),
	fc.integer({ min: -1_000, max: 1_000 }),
	fc.double({ min: -1_000, max: 1_000, noNaN: true }),
	fc.boolean(),
)

const valueArb: fc.Arbitrary<SearchParamValue> = fc.oneof(
	scalarArb,
	fc.constant(null),
	fc.constant(undefined),
	fc.array(scalarArb, { maxLength: 4 }),
)

/** String both query encodings must decode to. qss JSON-parses numeric scalars. */
function canonicalToken(token: string): string {
	try {
		const parsed = JSON.parse(token)

		if (Predicate.isNumber(parsed) && Number.isFinite(parsed)) return String(parsed)

		if (Predicate.isBoolean(parsed) || parsed === null) return String(parsed)
	} catch {
		// Plain filter text is already the decoded string.
	}

	return token
}

function repeatedGameQuery(tokens: readonly string[]): string {
	return tokens.map(token => `game=${encodeURIComponent(token)}`).join("&")
}

describe("parseSearch properties", () => {
	test("single-value and repeated-key encodings decode to the same string token", () => {
		fc.assert(
			fc.property(tokenArb, fc.integer({ min: 1, max: 5_000 }), (token, page) => {
				const expected = canonicalToken(token)

				const once = expectExitSuccess(
					decodeMainQuestSearchParams(
						parseSearch(`game=${encodeURIComponent(token)}&page=${page}`),
					),
				)

				const twice = expectExitSuccess(
					decodeMainQuestSearchParams(parseSearch(repeatedGameQuery([token, token]))),
				)

				expect(once.game).toEqual([expected])
				expect(twice.game).toEqual([expected, expected])
				expect(once.page).toBe(page)
				expect(Number.isInteger(once.page)).toBe(true)
			}),
		)
	})

	test("a list of filter tokens decodes to the same string array from JSON and repeated keys", () => {
		fc.assert(
			fc.property(fc.array(tokenArb, { minLength: 1, maxLength: 5 }), tokens => {
				const expected = tokens.map(canonicalToken)

				const fromRepeated = expectExitSuccess(
					decodeMainQuestSearchParams(parseSearch(repeatedGameQuery(tokens))),
				)

				const fromJson = expectExitSuccess(
					decodeMainQuestSearchParams(
						parseSearch(`game=${encodeURIComponent(JSON.stringify(tokens))}`),
					),
				)

				expect(fromRepeated.game).toEqual(expected)
				expect(fromJson.game).toEqual(fromRepeated.game)
				expect(fromRepeated.game.every(Predicate.isString)).toBe(true)
			}),
		)
	})

	test("page stays a finite integer and normalizeParsedSearch is idempotent", () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 5_000 }),
				fc.dictionary(fc.string({ minLength: 1, maxLength: 8, unit: "grapheme-ascii" }), valueArb, {
					maxKeys: 5,
				}),
				(page, search) => {
					const parsed = parseSearch(`page=${page}`)
					expect(parsed.page).toBe(page)
					expect(Number.isFinite(parsed.page)).toBe(true)
					expect(Number.isInteger(parsed.page)).toBe(true)
					expect(normalizeParsedSearch(parsed)).toEqual(parsed)

					const input: ParsedSearchParams = { ...search, page }
					const once = normalizeParsedSearch(input)
					expect(normalizeParsedSearch(once)).toEqual(once)
					expect(once.page).toBe(page)
				},
			),
		)
	})
})
