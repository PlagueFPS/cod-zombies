/**
 * Fill in the call at the bottom, then run:
 *   bun scripts/send-content-broadcast.ts
 *
 * Dry run is the default. It prints the rendered email and the broadcast payload
 * and does not contact the audience.
 *
 * Quest, relic, and policy need bullets for this release. Quest, relic, and zombie also take `id`,
 * the same slug the site uses for that entry's Open Graph image:
 *   { kind: "quest", type, id: "reckoning", title, description, redirectUrl, bullets: ["..."] }
 *   { kind: "relic", type, id: "lawyers-pen", title, description, redirectUrl, bullets: ["..."] }
 *   { kind: "policy", bullets: ["What changed in the policy"] }
 * Zombie uses the template's fixed breakdown list. Do not pass bullets:
 *   { kind: "zombie", type, id: "avogadro", title, description, redirectUrl }
 *
 * Send only when you mean it:
 *   bun scripts/send-content-broadcast.ts --send
 */
import type { RelicType } from "@/data/relics"
import type { ReactElement } from "react"
import { BunServices, BunRuntime } from "@effect/platform-bun"
import { render } from "@react-email/components"
import { Config, ConfigProvider, Effect, Encoding, Layer, Schema, Crypto, Redacted } from "effect"
import PrivacyPolicyUpdateEmail, {
	policyUpdatePreview,
	policyUpdateSubject,
} from "@/emails/policy-update-email"
import QuestReleaseEmail, { questReleaseSubject } from "@/emails/quest-release-email"
import RelicReleaseEmail, { relicReleaseSubject } from "@/emails/relic-release-email"
import ZombieReleaseEmail, { zombieReleaseSubject } from "@/emails/zombie-release-email"
import { Email } from "@/lib/services/emails"
import { NEWSLETTER_FROM_ADDRESS, SITE_ORIGIN } from "@/utils/constants"

const RESEND_UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}"

const BROADCAST_REPLY_TO = "contact@codzombiesguides.com"

const textEncoder = new TextEncoder()

const DevVarsConfig = ConfigProvider.layerAdd(
	ConfigProvider.fromDotEnv({ path: ".dev.vars" }).pipe(
		Effect.catchReason("PlatformError", "NotFound", () =>
			Effect.succeed(ConfigProvider.fromUnknown({})),
		),
	),
)

const BroadcastLive = Layer.mergeAll(Email.layer, BunServices.layer).pipe(
	Layer.provideMerge(Layer.provide(DevVarsConfig, BunServices.layer)),
)

export class BroadcastInputError extends Schema.TaggedError<BroadcastInputError>()(
	"BroadcastInputError",
	{
		message: Schema.String,
		cause: Schema.Defect(),
	},
) {}

export class MissingOpengraphImageError extends Schema.TaggedError<MissingOpengraphImageError>()(
	"MissingOpengraphImageError",
	{
		message: Schema.String,
		cause: Schema.Defect(),
	},
) {}

export class BroadcastRenderError extends Schema.TaggedError<BroadcastRenderError>()(
	"BroadcastRenderError",
	{
		message: Schema.String,
		cause: Schema.Defect(),
	},
) {}

export class BroadcastHashError extends Schema.TaggedError<BroadcastHashError>()(
	"BroadcastHashError",
	{
		message: Schema.String,
		cause: Schema.Defect(),
	},
) {}

export interface QuestBroadcastInput {
	kind: "quest"
	type: "Main" | "Side"
	id: string
	title: string
	description: string
	redirectUrl: string
	bullets: readonly string[]
}

export interface RelicBroadcastInput {
	kind: "relic"
	type: RelicType
	id: string
	title: string
	description: string
	redirectUrl: string
	bullets: readonly string[]
}

export interface ZombieBroadcastInput {
	kind: "zombie"
	type: "Normal" | "Special" | "Elite" | "Boss"
	id: string
	title: string
	description: string
	redirectUrl: string
}

export interface PolicyBroadcastInput {
	kind: "policy"
	bullets: readonly string[]
}

export type ContentBroadcastInput =
	| QuestBroadcastInput
	| RelicBroadcastInput
	| ZombieBroadcastInput
	| PolicyBroadcastInput

export interface BroadcastDryRun {
	mode: "dry-run"
	from: string
	replyTo: string
	subject: string
	previewText: string
	segmentId: string
	name: string
	html: string
	text: string
}

export interface BroadcastSent {
	mode: "sent"
	id: string
	subject: string
}

interface RenderedBroadcast {
	name: string
	subject: string
	previewText: string
	html: string
	text: string
	react: ReactElement
}

