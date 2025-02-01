import {
  Html,
  Head,
  Body,
  Button,
  Img,
  Container,
  Heading,
  Preview,
  Tailwind,
  Text,
  Section
} from "@react-email/components"

export interface IEmail {
  title: string
  description: string
  image: {
    url: string | undefined
    width: number | undefined
    height: number | undefined
  }
  redirectTo: string
  redirectText: string
}

export default function NewReleaseEmail({ title, description, image, redirectTo, redirectText }: IEmail) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head />
        <Preview>{ title } new release!</Preview>
        <Body>
          <Container>
            <Heading>{ title } New Release!</Heading>
            <Section>
              <Img 
                src={ `https:${image.url}?fm=jpg` } 
                width={ image.width } 
                height={ image.height }
                alt={ `${ title } image` }
                className="w-full h-auto rounded-lg"
              />
              <Text>{ description }</Text>
              <Button 
                href={ redirectTo }
                className="bg-orange-600 text-white rounded px-4 py-2"
              >
                { redirectText }
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
