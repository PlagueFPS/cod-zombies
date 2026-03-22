import { describe, expect, test } from "vitest"
import { formatRelativeTimeAgo } from "@/utils/last-updated-format"

describe("formatRelativeTimeAgo", () => {
	const now = new Date(2026, 2, 15, 12, 0, 0).getTime()
	const locale = "en-US"
	const fallback = "March 1, 2026"

	test("falls back to provided string when timestamp is in the future", () => {
		const future = now + 86_400_000
		expect(formatRelativeTimeAgo(future, now, locale, fallback)).toBe(fallback)
	})

	test("under 2 minutes shows as 1 minute ago", () => {
		expect(formatRelativeTimeAgo(now - 45_000, now, locale, fallback)).toMatch(/1 minute ago/)
		expect(formatRelativeTimeAgo(now - 119_000, now, locale, fallback)).toMatch(/1 minute ago/)
	})

	test("at 2 minutes shows 2 minutes ago", () => {
		expect(formatRelativeTimeAgo(now - 120_000, now, locale, fallback)).toMatch(/2 minutes ago/)
	})

	test("formats hours ago", () => {
		const past = now - 1 * 3_600_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 hour ago/)
	})

	test("formats plural hours", () => {
		const past = now - 3 * 3_600_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 hours ago/)
	})

	test("formats days ago", () => {
		const past = now - 1 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 day ago/)
	})

	test("formats plural days", () => {
		const past = now - 3 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 days ago/)
	})

	test("formats weeks ago", () => {
		const past = now - 7 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 week ago/)
	})

	test("formats plural weeks", () => {
		const past = now - 3 * 7 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 weeks ago/)
	})

	test("formats months ago", () => {
		const past = now - 31 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 month ago/)
	})

	test("formats plural months", () => {
		const past = now - 2 * 31 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/2 months ago/)
	})

	test("formats years ago", () => {
		const past = now - 365 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 year ago/)
	})

	test("24 months or more uses plural years", () => {
		const past = now - 730 * 86_400_000
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/2 years ago/)
	})
})
