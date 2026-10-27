import type { OpengraphKind } from "./validation-schemas"
import { Predicate } from "effect"
import manifest from "../data/opengraph-manifest.json" with { type: "json" }

type OpengraphVersionTable = { readonly [id: string]: number }

/** Versioned path the site uses for `og:image`, without an origin. */
export function opengraphImagePath(kind: OpengraphKind, id: string): string | undefined {
	// SAFETY: each kind is an id-to-integer version table; missing ids are undefined.
	const versions = manifest[kind] as OpengraphVersionTable
	const version = versions[id]

	if (Predicate.isUndefined(version)) return undefined

	return `/opengraph-images/${kind}/opengraph-${id}-v${String(version)}.jpg`
}

/** Same absolute URL the site puts in `og:image`. */
export function opengraphImageUrl(
	origin: string,
	kind: OpengraphKind,
	id: string,
): string | undefined {
	const path = opengraphImagePath(kind, id)

	if (Predicate.isUndefined(path)) return undefined

	return `${origin}${path}`
}

export function requireOpengraphImageUrl(origin: string, kind: OpengraphKind, id: string): string {
	const url = opengraphImageUrl(origin, kind, id)

	if (Predicate.isUndefined(url)) {
		throw new Error(`Missing opengraph image for ${kind}: ${id}.`)
	}

	return url
}
