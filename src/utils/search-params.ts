import { parseSearchWith } from "@tanstack/react-router"
import { Exit, Predicate, Schema } from "effect"

const jsonParseSearch = parseSearchWith(JSON.parse)

const SearchScalarSchema = Schema.Union([Schema.String, Schema.Number, Schema.Boolean])

export type SearchParamScalar = typeof SearchScalarSchema.Type

export type SearchParamValue =
	| SearchParamScalar
	| ReadonlyArray<SearchParamScalar>
	| null
	| undefined

export type ParsedSearchParams = { [key: string]: SearchParamValue }

/**
 * Coerces a multi-value filter element to a string.
 *
 * `qss` (via `parseSearchWith`) turns numeric-looking values into numbers/booleans,
 * which breaks `Schema.ArrayEnsure(Schema.String)`. Applied only to array elements —
 * scalar numbers like `page` must stay numbers for `Schema.Int`.
 */
function normalizeArrayElement(value: SearchParamValue): SearchParamScalar | undefined {
	const asScalar = Schema.decodeUnknownExit(SearchScalarSchema)(value)

	if (Exit.isSuccess(asScalar)) {
		return String(asScalar.value)
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

function normalizeSearchValue(value: SearchParamValue): SearchParamValue {
	if (value === undefined || value === null) {
		return value
	}

	if (Array.isArray(value)) {
		return value.flatMap(element => {
			const normalized = normalizeArrayElement(element)

			return normalized === undefined ? [] : [normalized]
		})
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
 * Scalar numbers/booleans are left as-is so params like `page` (Schema.Int) still
 * validate. Only array elements are string-coerced for filter schemas.
 */
export function normalizeParsedSearch(search: ParsedSearchParams) {
	const out: ParsedSearchParams = {}

	for (const key in search) {
		out[key] = normalizeSearchValue(search[key])
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
