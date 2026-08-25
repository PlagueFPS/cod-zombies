import { describe, expect, test } from "vitest"
import { SITE_ORIGIN } from "@/utils/constants"
import { isLoopbackHost, resolvePublicOrigin } from "@/utils/public-origin"

describe("isLoopbackHost", () => {
	test("matches localhost variants", () => {
		expect(isLoopbackHost("localhost")).toBe(true)
		expect(isLoopbackHost("LOCALHOST")).toBe(true)
		expect(isLoopbackHost("preview.localhost")).toBe(true)
	})

	test("matches IPv4 and IPv6 loopback", () => {
		expect(isLoopbackHost("127.0.0.1")).toBe(true)
		expect(isLoopbackHost("127.0.0.2")).toBe(true)
		expect(isLoopbackHost("0.0.0.0")).toBe(true)
		expect(isLoopbackHost("::1")).toBe(true)
		expect(isLoopbackHost("[::1]")).toBe(true)
		expect(isLoopbackHost("::ffff:127.0.0.1")).toBe(true)
	})

	test("rejects public hosts", () => {
		expect(isLoopbackHost("codzombiesguides.com")).toBe(false)
		expect(isLoopbackHost("cod-zombies.workers.dev")).toBe(false)
		expect(isLoopbackHost("192.168.1.1")).toBe(false)
	})
})

describe("resolvePublicOrigin", () => {
	test("rewrites the TanStack prerender preview origin in production", () => {
		const prerenderUrl = new URL(
			"http://127.0.0.1:35889/opengraph-images/main-quests/opengraph-rex-infernus-v3.jpg",
		)
		expect(resolvePublicOrigin(prerenderUrl, true)).toBe(SITE_ORIGIN)
	})

	test("keeps loopback origins in development so local SSR matches the client", () => {
		const local = new URL("http://127.0.0.1:3000/main-quests/black-ops-7/rex-infernus")
		expect(resolvePublicOrigin(local, false)).toBe("http://127.0.0.1:3000")
	})

	test("keeps a public request origin even when replacing loopback", () => {
		const preview = new URL("https://abc.cod-zombies.workers.dev/bestiary")
		expect(resolvePublicOrigin(preview, true)).toBe("https://abc.cod-zombies.workers.dev")
	})

	test("does not strip https from the canonical origin", () => {
		expect(SITE_ORIGIN).toBe("https://codzombiesguides.com")
		expect(resolvePublicOrigin(new URL("http://localhost:4173/"), true)).toBe(
			"https://codzombiesguides.com",
		)
	})
})
