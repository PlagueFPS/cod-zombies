import type { OpengraphKind } from "@/utils/validation-schemas"
import { Option, Record as Rec } from "effect"
import manifest from "@/data/opengraph-manifest.json" with { type: "json" }

/** Versioned path the site uses for `og:image`, without an origin. */
export function opengraphImagePath(kind: OpengraphKind, id: string): Option.Option<string> {
	const versions: { readonly [id: string]: number } = manifest[kind]

	return Rec.get(versions, id).pipe(
		Option.map(version => `/opengraph-images/${kind}/opengraph-${id}-v${String(version)}.jpg`),
	)
}

/** Same absolute URL the site puts in `og:image`. */
export function opengraphImageUrl(
	origin: string,
	kind: OpengraphKind,
	id: string,
): Option.Option<string> {
	return opengraphImagePath(kind, id).pipe(Option.map(path => `${origin}${path}`))
}

export function requireOpengraphImageUrl(origin: string, kind: OpengraphKind, id: string): string {
	return opengraphImageUrl(origin, kind, id).pipe(
		Option.getOrThrowWith(() => new Error(`Missing opengraph image for ${kind}: ${id}.`)),
	)
}
