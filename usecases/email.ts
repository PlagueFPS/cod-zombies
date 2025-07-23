import type { CreateBroadcastOptions } from "resend"
import { Effect, Redacted } from "effect"
import PrivacyPolicyUpdateEmail from "@/components/emails/PolicyUpdateEmail"
import QuestReleaseEmail, { type IQuestRelease } from "@/components/emails/QuestReleaseEmail"
import SubscribeEmail from "@/components/emails/SubscribeEmail"
import UnsubscribeEmail from "@/components/emails/UnsubscribeEmail"
import ZombieReleaseEmail, { type IZombieRelease } from "@/components/emails/ZombieReleaseEmail"
import { env } from "@/env"
import { Email } from "@/lib/services/Email"
import { ContactExistsError, ContactNotFoundError, CreateBroadcastError } from "@/types/errors"
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

export const sendQuestReleaseBroadcast = (props: IQuestRelease) =>
	createAndSendBroadcast(props.title, {
		audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
		from: "COD Zombies Guides <updates@codzombiesguides.com>",
		subject: `New ${props.type} Quest Guide: ${props.title}`,
		react: QuestReleaseEmail(props),
		name: `${props.title} Release`,
	}).pipe(
		Effect.withLogSpan("send_quest_release_broadcast"),
		Effect.annotateLogs({
			title: props.title,
			type: props.type,
		}),
	)

export const sendZombieReleaseBroadcast = (props: IZombieRelease) =>
	createAndSendBroadcast(props.title, {
		audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
		from: "COD Zombies Guides <updates@codzombiesguides.com>",
		subject: `New ${props.type} Zombie Release: ${props.title}`,
		react: ZombieReleaseEmail(props),
		name: `${props.title} Release`,
	}).pipe(
		Effect.withLogSpan("send_zombie_release_broadcast"),
		Effect.annotateLogs({
			title: props.title,
			type: props.type,
		}),
	)

export const sendLegalUpdateBroadcast = createAndSendBroadcast("Privacy Policy", {
	audienceId: Redacted.value(env.RESEND_AUDIENCE_ID),
	from: "COD Zombies Guides <legal@codzombiesguides.com>",
	subject: `Privacy Policy Update Notice`,
	react: PrivacyPolicyUpdateEmail(),
	name: "Privacy Policy Update",
}).pipe(Effect.withLogSpan("send_legal_update_broadcast"))
