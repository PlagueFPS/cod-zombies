import { parseSearchWith } from "@tanstack/react-router"
import { Option, Exit, Predicate, Schema, Array as Arr, Record as Rec } from "effect"

const jsonParseSearch = parseSearchWith(JSON.parse)

const SearchScalarSchema = Schema.Union([Schema.String, Schema.Finite, Schema.Boolean])

export type SearchParamScalar = typeof SearchScalarSchema.Type

const SearchParamValueSchema = Schema.Union([
	SearchScalarSchema,
	Schema.Array(SearchScalarSchema),
	Schema.Null,
	Schema.Undefined,
])

export type SearchParamValue = typeof SearchParamValueSchema.Type

export type ParsedSearchParams = { [key: string]: SearchParamValue }

/**
 * String form shared by a single query value and a repeated-key value.
 *
 * `qss` JSON-parses `1e2` as the number 100 on a scalar and leaves the string
 * `"1e2"` on a repeated key. Decoding JSON numbers, booleans, and null here
 * makes both encodings the same string. Plain strings stay as written.
 */
function stringifyFilterScalar(value: SearchParamScalar): string {
	const asString = Schema.decodeUnknownExit(Schema.String)(value)

	if (Exit.isFailure(asString)) return String(value)

	try {
		const parsed = JSON.parse(asString.value)
		const decoded = Schema.decodeUnknownExit(SearchScalarSchema)(parsed)

		const decodedString = Schema.decodeUnknownExit(Schema.String)(
			Exit.match(decoded, { onSuccess: decodedValue => decodedValue, onFailure: () => value }),
		)

		if (Exit.isSuccess(decoded) && Exit.isFailure(decodedString)) {
			return String(decoded.value)
		}
	} catch {}

	return asString.value
}

function isScalarArray(value: SearchParamValue): value is ReadonlyArray<SearchParamScalar> {
	return Arr.isArray(value)
}

function normalizeArrayElement(value: SearchParamValue): SearchParamScalar | undefined {
	const asScalar = Schema.decodeUnknownExit(SearchScalarSchema)(value)

	if (Exit.isSuccess(asScalar)) {
		return stringifyFilterScalar(asScalar.value)
	}

	if (!Predicate.isString(value)) {
		return undefined
	}

	try {
		const parsed = Schema.decodeUnknownExit(SearchScalarSchema)(JSON.parse(value))

		if (Exit.isSuccess(parsed)) {
			return String(parsed.value)
		}
	} catch {}

	return value
}

function normalizeSearchValue(key: string, value: SearchParamValue): SearchParamValue {
	if (Predicate.isUndefined(value)) return value

	if (Predicate.isNull(value)) {
		return key === "page" ? value : "null"
	}

	if (isScalarArray(value)) {
		return Arr.flatMap(value, element => {
			const normalized = normalizeArrayElement(element)

			return Predicate.isUndefined(normalized) ? [] : [normalized]
		})
	}

	const asScalar = Schema.decodeExit(SearchScalarSchema)(value)

	if (key !== "page" && Exit.isSuccess(asScalar)) {
		return stringifyFilterScalar(asScalar.value)
	}

	return value
}

/**
 * Normalizes TanStack Router's parsed query object so multi-value search params
 * decode consistently regardless of URL encoding style.
 *
 * Supports:
 * - JSON arrays: `?game=["a","b"]`
 * - Repeated keys: `?game=a&game=b`
 * - Single values: `?game=a`
 *
 * `page` stays a number so `Schema.Int` still validates. Every other scalar is
 * stringified so a single filter token decodes like its repeated-key form.
 * Array elements are always strings.
 */
export function normalizeParsedSearch(search: ParsedSearchParams) {
	return Rec.map(search, (value, key) => normalizeSearchValue(key, value))
}

export function parseSearch(searchStr: string) {
	const raw = jsonParseSearch(searchStr)

	const parsed = Rec.map(raw, value =>
		Schema.decodeOption(SearchParamValueSchema)(value).pipe(Option.getOrUndefined),
	)

	return normalizeParsedSearch(parsed)
}
