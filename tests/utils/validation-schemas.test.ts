import { Effect, Option } from "effect"
import { Schema } from "effect"
import { describe, expect, test } from "vitest"
import { expectExitFailure, expectExitSuccess } from "@/tests/helpers"
import {
	decodeLastModifiedData,
	decodeParams,
	decodeReckoningCode,
	decodeRichLinkNode,
	decodeTerminusCode,
	StandardContactFormSchema,
	StandardNewsletterFormSchema,
	validateFeedbackForm,
} from "@/utils/validation-schemas"

describe("decodeTerminusCode", () => {
	test("accepts single- and double-digit string coordinates in 0–99", () => {
		const values = expectExitSuccess(decodeTerminusCode({ x: "0", y: "12", z: "99" }))
		expect(values).toEqual({ x: 0, y: 12, z: 99 })
	})

	test("rejects non-numeric and out-of-range values", () => {
		expectExitFailure(decodeTerminusCode({ x: "abc", y: "1", z: "2" }))
		expectExitFailure(decodeTerminusCode({ x: "1", y: "1", z: "100" }))
		expectExitFailure(decodeTerminusCode({ x: "-1", y: "0", z: "0" }))
	})
})

describe("decodeReckoningCode", () => {
	test("accepts one-letter A–Z pairs", () => {
		const values = expectExitSuccess(decodeReckoningCode({ letter1: "A", letter2: "u" }))
		expect(values).toEqual({ letter1: "A", letter2: "u" })
	})

	test("rejects digits, multiple characters, and empty strings", () => {
		expectExitFailure(decodeReckoningCode({ letter1: "1", letter2: "A" }))
		expectExitFailure(decodeReckoningCode({ letter1: "AB", letter2: "C" }))
		expectExitFailure(decodeReckoningCode({ letter1: "", letter2: "A" }))
	})
})

describe("decodeParams", () => {
	test("maps missing route params to Option.none", () => {
		const decoded = decodeParams({})
		expect(decoded.id).toEqual(Option.none())
		expect(decoded.game).toEqual(Option.none())
		expect(decoded.map).toEqual(Option.none())
	})

	test("wraps present string params in Option.some", () => {
		const decoded = decodeParams({
			id: "nacht-der-untoten",
			game: "world-at-war",
			map: "nacht-der-untoten",
		})
		expect(decoded.id).toEqual(Option.some("nacht-der-untoten"))
		expect(decoded.game).toEqual(Option.some("world-at-war"))
		expect(decoded.map).toEqual(Option.some("nacht-der-untoten"))
	})

	test("treats null and undefined as absent", () => {
		const decoded = decodeParams({ id: null, game: undefined, message: "oops" })
		expect(decoded.id).toEqual(Option.none())
		expect(decoded.game).toEqual(Option.none())
		expect(decoded.message).toEqual(Option.some("oops"))
	})
})

describe("validateFeedbackForm", () => {
	test("accepts title and feedback with optional email omitted", () => {
		const exit = validateFeedbackForm({
			title: "Broken link",
			feedback: "Step 3 links to the wrong heading.",
		})
		expectExitSuccess(exit)
	})

	test("rejects empty title or feedback", () => {
		expectExitFailure(validateFeedbackForm({ title: "", feedback: "details" }))
		expectExitFailure(validateFeedbackForm({ title: "Bug", feedback: "" }))
	})

	test("rejects invalid email when provided", () => {
		expectExitFailure(
			validateFeedbackForm({
				title: "Bug",
				feedback: "details",
				email: "not-an-email",
			}),
		)
	})
})

describe("decodeRichLinkNode", () => {
	test("accepts non-empty link text", () => {
		const values = expectExitSuccess(decodeRichLinkNode({ text: "Main quest guide" }))
		expect(values.text).toBe("Main quest guide")
	})

	test("rejects empty text", () => {
		expectExitFailure(decodeRichLinkNode({ text: "" }))
	})
})

describe("decodeLastModifiedData", () => {
	test("decodes versioned file metadata JSON", async () => {
		const json = JSON.stringify({
			version: "1",
			generated: "2026-05-30T00:00:00.000Z",
			files: {
				"maps/foo.mdx": {
					lastModified: 1_700_000_000_000,
					lastModifiedFormatted: "Nov 14, 2023",
				},
			},
		})
		const decoded = await Effect.runPromise(decodeLastModifiedData(json))
		expect(decoded.version).toBe("1")
		expect(decoded.files["maps/foo.mdx"]?.lastModified).toBe(1_700_000_000_000)
	})
})

const decodeNewsletter = Schema.decodeExit(StandardNewsletterFormSchema)
const decodeContact = Schema.decodeExit(StandardContactFormSchema)

describe("newsletter and contact form schemas", () => {
	test("newsletter accepts a valid email", () => {
		expectExitSuccess(decodeNewsletter({ email: "player@example.com" }))
	})

	test("newsletter rejects invalid email", () => {
		expectExitFailure(decodeNewsletter({ email: "not-valid" }))
	})

	test("contact form accepts name, email, and message", () => {
		expectExitSuccess(
			decodeContact({
				name: "Alex",
				email: "alex@example.com",
				message: "Love the guides!",
			}),
		)
	})

	test("contact form rejects empty name or message", () => {
		expectExitFailure(decodeContact({ name: "", email: "alex@example.com", message: "Hi" }))
		expectExitFailure(decodeContact({ name: "Alex", email: "alex@example.com", message: "" }))
	})
})
