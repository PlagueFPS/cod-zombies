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

export default function NewFeatureEmail() {
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Tailwind>
        <Head>
          <title>New Feature: Interactive Maps</title>
          <Preview>Interactive Maps are here! A new way to view zombie maps.</Preview>
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
              Interactive Maps Feature Now Live!
            </Heading>

            <Section className='mb-[32px]'>
              <Text className="text-gray-600 text-[16px] leading-[24px] mb-[16px]">
                We're thrilled to announce our brand new <strong className="text-orange-500">Interactive Maps</strong> feature for Call of Duty: Zombies!
                No more getting lost in the chaos, our interactive maps will help guide you through every layer of every map so you never question where something is located.
              </Text>
            </Section>       
            
            <Section className='bg-gray-100 p-[24px] rounded-[8px] mb-[24px]'>
              <Heading className="text-[16px] text-gray-600">
                Key Features:
              </Heading>

              <ul className="list-disc pl-[24px]">
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Maps</strong> - All Black Ops 6 maps available
                </li>
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Locations</strong> - View locations for all perks, mystery boxes, wall buys, and more!
                </li>
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Objective Items</strong> - Know the locations of important objective items like Shattered Veil's Janus Crates and more.
                </li>
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Filters</strong> - Narrow down what you are looking for in our maps with filters for each item type.
                </li>
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Area Labels</strong> - Learn every area of the map so you are never lost.
                </li>
                <li className="text-[16px] text-gray-600 mb-[8px]">
                  <strong>Shareable</strong> - Sharing a link of your map will save your filters so the person receiving the link sees exactly what you see.
                </li>
              </ul>
            </Section>
            
            <Section className="text-center mb-[32px]">
              <Button
                className="bg-orange-500 text-white font-bold py-[12px] px-[24px] rounded-[4px] no-underline text-center box-border"
                href="https://codzombiesguides.com/maps"
              >
                Explore Interactive Maps
              </Button>
            </Section>
            
            <Text className='text-gray-600 text-[14px] leading-[20px]'>
              More features are planned and coming. If you have any feature requests never hesitate to contact us to let us know what you have in mind!
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
