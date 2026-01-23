import { Effect } from "effect"
import { Email } from "@/lib/services/emails"

interface EmailProps {
	name: string
	email: string
	message: string
}

export const sendContactEmail = (props: EmailProps) =>
	Effect.gen(function* () {
		const { sendEmail } = yield* Email

		yield* sendEmail({
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
