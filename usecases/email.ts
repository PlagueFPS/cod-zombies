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
  BroadcastDataError, 
  ContactExistsError, 
  ContactNotFoundError,
  ExpiredSubscribeLinkError,
  ExpiredUnsubscribeLinkError, 
  InvalidSubscribeLinkError, 
  InvalidUnsubscribeLinkError,
  UpstreamProviderError,  
} from "@/types/Error"
import SubscribeEmail from "@/emails/SubscribeEmail"

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

type ProccessUnsubscribeError = InvalidUnsubscribeLinkError | ExpiredUnsubscribeLinkError | UpstreamProviderError
type ProccessSubscribeError = UpstreamProviderError | InvalidSubscribeLinkError | ExpiredSubscribeLinkError

export const requestSubscribe = async (email: string): Promise<Result<string, UpstreamProviderError | ContactExistsError>> => {
  const { data, error } = await resend.contacts.get({ audienceId: env.RESEND_AUDIENCE_ID, email })
  if (error && error.name !== "not_found") return err(new UpstreamProviderError(
    "We were unable to send a confirmation email due to a technical issue with our email provider. Please try again.",
    { cause: error }
  ))
  if (data) return err(new ContactExistsError("We were unable to send a verification email because that email is already subscribed!"))
  
  const token = generateToken(email)
  const subscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`
  const { error: sendError } = await resend.emails.send({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Subscribe Request",
    react: SubscribeEmail({ subscribeUrl })
  })

  if (sendError) return err(new UpstreamProviderError(
    "We were unable to send a confirmation email due to a technical issue with our email provider. Please try again.",
    { cause: sendError }
  ))

  return ok("Confirmation email sent! Check your inbox.")
}

export const requestUnsubscribe = async (email: string): Promise<Result<string, UpstreamProviderError | ContactNotFoundError>> => {
  const { data, error } = await resend.contacts.get({ audienceId: env.RESEND_AUDIENCE_ID, email })
  if (error && error.name !== "not_found") return err(new UpstreamProviderError(
    "We were unable to send unsubscribe link due to a technical issue with our email provider. Please try again.", 
    { cause: error }
  ))
  if (!data) return err(new ContactNotFoundError("That email is not currently subscribed."))

  const token = generateToken(email)
  const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
  const { error: sendError } = await resend.emails.send({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Unsubscribe Request",
    react: UnsubscribeEmail({ unsubscribeUrl })
  })

  if (sendError) return err(new UpstreamProviderError(
    "We were unable to send unsubscribe link due to a technical issue with our email provider. Please try again.", 
    { cause: sendError }
  ))
  return ok("Confirmation email sent! Check your inbox.")
}

export const processSubscribe = async (token: string): Promise<Result<true, ProccessSubscribeError>> => {
  const result = verifyToken(token)
  if (result.isErr()) {
    switch(result.error._tag) {
      case "TOKEN_EXPIRATION_ERROR":
        return err(new ExpiredSubscribeLinkError("The ssubscribe link used has expired. Please request a new one."))
      case "TOKEN_VERIFICATION_ERROR":
        return err(new InvalidSubscribeLinkError("The ssubscribe link used is invalid. Please request a new one.", { cause: result.error }))
    }
  }

  const { error: createError } = await resend.contacts.create({
    email: result.value,
    audienceId: env.RESEND_AUDIENCE_ID,
  })

  if (createError) return err(new UpstreamProviderError(
    "Your subscribe request failed due to a technical issue with our email provider. Please try again.", 
    { cause: createError }
  ))

  return ok(true)
}

export const processUnsubscribe = async (token: string): Promise<Result<true, ProccessUnsubscribeError>> => {
  const result = verifyToken(token)
  if (result.isErr()) {
    switch(result.error._tag) {
      case "TOKEN_EXPIRATION_ERROR":
        return err(new ExpiredUnsubscribeLinkError("The unsubscribe link used has expired. Please request a new one."))
      case "TOKEN_VERIFICATION_ERROR":
        return err(new InvalidUnsubscribeLinkError("The unsubscribe link used is invalid. Please request a new one.", { cause: result.error }))
    }
  }

  const { error } = await resend.contacts.remove({
    audienceId: env.RESEND_AUDIENCE_ID,
    email: result.value,
  })

  if (error) return err(new UpstreamProviderError(
    "We were unable to process your unsubscribe request due to a technical issue with our email provider. Please try again or request a new unsubcribe link.", 
    { cause: error }
  ))
  return ok(true)
}

export const sendInternalEmail = async ({ subject, message }: InternalEmailProps) => {
  const { error } = await resend.emails.send({
    from: `COD Zombies Guides <support@codzombiesguides.com>`,
    to: 'codzombiesguidesteam@gmail.com',
    subject,
    text: message,
  })

  if (error) console.error(error)
}

export const sendContactEmail = async ({ name, email, message }: EmailProps): Promise<Result<EmailSuccess, UpstreamProviderError>> => {
  const { error } = await resend.emails.send({
    from: `${name} <support@codzombiesguides.com>`,
    replyTo: email,
    to: 'codzombiesguidesteam@gmail.com',
    subject: 'Contact Form Submission',
    text: message,
  })
  
  if (error) return err(new UpstreamProviderError(
    "We were unable to send your contact email due to a technical issue with our email provider. Please try again.", 
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

const sendBroadcast = async (title: string, payload: CreateBroadcastOptions): Promise<Result<EmailSuccess, UpstreamProviderError | BroadcastDataError>> => {
  const { data, error } = await resend.broadcasts.create(payload)
  if (error) return err(new UpstreamProviderError(`Failed to create broadcast with email provider: ${error.message}`, { cause: error }))
  if (!data) return err(new BroadcastDataError(`No data was returned for the ${title} broadcast creation.`))

  const { error: sendError } = await resend.broadcasts.send(data.id)
  if (sendError) return err(new UpstreamProviderError(`Failed to send broadcast with email provider: ${sendError.message}`, { cause: sendError }))

  return ok({ message: `${title} Broadcast sent successfully!` })
}