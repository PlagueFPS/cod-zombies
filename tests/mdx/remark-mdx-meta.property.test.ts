import { Predicate, String as Str } from "effect"
import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"
import { slugify } from "@/utils/shared-functions"

const headingChar = fc.constantFrom(
	...Str.split("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_&", ""),
)

const headingTextArb = fc.string({ unit: headingChar, minLength: 1, maxLength: 32 })

const blankHeadingArb = fc.integer({ min: 1, max: 32 }).map(length => Str.repeat(length)(" "))

describe("remark-mdx-meta slugify properties", () => {
	test("heading ids use the same slugify as shared-functions", () => {
		fc.assert(
			fc.property(blankHeadingArb, text => {
				const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)

				expect(Str.trim(text)).toBe("")
				expect(meta.headings[0]).toBeUndefined()
			}),
		)

		fc.assert(
			fc.property(
				headingTextArb.filter(text => Str.trim(text) !== ""),
				text => {
					const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)
					const heading = meta.headings[0]

					expect(heading).toBeDefined()

					if (Predicate.isUndefined(heading)) {
						throw new Error("expected a heading for non-blank text")
					}

					expect(heading.id).toBe(slugify(text))
					expect(heading.id).toBe(slugify(heading.text))
				},
			),
		)
	})
})
