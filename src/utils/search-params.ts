import { parseSearchWith } from "@tanstack/react-router"
import { Schema, SchemaGetter } from "effect"

const jsonParseSearch = parseSearchWith(JSON.parse)

function parseJsonScalarString(value: string): string {
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

const SearchParamElementSchema = Schema.Union([
	Schema.String.pipe(
		Schema.decode({
			decode: SchemaGetter.transform(parseJsonScalarString),
			encode: SchemaGetter.passthrough(),
		}),
	),
	Schema.Number.pipe(
		Schema.decodeTo(Schema.String, {
			decode: SchemaGetter.transform(String),
			encode: SchemaGetter.transform(Number),
		}),
	),
	Schema.Boolean.pipe(
		Schema.decodeTo(Schema.String, {
			decode: SchemaGetter.transform(String),
			encode: SchemaGetter.transform(value => value === "true"),
		}),
	),
	Schema.Unknown,
])

const SearchParamValueSchema = Schema.Union([
	Schema.Null,
	Schema.Undefined,
	Schema.Array(SearchParamElementSchema),
	SearchParamElementSchema,
])

const decodeSearchParamValue = Schema.decodeUnknownSync(SearchParamValueSchema)

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
		out[key] = decodeSearchParamValue(search[key])
	}

	return out
}

export function parseSearch(searchStr: string): Record<string, unknown> {
	return normalizeParsedSearch(jsonParseSearch(searchStr))
}
