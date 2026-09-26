/**
 * Fill in the call at the bottom, then run:
 *   bun scripts/send-content-broadcast.ts
 *
 * Dry run is the default. It prints the rendered email and the broadcast payload
 * and does not contact the audience.
 *
 * Quest and policy need bullets for this release. Quest and zombie also take `id`,
 * the same slug the site uses for that entry's Open Graph image:
 *   { kind: "quest", type, id: "reckoning", title, description, redirectUrl, bullets: ["..."] }
 *   { kind: "policy", bullets: ["What changed in the policy"] }
 * Zombie uses the template's fixed breakdown list. Do not pass bullets:
 *   { kind: "zombie", type, id: "avogadro", title, description, redirectUrl }
 *
 * Send only when you mean it:
 *   bun scripts/send-content-broadcast.ts --send
 */
import type { ReactElement } from "react"
import { BunServices, BunRuntime } from "@effect/platform-bun"
import { render } from "@react-email/components"
import { Config, Effect, Encoding, Layer, Schema } from "effect"
import { Crypto } from "effect/Crypto"
import PrivacyPolicyUpdateEmail, {
	policyUpdatePreview,
	policyUpdateSubject,
} from "@/emails/policy-update-email"
import QuestReleaseEmail, {
	questReleasePreview,
	questReleaseSubject,
} from "@/emails/quest-release-email"
import ZombieReleaseEmail, {
	zombieReleasePreview,
	zombieReleaseSubject,
} from "@/emails/zombie-release-email"
import { Email } from "@/lib/services/emails"
import { NEWSLETTER_FROM_ADDRESS, SITE_ORIGIN } from "@/utils/constants"

const RESEND_UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}"

const BROADCAST_REPLY_TO = "contact@codzombiesguides.com"

const textEncoder = new TextEncoder()

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
			const previewText = questReleasePreview(broadcast.type, broadcast.title)

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
				previewText: zombieReleasePreview,
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
	const crypto = yield* Crypto

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
	const audienceId = yield* Config.NonEmptyString("RESEND_AUDIENCE_ID")
	const send = options?.send === true

	if (!send) {
		return {
			mode: "dry-run" as const,
			from: NEWSLETTER_FROM_ADDRESS,
			replyTo: BROADCAST_REPLY_TO,
			subject: rendered.subject,
			previewText: rendered.previewText,
			segmentId: audienceId,
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
			segmentId: audienceId,
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
			console.log("--- HTML ---")
			console.log(result.html)
			console.log("")
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
	// Policy example:
	// { kind: "policy", bullets: ["How long confirmation tokens are kept"] }
	// Zombie example (no bullets; id is the bestiary slug):
	// { kind: "zombie", type: "Boss", id: "avogadro", title: "Avogadro", description: "...", redirectUrl: "/bestiary/avogadro" }
	sendContentBroadcast(
		{
			kind: "quest",
			type: "Main",
			id: "reckoning",
			title: "Reckoning",
			description:
				"Project Janus HQ teeters on the verge of collapse. Stabilize the Aether Reactors. Unleash the Sentinel Artifact. Complete the mission that began on Terminus.",
			redirectUrl: "/main-quests/black-ops-6/reckoning",
			bullets: [
				"How to stabilize the Aether Reactors",
				"Where to find the Sentinel Artifact",
				"Recommended loadouts for the boss fight",
			],
		},
		{ send },
	).pipe(
		Effect.tap(result => Effect.sync(() => printResult(result))),
		Effect.provide(Layer.mergeAll(BunServices.layer, Email.layer)),
		BunRuntime.runMain,
	)
}
