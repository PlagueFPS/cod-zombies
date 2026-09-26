import { Exit, Schema } from "effect"
import { afterEach, describe, expect, test, vi } from "vitest"
import { sendContentBroadcast, type ContentBroadcastInput } from "@/scripts/send-content-broadcast"
import { NEWSLETTER_FROM_ADDRESS } from "@/utils/constants"

type ZombieInput = Extract<ContentBroadcastInput, { kind: "zombie" }>

type QuestInput = Extract<ContentBroadcastInput, { kind: "quest" }>

type PolicyInput = Extract<ContentBroadcastInput, { kind: "policy" }>

const questBroadcast = {
	kind: "quest",
	type: "Main",
	title: "Reckoning",
	description: "Stabilize the Aether Reactors.",
	redirectUrl: "/main-quests/black-ops-6/reckoning",
	bullets: ["How to stabilize the Aether Reactors", "Where to find the Sentinel Artifact"],
} satisfies QuestInput

const zombieBroadcast = {
	kind: "zombie",
	type: "Boss",
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

		const result = await sendContentBroadcast(questBroadcast)

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
	})

	test("dry run keeps the zombie breakdown list fixed", async () => {
		const fetchMock = vi.fn<() => void>()
		vi.stubGlobal("fetch", fetchMock)

		const result = await sendContentBroadcast(zombieBroadcast)

		expect(fetchMock).not.toHaveBeenCalled()
		expect(result.mode).toBe("dry-run")

		if (result.mode !== "dry-run") return

		expect(result.html).toContain("How fast they move and how to counteract it")
		expect(result.html).toContain("How to defeat them effectively")
		expect(result.html).not.toContain("How to stabilize the Aether Reactors")
		expect(result.subject).toBe('New Boss Zombie Release: "Avogadro"')
	})

	test("dry run renders policy bullets", async () => {
		const result = await sendContentBroadcast(policyBroadcast)

		expect(result.mode).toBe("dry-run")

		if (result.mode !== "dry-run") return

		expect(result.subject).toBe("Privacy Policy Update")
		expect(result.html).toContain("How long confirmation tokens are kept")
		expect(result.html).toContain("Changes in this update")
		expect(result.text).toContain("How long confirmation tokens are kept")
	})

	test("rejects an empty bullet list", async () => {
		await expect(
			sendContentBroadcast({
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

		const result = await sendContentBroadcast(questBroadcast, { send: true })

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
