/**
 * Dry-run is the default. Pass `--send` to deliver the broadcast.
 *
 *   bun run send:broadcast -- content -k relic -i lawyers-pen -b "Where to light the three red candles"
 *   bun run send:broadcast -- content -k main-quest -i reckoning -b "How to stabilize the Aether Reactors"
 *   bun run send:broadcast -- content -k side-quest -i free-500-points -b "The door to open first"
 *   bun run send:broadcast -- content -k zombie -i avogadro
 *   bun run send:broadcast -- feature
 *   bun run send:broadcast -- policy -b "How long confirmation tokens are kept"
 *
 * Add `-s` / `--send` to any of those to deliver it. Quest, relic, and policy need at least one `-b` / `--bullet`.
 * Zombie uses the template's fixed breakdown list, so `-b` / `--bullet` is rejected.
 * Title, description, and the guide URL come from the site catalog. Override copy with `-t` / `--title` and `-d` / `--description`.
 */
import type { RelicType } from "@/data/relics"
import type { ContentState } from "@/types/data"
import type { ReactElement } from "react"
import { BunServices, BunRuntime } from "@effect/platform-bun"
import { render } from "@react-email/components"
import {
	Config,
	ConfigProvider,
	Effect,
	Layer,
	Match,
	Option,
	Schema,
	Crypto,
	Redacted,
} from "effect"
import { Command, Flag } from "effect/cli"
import { Hex } from "effect/encoding"
import { getMapByKey } from "@/data/maps"
import { getRelicByKey } from "@/data/relics"
import { getSideQuestByKey } from "@/data/side-quests"
import { getZombieByKey, type ZombieType } from "@/data/zombies"
import NewFeatureEmail, {
	featureUpdatePreview,
	featureUpdateSubject,
} from "@/emails/new-feature-email"
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

const CONTENT_KINDS = ["main-quest", "side-quest", "relic", "zombie"] as const

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
	type: ZombieType
	id: string
	title: string
	description: string
	redirectUrl: string
}

export interface PolicyBroadcastInput {
	kind: "policy"
	bullets: readonly string[]
}

export interface FeatureBroadcastInput {
	kind: "feature"
}

export type BroadcastInput =
	| QuestBroadcastInput
	| RelicBroadcastInput
	| ZombieBroadcastInput
	| PolicyBroadcastInput
	| FeatureBroadcastInput

export interface ContentCliInput {
	kind: (typeof CONTENT_KINDS)[number]
	id: string
	bullets: readonly string[]
	title: Option.Option<string>
	description: Option.Option<string>
}

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

const requireBullets = Effect.fnUntraced(function* (bullets: readonly string[], label: string) {
	const trimmed = bullets.map(bullet => bullet.trim())

	if (trimmed.length === 0 || trimmed.some(bullet => bullet.length === 0)) {
		return yield* new BroadcastInputError({
			message: `${label} needs at least one non-empty --bullet.`,
			cause: bullets,
		})
	}

	return trimmed
})

const textOrFallback = Effect.fnUntraced(function* (
	override: Option.Option<string>,
	fallback: string,
	flag: "--title" | "--description",
) {
	if (Option.isNone(override)) {
		if (fallback.trim().length === 0) {
			return yield* new BroadcastInputError({
				message: `This entry has no ${flag} text. Pass ${flag}.`,
				cause: fallback,
			})
		}

		return fallback
	}

	const value = override.value.trim()

	if (value.length === 0) {
		return yield* new BroadcastInputError({
			message: `${flag} cannot be empty.`,
			cause: override.value,
		})
	}

	return value
})

const refuseComingSoon = Effect.fnUntraced(function* (
	state: Option.Option<ContentState>,
	label: string,
) {
	if (state.valueOrUndefined === "Coming Soon") {
		return yield* new BroadcastInputError({
			message: `${label} is still Coming Soon, so it cannot be broadcast.`,
			cause: label,
		})
	}
})

const requireMap = Effect.fnUntraced(function* (id: string) {
	const map = getMapByKey(id)

	if (Option.isNone(map)) {
		return yield* new BroadcastInputError({
			message: `No map with id "${id}".`,
			cause: id,
		})
	}

	return map.value
})

