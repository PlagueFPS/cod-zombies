import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"
import { slugify } from "@/utils/shared-functions"

const headingChar = fc.constantFrom(
	..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_&".split(""),
)

const headingTextArb = fc.string({ unit: headingChar, minLength: 1, maxLength: 32 })

const blankHeadingArb = fc.integer({ min: 1, max: 32 }).map(length => " ".repeat(length))

describe("remark-mdx-meta slugify properties", () => {
	test("heading ids use the same slugify as shared-functions", () => {
		// Whitespace-only text never emits a heading. Every other sample does,
		// including "_" and "---", whose slugify result is "".
		fc.assert(
			fc.property(blankHeadingArb, text => {
				const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)

				expect(text.trim()).toBe("")
				expect(meta.headings[0]).toBeUndefined()
			}),
		)

		fc.assert(
			fc.property(
				headingTextArb.filter(text => text.trim() !== ""),
				text => {
					const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)
					const heading = meta.headings[0]

					expect(heading).toBeDefined()

					if (heading === undefined) {
						throw new Error("expected a heading for non-blank text")
					}

					expect(heading.id).toBe(slugify(text))
					expect(heading.id).toBe(slugify(heading.text))
				},
			),
		)
	})
})
