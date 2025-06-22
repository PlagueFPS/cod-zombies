import { env } from '@/env';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Text,
  Tailwind,
  Link,
} from '@react-email/components';

export interface IQuestRelease {
  type: "Main" | "Side",
  title: string,
  imageUrl: string,
  description: string,
  redirectUrl: string
}

export default function QuestReleaseEmail({ type, title, imageUrl, description, redirectUrl }: IQuestRelease) {
  const currentYear = new Date().getFullYear()

  const getGuideCoverage = () => {
    const defaultCoverage = [
      "Requirements for completion",
      "Detailed explanations for each step with images",
      "Tips to circumvent common pain points"
    ]
    switch(type) {
      default: return defaultCoverage
      case "Main":
        return [
          ...defaultCoverage, 
          "Recommended Loadouts", 
          "Recommended GobbleGums",
          "Video Guides for visual learners"
        ]
    }
  }

  return (
    <Html>
      <Tailwind>
        <Head>
          <title>New { type } Quest Guide: { title }</title>
        </Head>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            {/* Logo and Site Name */}
            <Section className="text-center mb-[24px]">
              <Img
                src={`${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
                alt="Site Logo"
                width="120"
                height="50"
                className="mx-auto mb-[12px] w-[120px] h-auto object-cover rounded-[10px]"
              />
              <Text className="text-[20px] font-bold text-gray-800 m-0">
                Call of Duty: <span className="text-orange-500">Zombies Guides</span>
              </Text>
            </Section>
            
            <Hr className="border-solid border-orange-200 my-[24px]" />
            
            <Section className="bg-orange-50 rounded-[8px] p-[16px] mb-[24px] border-l-[4px] border-solid border-orange-500">
              <Heading className="text-[20px] font-bold text-gray-800 mt-0 mb-[8px]">
                { title }
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                { description }
              </Text>
            </Section>
            
            {/* Article Preview Image */}
            <Section className="mb-[24px]">
              <Img 
                src={ imageUrl }
                alt={ `${title} Preview Image` }
                className="w-full h-auto object-cover rounded-[8px]"
              />
              <Text className="text-[14px] text-gray-500 italic mt-[8px] text-center m-0">
                A visual preview of the { title } article
              </Text>
            </Section>
            
            <Section className='my-[24px] bg-gray-100 rounded-[8px] p-[16px]'>
              <Text className="text-[16px] text-gray-600 mb-[16px] font-semibold">
                What you can expect from this guide:
              </Text>
              <ul className="list-disc pl-[24px] mb-[24px] font-medium">
                { getGuideCoverage().map((coverage, index) => (
                  <li key={index} className="text-[16px] text-gray-600 mb-[8px]">
                    {coverage}
                  </li>
                ))}
              </ul>
            </Section>
            
            <Section className="text-center mb-[32px]">
              <Button
                className="bg-orange-500 text-white font-bold py-[12px] px-[24px] rounded-[4px] no-underline text-center box-border"
                href={ redirectUrl }
              >
                Read the Full Guide
              </Button>
            </Section>
            
            <Hr className="border-solid border-gray-200 my-[24px]" />
            
            <Section className='text-center'>
              <Text className="text-[14px] text-gray-500 m-0 italic">
                © { currentYear } Call of Duty: Zombies Guides. All rights reserved. You&apos;re receiving this email because you opted-in via our website. 
                You may <Link href={`${env.NEXT_PUBLIC_WEBSITE_URL}/newsletter/unsubscribe`}>unsubscribe</Link> at any point you choose.
              </Text>
              
              
              <Text className="text-[14px] leading-[20px] text-gray-500 mt-[12px]">
                <Link href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`} className="text-[#8898aa] underline">
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