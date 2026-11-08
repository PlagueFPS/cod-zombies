import { it } from "@effect/vitest"
import { Arbitrary, Schema, Predicate, Array as Arr, String as Str } from "effect"
import { describe, expect } from "vitest"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"
import { slugify } from "@/utils/shared-functions"

const headingChar = Arbitrary.schema(
	Schema.Literals(
		Str.split("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_&", ""),
	),
)

const headingTextArb = Arbitrary.array(headingChar, { minLength: 1, maxLength: 32 }).pipe(
	Arbitrary.map(Arr.join("")),
)

const blankHeadingArb = Arbitrary.schema(
	Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 32 })),
).pipe(Arbitrary.map(length => Str.repeat(length)(" ")))

describe("remark-mdx-meta slugify properties", () => {
	it.prop("blank headings are omitted", [blankHeadingArb], ([text]) => {
		const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)

		expect(Str.trim(text)).toBe("")
		expect(meta.headings[0]).toBeUndefined()
	})

	it.prop(
		"non-blank headings use the shared slugify",
		[headingTextArb.pipe(Arbitrary.filter(text => Str.trim(text) !== ""))],
		([text]) => {
			const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)
			const heading = meta.headings[0]

			expect(heading).toBeDefined()

			if (Predicate.isUndefined(heading)) {
				throw new Error("expected a heading for non-blank text")
			}

			expect(heading.id).toBe(slugify(text))
			expect(heading.id).toBe(slugify(heading.text))
		},
	)
})
