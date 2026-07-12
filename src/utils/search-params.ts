import { parseSearchWith } from "@tanstack/react-router"

const jsonParseSearch = parseSearchWith(JSON.parse)

/**
 * Coerces a multi-value filter element to a string.
 *
 * `qss` (via `parseSearchWith`) turns numeric-looking values into numbers/booleans,
 * which breaks `Schema.ArrayEnsure(Schema.String)`. Applied only to array elements —
 * scalar numbers like `page` must stay numbers for `Schema.Int`.
 */
function normalizeArrayElement(value: unknown): unknown {
	if (typeof value === "string") {
		try {
			const parsed: unknown = JSON.parse(value)
			if (typeof parsed === "string" || typeof parsed === "number" || typeof parsed === "boolean") {
				return String(parsed)
			}
		} catch {
			// Plain string values are valid filter params.
		}
		return value
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value)
	}

	return value
}

function normalizeSearchValue(value: unknown): unknown {
	if (value === undefined || value === null) {
		return value
	}

	if (Array.isArray(value)) {
		return value.map(element => normalizeArrayElement(element))
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
 * Scalar numbers/booleans are left as-is so params like `page` (Schema.Int) still
 * validate. Only array elements are string-coerced for filter schemas.
 */
export function normalizeParsedSearch(search: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {}

	for (const key in search) {
		out[key] = normalizeSearchValue(search[key])
	}

	return out
}

export function parseSearch(searchStr: string): Record<string, unknown> {
	return normalizeParsedSearch(jsonParseSearch(searchStr))
}
