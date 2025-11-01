import type {
	getLastUpdated as GetLastUpdatedType,
	getServerUrl as GetServerUrlType,
} from "@/utils/functions"
import { afterEach, beforeAll, describe, expect, mock, test } from "bun:test"
import { Redacted } from "effect"

// We'll use dynamic imports to ensure mocks are set up first
let getLastUpdated: typeof GetLastUpdatedType
let getServerUrl: typeof GetServerUrlType

// Set up the mocks and import the module in a beforeAll hook
beforeAll(async () => {
	// Mock the last-modified.json module
	mock.module("@/data/last-modified.json", () => ({
		files: {
			"test/file.mdx": {
				lastModified: "2025-10-31T12:00:00.000Z",
				lastModifiedFormatted: "October 31, 2025",
			},
		},
	}))

	// Now import the module
	const functions = await import("@/utils/functions")
	getLastUpdated = functions.getLastUpdated
	getServerUrl = functions.getServerUrl
})

describe("getServerUrl", () => {
	const originalEnv = { ...process.env }

	afterEach(() => {
		process.env = originalEnv
	})

	test("should return localhost URL in development", () => {
		mock.module("@/env", () => ({
			env: {
				VERCEL_ENV: Redacted.make("development"),
				VERCEL_URL: Redacted.make("localhost:3000"),
				VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("example.com"),
			},
		}))
		expect(getServerUrl()).toBe("http://localhost:3000")
	})

	test("should return preview URL in preview environment", () => {
		mock.module("@/env", () => ({
			env: {
				VERCEL_ENV: Redacted.make("preview"),
				VERCEL_URL: Redacted.make("preview.example.com"),
				VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("example.com"),
			},
		}))
		expect(getServerUrl()).toBe("https://preview.example.com")
	})

	test("should return production URL in production environment", () => {
		mock.module("@/env", () => ({
			env: {
				VERCEL_ENV: Redacted.make("production"),
				VERCEL_URL: Redacted.make("example.vercel.app"),
				VERCEL_PROJECT_PRODUCTION_URL: Redacted.make("example.com"),
			},
		}))
		expect(getServerUrl()).toBe("https://example.com")
	})
})

describe("getLastUpdated", () => {
	test("should return last modified data for existing file", () => {
		const result = getLastUpdated("test/file.mdx")
		expect(result).toEqual({
			lastModified: "2025-10-31T12:00:00.000Z",
			lastModifiedFormatted: "October 31, 2025",
		})
	})

	test("should throw error for non-existing file", () => {
		expect(() => getLastUpdated("non-existing-file.mdx")).toThrow()
	})
})
