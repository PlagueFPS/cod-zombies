import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailShell } from "./_components/email-shell"
import { emailButtonClassName, emailLinkClassName } from "./_components/email-theme"

interface ISubscribeEmail {
	subscribeUrl: string
	serverUrl: string
}

export const subscribeEmailSubject = "Confirm Your Subscribe Request"

export const subscribeEmailPreview = "Please confirm your request to subscribe to our newsletter"

function SubscribeEmail({ subscribeUrl, serverUrl }: ISubscribeEmail) {
	return (
		<EmailShell title={subscribeEmailSubject} preview={subscribeEmailPreview} serverUrl={serverUrl}>
			<Heading as="h1" className="text-brand-ink mx-0 my-8 text-center text-2xl font-bold">
				Confirm Your Subscribe Request
			</Heading>
			<Text className="text-brand-body mb-6 text-base leading-6">
				We received a request to subscribe your email address to our newsletter. To confirm this
				request, please click the button below.
			</Text>
			<Text className="text-brand-body mb-6 text-base leading-6">
				If you did not request to subscribe, you can safely ignore this email and you&apos;ll not
				receive our newsletters.
			</Text>
			<Section className="my-8 text-center">
				<Button className={emailButtonClassName} href={subscribeUrl}>
					Confirm Subscribe
				</Button>
			</Section>
			<Text className="text-brand-muted mb-3 text-sm leading-5">
				If the button above doesn&apos;t work, copy and paste this subscription confirmation link
				into your browser:
			</Text>
			<Text className="mb-2 text-sm leading-5">
				<Link href={subscribeUrl} className={emailLinkClassName}>
					Confirm your newsletter subscription
				</Link>
			</Text>
			<Text className="text-brand-muted mb-6 text-sm leading-5 break-all">{subscribeUrl}</Text>
			<Text className="text-brand-muted mb-6 text-sm leading-5">
				This link will expire in 24 hours for security reasons.
			</Text>
		</EmailShell>
	)
}

export default Object.assign(SubscribeEmail, {
	PreviewProps: {
		subscribeUrl: "https://codzombiesguides.com/api/newsletter/subscribe?token=preview-token",
		serverUrl: "https://codzombiesguides.com",
	} satisfies ISubscribeEmail,
})
