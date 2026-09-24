import * as fc from "fast-check"
import { describe, expect, test } from "vitest"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"
import { slugify } from "@/utils/shared-functions"

const headingChar = fc.constantFrom(
	..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_&".split(""),
)

const headingTextArb = fc.string({ unit: headingChar, minLength: 1, maxLength: 32 })

describe("remark-mdx-meta slugify properties", () => {
	test("heading ids use the same slugify as shared-functions", () => {
		fc.assert(
			fc.property(headingTextArb, text => {
				const meta = getMdxDocumentMetaFromSource(`## ${text}\n\nSome words to read.`)
				const heading = meta.headings[0]

				if (slugify(text) === "") {
					expect(heading).toBeUndefined()

					return
				}

				expect(heading).toBeDefined()
				expect(heading?.id).toBe(slugify(text))
				expect(heading?.id).toBe(slugify(heading?.text ?? ""))
			}),
		)
	})
})
