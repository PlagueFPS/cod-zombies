import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import type { IQuestRelease } from './QuestReleaseEmail';
import type { ZombieType } from '@/types/Zombie';

export interface IZombieRelease extends Omit<IQuestRelease, "type"> {
  type: ZombieType
}

export default function ZombieReleaseEmail({ type, title, description, image, redirectUrl }: IZombieRelease) {
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Tailwind>
        <Head>
          <title>New { type } Zombie Released</title>
          <Preview>We've just published a new guide you might be interested in</Preview>
        </Head>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            {/* Logo and Site Name */}
            <Section className="text-center mb-[24px]">
              <Img
                src="https://codzombiesguides.com/logo.webp"
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
            
            <Heading className="text-[24px] font-bold text-gray-800 my-[24px]">
              New { type } Zombie Released
            </Heading>
            
            <Text className="text-[16px] text-gray-600 mb-[16px]">
              Introducing the latest addition to the zombies bestiary:
            </Text>
            
            <Section className="bg-orange-50 rounded-[8px] p-[16px] mb-[24px] border-l-[4px] border-solid border-orange-500">
              <Heading className="text-[20px] font-bold text-gray-800 mt-0 mb-[8px]">
                { title }
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                { description }
              </Text>
            </Section>
            
            {/* Zombie Preview Image */}
            <Section className="mb-[24px]">
              <Img
                src={ `https://${image.url}?fm=jpg` }
                alt={ `${title} Preview Image` }
                className="w-full h-auto object-cover rounded-[8px]"
              />
              <Text className="text-[14px] text-gray-500 italic mt-[8px] text-center m-0">
                A visual preview of an { title }
              </Text>
            </Section>
            
            <Text className="text-[16px] text-gray-600 mb-[24px]">
              This comprehensive guide covers:
            </Text>

            <ul className="list-disc pl-[24px] mb-[24px]">
              <li className="text-[16px] text-gray-600 mb-[8px]">
                How fast they are
              </li>
              <li className="text-[16px] text-gray-600 mb-[8px]">
                Their Elemental Weaknesses
              </li>
              <li className="text-[16px] text-gray-600 mb-[8px]">
                Detailed description of their attacks
              </li>
              <li className="text-[16px] text-gray-600 mb-[8px]">
                Their Spawn Behavior
              </li>
              <li className="text-[16px] text-gray-600 mb-[8px]">
                Combat Strategies to defeat them
              </li>
            </ul>
            
            <Section className="text-center mb-[32px]">
              <Button
                className="bg-orange-500 text-white font-bold py-[12px] px-[24px] rounded-[4px] no-underline text-center box-border"
                href={ redirectUrl }
              >
                Read the Full Guide
              </Button>
            </Section>
            
            <Text className="text-[16px] text-gray-600 mb-[16px]">
              Don't miss out on our future guides! We publish new guides for every zombie type to help you understand and defeat them.
            </Text>
            
            <Hr className="border-solid border-gray-200 my-[24px]" />
            
            <Text className="text-[14px] text-gray-500 m-0">
              © { currentYear } Call of Duty: Zombies Guides. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}