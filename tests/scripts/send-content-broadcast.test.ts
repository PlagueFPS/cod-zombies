import { layer as BunCryptoLayer } from "@effect/platform-bun/BunCrypto"
import { Effect, Exit, Schema } from "effect"
import { afterEach, describe, expect, test, vi } from "vitest"
import { sendContentBroadcast, type ContentBroadcastInput } from "@/scripts/send-content-broadcast"
import { NEWSLETTER_FROM_ADDRESS, SITE_ORIGIN } from "@/utils/constants"
import { opengraphImageUrl } from "@/utils/opengraph-image-url"

type ZombieInput = Extract<ContentBroadcastInput, { kind: "zombie" }>

type QuestInput = Extract<ContentBroadcastInput, { kind: "quest" }>

type PolicyInput = Extract<ContentBroadcastInput, { kind: "policy" }>

const questBroadcast = {
	kind: "quest",
	type: "Main",
	id: "reckoning",
	title: "Reckoning",
	description: "Stabilize the Aether Reactors.",
	redirectUrl: "/main-quests/black-ops-6/reckoning",
	bullets: ["How to stabilize the Aether Reactors", "Where to find the Sentinel Artifact"],
} satisfies QuestInput

const zombieBroadcast = {
	kind: "zombie",
	type: "Boss",
	id: "avogadro",
	title: "Avogadro",
	description: "A boss zombie on Tranzit and Alpha Omega.",
	redirectUrl: "/bestiary/avogadro",
} satisfies ZombieInput

const policyBroadcast = {
	kind: "policy",
	bullets: ["How long confirmation tokens are kept"],
} satisfies PolicyInput

const BroadcastRequestBody = Schema.Struct({
	from: Schema.String,
	segment_id: Schema.String,
	subject: Schema.String,
	send: Schema.Boolean,
	html: Schema.String,
	text: Schema.String,
})

function runBroadcast(broadcast: ContentBroadcastInput, options?: { readonly send?: boolean }) {
	return Effect.runPromise(
		sendContentBroadcast(broadcast, options).pipe(Effect.provide(BunCryptoLayer)),
	)
}

