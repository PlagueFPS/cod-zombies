import type { Zombie } from "@/types/payload-types"
import type { IQuestRelease } from "./quest-release-email"
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
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"
import { env } from "@/env"

export interface IZombieRelease extends Omit<IQuestRelease, "type"> {
	type: Zombie["type"]
}

export default function ZombieReleaseEmail({
	type,
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
}: IZombieRelease) {
	const currentYear = new Date().getFullYear()

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>
						New {type} Zombie Release: &quot;{title}&quot;
					</title>
					<Preview>
						We&apos;ve just published a new zombie breakdown you might be interested in
					</Preview>
				</Head>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[20px]">
						{/* Logo and Site Name */}
						<Section className="mb-[24px] text-center">
							<Img
								src={`${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
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

						<Section className="mb-[24px] rounded-[8px] bg-gray-100 p-[16px]">
							<Text className="mb-[16px] font-semibold text-[16px] text-gray-600">
								What you can expect from this breakdown:
							</Text>

							<ul className="mb-[24px] list-disc pl-[24px] font-medium">
								<li className="mb-[8px] text-[16px] text-gray-600">
									How fast they move and how to counteract it
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									What elements they are weak against
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									Detailed descriptions of their attacks
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">When and how they spawn</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									How to defeat them effectively
								</li>
							</ul>
						</Section>

						<Section className="mb-[32px] text-center">
							<Button
								className="box-border rounded-[4px] bg-orange-500 px-[24px] py-[12px] text-center font-bold text-white no-underline"
								href={redirectUrl}
							>
								View the Full Breakdown
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
									href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`}
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
