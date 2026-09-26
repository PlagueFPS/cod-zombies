/**
 * Fill in the call at the bottom, then run:
 *   bun scripts/send-content-broadcast.ts
 *
 * Dry run is the default. It prints the rendered email and the broadcast payload
 * and does not contact the audience.
 *
 * Quest and policy need bullets for this release:
 *   { kind: "quest", type, title, description, redirectUrl, bullets: ["..."] }
 *   { kind: "policy", bullets: ["What changed in the policy"] }
 * Zombie uses the template's fixed breakdown list. Do not pass bullets:
 *   { kind: "zombie", type, title, description, redirectUrl }
 *
 * Send only when you mean it:
 *   bun scripts/send-content-broadcast.ts --send
 */
import type { ReactElement } from "react"
import { createHash } from "node:crypto"
import { render } from "@react-email/components"
import { Resend } from "resend"
import PrivacyPolicyUpdateEmail, {
	policyUpdatePreview,
	policyUpdateSubject,
} from "@/emails/policy-update-email"
import QuestReleaseEmail, {
	questReleasePreview,
	questReleaseSubject,
	type IQuestRelease,
} from "@/emails/quest-release-email"
import ZombieReleaseEmail, {
	zombieReleasePreview,
	zombieReleaseSubject,
	type IZombieRelease,
} from "@/emails/zombie-release-email"
import { NEWSLETTER_FROM_ADDRESS, SITE_ORIGIN } from "@/utils/constants"

const RESEND_UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}"

const BROADCAST_REPLY_TO = "contact@codzombiesguides.com"

export interface QuestBroadcastInput {
	kind: "quest"
	type: IQuestRelease["type"]
	title: string
	description: string
	redirectUrl: string
	bullets: readonly string[]
}