const resolveMainQuestBroadcast = Effect.fnUntraced(function* (input: ContentCliInput) {
	const map = yield* requireMap(input.id)

	if (Option.isNone(map.mainQuest)) {
		return yield* new BroadcastInputError({
			message: `Map "${input.id}" has no main quest.`,
			cause: input.id,
		})
	}

	yield* refuseComingSoon(map.state, map.title)
	const bullets = yield* requireBullets(input.bullets, "A main quest broadcast")

	return {
		kind: "quest",
		type: "Main",
		id: map.id,
		title: yield* textOrFallback(input.title, map.title, "--title"),
		description: yield* textOrFallback(input.description, map.description, "--description"),
		redirectUrl: `/main-quests/${map.game}/${map.id}`,
		bullets,
	} satisfies QuestBroadcastInput
})

const resolveSideQuestBroadcast = Effect.fnUntraced(function* (input: ContentCliInput) {
	const quest = getSideQuestByKey(input.id)

	if (Option.isNone(quest)) {
		return yield* new BroadcastInputError({
			message: `No side quest with id "${input.id}".`,
			cause: input.id,
		})
	}

	const map = yield* requireMap(quest.value.map)
	yield* refuseComingSoon(quest.value.state, quest.value.title)
	const bullets = yield* requireBullets(input.bullets, "A side quest broadcast")

	return {
		kind: "quest",
		type: "Side",
		id: quest.value.id,
		title: yield* textOrFallback(input.title, quest.value.title, "--title"),
		description: yield* textOrFallback(input.description, quest.value.description, "--description"),
		redirectUrl: `/side-quests/${map.game}/${map.id}/${quest.value.id}`,
		bullets,
	} satisfies QuestBroadcastInput
})

const resolveRelicBroadcast = Effect.fnUntraced(function* (input: ContentCliInput) {
	const relic = getRelicByKey(input.id)

	if (Option.isNone(relic)) {
		return yield* new BroadcastInputError({
			message: `No relic with id "${input.id}".`,
			cause: input.id,
		})
	}

	const map = yield* requireMap(relic.value.map)
	yield* refuseComingSoon(relic.value.state, relic.value.title)
	const bullets = yield* requireBullets(input.bullets, "A relic broadcast")

	return {
		kind: "relic",
		type: relic.value.type,
		id: relic.value.id,
		title: yield* textOrFallback(input.title, relic.value.title, "--title"),
		description: yield* textOrFallback(input.description, relic.value.description, "--description"),
		redirectUrl: `/relics/${map.game}/${relic.value.id}`,
		bullets,
	} satisfies RelicBroadcastInput
})

const resolveZombieBroadcast = Effect.fnUntraced(function* (input: ContentCliInput) {
	if (input.bullets.length > 0) {
		return yield* new BroadcastInputError({
			message: "Zombie broadcasts use the template's breakdown list. Do not pass --bullet.",
			cause: input.bullets,
		})
	}

	const zombie = getZombieByKey(input.id)

	if (Option.isNone(zombie)) {
		return yield* new BroadcastInputError({
			message: `No zombie with id "${input.id}".`,
			cause: input.id,
		})
	}

	yield* refuseComingSoon(zombie.value.state, zombie.value.title)

	return {
		kind: "zombie",
		type: zombie.value.type,
		id: zombie.value.id,
		title: yield* textOrFallback(input.title, zombie.value.title, "--title"),
		description: yield* textOrFallback(
			input.description,
			zombie.value.description,
			"--description",
		),
		redirectUrl: `/bestiary/${zombie.value.id}`,
	} satisfies ZombieBroadcastInput
})

export const resolveContentBroadcast = Effect.fn("resolveContentBroadcast")(function* (
	input: ContentCliInput,
) {
	return yield* Match.value(input).pipe(
		Match.discriminatorsExhaustive("kind")({
			"main-quest": resolveMainQuestBroadcast,
			"side-quest": resolveSideQuestBroadcast,
			relic: resolveRelicBroadcast,
			zombie: resolveZombieBroadcast,
		}),
	)
})

export const resolvePolicyBroadcast = Effect.fn("resolvePolicyBroadcast")(function* (
	bullets: readonly string[],
) {
	return {
		kind: "policy" as const,
		bullets: yield* requireBullets(bullets, "A policy broadcast"),
	} satisfies PolicyBroadcastInput
})

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

const renderedBroadcast = (
	react: ReactElement,
	subject: string,
	previewText: string,
	html: string,
	text: string,
): RenderedBroadcast => ({
	name: subject,
	subject,
	previewText,
	react,
	html,
	text,
})

