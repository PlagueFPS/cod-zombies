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
import { DATE_OPTIONS } from "@/utils/constants"

export default function PrivacyPolicyUpdateEmail() {
	const today = new Date()
	const _currentYear = new Date(today).getFullYear()
	const oneMonthFromNow = new Date(today)

	const currentMonth = oneMonthFromNow.getMonth()
	oneMonthFromNow.setMonth(currentMonth + 1)

	const _formattedDate = oneMonthFromNow.toLocaleDateString("en-US", DATE_OPTIONS)

	// return (
	// 	<Html>
	// 		<Head />
	// 		<Preview>Important update to our Privacy Policy</Preview>
	// 		<Tailwind>
	// 			<Body className="bg-[#f6f9fc] py-[40px] font-sans">
	// 				<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[20px]">
	// 					<Section className="mb-[32px] text-center">
	// 						<Img
	// 							src={`${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
	// 							alt={`Site Logo`}
	// 							width="120"
	// 							height="50"
	// 							className="mx-auto h-auto w-[120px] rounded-[8px] object-cover"
	// 						/>
	// 						<Text className="m-0 font-bold text-[20px] text-gray-800">
	// 							Call of Duty: <span className="text-orange-500">Zombies Guides</span>
	// 						</Text>
	// 					</Section>

	// 					<Hr className="mx-0 my-[24px] border-[#e6ebf1] border-solid" />

	// 					<Section>
	// 						<Heading className="mx-0 my-[24px] text-center font-bold text-[#333] text-[24px]">
	// 							Privacy Policy Update
	// 						</Heading>

	// 						<Text className="mb-[16px] text-[#333] text-[16px] leading-[24px]">Hello,</Text>

	// 						<Text className="mb-[16px] text-[#333] text-[16px] leading-[24px]">
	// 							We&apos;re writing to inform you about important changes to our Privacy Policy. These updates will take
	// 							effect on <strong>{formattedDate}</strong>.
	// 						</Text>

	// 						<Text className="mb-[24px] text-[#333] text-[16px] leading-[24px]">
	// 							We&apos;ve updated our Privacy Policy to provide more transparency about how we collect, use, and
	// 							protect your personal information. These changes reflect our ongoing commitment to safeguarding your
	// 							privacy and ensuring compliance with evolving privacy regulations.
	// 						</Text>

	// 						<Text className="mb-[24px] text-[#333] text-[16px] leading-[24px]">
	// 							We encourage you to review the complete Privacy Policy.{" "}
	// 							<strong>By continuing to use our services after {formattedDate}, you acknowledge these updates.</strong>
	// 						</Text>

	// 						<Section className="mb-[32px] text-center">
	// 							<Button
	// 								className="box-border rounded-[4px] bg-orange-600 px-[20px] py-[12px] text-center font-medium text-white no-underline"
	// 								href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`}
	// 							>
	// 								Review Privacy Policy
	// 							</Button>
	// 						</Section>

	// 						<Text className="mb-[32px] text-[#333] text-[16px] leading-[24px]">
	// 							If you have any questions about our Privacy Policy, please contact our team at
	// 							codzombiesguidesteam@gmail.com. We value your trust and are committed to protecting your privacy.
	// 						</Text>

	// 						<Text className="text-[#333] text-[16px] leading-[24px]">Best regards,</Text>

	// 						<Text className="mb-[32px] text-[#333] text-[16px] leading-[24px]">
	// 							The Call of Duty: Zombies Guides Team
	// 						</Text>
	// 					</Section>

	// 					<Hr className="mx-0 my-[24px] border-[#e6ebf1] border-solid" />

	// 					<Section className="text-center">
	// 						<Text className="m-0 text-[14px] text-gray-500 italic">
	// 							© {currentYear} Call of Duty: Zombies Guides. All rights reserved. You&apos;re receiving this email
	// 							because you opted-in via our website. You may{" "}
	// 							<Link href={`${env.NEXT_PUBLIC_WEBSITE_URL}/newsletter/unsubscribe`}>unsubscribe</Link> at any point you
	// 							choose.
	// 						</Text>

	// 						<Text className="mt-[12px] text-[14px] text-gray-500 leading-[20px]">
	// 							<Link href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`} className="text-[#8898aa] underline">
	// 								Privacy Policy
	// 							</Link>
	// 						</Text>
	// 					</Section>
	// 				</Container>
	// 			</Body>
	// 		</Tailwind>
	// 	</Html>
	// )
}