function guideUrl(redirectUrl: string): string {
	if (redirectUrl.startsWith("https://") || redirectUrl.startsWith("http://")) return redirectUrl
	const path = redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`

	return `${SITE_ORIGIN}${path}`
}

function emailBuildError(
	cause: unknown,
	fallback: string,
): MissingOpengraphImageError | BroadcastRenderError {
	if (cause instanceof Error && cause.message.startsWith("Missing opengraph image")) {
		return new MissingOpengraphImageError({ message: cause.message, cause })
	}

	return new BroadcastRenderError({ message: fallback, cause })
}

const renderEmail = Effect.fn("renderEmail")(function* (react: ReactElement) {
	const html = yield* Effect.tryPromise({
		try: () => render(react),
		catch: cause =>
			new BroadcastRenderError({
				message: "Failed to render the broadcast email.",
				cause,
			}),
	})

	const text = yield* Effect.tryPromise({
		try: () => render(react, { plainText: true }),
		catch: cause =>
			new BroadcastRenderError({
				message: "Failed to render the broadcast email as text.",
				cause,
			}),
	})

	if (!html.includes("RESEND_UNSUBSCRIBE_URL")) {
		return yield* new BroadcastRenderError({
			message: "Broadcast HTML is missing the Resend unsubscribe URL.",
			cause: html,
		})
	}

	return { html, text }
})

const renderBroadcast = Effect.fn("renderBroadcast")(function* (broadcast: ContentBroadcastInput) {
	const serverUrl = SITE_ORIGIN
	const unsubscribeUrl = RESEND_UNSUBSCRIBE_URL

	switch (broadcast.kind) {
		case "quest": {
			const subject = questReleaseSubject(broadcast.type, broadcast.title)
			const previewText = broadcast.description

			const react = yield* Effect.try({
				try: () =>
					QuestReleaseEmail({
						type: broadcast.type,
						id: broadcast.id,
						title: broadcast.title,
						description: broadcast.description,
						redirectUrl: guideUrl(broadcast.redirectUrl),
						unsubscribeUrl,
						serverUrl,
						bullets: broadcast.bullets,
					}),
				catch: cause => emailBuildError(cause, "Failed to build the quest email."),
			})

			const rendered = yield* renderEmail(react)

			return {
				name: subject,
				subject,
				previewText,
				react,
				html: rendered.html,
				text: rendered.text,
			} satisfies RenderedBroadcast
		}

		case "relic": {
			const subject = relicReleaseSubject(broadcast.type, broadcast.title)
			const previewText = broadcast.description

			const react = yield* Effect.try({
				try: () =>
					RelicReleaseEmail({
						type: broadcast.type,
						id: broadcast.id,
						title: broadcast.title,
						description: broadcast.description,
						redirectUrl: guideUrl(broadcast.redirectUrl),
						unsubscribeUrl,
						serverUrl,
						bullets: broadcast.bullets,
					}),
				catch: cause => emailBuildError(cause, "Failed to build the relic email."),
			})

			const rendered = yield* renderEmail(react)

			return {
				name: subject,
				subject,
				previewText,
				react,
				html: rendered.html,
				text: rendered.text,
			} satisfies RenderedBroadcast
		}

		case "zombie": {
			const subject = zombieReleaseSubject(broadcast.type, broadcast.title)

			const react = yield* Effect.try({
				try: () =>
					ZombieReleaseEmail({
						type: broadcast.type,
						id: broadcast.id,
						title: broadcast.title,
						description: broadcast.description,
						redirectUrl: guideUrl(broadcast.redirectUrl),
						unsubscribeUrl,
						serverUrl,
					}),
				catch: cause => emailBuildError(cause, "Failed to build the zombie email."),
			})

			const rendered = yield* renderEmail(react)

			return {
				name: subject,
				subject,
				previewText: broadcast.description,
				react,
				html: rendered.html,
				text: rendered.text,
			} satisfies RenderedBroadcast
		}

		case "policy": {
			const react = PrivacyPolicyUpdateEmail({
				unsubscribeUrl,
				serverUrl,
				bullets: broadcast.bullets,
			})

			const rendered = yield* renderEmail(react)

			return {
				name: policyUpdateSubject,
				subject: policyUpdateSubject,
				previewText: policyUpdatePreview,
				react,
				html: rendered.html,
				text: rendered.text,
			} satisfies RenderedBroadcast
		}

		default: {
			const exhaustive: never = broadcast

			return yield* new BroadcastInputError({
				message: `Unexpected broadcast kind: ${JSON.stringify(exhaustive)}`,
				cause: exhaustive,
			})
		}
	}
})

const contentIdempotencyKey = Effect.fn("contentIdempotencyKey")(function* (
	broadcast: ContentBroadcastInput,
	subject: string,
) {
	const crypto = yield* Crypto.Crypto

	const digest = yield* crypto
		.digest("SHA-256", textEncoder.encode(JSON.stringify({ broadcast, subject })))
		.pipe(
			Effect.mapError(
				cause =>
					new BroadcastHashError({
						message: "Failed to hash the broadcast for an idempotency key.",
						cause,
					}),
			),
		)

	const fingerprint = Encoding.encodeHex(digest).slice(0, 32)

	return `content-broadcast/${broadcast.kind}/${fingerprint}`
})

export const sendContentBroadcast = Effect.fn("sendContentBroadcast")(function* (
	broadcast: ContentBroadcastInput,
	options?: { readonly send?: boolean },
) {
	const rendered = yield* renderBroadcast(broadcast)
	const audienceId = yield* Config.Redacted("RESEND_AUDIENCE_ID")
	const send = options?.send === true

	if (!send) {
		return {
			mode: "dry-run" as const,
			from: NEWSLETTER_FROM_ADDRESS,
			replyTo: BROADCAST_REPLY_TO,
			subject: rendered.subject,
			previewText: rendered.previewText,
			segmentId: Redacted.value(audienceId),
			name: rendered.name,
			html: rendered.html,
			text: rendered.text,
		} satisfies BroadcastDryRun
	}

	const emails = yield* Email
	const idempotencyKey = yield* contentIdempotencyKey(broadcast, rendered.subject)

	const data = yield* emails.createBroadcast(
		{
			name: rendered.name,
			from: NEWSLETTER_FROM_ADDRESS,
			replyTo: BROADCAST_REPLY_TO,
			subject: rendered.subject,
			previewText: rendered.previewText,
			segmentId: Redacted.value(audienceId),
			react: rendered.react,
			text: rendered.text,
			send: true,
		},
		{ headers: { "Idempotency-Key": idempotencyKey } },
	)

	return { mode: "sent" as const, id: data.id, subject: rendered.subject } satisfies BroadcastSent
})

function printResult(result: BroadcastDryRun | BroadcastSent): void {
	switch (result.mode) {
		case "dry-run":
			console.log("Dry run. No broadcast was sent.")
			console.log("")
			console.log(`From: ${result.from}`)
			console.log(`Reply-to: ${result.replyTo}`)
			console.log(`Segment: ${result.segmentId}`)
			console.log(`Name: ${result.name}`)
			console.log(`Subject: ${result.subject}`)
			console.log(`Preview: ${result.previewText}`)
			console.log("")
			console.log("--- Plain text ---")
			console.log(result.text)
			console.log("Pass --send to deliver this broadcast.")

			return
		case "sent":
			console.log(`Sent broadcast ${result.id}`)
			console.log(`Subject: ${result.subject}`)

			return
		default: {
			const exhaustive: never = result
			throw new Error(`Unexpected broadcast result: ${JSON.stringify(exhaustive)}`)
		}
	}
}

if (import.meta.main) {
	const send = process.argv.includes("--send")

	// Replace this argument, then run the command in the file comment.
	// Relic example:
	// { kind: "relic", type: "Grim", id: "lawyers-pen", title: "Lawyer's Pen", description: "Mimic props have infiltrated the map.", redirectUrl: "/relics/black-ops-7/lawyers-pen", bullets: ["Where to light the three red candles"] }
	// Policy example:
	// { kind: "policy", bullets: ["How long confirmation tokens are kept"] }
	// Zombie example (no bullets; id is the bestiary slug):
	// { kind: "zombie", type: "Boss", id: "avogadro", title: "Avogadro", description: "...", redirectUrl: "/bestiary/avogadro" }
	sendContentBroadcast(
		{
			kind: "relic",
			type: "Special",
			id: "mister-peeks-mayhem",
			title: "Mister Peeks Mayhem",
			description: "All Cursed Tier rewards active and mayhem is increased.",
			redirectUrl: "/relics/black-ops-7/mister-peeks-mayhem",
			bullets: [
				"How to complete the Super Easter Egg",
				"Detailed walkthrough of all steps on all maps",
				"Any requirements for specific maps.",
				"Tips and strategies for completing The Play Date encounter with the twins.",
			],
		},
		{ send },
	).pipe(
		Effect.tap(result => Effect.sync(() => printResult(result))),
		Effect.provide(BroadcastLive),
		BunRuntime.runMain,
	)
}
