import { env } from "@/env"
import { type CreateBroadcastOptions } from "resend"
import QuestReleaseEmail, { type IQuestRelease } from "@/emails/QuestReleaseEmail"
import ZombieReleaseEmail, { type IZombieRelease } from "@/emails/ZombieReleaseEmail"
import PrivacyPolicyUpdateEmail from "@/emails/PolicyUpdateEmail"
import { generateToken } from "@/utils/functions"
import UnsubscribeEmail from "@/emails/UnsubscribeEmail"
import {  ContactExistsError, ContactNotFoundError, CreateBroadcastError } from "@/types/Error"
import SubscribeEmail from "@/emails/SubscribeEmail"
import { Console, Effect } from "effect"
import { Email } from "@/lib/services/Email"

interface EmailProps {
  name: string
  email: string
  message: string
}

export const requestSubscribe = (email: string) => Effect.gen(function*() {
  const emails = yield* Email
  const contact = yield* emails.getContact(email)
  if (contact) return yield* Effect.fail(new ContactExistsError({
    message: "We were unable to send a verification email because that email is already subscribed!",
    cause: new Error(`Contact already subscribed: ${contact.id}`)
  }))

  const token = yield* generateToken(email, "1 day")
  const subscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

  yield* emails.sendEmail({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Subscribe Request",
    react: SubscribeEmail({ subscribeUrl })
  })
  return { success: true, message: "Confirmation email sent! Check your inbox." }
}).pipe(
  Effect.withLogSpan("request_subscribe"),
  Effect.tapError(error => Console.error(error)),
  Effect.catchAll(error => Effect.succeed({ success: false, message: error.message }))
)

export const requestUnsubscribe = (email: string) => Effect.gen(function*() {
  const emails = yield* Email
  const contact = yield* emails.getContact(email)
  if (!contact) return yield* Effect.fail(new ContactNotFoundError({
    message: "That email is not currently subscribed.",
    cause: new Error(`Contact not found: ${email}`)
  }))

  const token = yield* generateToken(email, "1 day")
  const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
  yield* emails.sendEmail({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Unsubscribe Request",
    react: UnsubscribeEmail({ unsubscribeUrl })
  })
  return { success: true, message: "Confirmation email sent! Check your inbox." }
}).pipe(
  Effect.withLogSpan("request_unsubscribe"),
  Effect.tapError(error => Console.error(error)),
  Effect.catchAll(error => Effect.succeed({ success: false, message: error.message }))
)

export const subscribeEmail = (email: string) => Effect.gen(function*() {
  const emails = yield* Email
  yield* emails.createContact(email)
  return { success: true }
}).pipe(
  Effect.withLogSpan("process_subscribe"),
  Effect.tapError(error => Console.error(error)),
  Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
)

export const unsubscribeEmail = (email: string) => Effect.gen(function*() {
  const emails = yield* Email
  return yield* emails.removeContact(email)
}).pipe(
  Effect.withLogSpan("process_unsubscribe"),
  Effect.tapError(error => Console.error(error)),
)

export const sendContactEmail = (props: EmailProps) => Effect.gen(function*() {
  const emails = yield* Email
  yield* emails.sendEmail({
    from: `${props.name} <contact@codzombiesguides.com>`,
    replyTo: props.email,
    to: 'codzombiesguidesteam@gmail.com',
    subject: 'Contact Form Submission',
    text: props.message,
  })
  return { success: true, message: "Thank you for contacting us! We will get back to you as soon as possible." }
}).pipe(
  Effect.withLogSpan("send_contact_email"),
  Effect.tapError(error => Console.error(error)),
  Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
)

export const sendQuestReleaseBroadcast = (props: IQuestRelease) => {
  return sendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Quest Guide: ${props.title}`,
      react: QuestReleaseEmail(props),
      name: `${props.title} Release`
    }).pipe(Effect.withLogSpan("send_quest_release_broadcast"))
}

export const sendZombieReleaseBroadcast = (props: IZombieRelease) => {
  return sendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Zombie Release: ${props.title}`,
      react: ZombieReleaseEmail(props),
      name: `${props.title} Release`
    }).pipe(Effect.withLogSpan("send_zombie_release_broadcast"))
}

export const sendLegalUpdateBroadcast = () => {
  return sendBroadcast("Privacy Policy", {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <legal@codzombiesguides.com>",
      subject: `Privacy Policy Update Notice`,
      react: PrivacyPolicyUpdateEmail(),
      name: "Privacy Policy Update"
    }).pipe(Effect.withLogSpan("send_legal_update_broadcast"))
}

const sendBroadcast = (title: string, payload: CreateBroadcastOptions) => Effect.gen(function*() {
  const emails = yield* Email
  const broadcast = yield* emails.createBroadcast(payload)
  if (!broadcast) return yield* Effect.fail(new CreateBroadcastError({
    message: "Failed to create broadcast",
    cause: new Error("No data was returned for the broadcast request.")
  }))

  yield* emails.sendBroadcast(broadcast.id)
  return { success: true, message: `${title} Broadcast sent successfully!` }
}).pipe(
  Effect.withLogSpan("send_broadcast"),
  Effect.tapError(error => Console.error(error)),
  Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
)