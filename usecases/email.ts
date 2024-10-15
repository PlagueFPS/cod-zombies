import { env } from "@/env"
import { Resend } from "resend"

interface EmailProps {
  name: string
  email: string
  message: string
}

interface InternalEmailProps extends Pick<EmailProps, 'message'> {
  subject: string
}

export const sendInternalEmailUseCase = async ({ subject, message }: InternalEmailProps) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `Cod Zombies Guides <support@codzombiesguides.com>`,
    to: ['codzombiesguidesteam@gmail.com'],
    subject,
    text: message,
  })

  if (error) console.error(error)
}

export const sendContactEmailUseCase = async ({ name, email, message }: EmailProps) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `${name} <support@codzombiesguides.com>`,
    replyTo: email,
    to: ['codzombiesguidesteam@gmail.com'],
    subject: 'Contact Form Submission',
    text: message,
  })
  
  if (error) {  
    console.error(error)
    return {
      success: false,
      message: 'Something went wrong! Failed to send email'
    }
  }
  
  return {
    success: true,
    message: 'Thank you for contacting us! We will get back to you as soon as possible.'
  }
}
