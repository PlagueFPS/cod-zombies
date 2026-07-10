import { parseSearchWith } from "@tanstack/react-router"

const jsonParseSearch = parseSearchWith(JSON.parse)

function normalizeSearchElement(value: unknown): unknown {
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
		return value.map(element => normalizeSearchElement(element))
	}

	return normalizeSearchElement(value)
}

/**
 * Normalizes TanStack Router's parsed query object so multi-value search params
 * decode consistently regardless of URL encoding style.
 *
 * Supports:
 * - JSON arrays: `?game=["a","b"]`
 * - Repeated keys: `?game=a&game=b`
 * - Single values: `?game=a`
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
