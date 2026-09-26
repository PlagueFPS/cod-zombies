import type { ReactNode } from "react"
import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"
import { emailLinkClassName, emailTailwindConfig } from "./email-theme"

interface EmailShellProps {
	title: string
	preview: string
	serverUrl: string
	children: ReactNode
	unsubscribeUrl?: string
}

export function EmailShell({
	title,
	preview,
	serverUrl,
	children,
	unsubscribeUrl,
}: EmailShellProps) {
	const year = new Date().getFullYear()

	return (
		<Html lang="en" dir="ltr">
			<Tailwind config={emailTailwindConfig}>
				<Head>
					<title>{title}</title>
				</Head>
				<Body lang="en" dir="ltr" className="bg-brand-canvas py-10 font-sans">
					<Preview lang="en" dir="ltr">
						{preview}
					</Preview>
					<Container
						lang="en"
						dir="ltr"
						className="bg-brand-card mx-auto max-w-[600px] rounded-[10px] px-5 py-5"
					>
						<Section className="text-center">
							<Img
								src={`${serverUrl}/logo.png`}
								alt=""
								width={32}
								height={32}
								className="mx-auto"
							/>
							<Text className="text-brand-ink m-0 mt-3 text-xl font-bold">
								Call of Duty: <span className="text-brand-accent">Zombies Guides</span>
							</Text>
						</Section>
						<Hr className="border-brand-line my-6 border-t border-none border-solid" />
						{children}
						<Section className="border-brand-line mt-8 border-t border-none border-solid pt-6 text-center">
							{unsubscribeUrl ? (
								<Text className="text-brand-muted m-0 text-sm leading-5">
									© {year} Call of Duty: Zombies Guides. All rights reserved. You&apos;re receiving
									this email because you opted-in via our website. You may{" "}
									<Link href={unsubscribeUrl} className={emailLinkClassName}>
										unsubscribe from the newsletter
									</Link>{" "}
									at any point you choose.
								</Text>
							) : (
								<Text className="text-brand-muted m-0 text-sm leading-5">
									© {year} Call of Duty: Zombies Guides. All rights reserved.
								</Text>
							)}
							<Text className="mt-3 mb-0 text-sm leading-5">
								<Link href={`${serverUrl}/privacy-policy`} className={emailLinkClassName}>
									Privacy Policy
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

interface EmailCalloutProps {
	title: string
	description: string
}

export function EmailCallout({ title, description }: EmailCalloutProps) {
	return (
		<Section className="bg-brand-highlight mb-6 rounded-[10px]">
			<Row>
				<Column className="bg-brand-primary w-1 align-top" style={{ width: "4px" }}>
					{"\u00a0"}
				</Column>
				<Column className="px-4 py-4">
					<Heading as="h2" className="text-brand-ink m-0 mb-2 text-xl font-bold">
						{title}
					</Heading>
					<Text className="text-brand-body m-0 text-base leading-6">{description}</Text>
				</Column>
			</Row>
		</Section>
	)
}

interface EmailBulletListProps {
	heading: string
	items: readonly string[]
}

export function EmailBulletList({ heading, items }: EmailBulletListProps) {
	return (
		<Section className="bg-brand-canvas mb-6 rounded-[10px] px-4 py-4">
			<Heading as="h2" className="text-brand-ink m-0 mb-4 text-base font-semibold">
				{heading}
			</Heading>
			<ul className="m-0 list-disc pl-6">
				{items.map((item, index) => (
					<li key={`${index}-${item}`} className="text-brand-body mb-2 text-base leading-6">
						{item}
					</li>
				))}
			</ul>
		</Section>
	)
}
