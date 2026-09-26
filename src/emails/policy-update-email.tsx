import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailBulletList, EmailShell } from "./_components/email-shell"
import { emailButtonClassName, emailLinkClassName } from "./_components/email-theme"

interface IPolicyUpdateEmail {
	unsubscribeUrl: string
	serverUrl: string
	bullets: readonly string[]
}

export const policyUpdateSubject = "Privacy Policy Update"

export const policyUpdatePreview = "Important update to our Privacy Policy"

const policyDateOptions: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
}

function PrivacyPolicyUpdateEmail({ unsubscribeUrl, serverUrl, bullets }: IPolicyUpdateEmail) {
	const today = new Date()
	const oneMonthFromNow = new Date(today)
	oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)
	const formattedDate = oneMonthFromNow.toLocaleDateString("en-US", policyDateOptions)

	return (
		<EmailShell
			title={policyUpdateSubject}
			preview={policyUpdatePreview}
			serverUrl={serverUrl}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				Privacy Policy Update
			</Heading>
			<Text className="text-brand-body mb-4 text-base leading-6">Hello,</Text>
			<Text className="text-brand-body mb-4 text-base leading-6">
				We&apos;re writing to inform you about important changes to our Privacy Policy. These
				updates will take effect on <strong>{formattedDate}</strong>.
			</Text>
			<Text className="text-brand-body mb-4 text-base leading-6">
				We&apos;ve updated our Privacy Policy to provide more transparency about how we collect,
				use, and protect your personal information. These changes reflect our ongoing commitment to
				safeguarding your privacy and ensuring compliance with evolving privacy regulations.
			</Text>
			<EmailBulletList heading="Changes in this update" items={bullets} />
			<Text className="text-brand-body mb-6 text-base leading-6">
				We encourage you to review the complete Privacy Policy.{" "}
				<strong>
					By continuing to use our services after {formattedDate}, you acknowledge these updates.
				</strong>
			</Text>
			<Section className="mb-8 text-center">
				<Button className={emailButtonClassName} href={`${serverUrl}/privacy-policy`}>
					Review Privacy Policy
				</Button>
			</Section>
			<Text className="text-brand-body mb-8 text-base leading-6">
				If you have any questions about our Privacy Policy, please contact our team at{" "}
				<Link href="mailto:contact@codzombiesguides.com" className={emailLinkClassName}>
					contact@codzombiesguides.com
				</Link>
				. We value your trust and are committed to protecting your privacy.
			</Text>
			<Text className="text-brand-body mb-0 text-base leading-6">Best regards,</Text>
			<Text className="text-brand-body mb-8 text-base leading-6">
				The Call of Duty: Zombies Guides Team
			</Text>
		</EmailShell>
	)
}

export default Object.assign(PrivacyPolicyUpdateEmail, {
	PreviewProps: {
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://codzombiesguides.com",
		bullets: [
			"How the newsletter form describes the information it collects",
			"How long confirmation tokens are kept",
			"How to contact the team about your personal information",
		],
	} satisfies IPolicyUpdateEmail,
})
