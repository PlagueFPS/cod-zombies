import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"
import { getServerUrl } from "@/utils/functions"
export interface IQuestRelease {
	type: "Main" | "Side"
	title: string
	description: string
	redirectUrl: string
	unsubscribeUrl: string
}

export default function QuestReleaseEmail({
	type,
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
}: IQuestRelease) {
	const currentYear = new Date().getFullYear()
	const serverUrl = getServerUrl()

	const getGuideCoverage = () => {
		const defaultCoverage = [
			"Requirements for completion",
			"Detailed explanations for each step with images",
			"Tips to circumvent common pain points",
		]
		switch (type) {
			case "Main":
				return [
					...defaultCoverage,
					"Recommended Loadouts",
					"Recommended GobbleGums",
					"Video Guides for visual learners",
				]
			default:
				return defaultCoverage
		}
	}

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>
						New {type} Quest Guide: &quot;{title}&quot;
					</title>
				</Head>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[20px]">
						{/* Logo and Site Name */}
						<Section className="mb-[24px] text-center">
							<Img
								src={`${serverUrl}/logo.webp`}
								alt="Site Logo"
								width="120"
								height="50"
								className="mx-auto mb-[12px] h-auto w-[120px] rounded-[10px] object-cover"
							/>
							<Text className="m-0 font-bold text-[20px] text-gray-800">
								Call of Duty: <span className="text-orange-500">Zombies Guides</span>
							</Text>
						</Section>

						<Hr className="my-[24px] border-orange-200 border-solid" />

						<Section className="mb-[24px] rounded-[8px] border-orange-500 border-l-[4px] border-solid bg-orange-50 p-[16px]">
							<Heading className="mt-0 mb-[8px] font-bold text-[20px] text-gray-800">
								{title}
							</Heading>
							<Text className="m-0 text-[16px] text-gray-600">{description}</Text>
						</Section>

						<Section className="my-[24px] rounded-[8px] bg-gray-100 p-[16px]">
							<Text className="mb-[16px] font-semibold text-[16px] text-gray-600">
								What you can expect from this guide:
							</Text>
							<ul className="mb-[24px] list-disc pl-[24px] font-medium">
								{getGuideCoverage().map(coverage => (
									<li key={coverage} className="mb-[8px] text-[16px] text-gray-600">
										{coverage}
									</li>
								))}
							</ul>
						</Section>

						<Section className="mb-[32px] text-center">
							<Button
								className="box-border rounded-[4px] bg-orange-500 px-[24px] py-[12px] text-center font-bold text-white no-underline"
								href={redirectUrl}
							>
								Read the Full Guide
							</Button>
						</Section>

						<Hr className="my-[24px] border-gray-200 border-solid" />

						<Section className="text-center">
							<Text className="m-0 text-[14px] text-gray-500 italic">
								© {currentYear} Call of Duty: Zombies Guides. All rights reserved. You&apos;re
								receiving this email because you opted-in via our website. You may{" "}
								<Link href={unsubscribeUrl}>unsubscribe</Link> at any point you choose.
							</Text>

							<Text className="mt-[12px] text-[14px] text-gray-500 leading-[20px]">
								<Link
									href={`${serverUrl}/privacy-policy`}
									className="text-[#8898aa] underline"
								>
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
