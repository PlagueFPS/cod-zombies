import type { SerializedHeadingNode } from "@payloadcms/richtext-lexical"
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import type { Media } from "@/types/payload-types"
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext"
import { Effect, Predicate } from "effect"
import { RelationshipError } from "@/types/errors"
import { slugify } from "./functions.client"

/**Asserts that the given relationship exists */
export const assertRelation = <T>(value: string | T) =>
	Effect.gen(function* () {
		if (Predicate.isString(value) || !value) {
			yield* Effect.logWarning("Relationship is not populated", value)
			return yield* new RelationshipError({
				message: "Expected relationship to be populated.",
				cause:
					'Query depth is not high enough to populate relationship or you forgot to provide a "populate" option.',
			})
		}

		return value
	}).pipe(Effect.withLogSpan("assert_relation"))

export const createMediaDto = (media: Media) => ({
	url: media.url,
	width: media.width,
	height: media.height,
})

export const calculateTimeToRead = (content: SerializedEditorState) => {
	const text = convertLexicalToPlaintext({ data: content })
	const wordPerMinute = 200 // avg reading speed
	const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
	const minutes = Math.ceil(wordCount / wordPerMinute) // always use the worst case
	return minutes
}

export const extractHeadings = (content: SerializedEditorState) => {
	const headings: Heading[] = []
	content.root.children.forEach(node => {
		if (node.type === "heading") {
			const heading = node as SerializedHeadingNode

			if (
				heading.children[0] &&
				Predicate.hasProperty(heading.children[0], "text") &&
				Predicate.isString(heading.children[0].text)
			) {
				headings.push({
					type: heading.tag,
					text: heading.children[0].text,
					id: slugify(heading.children[0].text),
				})
			}
		}
	})

	return headings
}