function requestUrl(input: RequestInfo | URL): string {
	if (input instanceof URL) return input.href

	if (input instanceof Request) return input.url

	return input
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe("sendContentBroadcast", () => {
	test("quest and policy require bullets and zombie does not", () => {
		const questHasBullets: "bullets" extends keyof QuestInput ? true : false = true
		const policyHasBullets: "bullets" extends keyof PolicyInput ? true : false = true
		const zombieHasBullets: "bullets" extends keyof ZombieInput ? true : false = false

		expect(questHasBullets).toBe(true)
		expect(policyHasBullets).toBe(true)
		expect(zombieHasBullets).toBe(false)
	})

	test("dry run renders custom quest bullets and does not contact Resend", async () => {
		const fetchMock = vi.fn<() => void>()
		vi.stubGlobal("fetch", fetchMock)

		const result = await runBroadcast(questBroadcast)

		expect(fetchMock).not.toHaveBeenCalled()
		expect(result.mode).toBe("dry-run")

		if (result.mode !== "dry-run") return

		expect(result.from).toBe(NEWSLETTER_FROM_ADDRESS)
		expect(result.segmentId).toBe("test-audience")
		expect(result.subject).toBe('New Main Quest Guide: "Reckoning"')
		expect(result.html).toContain("How to stabilize the Aether Reactors")
		expect(result.html).toContain("Where to find the Sentinel Artifact")
		expect(result.html).not.toContain("Recommended GobbleGums")
		expect(result.html).toContain("RESEND_UNSUBSCRIBE_URL")
		expect(result.text).toContain("How to stabilize the Aether Reactors")
		expect(result.html).toContain("https://codzombiesguides.com/main-quests/black-ops-6/reckoning")
		const questImageUrl = opengraphImageUrl(SITE_ORIGIN, "main-quests", "reckoning")
		expect(questImageUrl).toBeDefined()

		if (questImageUrl === undefined) return

		expect(result.html).toContain(questImageUrl)
		expect(result.html).toContain("Preview card for the Reckoning main quest guide")
	})

	test("dry run keeps the zombie breakdown list fixed", async () => {
		const fetchMock = vi.fn<() => void>()
		vi.stubGlobal("fetch", fetchMock)

		const result = await runBroadcast(zombieBroadcast)

		expect(fetchMock).not.toHaveBeenCalled()
		expect(result.mode).toBe("dry-run")

		if (result.mode !== "dry-run") return

		expect(result.html).toContain("How fast they move and how to counteract it")
		expect(result.html).toContain("How to defeat them effectively")
		expect(result.html).not.toContain("How to stabilize the Aether Reactors")
		expect(result.subject).toBe('New Boss Zombie Release: "Avogadro"')
		const zombieImageUrl = opengraphImageUrl(SITE_ORIGIN, "zombies", "avogadro")
		expect(zombieImageUrl).toBeDefined()

		if (zombieImageUrl === undefined) return

		expect(result.html).toContain(zombieImageUrl)
		expect(result.html).toContain("Preview card for the Avogadro Boss zombie")
		expect(result.html).not.toContain("opengraph-reckoning")
	})

	test("dry run renders policy bullets", async () => {
		const result = await runBroadcast(policyBroadcast)

		expect(result.mode).toBe("dry-run")

		if (result.mode !== "dry-run") return

		expect(result.subject).toBe("Privacy Policy Update")
		expect(result.html).toContain("How long confirmation tokens are kept")
		expect(result.html).toContain("Changes in this update")
		expect(result.text).toContain("How long confirmation tokens are kept")
		expect(result.html).not.toContain("opengraph-images")
	})

	test("rejects a quest id that has no opengraph image", async () => {
		await expect(
			runBroadcast({
				...questBroadcast,
				id: "no-such-map",
			}),
		).rejects.toThrow(/Missing opengraph image for main-quests: no-such-map/)
	})

	test("rejects an empty bullet list", async () => {
		await expect(
			runBroadcast({
				kind: "policy",
				bullets: [],
			}),
		).rejects.toThrow(/bullet point/)
	})

	test("send flag posts a broadcast payload and does not use a live audience by default", async () => {
		const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(
			async () => {
				return new Response(JSON.stringify({ id: "bc_test" }), {
					status: 200,
					headers: { "content-type": "application/json" },
				})
			},
		)

		vi.stubGlobal("fetch", fetchMock)

		const result = await runBroadcast(questBroadcast, { send: true })

		expect(result).toEqual({
			mode: "sent",
			id: "bc_test",
			subject: 'New Main Quest Guide: "Reckoning"',
		})
		expect(fetchMock).toHaveBeenCalledOnce()

		const call = fetchMock.mock.calls[0]
		expect(call).toBeDefined()

		if (!call) return
		const [url, init] = call
		expect(requestUrl(url)).toContain("/broadcasts")
		expect(init?.method).toBe("POST")

		const headers = new Headers(init?.headers)
		expect(headers.get("Idempotency-Key")).toMatch(/^content-broadcast\/quest\//)
		expect(headers.get("Authorization")).toBe("Bearer test-key")

		const rawBody: unknown = init?.body
		const rawText = Schema.decodeUnknownExit(Schema.String)(rawBody)

		expect(Exit.isSuccess(rawText)).toBe(true)

		if (Exit.isFailure(rawText)) return

		const bodyExit = Schema.decodeUnknownExit(BroadcastRequestBody)(JSON.parse(rawText.value))

		expect(Exit.isSuccess(bodyExit)).toBe(true)

		if (Exit.isFailure(bodyExit)) return

		const body = bodyExit.value

		expect(body.from).toBe(NEWSLETTER_FROM_ADDRESS)
		expect(body.segment_id).toBe("test-audience")
		expect(body.send).toBe(true)
		expect(body.html).toContain("How to stabilize the Aether Reactors")
		expect(body.html).toContain("RESEND_UNSUBSCRIBE_URL")
		expect(body.text).toContain("How to stabilize the Aether Reactors")
		expect(JSON.stringify(body)).not.toContain("test-key")
	})
})
