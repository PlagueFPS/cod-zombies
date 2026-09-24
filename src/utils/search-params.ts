import { parseSearchWith } from "@tanstack/react-router"
import { Exit, Predicate, Schema } from "effect"

const jsonParseSearch = parseSearchWith(JSON.parse)

const SearchScalarSchema = Schema.Union([Schema.String, Schema.Finite, Schema.Boolean])

export type SearchParamScalar = typeof SearchScalarSchema.Type

export type SearchParamValue =
	| SearchParamScalar
	| ReadonlyArray<SearchParamScalar>
	| null
	| undefined

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
			Exit.isSuccess(decoded) ? decoded.value : value,
		)

		if (Exit.isSuccess(decoded) && Exit.isFailure(decodedString)) {
			return String(decoded.value)
		}
	} catch {
		// Not a JSON scalar. Keep the original filter string.
	}

	return asString.value
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
	} catch {
		// Plain string values are valid filter params.
	}

	return value
}

function normalizeSearchValue(key: string, value: SearchParamValue): SearchParamValue {
	if (value === undefined) return value

	// `page` must stay numeric for Schema.Int. Other nulls follow the repeated-key
	// path, which stringifies JSON null to "null".
	if (value === null) {
		return key === "page" ? value : "null"
	}

	if (Array.isArray(value)) {
		return value.flatMap(element => {
			const normalized = normalizeArrayElement(element)

			return normalized === undefined ? [] : [normalized]
		})
	}

	const asScalar = Schema.decodeUnknownExit(SearchScalarSchema)(value)

	if (key !== "page" && Exit.isSuccess(asScalar)) {
		return stringifyFilterScalar(asScalar.value)
	}

	return value
}

function isSearchParamValue(value: unknown): value is SearchParamValue {
	if (value === undefined || value === null) return true

	if (Exit.isSuccess(Schema.decodeUnknownExit(SearchScalarSchema)(value))) return true

	return (
		Array.isArray(value) &&
		value.every(item => Exit.isSuccess(Schema.decodeUnknownExit(SearchScalarSchema)(item)))
	)
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
	const out: ParsedSearchParams = {}

	for (const key in search) {
		out[key] = normalizeSearchValue(key, search[key])
	}

	return out
}

export function parseSearch(searchStr: string) {
	const raw = jsonParseSearch(searchStr)
	const parsed: ParsedSearchParams = {}

	for (const [key, value] of Object.entries(raw)) {
		parsed[key] = isSearchParamValue(value) ? value : undefined
	}

	return normalizeParsedSearch(parsed)
}
