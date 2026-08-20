import { Exit, Schema } from "effect"
import { describe, expect, test } from "vitest"
import { expectExitSuccess } from "@/tests/helpers"
import {
	ContactFormSchema,
	FeedbackFormSchema,
	NewsletterFormSchema,
	decodeBestiarySearchParams,
	decodeErrorPageSearchParams,
	decodeInteractiveMapSearchParams,
	decodeMainQuestSearchParams,
	StandardErrorPageSchema,
} from "@/utils/validation-schemas"

const decodeNewsletter = Schema.decodeUnknownExit(NewsletterFormSchema)
const decodeContact = Schema.decodeUnknownExit(ContactFormSchema)
const decodeFeedback = Schema.decodeUnknownExit(FeedbackFormSchema)

describe("form validation schemas", () => {
	test("accepts valid newsletter, contact, and feedback payloads", () => {
		expect(Exit.isSuccess(decodeNewsletter({ email: "reader@example.com" }))).toBe(true)
		expect(
			Exit.isSuccess(
				decodeContact({
					name: "Reader",
					email: "reader@example.com",
					message: "This is useful.",
				}),
			),
		).toBe(true)
		expect(
			Exit.isSuccess(
				decodeFeedback({
					title: "Typo",
					email: "",
					feedback: "There is a typo on the map page.",
				}),
			),
		).toBe(true)
	})

	test("rejects invalid email and missing required message values", () => {
		expect(Exit.isFailure(decodeNewsletter({ email: "not-an-email" }))).toBe(true)
		expect(
			Exit.isFailure(
				decodeContact({
					name: "",
					email: "reader@example.com",
					message: "",
				}),
			),
		).toBe(true)
		expect(Exit.isFailure(decodeFeedback({ title: "Bug", email: "bad", feedback: "" }))).toBe(true)
	})
})

describe("search param validation schemas", () => {
	test("coerces multi-value params and omits defaults", () => {
		const bestiary = decodeBestiarySearchParams({
			game: "black-ops-6",
			map: ["terminus", "reckoning"],
		})

		const bestiaryValue = expectExitSuccess(bestiary)
		expect(bestiaryValue.game).toEqual(["black-ops-6"])
		expect(bestiaryValue.map).toEqual(["terminus", "reckoning"])
		expect(bestiaryValue.type).toEqual([])
	})

	test("rejects invalid pages while accepting known search shape", () => {
		expect(Exit.isFailure(decodeMainQuestSearchParams({ page: 0 }))).toBe(true)
		expect(
			Exit.isSuccess(
				decodeMainQuestSearchParams({
					page: 2,
					sort: "latest",
					game: ["black-ops-7"],
					time: [],
					difficulty: "Medium",
				}),
			),
		).toBe(true)
	})

	test("defaults a missing error-page message for Effect and Standard Schema decode", () => {
		const decoded = expectExitSuccess(decodeErrorPageSearchParams({}))
		expect(decoded.message).toBe("Something went wrong. Please try again.")

		const standard = StandardErrorPageSchema["~standard"].validate({})
		expect(standard).toEqual({
			value: { message: "Something went wrong. Please try again." },
		})
	})

	test("keeps an explicit error-page message", () => {
		const decoded = expectExitSuccess(decodeErrorPageSearchParams({ message: "Missing Token" }))
		expect(decoded.message).toBe("Missing Token")
	})

	test("decodes interactive map include, exclude, and layer search params", () => {
		const search = decodeInteractiveMapSearchParams({
			include: "perk",
			exclude: ["label"],
			layer: "boss-fight-arena",
		})

		const searchValue = expectExitSuccess(search)
		expect(searchValue).toEqual({
			include: ["perk"],
			exclude: ["label"],
			layer: "boss-fight-arena",
		})
	})
})
