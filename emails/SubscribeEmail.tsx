import { env } from '@/env';
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
  Text,
  Tailwind,
} from '@react-email/components';

interface ISubscribeEmail {
  subscribeUrl: string
}

export default function SubscribeEmail({ subscribeUrl }: ISubscribeEmail) {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Confirm Your Subscribe Request</title>
          <Preview>Please confirm your request to subscribe to our newsletter</Preview>
        </Head>
        <Body className="bg-[#f6f9fc] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            <Section className="text-center pt-[16px] pb-[32px]">
              <Img
                src={`${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
                alt={`Site Logo`}
                width="120"
                height="50"
                className="w-[120px] h-auto object-cover mx-auto"
              />
              <Text className="text-[20px] font-bold text-gray-800 m-0">
                Call of Duty: <span className="text-orange-500">Zombies Guides</span>
              </Text>
            </Section>
            
            <Section className="border-t border-solid border-[#e6ebf1] pt-[32px]">
              <Heading className="text-[24px] font-bold text-center text-[#333333] mx-0 my-[30px]">
                Confirm Your Subscribe Request
              </Heading>
              <Text className="text-[16px] leading-[24px] text-[#555555] mb-[24px]">
                We received a request to subscribe your email address to our newsletter. To confirm this request, please click the button below.
              </Text>
              <Text className="text-[16px] leading-[24px] text-[#555555] mb-[24px]">
                If you did not request to subscribe, you can safely ignore this email and you&apos;ll not receive our newsletters.
              </Text>
              <Section className="text-center my-[32px]">
                <Button
                  className={`bg-orange-600 text-white font-bold no-underline rounded-[8px] py-[12px] px-[20px] box-border`}
                  href={ subscribeUrl }
                >
                  Confirm Subscribe
                </Button>
              </Section>
              <Text className="text-[14px] text-[#8898aa] italic mb-[24px]">
                If the button above doesn&apos;t work, you can copy and paste the following link into your browser:
                <br />
                <Link href={ subscribeUrl } className="underline break-all">
                  { subscribeUrl }
                </Link>
              </Text>
              <Text className="text-[14px] text-[#8898aa] italic mb-[24px]">
                This link will expire in 24 hours for security reasons.
              </Text>
            </Section>
            <Section className="border-t border-solid border-[#e6ebf1] mt-[32px] pt-[32px] text-center">
              <Text className="text-[14px] text-[#8898aa] m-0">
                © {new Date().getFullYear()} Call of Duty: Zombies Guides. All rights reserved.
              </Text>
              <Text className="text-[14px] text-[#8898aa] mt-[16px]">
                <Link href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`} className="text-[#6b7280] underline">
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