import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { ConfigProvider, Effect, Exit, Layer, Option } from "effect"
import { Command } from "effect/cli"
import { Digest } from "effect/crypto"
import { describe, expect, test } from "vitest"
import { Email } from "@/lib/services/emails"
import {
	broadcastCli,
	BroadcastInputError,
	resolveContentBroadcast,
	resolvePolicyBroadcast,
	sendBroadcast,
} from "@/scripts/send-broadcast"
import { expectCauseTaggedError, expectExitFailure, expectExitSuccess } from "@/tests/helpers"

const emailLayerTest = Layer.mock(Email, {
	createBroadcast: () => Effect.succeed({ id: "123" }),
})

const testConfig = ConfigProvider.layer(
	ConfigProvider.fromUnknown({
		RESEND_AUDIENCE_ID: "aud_test",
		RESEND_API_KEY: "re_test",
	}),
)

const testLayer = Layer.mergeAll(
	emailLayerTest,
	BunServicesLayer,
	testConfig,
	Digest.layerWebCrypto,
)

const runBroadcast = Command.runWith(broadcastCli, { version: "1.0.0" })

describe("resolveContentBroadcast", () => {
	test("should build a relic broadcast from the catalog slug", async () => {
		const program = resolveContentBroadcast({
			kind: "relic",
			id: "mister-peeks-mayhem",
			bullets: ["How to complete the Super Easter Egg"],
			title: Option.none(),
			description: Option.none(),
		})

		const exit = await Effect.runPromiseExit(program)

		const broadcast = expectExitSuccess(exit)
		expect(broadcast).toMatchObject({
			kind: "relic",
			type: "Special",
			id: "mister-peeks-mayhem",
			title: "Mister Peeks Mayhem",
			redirectUrl: "/relics/black-ops-7/mister-peeks-mayhem",
			bullets: ["How to complete the Super Easter Egg"],
		})
	})

	test("should build a main quest broadcast from the map slug", async () => {
		const program = resolveContentBroadcast({
			kind: "main-quest",
			id: "reckoning",
			bullets: [" How to stabilize the reactors "],
			title: Option.some("Reckoning"),
			description: Option.none(),
		})

		const exit = await Effect.runPromiseExit(program)

		const broadcast = expectExitSuccess(exit)
		expect(broadcast).toMatchObject({
			kind: "quest",
			type: "Main",
			id: "reckoning",
			title: "Reckoning",
			redirectUrl: "/main-quests/black-ops-6/reckoning",
			bullets: ["How to stabilize the reactors"],
		})
	})

	test("should reject a relic that is missing --bullet", async () => {
		const program = resolveContentBroadcast({
			kind: "relic",
			id: "lawyers-pen",
			bullets: [],
			title: Option.none(),
			description: Option.none(),
		})

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("--bullet")
	})

	test("should reject --bullet on a zombie broadcast", async () => {
		const program = resolveContentBroadcast({
			kind: "zombie",
			id: "avogadro",
			bullets: ["Custom line"],
			title: Option.none(),
			description: Option.none(),
		})

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("Do not pass --bullet")
	})

	test("should reject an unknown relic id", async () => {
		const program = resolveContentBroadcast({
			kind: "relic",
			id: "not-a-relic",
			bullets: ["A line"],
			title: Option.none(),
			description: Option.none(),
		})

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("not-a-relic")
	})
})

describe("resolvePolicyBroadcast", () => {
	test("should trim policy bullets", async () => {
		const program = resolvePolicyBroadcast(["  How long confirmation tokens are kept  "])

		const exit = await Effect.runPromiseExit(program)

		expect(expectExitSuccess(exit)).toEqual({
			kind: "policy",
			bullets: ["How long confirmation tokens are kept"],
		})
	})
})

describe("sendBroadcast", () => {
	test("preserves the canonical SHA-256 idempotency fingerprint", async () => {
		let key = ""

		const email = Layer.mock(Email, {
			createBroadcast: (_params, options) => {
				key = new Headers(options?.headers).get("Idempotency-Key") ?? ""

				return Effect.succeed({ id: "123" })
			},
		})

		await Effect.runPromise(
			sendBroadcast(
				{ kind: "policy", bullets: ["How long confirmation tokens are kept"] },
				{ send: true },
			).pipe(Effect.provide(Layer.mergeAll(email, testConfig, Digest.layerWebCrypto))),
		)
		expect(key).toBe("broadcast/policy/8c106a5ccc7b20d3e2ceaf829d6a1a4b")
	})

	test("should dry-run a policy broadcast without calling Resend", async () => {
		const program = sendBroadcast(
			{ kind: "policy", bullets: ["How long confirmation tokens are kept"] },
			{ send: false },
		).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		const result = expectExitSuccess(exit)

		if (result.mode !== "dry-run") {
			throw new Error(`expected a dry run, got ${result.mode}`)
		}

		expect(result.subject).toBe("Privacy Policy Update")
		expect(result.text).toContain("How long confirmation tokens are kept")
		expect(result.segmentId).toBe("aud_test")
	})

	test("should send a policy broadcast through the email service when send is set", async () => {
		const program = sendBroadcast(
			{ kind: "policy", bullets: ["How long confirmation tokens are kept"] },
			{ send: true },
		).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		expect(expectExitSuccess(exit)).toEqual({
			mode: "sent",
			id: "123",
			subject: "Privacy Policy Update",
		})
	})
})

describe("broadcastCli", () => {
	test("should dry-run a policy subcommand", async () => {
		const program = runBroadcast([
			"policy",
			"--bullet",
			"How long confirmation tokens are kept",
		]).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		expect(Exit.isSuccess(exit)).toBe(true)
	})

	test("should accept -k, -i, -b, and -s in place of the long flags", async () => {
		const program = runBroadcast([
			"content",
			"-k",
			"relic",
			"-i",
			"lawyers-pen",
			"-b",
			" ",
			"-s",
		]).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("--bullet")
	})

	test("should accept -t and -d in place of --title and --description", async () => {
		const program = runBroadcast([
			"content",
			"-k",
			"relic",
			"-i",
			"lawyers-pen",
			"-b",
			"Where to light the three red candles",
			"-t",
			" ",
		]).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("--title")
	})

	test("should accept -d in place of --description", async () => {
		const program = runBroadcast([
			"content",
			"-k",
			"relic",
			"-i",
			"lawyers-pen",
			"-b",
			"Where to light the three red candles",
			"-d",
			" ",
		]).pipe(Effect.provide(testLayer))

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("--description")
	})

	test("should fail a content command that omits --bullet", async () => {
		const program = runBroadcast(["content", "--kind", "relic", "--id", "lawyers-pen"]).pipe(
			Effect.provide(testLayer),
		)

		const exit = await Effect.runPromiseExit(program)

		const cause = expectExitFailure(exit)
		const error = expectCauseTaggedError<BroadcastInputError>(cause, "BroadcastInputError")
		expect(error).toBeInstanceOf(BroadcastInputError)
		expect(error.message).toContain("--bullet")
	})
})
