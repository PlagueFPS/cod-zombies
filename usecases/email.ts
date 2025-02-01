import { IEmail } from "@/emails/NewReleaseEmail"
import { env } from "@/env"
import { type CreateBatchOptions, Resend } from "resend"
import NewReleaseEmail from "@/emails/NewReleaseEmail"

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
    to: 'codzombiesguidesteam@gmail.com',
    subject,
    text: message,
  })

  if (error) console.error(error)
  return { error }
}

export const sendContactEmailUseCase = async ({ name, email, message }: EmailProps) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `${name} <support@codzombiesguides.com>`,
    replyTo: email,
    to: 'codzombiesguidesteam@gmail.com',
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

export const sendBatchReleaseEmail = async (props: IEmail) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const { data: contacts, error } = await resend.contacts.list({
    audienceId: env.RESEND_AUDIENCE_ID
  })

  if (error || !contacts) {
    console.error(error?.message)
    return {
      success: false,
      message: error?.message || "Something Went Wrong! Please Try Again."
    }
  }

  const emails: CreateBatchOptions = contacts.data.filter(contact => !contact.unsubscribed).map(contact => {
    return {
      from: "COD: Zombies Guides <support@codzombiesguides.com>",
      to: contact.email,
      subject: "New Release!",
      react: NewReleaseEmail(props),
    }
  })

  const { error: batchError } = await resend.batch.send(emails)
  if (batchError) {
    console.error(batchError.message)
    return {
      success: false,
      message: batchError.message
    }
  }

  return {
    success: true,
    message: "Batch emails successfully sent."
  }
}
