import "server-only"
import { env } from "@/env"
import { CreateBroadcastOptions, Resend } from "resend"
import { after } from "next/server"
import QuestReleaseEmail, { IQuestRelease } from "@/emails/QuestReleaseEmail"
import ZombieReleaseEmail, { IZombieRelease } from "@/emails/ZombieReleaseEmail"
import PrivacyPolicyUpdateEmail from "@/emails/PolicyUpdateEmail"
import { generateToken, verifyToken } from "@/utils/functions"
import UnsubscribeEmail from "@/emails/UnsubscribeEmail"

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

export const requestUnsubscribeUseCase = async (email: string) => {
  const { data: contacts, error } = await resend.contacts.list({ audienceId: env.RESEND_AUDIENCE_ID })

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

  const token = generateToken(email)
  const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/unsubscribe?token=${token}`
  const { error: sendError } = await resend.emails.send({
    from: "COD: Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm your unsubscribe request",
    react: UnsubscribeEmail({ unsubscribeUrl })
  })

  if (sendError) return {
    success: false,
    message: "Failed to send confirmation email. Please Try Again."
  }

  return { success: true, message: "Confirmation email sent! Check your inbox."}
}

export const processUnsubscribe = async (token: string) => {
  const { valid, value } = verifyToken(token)
  if (!valid || !value) return {
    success: false,
    message: "Invalid or expired unsubscribe link. Please request a new one."
  }

  const { error } = await resend.contacts.remove({
    audienceId: env.RESEND_AUDIENCE_ID,
    email: value,
  })

  if (error) return {
    success: false,
    message: "Failed to process your request. Please try again."
  }

  return {
    success: true,
    message: "You have been successfully unsubscribed."
  }
}

export const sendInternalEmailUseCase = async ({ subject, message }: InternalEmailProps) => {
  const { error } = await resend.emails.send({
    from: `COD: Zombies Guides <support@codzombiesguides.com>`,
    to: 'codzombiesguidesteam@gmail.com',
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

export const sendQuestReleaseBroadcast = async (props: IQuestRelease) => {
  return await sendBroadcast(props.title, {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD: Zombies Guides <updates@codzombiesguides.com>",
    subject: `New ${props.type} Quest Guide Release!`,
    react: QuestReleaseEmail(props),
    name: `${props.title} Release`
  })
}

export const sendZombieReleaseBroadcast = async (props: IZombieRelease) => {
  return await sendBroadcast(props.title, {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD: Zombies Guides <updates@codzombiesguides.com>",
    subject: `New ${props.type} Zombie Release!`,
    react: ZombieReleaseEmail(props),
    name: `${props.title} Release`
  })
}

export const sendLegalUpdateBroadcast = async () => {
  return await sendBroadcast("Privacy Policy", {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD: Zombies Guides <legal@codzombiesguides.com>",
    subject: `Privacy Policy Update Notice`,
    react: PrivacyPolicyUpdateEmail(),
    name: "Privacy Policy Update"
  })
}

const sendBroadcast = async (title: string, payload: CreateBroadcastOptions) => {
  const { data, error } = await resend.broadcasts.create(payload)

  if (error || !data) {
    console.error(error)
    return {
      success: false,
      message: error?.message || "Failed to create broadcast. Check server logs."
    }
  }

  const { error: sendError } = await resend.broadcasts.send(data.id)
  if (sendError) {
    console.error(sendError)
    return {
      success: false,
      message: sendError.message
    }
  }

  return {
    success: true,
    message: `${title} Broadcast sent successfully!`
  }
}