const renderQuestBroadcast = Effect.fnUntraced(function* (broadcast: QuestBroadcastInput) {
	const subject = questReleaseSubject(broadcast.type, broadcast.title)

	const react = yield* Effect.try({
		try: () =>
			QuestReleaseEmail({
				type: broadcast.type,
				id: broadcast.id,
				title: broadcast.title,
				description: broadcast.description,
				redirectUrl: guideUrl(broadcast.redirectUrl),
				unsubscribeUrl: RESEND_UNSUBSCRIBE_URL,
				serverUrl: SITE_ORIGIN,
				bullets: broadcast.bullets,
			}),
		catch: cause => emailBuildError(cause, "Failed to build the quest email."),
	})

	const rendered = yield* renderEmail(react)

	return renderedBroadcast(react, subject, broadcast.description, rendered.html, rendered.text)
})

const renderRelicBroadcast = Effect.fnUntraced(function* (broadcast: RelicBroadcastInput) {
	const subject = relicReleaseSubject(broadcast.type, broadcast.title)

	const react = yield* Effect.try({
		try: () =>
			RelicReleaseEmail({
				type: broadcast.type,
				id: broadcast.id,
				title: broadcast.title,
				description: broadcast.description,
				redirectUrl: guideUrl(broadcast.redirectUrl),
				unsubscribeUrl: RESEND_UNSUBSCRIBE_URL,
				serverUrl: SITE_ORIGIN,
				bullets: broadcast.bullets,
			}),
		catch: cause => emailBuildError(cause, "Failed to build the relic email."),
	})

	const rendered = yield* renderEmail(react)

	return renderedBroadcast(react, subject, broadcast.description, rendered.html, rendered.text)
})

const renderZombieBroadcast = Effect.fnUntraced(function* (broadcast: ZombieBroadcastInput) {
	const subject = zombieReleaseSubject(broadcast.type, broadcast.title)

	const react = yield* Effect.try({
		try: () =>
			ZombieReleaseEmail({
				type: broadcast.type,
				id: broadcast.id,
				title: broadcast.title,
				description: broadcast.description,
				redirectUrl: guideUrl(broadcast.redirectUrl),
				unsubscribeUrl: RESEND_UNSUBSCRIBE_URL,
				serverUrl: SITE_ORIGIN,
			}),
		catch: cause => emailBuildError(cause, "Failed to build the zombie email."),
	})

	const rendered = yield* renderEmail(react)

	return renderedBroadcast(react, subject, broadcast.description, rendered.html, rendered.text)
})

const renderPolicyBroadcast = Effect.fnUntraced(function* (broadcast: PolicyBroadcastInput) {
	const react = PrivacyPolicyUpdateEmail({
		unsubscribeUrl: RESEND_UNSUBSCRIBE_URL,
		serverUrl: SITE_ORIGIN,
		bullets: broadcast.bullets,
	})

	const rendered = yield* renderEmail(react)

	return renderedBroadcast(
		react,
		policyUpdateSubject,
		policyUpdatePreview,
		rendered.html,
		rendered.text,
	)
})

const renderFeatureBroadcast = Effect.fnUntraced(function* () {
	const react = yield* Effect.try({
		try: () => NewFeatureEmail({ unsubscribeUrl: RESEND_UNSUBSCRIBE_URL }),
		catch: cause => emailBuildError(cause, "Failed to build the feature email."),
	})

	const rendered = yield* renderEmail(react)

	return renderedBroadcast(
		react,
		featureUpdateSubject,
		featureUpdatePreview,
		rendered.html,
		rendered.text,
	)
})

const renderBroadcast = Effect.fn("renderBroadcast")(function* (broadcast: BroadcastInput) {
	return yield* Match.value(broadcast).pipe(
		Match.discriminatorsExhaustive("kind")({
			quest: renderQuestBroadcast,
			relic: renderRelicBroadcast,
			zombie: renderZombieBroadcast,
			policy: renderPolicyBroadcast,
			feature: renderFeatureBroadcast,
		}),
	)
})

