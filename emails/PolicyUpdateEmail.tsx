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
} from '@react-email/components';
import { DATE_OPTIONS } from '@/utils/constants';
import { env } from '@/env';

export default function PrivacyPolicyUpdateEmail() {
  const today = new Date();
  const currentYear = new Date(today).getFullYear()
  const oneMonthFromNow = new Date(today);

  const currentMonth = oneMonthFromNow.getMonth();
  oneMonthFromNow.setMonth(currentMonth + 1);

  const formattedDate = oneMonthFromNow.toLocaleDateString('en-US', DATE_OPTIONS)
 

  return (
    <Html>
      <Head />
      <Preview>Important update to our Privacy Policy</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            <Section className="text-center mb-[32px]">
              <Img
                src={`${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
                alt={`Site Logo`}
                width="120"
                height="50"
                className="mx-auto w-[120px] h-auto object-cover rounded-[8px]"
              />
              <Text className="text-[20px] font-bold text-gray-800 m-0">
                Call of Duty: <span className="text-orange-500">Zombies Guides</span>
              </Text>
            </Section>
            
            <Hr className="border-solid border-[#e6ebf1] my-[24px] mx-0" />
            
            <Section>
              <Heading className="text-[24px] font-bold text-[#333] my-[24px] mx-0 text-center">
                Privacy Policy Update
              </Heading>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[16px]">
                Hello,
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[16px]">
                We&apos;re writing to inform you about important changes to our Privacy Policy. These updates will take effect on <strong>{ formattedDate }</strong>.
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[24px]">
                We&apos;ve updated our Privacy Policy to provide more transparency about how we collect, use, and protect your personal information. These changes reflect our ongoing commitment to safeguarding your privacy and ensuring compliance with evolving privacy regulations.
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[24px]">
                We encourage you to review the complete Privacy Policy. <strong>By continuing to use our services after { formattedDate }, you acknowledge these updates.</strong>
              </Text>
              
              <Section className="text-center mb-[32px]">
                <Button
                  className="bg-orange-600 text-white py-[12px] px-[20px] rounded-[4px] font-medium no-underline text-center box-border"
                  href={`${env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`}
                >
                  Review Privacy Policy
                </Button>
              </Section>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[32px]">
                If you have any questions about our Privacy Policy, please contact our team at codzombiesguidesteam@gmail.com.
                We value your trust and are committed to protecting your privacy.
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#333]">
                Best regards,
              </Text>
              
              <Text className="text-[16px] leading-[24px] text-[#333] mb-[32px]">
                The Call of Duty: Zombies Guides Team
              </Text>
            </Section>
            
            <Hr className="border-solid border-[#e6ebf1] my-[24px] mx-0" />
            
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
  );
};