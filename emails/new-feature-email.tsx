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

export default function NewFeatureEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
	const currentYear = new Date().getFullYear()

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>New Feature: Interactive Maps</title>
					<Preview>Interactive Maps are here! A new way to view zombie maps.</Preview>
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

						<Heading className="my-[24px] text-center font-bold text-[24px] text-gray-800">
							Interactive Maps Feature Now Live!
						</Heading>

						<Section className="mb-[32px]">
							<Text className="mb-[16px] text-[16px] text-gray-600 leading-[24px]">
								We&apos;re thrilled to announce our brand new{" "}
								<strong className="text-orange-500">Interactive Maps</strong> feature for Call of
								Duty: Zombies! No more getting lost in the chaos, our interactive maps will help
								guide you through every layer of every map so you never question where something is
								located.
							</Text>
						</Section>

						<Section className="mb-[24px] rounded-[8px] bg-gray-100 p-[24px]">
							<Heading className="text-[16px] text-gray-600">Key Features:</Heading>

							<ul className="list-disc pl-[24px]">
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Maps</strong> - All Black Ops 6 maps available
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Locations</strong> - View locations for all perks, mystery boxes, wall
									buys, and more!
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Objective Items</strong> - Know the locations of important objective items
									like Shattered Veil&apos;s Janus Crates and more.
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Filters</strong> - Narrow down what you are looking for in our maps with
									filters for each item type.
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Area Labels</strong> - Learn every area of the map so you are never lost.
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Shareable</strong> - Sharing a link of your map will save your filters so
									the person receiving the link sees exactly what you see.
								</li>
							</ul>
						</Section>

						<Section className="mb-[32px] text-center">
							<Button
								className="box-border rounded-[4px] bg-orange-500 px-[24px] py-[12px] text-center font-bold text-white no-underline"
								href={`${env.NEXT_PUBLIC_WEBSITE_URL}/maps`}
							>
								Explore Interactive Maps
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
