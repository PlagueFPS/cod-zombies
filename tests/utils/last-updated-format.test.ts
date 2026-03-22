import { describe, expect, test } from "vitest"
import { formatRelativeTimeAgo, MS_DAY, MS_HOUR, MS_MONTH, MS_WEEK } from "@/utils/last-updated-format"

describe("formatRelativeTimeAgo", () => {
	const now = new Date(2026, 2, 15, 12, 0, 0).getTime()
	const locale = "en-US"
	const fallback = "March 1, 2026"

	test("falls back to provided string when timestamp is in the future", () => {
		const future = now + MS_DAY
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
		const past = now - MS_HOUR
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 hour ago/)
	})

	test("formats plural hours", () => {
		const past = now - MS_HOUR * 3
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 hours ago/)
	})

	test("formats days ago", () => {
		const past = now - MS_DAY
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 day ago/)
	})

	test("formats plural days", () => {
		const past = now - MS_DAY * 3
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 days ago/)
	})

	test("formats weeks ago", () => {
		const past = now - MS_WEEK
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 week ago/)
	})

	test("formats plural weeks", () => {
		const past = now - MS_WEEK * 3
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/3 weeks ago/)
	})

	test("formats months ago", () => {
		const past = now - MS_MONTH
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 month ago/)
	})

	test("formats plural months", () => {
		const past = now - MS_MONTH * 2
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/2 months ago/)
	})

	test("formats years ago", () => {
		const past = now - MS_MONTH * 12
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/1 year ago/)
	})

	test("24 months or more uses plural years", () => {
		const past = now - MS_MONTH * 24
		expect(formatRelativeTimeAgo(past, now, locale, fallback)).toMatch(/2 years ago/)
	})
})