export interface ZombieBroadcastInput {
	kind: "zombie"
	type: IZombieRelease["type"]
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

function assertPresent(value: string, label: string): void {
	if (value.trim().length === 0) {
		throw new Error(`${label} is required.`)
	}
}

function assertBullets(bullets: readonly string[]): void {
	if (bullets.length === 0 || bullets.some(bullet => bullet.trim().length === 0)) {
		throw new Error("Add at least one non-empty bullet point for this quest or policy update.")
	}
}

function validateBroadcast(broadcast: ContentBroadcastInput): void {
	switch (broadcast.kind) {
		case "quest":
			assertPresent(broadcast.title, "Quest title")
			assertPresent(broadcast.description, "Quest description")
			assertPresent(broadcast.redirectUrl, "Quest redirectUrl")
			assertBullets(broadcast.bullets)

			return
		case "policy":
			assertBullets(broadcast.bullets)

			return
		case "zombie":
			assertPresent(broadcast.title, "Zombie title")
			assertPresent(broadcast.description, "Zombie description")
			assertPresent(broadcast.redirectUrl, "Zombie redirectUrl")

			return
		default: {
			const exhaustive: never = broadcast
			throw new Error(`Unexpected broadcast kind: ${JSON.stringify(exhaustive)}`)
		}
	}
}

function guideUrl(redirectUrl: string): string {
	if (redirectUrl.startsWith("https://") || redirectUrl.startsWith("http://")) return redirectUrl
	const path = redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`

	return `${SITE_ORIGIN}${path}`
}

async function renderBroadcast(broadcast: ContentBroadcastInput): Promise<RenderedBroadcast> {
	const serverUrl = SITE_ORIGIN
	const unsubscribeUrl = RESEND_UNSUBSCRIBE_URL

	switch (broadcast.kind) {
		case "quest": {
			const subject = questReleaseSubject(broadcast.type, broadcast.title)
			const previewText = questReleasePreview(broadcast.type, broadcast.title)

			const react = QuestReleaseEmail({
				type: broadcast.type,
				title: broadcast.title,
				description: broadcast.description,
				redirectUrl: guideUrl(broadcast.redirectUrl),
				unsubscribeUrl,
				serverUrl,
				bullets: broadcast.bullets,
			})

			return {
				name: subject,
				subject,
				previewText,
				react,
				html: await render(react),
				text: await render(react, { plainText: true }),
			}
		}

		case "zombie": {
			const subject = zombieReleaseSubject(broadcast.type, broadcast.title)

			const react = ZombieReleaseEmail({
				type: broadcast.type,
				title: broadcast.title,
				description: broadcast.description,
				redirectUrl: guideUrl(broadcast.redirectUrl),
				unsubscribeUrl,
				serverUrl,
			})

			return {
				name: subject,
				subject,
				previewText: zombieReleasePreview,
				react,
				html: await render(react),
				text: await render(react, { plainText: true }),
			}
		}

		case "policy": {
			const react = PrivacyPolicyUpdateEmail({
				unsubscribeUrl,
				serverUrl,
				bullets: broadcast.bullets,
			})

			return {
				name: policyUpdateSubject,
				subject: policyUpdateSubject,
				previewText: policyUpdatePreview,
				react,
				html: await render(react),
				text: await render(react, { plainText: true }),
			}
		}

		default: {
			const exhaustive: never = broadcast
			throw new Error(`Unexpected broadcast kind: ${JSON.stringify(exhaustive)}`)
		}
	}
}

function contentIdempotencyKey(broadcast: ContentBroadcastInput, subject: string): string {
	const fingerprint = createHash("sha256")
		.update(JSON.stringify({ broadcast, subject }))
		.digest("hex")
		.slice(0, 32)

	return `content-broadcast/${broadcast.kind}/${fingerprint}`
}

export async function sendContentBroadcast(
	broadcast: ContentBroadcastInput,
	options?: { send?: boolean },
): Promise<BroadcastDryRun | BroadcastSent> {
	validateBroadcast(broadcast)
	const rendered = await renderBroadcast(broadcast)

	if (!rendered.html.includes("RESEND_UNSUBSCRIBE_URL")) {
		throw new Error("Broadcast HTML is missing the Resend unsubscribe URL.")
	}

	const segmentId = process.env.RESEND_AUDIENCE_ID ?? ""
	const send = options?.send === true

	if (!send) {
		return {
			mode: "dry-run",
			from: NEWSLETTER_FROM_ADDRESS,
			replyTo: BROADCAST_REPLY_TO,
			subject: rendered.subject,
			previewText: rendered.previewText,
			segmentId: segmentId.length > 0 ? segmentId : "(RESEND_AUDIENCE_ID is not set)",
			name: rendered.name,
			html: rendered.html,
			text: rendered.text,
		}
	}

	const apiKey = process.env.RESEND_API_KEY

	if (!apiKey || segmentId.length === 0) {
		throw new Error("Set RESEND_API_KEY and RESEND_AUDIENCE_ID before sending a broadcast.")
	}

	const resend = new Resend(apiKey)

	const { data, error } = await resend.broadcasts.create(
		{
			name: rendered.name,
			from: NEWSLETTER_FROM_ADDRESS,
			replyTo: BROADCAST_REPLY_TO,
			subject: rendered.subject,
			previewText: rendered.previewText,
			segmentId,
			react: rendered.react,
			text: rendered.text,
			send: true,
		},
		{ headers: { "Idempotency-Key": contentIdempotencyKey(broadcast, rendered.subject) } },
	)

	if (error || !data) {
		throw new Error(error?.message ?? "Resend did not return a broadcast id.")
	}

	return { mode: "sent", id: data.id, subject: rendered.subject }
}

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
	// Zombie example (no bullets):
	// { kind: "zombie", type: "Boss", title: "Avogadro", description: "...", redirectUrl: "/bestiary/avogadro" }
	const result = await sendContentBroadcast(
		{
			kind: "quest",
			type: "Main",
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
	)

	printResult(result)
}
