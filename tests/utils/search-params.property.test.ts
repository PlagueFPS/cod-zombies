import { it } from "@effect/vitest"
import { Arbitrary, Schema, Predicate, Result, Array as Arr } from "effect"
import { describe, expect } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import { normalizeParsedSearch, parseSearch, type ParsedSearchParams } from "@/utils/search-params"
import { decodeMainQuestSearchParams } from "@/utils/validation-schemas"

const Token = Schema.Union([
	Schema.String.check(Schema.isPattern(/^[a-z0-9-]{1,12}$/)),
	Schema.Literals(["true", "false", "null", "0", "1", "01", "1e2", "2.5", "1.0"]),
])

const tokenArb = Arbitrary.schema(Token)

const Scalar = Schema.Union([
	Schema.String.check(Schema.isPattern(/^[ -~]{0,8}$/)),
	Schema.Int.check(Schema.isBetween({ minimum: -1_000, maximum: 1_000 })),
	Schema.Finite.check(Schema.isBetween({ minimum: -1_000, maximum: 1_000 })),
	Schema.Boolean,
])

const Value = Schema.Union([
	Scalar,
	Schema.Null,
	Schema.Undefined,
	Schema.Array(Scalar).check(Schema.isMaxLength(4)),
])

/** String both query encodings must decode to. qss JSON-parses numeric scalars. */
function canonicalToken(token: string): string {
	try {
		const parsed = Result.getOrThrow(
			Schema.decodeResult(Schema.fromJsonString(Schema.Unknown))(token),
		)

		if (Predicate.isNumber(parsed) && Number.isFinite(parsed)) return String(parsed)

		if (Predicate.isBoolean(parsed) || Predicate.isNull(parsed)) return String(parsed)
	} catch {}

	return token
}

function repeatedGameQuery(tokens: readonly string[]): string {
	return Arr.join(
		Arr.map(tokens, token => `game=${encodeURIComponent(token)}`),
		"&",
	)
}

describe("parseSearch properties", () => {
	it.prop(
		"single-value and repeated-key encodings decode to the same string token",
		[
			tokenArb,
			Arbitrary.schema(Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 5_000 }))),
		],
		([token, page]) => {
			const expected = canonicalToken(token)

			const once = expectExitSuccess(
				decodeMainQuestSearchParams(parseSearch(`game=${encodeURIComponent(token)}&page=${page}`)),
			)

			const twice = expectExitSuccess(
				decodeMainQuestSearchParams(parseSearch(repeatedGameQuery([token, token]))),
			)

			expect(once.game).toEqual([expected])
			expect(twice.game).toEqual([expected, expected])
			expect(once.page).toBe(page)
			expect(Number.isInteger(once.page)).toBe(true)
		},
	)

	it.prop(
		"a list of filter tokens decodes to the same string array from JSON and repeated keys",
		[Arbitrary.array(tokenArb, { minLength: 1, maxLength: 5 })],
		([tokens]) => {
			const expected = Arr.map(tokens, canonicalToken)

			const fromRepeated = expectExitSuccess(
				decodeMainQuestSearchParams(parseSearch(repeatedGameQuery(tokens))),
			)

			const fromJson = expectExitSuccess(
				decodeMainQuestSearchParams(
					parseSearch(
						`game=${encodeURIComponent(Result.getOrThrow(Schema.encodeResult(Schema.fromJsonString(Schema.Unknown))(tokens)))}`,
					),
				),
			)

			expect(fromRepeated.game).toEqual(expected)
			expect(fromJson.game).toEqual(fromRepeated.game)
			expect(Arr.every(fromRepeated.game, Predicate.isString)).toBe(true)
		},
	)

	it.prop(
		"page stays a finite integer and normalizeParsedSearch is idempotent",
		[
			Arbitrary.schema(Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 5_000 }))),
			Arbitrary.schema(
				Schema.Record(Schema.String.check(Schema.isPattern(/^[ -~]{1,8}$/)), Value).check(
					Schema.isMaxProperties(5),
				),
			),
		],
		([page, search]) => {
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
	)
})
