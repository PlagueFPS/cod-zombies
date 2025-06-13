import "server-only"
import { env } from "@/env"
import { type CreateBroadcastOptions, Resend } from "resend"
import QuestReleaseEmail, { IQuestRelease } from "@/emails/QuestReleaseEmail"
import ZombieReleaseEmail, { IZombieRelease } from "@/emails/ZombieReleaseEmail"
import PrivacyPolicyUpdateEmail from "@/emails/PolicyUpdateEmail"
import { generateToken, verifyToken } from "@/utils/functions"
import UnsubscribeEmail from "@/emails/UnsubscribeEmail"
import { err, ok, Result } from 'neverthrow'
import { 
  BroadcastCreateError, 
  BroadcastDataError, 
  BroadcastSendError, 
  ContactCreateError, 
  ContactExistsError, 
  ContactGetError, 
  ContactNotFoundError, 
  ContactRemoveError, 
  EmailSendError, 
  ExpiredUnsubscribeLinkError, 
  InvalidUnsubscribeLinkError,  
} from "@/types/Error"

interface EmailProps {
  name: string
  email: string
  message: string
}

interface InternalEmailProps extends Pick<EmailProps, 'message'> {
  subject: string
}

const resend = new Resend(env.RESEND_API_KEY)

interface EmailSuccess {
  message: string
}

type SubscribeEmailError = ContactGetError | ContactExistsError | ContactCreateError
type RequestUnsubscribeError = ContactGetError | ContactNotFoundError | EmailSendError
type ProccessUnsubscribeError = InvalidUnsubscribeLinkError | ExpiredUnsubscribeLinkError | ContactRemoveError
type SendBroadcastError = BroadcastCreateError | BroadcastDataError | BroadcastSendError


export const subscribeEmailUseCase = async (email: string): Promise<Result<EmailSuccess, SubscribeEmailError>> => {
  const { data, error } = await resend.contacts.get({ audienceId: env.RESEND_AUDIENCE_ID, email })
  if (error && error.name !== "not_found") return err(new ContactGetError(
    "Your subscribe request failed due to a technical issue on our end. Please try again.", 
    { cause: error }
  ))
  if (data) return err(new ContactExistsError('Your subscribe request failed because that email has already subscribed!'))
  
  const { error: createError } = await resend.contacts.create({
    email: email,
    audienceId: env.RESEND_AUDIENCE_ID,
  })

  if (createError) return err(new ContactCreateError(
    "Your subscribe request failed due to a technical issue on our end. Please try again.", 
    { cause: createError }
  ))
  return ok({
    message: 'You have EmailSuccessfully subscribed! Thank you for subscribing.'
  })
}

export const requestUnsubscribeUseCase = async (email: string): Promise<Result<EmailSuccess, RequestUnsubscribeError>> => {
  const { data, error } = await resend.contacts.get({ audienceId: env.RESEND_AUDIENCE_ID, email })
  if (error && error.name !== "not_found") return err(new ContactGetError(
    "We were unable to send unsubscribe link due to a technical issue on our end. Please try again.", 
    { cause: error }
  ))
  if (!data) return err(new ContactNotFoundError("That email is not currently subscribed."))

  const token = generateToken(email)
  const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/unsubscribe?token=${token}`
  const { error: sendError } = await resend.emails.send({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm your unsubscribe request",
    react: UnsubscribeEmail({ unsubscribeUrl })
  })

  if (sendError) return err(new EmailSendError(
    "We were unable to send unsubscribe link due to a technical issue on our end. Please try again.", 
    { cause: sendError }
  ))
  return ok({ message: "Confirmation email sent! Check your inbox."})
}

export const processUnsubscribe = async (token: string): Promise<Result<true, ProccessUnsubscribeError>> => {
  const result = verifyToken(token)
  if (result.isErr()) {
    switch(result.error._tag) {
      case "TOKEN_EXPIRATION_ERROR":
        return err(new ExpiredUnsubscribeLinkError("The unsubscribe link used has expired. Please request a new one."))
      case "TOKEN_VERIFICATION_ERROR":
        return err(new InvalidUnsubscribeLinkError("The unsubscribe link used is invalid. Please request a new one.", { cause: result.error.cause }))
    }
  }

  const { error } = await resend.contacts.remove({
    audienceId: env.RESEND_AUDIENCE_ID,
    email: result.value,
  })

  if (error) return err(new ContactRemoveError(
    "We were unable to process your unsubscribe request due to a technical issue on our end. Please try again or request a new unsubcribe link.", 
    { cause: error }
  ))
  return ok(true)
}

export const sendInternalEmailUseCase = async ({ subject, message }: InternalEmailProps) => {
  const { error } = await resend.emails.send({
    from: `COD Zombies Guides <support@codzombiesguides.com>`,
    to: 'codzombiesguidesteam@gmail.com',
    subject,
    text: message,
  })

  if (error) console.error(error)
}

export const sendContactEmailUseCase = async ({ name, email, message }: EmailProps): Promise<Result<EmailSuccess, EmailSendError>> => {
  const { error } = await resend.emails.send({
    from: `${name} <support@codzombiesguides.com>`,
    replyTo: email,
    to: 'codzombiesguidesteam@gmail.com',
    subject: 'Contact Form Submission',
    text: message,
  })
  
  if (error) return err(new EmailSendError(
    "We were unable to send your contact email due to a technical issue on our end. Please try again.", 
    { cause: error }
  ))
  return ok({ message: 'Thank you for contacting us! We will get back to you as soon as possible.' })
}

export const sendQuestReleaseBroadcast = async (props: IQuestRelease) => {
  const result = await sendBroadcast(props.title, {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD Zombies Guides <updates@codzombiesguides.com>",
    subject: `New ${props.type} Quest Guide Release!`,
    react: QuestReleaseEmail(props),
    name: `${props.title} Release`
  })

  if (result.isErr()) {
    console.error(result.error)
    return { success: false, message: result.error.message }
  }

  return {
    success: true,
    message: result.value.message
  }
}

export const sendZombieReleaseBroadcast = async (props: IZombieRelease) => {
  const result = await sendBroadcast(props.title, {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD Zombies Guides <updates@codzombiesguides.com>",
    subject: `New ${props.type} Zombie Release!`,
    react: ZombieReleaseEmail(props),
    name: `${props.title} Release`
  })

  if (result.isErr()) {
    console.error(result.error)
    return { success: false, message: result.error.message }
  }

  return {
    success: true,
    message: result.value.message
  }
}

export const sendLegalUpdateBroadcast = async () => {
  const result = await sendBroadcast("Privacy Policy", {
    audienceId: env.RESEND_AUDIENCE_ID,
    from: "COD Zombies Guides <legal@codzombiesguides.com>",
    subject: `Privacy Policy Update Notice`,
    react: PrivacyPolicyUpdateEmail(),
    name: "Privacy Policy Update"
  })

  if (result.isErr()) {
    console.error(result.error)
    return { success: false, message: result.error.message }
  }

  return {
    success: true,
    message: result.value.message
  }
}

const sendBroadcast = async (title: string, payload: CreateBroadcastOptions): Promise<Result<EmailSuccess, SendBroadcastError>> => {
  const { data, error } = await resend.broadcasts.create(payload)
  if (error) return err(new BroadcastCreateError(error.message, { cause: error }))
  if (!data) return err(new BroadcastDataError(`No data was returned for the ${title} broadcast creation.`))

  const { error: sendError } = await resend.broadcasts.send(data.id)
  if (sendError) return err(new BroadcastSendError(sendError.message, { cause: sendError }))

  return ok({ message: `${title} Broadcast sent successfully!` })
}