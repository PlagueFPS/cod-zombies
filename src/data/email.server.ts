import { Effect, Option, Predicate, Schedule } from "effect"
import SubscribeEmail from "@/emails/subscribe-email"
import UnsubscribeEmail from "@/emails/unsubscribe-email"
import { Email } from "@/lib/services/emails"
import { NewsletterTokens } from "@/lib/services/newsletter-tokens"
import { NEWSLETTER_FROM_ADDRESS } from "@/utils/constants"
import { NEWSLETTER_ACKNOWLEDGEMENT } from "@/utils/newsletter"

interface EmailProps {
	name: string
	email: string
	message: string
}

export const requestSubscribe = Effect.fn("requestSubscribe")(function* (
	email: string,
	serverUrl: string,
) {
	const emails = yield* Email

	const contact = yield* emails.getContact(email)

	if (Option.isSome(contact)) return NEWSLETTER_ACKNOWLEDGEMENT
	const tokens = yield* NewsletterTokens
	const token = yield* tokens.issueSubscribe(email)
	const subscribeUrl = `${serverUrl}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

	yield* emails.sendEmail({
		from: NEWSLETTER_FROM_ADDRESS,
		to: email,
		subject: "Confirm Your Subscribe Request",
		react: SubscribeEmail({ subscribeUrl, serverUrl }),
	})

	return NEWSLETTER_ACKNOWLEDGEMENT
})

export const requestUnsubscribe = Effect.fn("requestUnsubscribe")(function* (
	email: string,
	serverUrl: string,
) {
	const emails = yield* Email

	const contact = yield* emails.getContact(email)

	if (Option.isNone(contact)) return NEWSLETTER_ACKNOWLEDGEMENT
	const tokens = yield* NewsletterTokens
	const token = yield* tokens.issueUnsubscribe(email)
	const unsubscribeUrl = `${serverUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

	yield* emails.sendEmail({
		from: NEWSLETTER_FROM_ADDRESS,
		to: email,
		subject: "Confirm Your Unsubscribe Request",
		react: UnsubscribeEmail({ unsubscribeUrl, serverUrl }),
	})

	return NEWSLETTER_ACKNOWLEDGEMENT
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

export const newsletterRequest = (
	action: "subscribe" | "unsubscribe",
	email: string,
	serverUrl: string,
) =>
	(action === "subscribe"
		? requestSubscribe(email, serverUrl)
		: requestUnsubscribe(email, serverUrl)
	).pipe(
		Effect.retry({
			while: Predicate.isTagged("ResendError"),
			times: 3,
			schedule: Schedule.fixed("200 millis"),
		}),
		Effect.timeout("10 seconds"),
		Effect.catchCause(() => Effect.logError("Newsletter request failed")),
		Effect.as(NEWSLETTER_ACKNOWLEDGEMENT),
	)
