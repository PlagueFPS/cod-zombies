import {
  Html,
  Head,
  Body,
  Button,
  Img,
  Container,
  Heading,
  Preview,
  Text,
  Section,
  Hr
} from "@react-email/components"

export interface INewReleaseEmail {
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

export default function NewReleaseEmail({ title, description, image, redirectTo, redirectText }: INewReleaseEmail) {
  return (
    <Html>
      <Head />
      <Preview>New Guide Release: { title }</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
            <Img 
              src="https://codzombiesguides.com/logo.webp"
              alt="Call of Duty: Zombies Guides Logo"
              width={ 512 }
              height={ 512 }
              style={ logo }
            />
            <Heading style={h1}>Call of Duty: Zombies Guides</Heading>
          </Section>
          <Hr style={hr} />
          <Img 
            src={`https:${image.url}?fm=jpg`} 
            width={ image.width} 
            height={ image.height } 
            alt={ `${title} Image` } 
            style={ imageStyle } 
          />
          <Section style={contentSection}>
            <Heading as="h2" style={h2}>
              { title }
            </Heading>
            <Text style={paragraph}>{ description }</Text>
            <Button style={button} href={ redirectTo }>
              { redirectText }
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "hsl(0, 0%, 100%)",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
}

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
  display: "block",
  width: "64px",
  height: "64px",
}

const h1 = {
  color: "hsl(20, 14.3%, 4.1%)",
  fontSize: "32px",
  fontWeight: "bolder",
}

const h2 = {
  color: "hsl(20, 14.3%, 4.1%)",
  fontSize: "32px",
  fontWeight: "bolder",
}

const imageStyle = {
  borderRadius: "10px",
  width: "100%",
  height: "auto"
}

const contentSection = {
  padding: "0 20px",
}

const paragraph: React.CSSProperties = {
  color: "hsl(20, 14.3%, 4.1%, 0.85)",
  fontSize: "16px",
  lineHeight: "26px",
}

const button = {
  backgroundColor: "black",
  borderRadius: "10px",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px 20px 12px 20px",
  margin: "0 auto",
}

const hr = {
  borderColor: "hsl(20, 14.3%, 4.1%, 0.3)",
  margin: "20px 0",
}

const footer = {
  color: "hsl(20, 14.3%, 4.1%, 0.7)",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
}

const link = {
  color: "hsl(24.6 95% 53.1%)",
  textDecoration: "underline",
}
