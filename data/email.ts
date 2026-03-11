import { Effect } from "effect"
import SubscribeEmail from "@/emails/subscribe-email"
import UnsubscribeEmail from "@/emails/unsubscribe-email"
import { Email } from "@/lib/services/emails"
import { ContactExistsError, ContactNotFoundError } from "@/types/errors"
import { generateToken, getServerUrl } from "@/utils/server-functions"

interface EmailProps {
	name: string
	email: string
	message: string
}

export const requestSubscribe = (email: string) =>
	Effect.gen(function* () {
		const emails = yield* Email

		const contact = yield* emails.getContact(email)
		if (contact)
			return yield* new ContactExistsError({
				message: "That email is already subscribed!",
				cause: new Error(`Contact already subscribed: ${contact}`),
			})

		const token = yield* generateToken(email, "1 day")
		const subscribeUrl = `${getServerUrl()}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

		yield* emails.sendEmail({
			from: "COD Zombies Guides <support@codzombiesguides.com>",
			to: email,
			subject: "Confirm Your Subscribe Request",
			react: SubscribeEmail({ subscribeUrl }),
		})
		return { success: true, message: "Check your inbox to complete your subscribe request." }
	}).pipe(Effect.withLogSpan("request_subscribe"))

export const requestUnsubscribe = (email: string) =>
	Effect.gen(function* () {
		const emails = yield* Email

		const contact = yield* emails.getContact(email)
		if (!contact)
			return yield* new ContactNotFoundError({
				message: "That email is not currently subscribed!",
				cause: new Error(`Contact not found for email: ${email}`),
			})

		const token = yield* generateToken(email, "1 day")
		const unsubscribeUrl = `${getServerUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

		yield* emails.sendEmail({
			from: "COD Zombies Guides <support@codzombiesguides.com>",
			to: email,
			subject: "Confirm Your Unsubscribe Request",
			react: UnsubscribeEmail({ unsubscribeUrl }),
		})
		return { success: true, message: "Check your inbox to complete your unsubscribe request." }
	}).pipe(Effect.withLogSpan("request_unsubscribe"))

export const subscribeEmail = (email: string) =>
	Effect.gen(function* () {
		const emails = yield* Email
		return yield* emails.createContact(email)
	}).pipe(Effect.withLogSpan("subscribe_email"))

export const unsubscribeEmail = (email: string) =>
	Effect.gen(function* () {
		const emails = yield* Email
		return yield* emails.removeContact(email)
	}).pipe(Effect.withLogSpan("unsubscribe_email"))

export const sendContactEmail = (props: EmailProps) =>
	Effect.gen(function* () {
		const emails = yield* Email

		yield* emails.sendEmail({
			from: `${props.name} <contact@codzombiesguides.com>`,
			replyTo: props.email,
			to: "contact@codzombiesguides.com",
			subject: "Contact Form Submission",
			text: props.message,
		})
		return {
			success: true,
			message: "Thank you for contacting us! We will get back to you as soon as possible.",
		}
	}).pipe(Effect.withLogSpan("send_contact_email"))
