import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"
import { getServerUrl } from "@/utils/server-functions"

interface IUnsubscribeEmail {
	unsubscribeUrl: string
}

export default function UnsubscribeEmail({ unsubscribeUrl }: IUnsubscribeEmail) {
	const serverUrl = getServerUrl()

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>Confirm Your Unsubscribe Request</title>
					<Preview>Please confirm your request to unsubscribe from our newsletter</Preview>
				</Head>
				<Body className="bg-[#f6f9fc] py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[20px]">
						<Section className="pt-[16px] pb-[32px] text-center">
							<Img
								src={`${serverUrl}/logo.webp`}
								alt={`Site Logo`}
								width="120"
								height="50"
								className="mx-auto h-auto w-[120px] object-cover"
							/>
							<Text className="m-0 font-bold text-[20px] text-gray-800">
								Call of Duty: <span className="text-orange-500">Zombies Guides</span>
							</Text>
						</Section>
						<Section className="border-[#e6ebf1] border-t border-solid pt-[32px]">
							<Heading className="mx-0 my-[30px] text-center font-bold text-[#333333] text-[24px]">
								Confirm Your Unsubscribe Request
							</Heading>
							<Text className="mb-[24px] text-[#555555] text-[16px] leading-[24px]">
								We received a request to unsubscribe your email address from our newsletter. To
								confirm this request, please click the button below.
							</Text>
							<Text className="mb-[24px] text-[#555555] text-[16px] leading-[24px]">
								If you did not request to unsubscribe, you can safely ignore this email and
								you&apos;ll continue to receive our newsletters.
							</Text>
							<Section className="my-[32px] text-center">
								<Button
									className={`box-border rounded-[8px] bg-orange-600 px-[20px] py-[12px] font-bold text-white no-underline`}
									href={unsubscribeUrl}
								>
									Confirm Unsubscribe
								</Button>
							</Section>
							<Text className="mb-[24px] text-[#8898aa] text-[14px] italic">
								If the button above doesn&apos;t work, you can copy and paste the following link
								into your browser:
								<br />
								<Link href={unsubscribeUrl} className="break-all underline">
									{unsubscribeUrl}
								</Link>
							</Text>
							<Text className="mb-[24px] text-[#8898aa] text-[14px] italic">
								This link will expire in 24 hours for security reasons.
							</Text>
						</Section>
						<Section className="mt-[32px] border-[#e6ebf1] border-t border-solid pt-[32px] text-center">
							<Text className="m-0 text-[#8898aa] text-[14px]">
								© {new Date().getFullYear()} Call of Duty: Zombies Guides. All rights reserved.
							</Text>
							<Text className="mt-[16px] text-[#8898aa] text-[14px]">
								<Link href={`${serverUrl}/privacy-policy`} className="text-[#6b7280] underline">
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
