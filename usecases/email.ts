import "server-only"
import { env } from "@/env"
import { type CreateBroadcastOptions } from "resend"
import QuestReleaseEmail, { type IQuestRelease } from "@/emails/QuestReleaseEmail"
import ZombieReleaseEmail, { type IZombieRelease } from "@/emails/ZombieReleaseEmail"
import PrivacyPolicyUpdateEmail from "@/emails/PolicyUpdateEmail"
import { generateToken } from "@/utils/functions"
import UnsubscribeEmail from "@/emails/UnsubscribeEmail"
import {  ContactExistsError, ContactNotFoundError } from "@/types/Error"
import SubscribeEmail from "@/emails/SubscribeEmail"
import { Console, Effect } from "effect"
import { EmailService } from "@/lib/services/EmailService"

interface EmailProps {
  name: string
  email: string
  message: string
}

export const requestSubscribe = (email: string) => 
  Effect.gen(function*() {
    const emailService = yield* EmailService
    const contact = yield* emailService.getContact({ audienceId: env.RESEND_AUDIENCE_ID, email })
    if (contact) return yield* Effect.fail(new ContactExistsError({
      message: "We were unable to send a verification email because that email is already subscribed!",
      cause: new Error(`Contact already subscribed: ${contact.id}`)
    }))

    const token = yield* generateToken(email, "24 hours")
    const subscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

    yield* emailService.sendEmail({
      from: "COD Zombies Guides <support@codzombiesguides.com>",
      to: email,
      subject: "Confirm Your Subscribe Request",
      react: SubscribeEmail({ subscribeUrl })
    })
    return { success: true, message: "Confirmation email sent! Check your inbox." }
  }).pipe(
    Effect.withLogSpan("request_subscribe"),
    Effect.tapErrorCause(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ success: false, message: error.message }))
  )

export const requestUnsubscribe = (email: string) => 
  Effect.gen(function*() {
    const emailService = yield* EmailService
    const contact = yield* emailService.getContact({ audienceId: env.RESEND_AUDIENCE_ID, email })
    if (!contact) return yield* Effect.fail(new ContactNotFoundError({
      message: "That email is not currently subscribed.",
      cause: new Error(`Contact not found: ${email}`)
    }))

    const token = yield* generateToken(email, "24 hours")
    const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
    yield* emailService.sendEmail({
      from: "COD Zombies Guides <support@codzombiesguides.com>",
      to: email,
      subject: "Confirm Your Unsubscribe Request",
      react: UnsubscribeEmail({ unsubscribeUrl })
    })
    return { success: true, message: "Confirmation email sent! Check your inbox." }
  }).pipe(
    Effect.withLogSpan("request_unsubscribe"),
    Effect.tapErrorCause(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ success: false, message: error.message }))
  )

export const subscribeEmail = (email: string) =>
  Effect.gen(function*() {
    const emailService = yield* EmailService
    yield* emailService.createContact({ email, audienceId: env.RESEND_AUDIENCE_ID })
    return { success: true }
  }).pipe(
    Effect.withLogSpan("process_subscribe"),
    Effect.tapErrorCause(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
  )

export const unsubscribeEmail = (email: string) =>
  Effect.gen(function*() {
    const emailService = yield* EmailService
    return yield* emailService.removeContact({ audienceId: env.RESEND_AUDIENCE_ID, email })
  }).pipe(
    Effect.withLogSpan("process_unsubscribe"),
    Effect.tapError(error => Console.error(error)),
  )

export const sendContactEmail = (props: EmailProps) => 
  Effect.gen(function*() {
    const emailService = yield* EmailService
    yield* emailService.sendEmail({
      from: `${props.name} <contact@codzombiesguides.com>`,
      replyTo: props.email,
      to: 'codzombiesguidesteam@gmail.com',
      subject: 'Contact Form Submission',
      text: props.message,
    })
    return { success: true, message: "Thank you for contacting us! We will get back to you as soon as possible." }
  }).pipe(
    Effect.withLogSpan("send_contact_email"),
    Effect.tapErrorCause(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
  )

export const sendQuestReleaseBroadcast = (props: IQuestRelease) =>
  Effect.gen(function*() {
    return yield* sendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Quest Guide: ${props.title}`,
      react: QuestReleaseEmail(props),
      name: `${props.title} Release`
    })
  }).pipe(Effect.withLogSpan("send_quest_release_broadcast"))

export const sendZombieReleaseBroadcast = (props: IZombieRelease) =>
  Effect.gen(function*() {
    return yield* sendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Zombie Release: ${props.title}`,
      react: ZombieReleaseEmail(props),
      name: `${props.title} Release`
    })
  }).pipe(Effect.withLogSpan("send_zombie_release_broadcast"))

export const sendLegalUpdateBroadcast = () =>
  Effect.gen(function*() {
    return yield* sendBroadcast("Privacy Policy", {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <legal@codzombiesguides.com>",
      subject: `Privacy Policy Update Notice`,
      react: PrivacyPolicyUpdateEmail(),
      name: "Privacy Policy Update"
    })
  }).pipe(Effect.withLogSpan("send_legal_update_broadcast"))

const sendBroadcast = (title: string, payload: CreateBroadcastOptions) =>
  Effect.gen(function*() {
    const emailService = yield* EmailService
    const broadcast = yield* emailService.createBroadcast(payload)
    yield* emailService.sendBroadcast(broadcast.id)
    return { success: true, message: `${title} Broadcast sent successfully!` }
  }).pipe(
    Effect.withLogSpan("send_broadcast"),
    Effect.tapErrorCause(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ message: error.message, success: false }))
  )