import type { Media } from "@/types/payload-types"
import { Effect, Predicate } from "effect"
import { RelationshipError } from "@/types/errors"

/**Asserts that the given relationship exists */
export const assertRelation = Effect.fnUntraced(function* <T>(value: string | T) {
	if (Predicate.isString(value) || !value)
		return yield* new RelationshipError({
			message: "Expected relationship to be populated.",
			cause:
				"Query depth is not high enough to populate relationship or you forgot to provide a `populate` option.",
		})

	return value
})

export const createMediaDto = (media: Media) => ({
	url: media.url,
	width: media.width,
	height: media.height,
})
