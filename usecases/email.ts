import type { CollectionSlug } from "payload"
import type { CreateBroadcastOptions } from "resend"
import type { IQuestRelease } from "@/emails/quest-release-email"
import { Effect, Redacted } from "effect"
import { getMainQuestBroadcastInfo } from "@/data/main-quests"
import { getSideQuestBroadcastInfo } from "@/data/side-quests"
import { getZombieBroadcastInfo } from "@/data/zombies"
import PrivacyPolicyUpdateEmail from "@/emails/policy-update-email"
import QuestReleaseEmail from "@/emails/quest-release-email"
import SubscribeEmail from "@/emails/subscribe-email"
import UnsubscribeEmail from "@/emails/unsubscribe-email"
import ZombieReleaseEmail, { type IZombieRelease } from "@/emails/zombie-release-email"
import { env } from "@/env"
import { Email } from "@/lib/services/Email"
import {
	ContactExistsError,
	ContactNotFoundError,
	CreateBroadcastError,
	InvalidRequestError,
} from "@/types/errors"
import { generateToken } from "@/utils/functions"

interface EmailProps {
	name: string
	email: string
	message: string
}

export const requestSubscribe = (email: string) =>
	Effect.gen(function* () {
		const { getContact, sendEmail } = yield* Email

		const contact = yield* getContact(email)
		if (contact)
			return yield* new ContactExistsError({
				message:
					"We were unable to send a confirmation email because that email is already subscribed!",
				cause: new Error(`Contact already subscribed: ${contact}`),
			})

		const token = yield* generateToken(email, "1 day")
		const subscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

		yield* sendEmail({
			from: "COD Zombies Guides <support@codzombiesguides.com>",
			to: email,
			subject: "Confirm Your Subscribe Request",
			react: SubscribeEmail({ subscribeUrl }),
		})
		return { success: true, message: "Check your inbox to complete your subscribe request." }
	}).pipe(Effect.withLogSpan("request_subscribe"))

export const requestUnsubscribe = (email: string) =>
	Effect.gen(function* () {
		const { getContact, sendEmail } = yield* Email

		const contact = yield* getContact(email)
		if (!contact)
			return yield* new ContactNotFoundError({
				message:
					"We were unable to send a confirmation email because that email is not currently subscribed!",
				cause: new Error(`Contact not found for email: ${email}`),
			})

		const token = yield* generateToken(email, "1 day")
		const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

		yield* sendEmail({
			from: "COD Zombies Guides <support@codzombiesguides.com>",
			to: email,
			subject: "Confirm Your Unsubscribe Request",
			react: UnsubscribeEmail({ unsubscribeUrl }),
		})
		return { success: true, message: "Check your inbox to complete your unsubscribe request." }
	}).pipe(Effect.withLogSpan("request_unsubscribe"))

export const subscribeEmail = (email: string) =>
	Effect.gen(function* () {
		const { createContact } = yield* Email
		return yield* createContact(email)
	}).pipe(Effect.withLogSpan("subscribe_email"))

export const unsubscribeEmail = (email: string) =>
	Effect.gen(function* () {
		const { removeContact } = yield* Email
		return yield* removeContact(email)
	}).pipe(Effect.withLogSpan("unsubscribe_email"))

export const sendContactEmail = (props: EmailProps) =>
	Effect.gen(function* () {
		const { sendEmail } = yield* Email

		yield* sendEmail({
			from: `${props.name} <contact@codzombiesguides.com>`,
			replyTo: props.email,
			to: "codzombiesguidesteam@gmail.com",
			subject: "Contact Form Submission",
			text: props.message,
		})
		return {
			success: true,
			message: "Thank you for contacting us! We will get back to you as soon as possible.",
		}
	}).pipe(Effect.withLogSpan("send_contact_email"))

