import { INewReleaseEmail } from "@/emails/NewReleaseEmail"
import { env } from "@/env"
import { type CreateBatchOptions, Resend } from "resend"
import NewReleaseEmail from "@/emails/NewReleaseEmail"
import { render } from "@react-email/components"
import { after } from "next/server"

interface EmailProps {
  name: string
  email: string
  message: string
}

interface InternalEmailProps extends Pick<EmailProps, 'message'> {
  subject: string
}

const resend = new Resend(env.RESEND_API_KEY)

export const subscribeEmailUseCase = async (email: string) => {
  const { data: contacts, error } = await resend.contacts.list({ audienceId: env.RESEND_AUDIENCE_ID })

  if (error || !contacts) {
    console.error(error?.message)
    return {
      success: false,
      message: "Something Went Wrong! Please Try Again.",
    }
  }

  after(() => {
    const unsubscribedContacts = contacts.data.filter(contact => contact.unsubscribed)
    if (unsubscribedContacts.length > 0) {
      unsubscribedContacts.forEach(async (contact) => {
        const { error: removeError } = await resend.contacts.remove({ 
          audienceId: env.RESEND_AUDIENCE_ID, 
          id: contact.id 
        })

        if (removeError) {
          console.error(removeError.message)
        }
      })
    }
  })
  
  const contact = contacts.data.find(contact => contact.email === email)
  if (contact) return {
    success: false,
    message: 'That email has already subscribed!'
  }
  
  const { error: createError } = await resend.contacts.create({
    email: email,
    audienceId: env.RESEND_AUDIENCE_ID,
    unsubscribed: false,
  })
  if (createError) {
    console.error(createError.message)
    return {
      success: false,
      message: 'Failed to Subscribe! Please Try Again.'
    }
  }

  return {
    success: true,
    message: 'Thank You For Subscribing!'
  }
}

export const unsubscribeEmailUseCase = async (email: string) => {
  const { data: contacts, error } = await resend.contacts.list({ 
    audienceId: env.RESEND_AUDIENCE_ID 
  })

  if (error || !contacts) {
    console.error(error?.message)
    return {
      success: false,
      message: "Something Went Wrong! Please Try Again.",
    }
  }

  const contact = contacts.data.find(contact => contact.email === email)
  if (!contact) return {
    success: false,
    message: "That email is not currently subscribed."
  }

  const { error: removeError } = await resend.contacts.remove({
    audienceId: env.RESEND_AUDIENCE_ID,
    id: contact.id,
    email: contact.email,
  })

  if (removeError) {
    console.error(removeError.message)
    return {
      success: false,
      message: "Failed to unsubscribe! Please Try Again."
    }
  }

  return {
    success: true,
    message: `${email} successfully unsubscribed! You will no longer receive emails from us.`
  }
}

export const sendInternalEmailUseCase = async ({ subject, message }: InternalEmailProps) => {
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

export const sendBatchReleaseEmailUseCase = async (props: Omit<INewReleaseEmail, "contactId">) => {
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
  
  const emails: CreateBatchOptions = await Promise.all(contacts.data.filter(contact => !contact.unsubscribed).map(async contact => {
    return {
      from: "COD: Zombies Guides <support@codzombiesguides.com>",
      to: contact.email,
      subject: `New Guide Release: ${props.title}`,
      react: NewReleaseEmail({ ...props, contactId: contact.id }),
      text: await render(NewReleaseEmail({ ...props, contactId: contact.id }), {
        plainText: true
      }),
      headers: {
        'List-Unsubscribe': `<https://codzombiesguides.com/api/emails/unsubscribe?contactId=${contact.id}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    }
  }))

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

export const getContactById = async (contactId: string) => {
  const { data, error } = await resend.contacts.get({
    audienceId: env.RESEND_AUDIENCE_ID,
    id: contactId
  })

  if (error || !data) return {
    contact: null,
    success: false,
    message: error?.message
  }

  return { contact: data }
}