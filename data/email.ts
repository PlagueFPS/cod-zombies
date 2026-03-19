import { Duration, Effect, Option, Schema } from "effect"
import SubscribeEmail from "@/emails/subscribe-email"
import UnsubscribeEmail from "@/emails/unsubscribe-email"
import { Email } from "@/lib/services/emails"
import { generateToken, getServerUrl } from "@/utils/server-functions"

interface EmailProps {
	name: string
	email: string
	message: string
}

class ContactExistsError extends Schema.TaggedErrorClass<ContactExistsError>()(
	"ContactExistsError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}
class ContactNotFoundError extends Schema.TaggedErrorClass<ContactNotFoundError>()(
	"ContactNotFoundError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}

export const requestSubscribe = Effect.fn("requestSubscribe")(function* (email: string) {
	const emails = yield* Email

	const contact = yield* emails.getContact(email)
	if (Option.isSome(contact))
		return yield* new ContactExistsError({
			message: "That email is already subscribed!",
			cause: new Error(`Contact already subscribed: ${contact.value}`),
		})

	const ttl = yield* Duration.fromInput("1 day")
	const token = yield* generateToken(email, ttl)
	const subscribeUrl = `${getServerUrl()}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

	yield* emails.sendEmail({
		from: "COD Zombies Guides <support@codzombiesguides.com>",
		to: email,
		subject: "Confirm Your Subscribe Request",
		react: SubscribeEmail({ subscribeUrl }),
	})
	return { success: true, message: "Check your inbox to complete your subscribe request." }
})

export const requestUnsubscribe = Effect.fn("requestUnsubscribe")(function* (email: string) {
	const emails = yield* Email

	const contact = yield* emails.getContact(email)
	if (Option.isNone(contact))
		return yield* new ContactNotFoundError({
			message: "That email is not currently subscribed!",
			cause: new Error(`Contact not found for email: ${email}`),
		})

	const ttl = yield* Duration.fromInput("1 day")
	const token = yield* generateToken(email, ttl)
	const unsubscribeUrl = `${getServerUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

	yield* emails.sendEmail({
		from: "COD Zombies Guides <support@codzombiesguides.com>",
		to: email,
		subject: "Confirm Your Unsubscribe Request",
		react: UnsubscribeEmail({ unsubscribeUrl }),
	})

	return { success: true, message: "Check your inbox to complete your unsubscribe request." }
})

export const subscribeEmail = Effect.fn("subscribeEmail")(function* (email: string) {
	const emails = yield* Email
	return yield* emails.createContact(email)
})

export const unsubscribeEmail = Effect.fn("unsubscribeEmail")(function* (email: string) {
	const emails = yield* Email
	return yield* emails.removeContact(email)
})

export const sendContactEmail = Effect.fn("sendContactEmail")(function* (props: EmailProps) {
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
})
