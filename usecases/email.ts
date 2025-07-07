import type { CreateBroadcastOptions } from "resend"
import { Effect } from "effect"
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

export const requestSubscribe = Effect.fn("requestSubscribe")(function* (email: string) {
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
})

export const requestUnsubscribe = Effect.fn("requestUnsubscribe")(function* (email: string) {
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
})

export const subscribeEmail = Effect.fn("subscribeEmail")(function* (email: string) {
	const { createContact } = yield* Email
	return yield* createContact(email)
})

export const unsubscribeEmail = Effect.fn("unsubscribeEmail")(function* (email: string) {
	const { removeContact } = yield* Email
	return yield* removeContact(email)
})

export const sendContactEmail = Effect.fn("sendContactEmail")(function* (props: EmailProps) {
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
})

export const sendQuestReleaseBroadcast = Effect.fn("sendQuestReleaseBroadcast")(function* (
	props: IQuestRelease,
) {
	return yield* createAndSendBroadcast(props.title, {
		audienceId: env.RESEND_AUDIENCE_ID,
		from: "COD Zombies Guides <updates@codzombiesguides.com>",
		subject: `New ${props.type} Quest Guide: ${props.title}`,
		react: QuestReleaseEmail(props),
		name: `${props.title} Release`,
	})
})

export const sendZombieReleaseBroadcast = Effect.fn("sendZombieReleaseBroadcast")(function* (
	props: IZombieRelease,
) {
	return yield* createAndSendBroadcast(props.title, {
		audienceId: env.RESEND_AUDIENCE_ID,
		from: "COD Zombies Guides <updates@codzombiesguides.com>",
		subject: `New ${props.type} Zombie Release: ${props.title}`,
		react: ZombieReleaseEmail(props),
		name: `${props.title} Release`,
	})
})

export const sendLegalUpdateBroadcast = Effect.fn("sendLegalUpdateBroadcast")(function* () {
	return yield* createAndSendBroadcast("Privacy Policy", {
		audienceId: env.RESEND_AUDIENCE_ID,
		from: "COD Zombies Guides <legal@codzombiesguides.com>",
		subject: `Privacy Policy Update Notice`,
		react: PrivacyPolicyUpdateEmail(),
		name: "Privacy Policy Update",
	})
})

const createAndSendBroadcast = Effect.fn("createAndSendBroadcast")(function* (
	title: string,
	payload: CreateBroadcastOptions,
) {
	const { createBroadcast, sendBroadcast } = yield* Email

	const broadcast = yield* createBroadcast(payload)
	if (!broadcast)
		return yield* new CreateBroadcastError({
			message: "Failed to create broadcast",
			cause: new Error("No data was returned for the broadcast request."),
		})

	yield* sendBroadcast(broadcast.id)
	return { success: true, message: `${title} Broadcast sent successfully!` }
})