export const handleEntryBroadcast = (collection: CollectionSlug, id: string) =>
	Effect.gen(function* () {
		switch (collection) {
			case "mainQuests": {
				const mainQuest = yield* getMainQuestBroadcastInfo(id)
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/${mainQuest.game.slug}/${mainQuest.map.slug}`
				return yield* sendQuestReleaseBroadcast({
					type: "Main",
					redirectUrl,
					title: mainQuest.map.title,
					description: mainQuest.description,
				})
			}
			case "sideQuests": {
				const sideQuest = yield* getSideQuestBroadcastInfo(id)
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/${sideQuest.game.slug}/${sideQuest.map.slug}/${sideQuest.slug}`
				return yield* sendQuestReleaseBroadcast({
					type: "Side",
					redirectUrl,
					title: sideQuest.title,
					description: sideQuest.description,
				})
			}
			case "zombies": {
				const zombie = yield* getZombieBroadcastInfo(id)
				const redirectUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`
				return yield* sendZombieReleaseBroadcast({
					redirectUrl,
					title: zombie.title,
					description: zombie.description,
					type: zombie.type,
				})
			}
			default:
				return yield* new InvalidRequestError({ message: "Invalid collection slug" })
		}
	}).pipe(Effect.withLogSpan("handle_entry_broadcast"), Effect.annotateLogs({ collection, id }))

const createAndSendBroadcast = (title: string, payload: CreateBroadcastOptions) =>
	Effect.gen(function* () {
		const { createBroadcast, sendBroadcast } = yield* Email

		const broadcast = yield* createBroadcast(payload)
		if (!broadcast)
			return yield* new CreateBroadcastError({
				message: "Failed to create broadcast",
				cause: new Error("No data was returned for the broadcast request."),
			})

		yield* sendBroadcast(broadcast.id)
		return { success: true, message: `${title} Broadcast sent successfully!` }
	}).pipe(Effect.withLogSpan("create_and_send_broadcast"), Effect.annotateLogs("title", title))

const sendQuestReleaseBroadcast = (props: Omit<IQuestRelease, "unsubscribeUrl">) =>
	Effect.gen(function* () {
		const unsubscribeUrl = yield* getUnsubscribeUrl

		return yield* createAndSendBroadcast(props.title, {
			audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
			from: "COD Zombies Guides <updates@codzombiesguides.com>",
			subject: `New ${props.type} Quest Guide: ${props.title}`,
			react: QuestReleaseEmail({ ...props, unsubscribeUrl }),
			name: `${props.title} Release`,
		})
	}).pipe(
		Effect.withLogSpan("send_quest_release_broadcast"),
		Effect.annotateLogs({
			title: props.title,
			type: props.type,
		}),
	)

const sendZombieReleaseBroadcast = (props: Omit<IZombieRelease, "unsubscribeUrl">) =>
	Effect.gen(function* () {
		const unsubscribeUrl = yield* getUnsubscribeUrl

		return yield* createAndSendBroadcast(props.title, {
			audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
			from: "COD Zombies Guides <updates@codzombiesguides.com>",
			subject: `New ${props.type} Zombie Release: ${props.title}`,
			react: ZombieReleaseEmail({ ...props, unsubscribeUrl }),
			name: `${props.title} Release`,
		})
	}).pipe(
		Effect.withLogSpan("send_zombie_release_broadcast"),
		Effect.annotateLogs({
			title: props.title,
			type: props.type,
		}),
	)

export const sendLegalUpdateBroadcast = Effect.gen(function* () {
	const unsubscribeUrl = yield* getUnsubscribeUrl

	return yield* createAndSendBroadcast("Privacy Policy", {
		audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
		from: "COD Zombies Guides <legal@codzombiesguides.com>",
		subject: `Privacy Policy Update Notice`,
		react: PrivacyPolicyUpdateEmail({ unsubscribeUrl }),
		name: "Privacy Policy Update",
	})
}).pipe(Effect.withLogSpan("send_legal_update_broadcast"))

const getUnsubscribeUrl = Effect.gen(function* () {
	// These tokens will expire in 30 days since they weren't user requested
	const token = yield* generateToken(crypto.randomUUID(), "30 days")
	return `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
}).pipe(
	Effect.withLogSpan("get_unsubscribe_url"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed(`${env.NEXT_PUBLIC_WEBSITE_URL}/newsletter/unsubscribe`)),
)
