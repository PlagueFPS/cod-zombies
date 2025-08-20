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
import * as React from "react"

export default function NewFeatureEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
	const currentYear = new Date().getFullYear()

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>New Interactive Map: Reckoning</title>
					<Preview>The Reckoning interactive map is now available!</Preview>
				</Head>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[20px]">
						{/* Logo and Site Name */}
						<Section className="mb-[24px] text-center">
							<Img
								src={`https://www.codzombiesguides.com/logo.webp`}
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
							The Reckoning Interactive Map is Now Available!
						</Heading>

						<Section className="mb-[32px]">
							<Text className="mb-[16px] text-[16px] text-gray-600 leading-[24px]">
								We&apos;re thrilled to announce the release of our{" "}
								<strong className="text-orange-500">Reckoning Interactive Map</strong> for Call of
								Duty: Zombies!
							</Text>
						</Section>

						<Section className="mb-[24px]">
							<Img
								src="https://www.codzombiesguides.com/previews/reckoning-preview.webp"
								alt="Reckoning Preview"
								className="h-auto w-full rounded-[8px] object-cover"
							/>
							<Text className="m-0 mt-[8px] text-center text-[14px] text-gray-500 italic">
								A visual preview of the Reckoning interactive map
							</Text>
						</Section>

						<Section className="mb-[24px] rounded-[8px] bg-gray-100 p-[24px]">
							<Heading className="text-[16px] text-gray-600">Key Features:</Heading>
							<ul className="list-disc pl-[24px]">
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Locations</strong> - View locations for all Perks, Mystery Boxes, Wall
									Buys, Intel, and more!
								</li>
								<li className="mb-[8px] text-[16px] text-gray-600">
									<strong>Objective Items</strong> - Know the locations of important objective items
									like Aetheric Flora, Vacuum-Seal Devices, and more.
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
								href={`https://codzombiesguides.com/maps/reckoning`}
							>
								View the Interactive Map
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
									href={`https://codzombiesguides.com/privacy-policy`}
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
