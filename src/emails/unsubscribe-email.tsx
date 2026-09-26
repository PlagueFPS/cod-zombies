import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailShell } from "./_components/email-shell"
import { emailButtonClassName, emailLinkClassName } from "./_components/email-theme"

interface IUnsubscribeEmail {
	unsubscribeUrl: string
	serverUrl: string
}

export const unsubscribeEmailSubject = "Confirm Your Unsubscribe Request"

export const unsubscribeEmailPreview =
	"Please confirm your request to unsubscribe from our newsletter"

function UnsubscribeEmail({ unsubscribeUrl, serverUrl }: IUnsubscribeEmail) {
	return (
		<EmailShell
			title={unsubscribeEmailSubject}
			preview={unsubscribeEmailPreview}
			serverUrl={serverUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 my-8 text-center text-2xl font-bold">
				Confirm Your Unsubscribe Request
			</Heading>
			<Text className="text-brand-body mb-6 text-base leading-6">
				We received a request to unsubscribe your email address from our newsletter. To confirm this
				request, please click the button below.
			</Text>
			<Text className="text-brand-body mb-6 text-base leading-6">
				If you did not request to unsubscribe, you can safely ignore this email and you&apos;ll
				continue to receive our newsletters.
			</Text>
			<Section className="my-8 text-center">
				<Button className={emailButtonClassName} href={unsubscribeUrl}>
					Confirm Unsubscribe
				</Button>
			</Section>
			<Text className="text-brand-muted mb-3 text-sm leading-5">
				If the button above doesn&apos;t work, copy and paste this unsubscribe confirmation link
				into your browser:
			</Text>
			<Text className="mb-2 text-sm leading-5">
				<Link href={unsubscribeUrl} className={emailLinkClassName}>
					Confirm unsubscribe from the newsletter
				</Link>
			</Text>
			<Text className="text-brand-muted mb-6 text-sm leading-5 break-all">{unsubscribeUrl}</Text>
			<Text className="text-brand-muted mb-6 text-sm leading-5">
				This link will expire in 24 hours for security reasons.
			</Text>
		</EmailShell>
	)
}

export default Object.assign(UnsubscribeEmail, {
	PreviewProps: {
		unsubscribeUrl: "https://codzombiesguides.com/api/newsletter/unsubscribe?token=preview-token",
		serverUrl: "https://codzombiesguides.com",
	} satisfies IUnsubscribeEmail,
})