const broadcastIdempotencyKey = Effect.fn("broadcastIdempotencyKey")(function* (
	broadcast: BroadcastInput,
	subject: string,
	text: string,
) {
	const crypto = yield* Crypto.Crypto

	const digest = yield* crypto
		.digest("SHA-256", textEncoder.encode(JSON.stringify({ broadcast, subject, text })))
		.pipe(
			Effect.mapError(
				cause =>
					new BroadcastHashError({
						message: "Failed to hash the broadcast for an idempotency key.",
						cause,
					}),
			),
		)

	const fingerprint = Hex.encode(digest).slice(0, 32)

	return `broadcast/${broadcast.kind}/${fingerprint}`
})

export const sendBroadcast = Effect.fn("sendBroadcast")(function* (
	broadcast: BroadcastInput,
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

	const idempotencyKey = yield* broadcastIdempotencyKey(broadcast, rendered.subject, rendered.text)

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

function printDryRun(result: BroadcastDryRun): void {
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
}

function printSent(result: BroadcastSent): void {
	console.log(`Sent broadcast ${result.id}`)
	console.log(`Subject: ${result.subject}`)
}

function printResult(result: BroadcastDryRun | BroadcastSent): void {
	Match.value(result).pipe(
		Match.discriminatorsExhaustive("mode")({
			"dry-run": printDryRun,
			sent: printSent,
		}),
	)
}

const deliver = Effect.fn("deliverBroadcast")(function* (broadcast: BroadcastInput, send: boolean) {
	const result = yield* sendBroadcast(broadcast, { send })
	yield* Effect.sync(() => printResult(result))
})

const sendFlag = Flag.Boolean("send").pipe(
	Flag.withAlias("s"),
	Flag.withDefault(false),
	Flag.withDescription("Deliver the broadcast. Omit this flag to print a dry run."),
)

const kindFlag = Flag.Literals("kind", CONTENT_KINDS).pipe(
	Flag.withAlias("k"),
	Flag.withDescription("Guide to announce: main-quest, side-quest, relic, or zombie."),
)

const idFlag = Flag.String("id").pipe(
	Flag.withAlias("i"),
	Flag.withDescription(
		"Site slug for that guide (map id, side-quest id, relic id, or bestiary id).",
	),
)

const bulletFlag = Flag.String("bullet").pipe(
	Flag.withAlias("b"),
	Flag.atLeast(0),
	Flag.withDescription(
		"Highlight line. Repeat for each bullet. Required for quests, relics, and policy.",
	),
)

const titleFlag = Flag.optional(Flag.String("title")).pipe(
	Flag.withAlias("t"),
	Flag.withDescription("Override the title taken from the site catalog."),
)

const descriptionFlag = Flag.optional(Flag.String("description")).pipe(
	Flag.withAlias("d"),
	Flag.withDescription("Override the description taken from the site catalog."),
)

const sendBroadcastCommand = Command.make("send-broadcast").pipe(
	Command.withDescription(
		"Dry-run or send a newsletter broadcast. Subcommands: content, feature, policy.",
	),
	Command.withSharedFlags({ send: sendFlag }),
)

const contentCommand = Command.make(
	"content",
	{
		kind: kindFlag,
		id: idFlag,
		bullets: bulletFlag,
		title: titleFlag,
		description: descriptionFlag,
	},
	Effect.fn("broadcast.content")(function* (args) {
		const parent = yield* sendBroadcastCommand
		const broadcast = yield* resolveContentBroadcast(args)

		yield* deliver(broadcast, parent.send)
	}),
).pipe(Command.withDescription("Announce a quest, relic, or bestiary guide."))

const featureCommand = Command.make(
	"feature",
	{},
	Effect.fn("broadcast.feature")(function* () {
		const parent = yield* sendBroadcastCommand

		yield* deliver({ kind: "feature" }, parent.send)
	}),
).pipe(Command.withDescription("Send the current new-feature announcement."))

const policyCommand = Command.make(
	"policy",
	{ bullets: bulletFlag },
	Effect.fn("broadcast.policy")(function* (args) {
		const parent = yield* sendBroadcastCommand
		const broadcast = yield* resolvePolicyBroadcast(args.bullets)

		yield* deliver(broadcast, parent.send)
	}),
).pipe(Command.withDescription("Announce a privacy policy update."))

export const broadcastCli = sendBroadcastCommand.pipe(
	Command.withSubcommands([contentCommand, featureCommand, policyCommand]),
)

if (import.meta.main) {
	Command.run(broadcastCli, { version: "1.0.0" }).pipe(
		Effect.provide(BroadcastLive),
		BunRuntime.runMain,
	)
}
