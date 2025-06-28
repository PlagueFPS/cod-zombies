import { env } from "@/env"
import { type CreateBroadcastOptions } from "resend"
import QuestReleaseEmail, { type IQuestRelease } from "@/emails/QuestReleaseEmail"
import ZombieReleaseEmail, { type IZombieRelease } from "@/emails/ZombieReleaseEmail"
import PrivacyPolicyUpdateEmail from "@/emails/PolicyUpdateEmail"
import { generateToken } from "@/utils/functions"
import UnsubscribeEmail from "@/emails/UnsubscribeEmail"
import { 
  ContactExistsError, 
  ContactNotFoundError, 
  CreateBroadcastError 
} from "@/types/Error"
import SubscribeEmail from "@/emails/SubscribeEmail"
import { Effect } from "effect"
import { Email } from "@/lib/services/Email"

interface EmailProps {
  name: string
  email: string
  message: string
}

export const requestSubscribe = (email: string) => Effect.gen(function*() {
  const { getContact, sendEmail } = yield* Email

  const contact = yield* getContact(email)
  if (contact) return yield* new ContactExistsError({
    message: "We were unable to send a confirmation email because that email is already subscribed!",
    cause: new Error(`Contact already subscribed: ${contact}`)
  })

  const token = yield* generateToken(email, "1 day")
  const subscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/subscribe?token=${encodeURIComponent(token)}`

  yield* sendEmail({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Subscribe Request",
    react: SubscribeEmail({ subscribeUrl })
  })
  return { success: true, message: "Check your inbox to complete your subscribe request." }
}).pipe(
  Effect.withLogSpan("request_subscribe")
)

export const requestUnsubscribe = (email: string) => Effect.gen(function*() {
  const { getContact, sendEmail } = yield* Email

  const contact = yield* getContact(email)
  if (!contact) return yield* new ContactNotFoundError({
    message: "We were unable to send a confirmation email because that email is not currently subscribed!",
    cause: new Error(`Contact not found for email: ${email}`)
  })

  const token = yield* generateToken(email, "1 day")
  const unsubscribeUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

  yield* sendEmail({
    from: "COD Zombies Guides <support@codzombiesguides.com>",
    to: email,
    subject: "Confirm Your Unsubscribe Request",
    react: UnsubscribeEmail({ unsubscribeUrl })
  })
  return { success: true, message: "Check your inbox to complete your unsubscribe request." }
}).pipe(
  Effect.withLogSpan("request_unsubscribe"),
)

export const subscribeEmail = (email: string) => Effect.gen(function*() {
  const { createContact } = yield* Email

  yield* createContact(email)
  return { success: true }
}).pipe(
  Effect.withLogSpan("process_subscribe")
)

export const unsubscribeEmail = (email: string) => Effect.gen(function*() {
  const { removeContact } = yield* Email

  return yield* removeContact(email)
}).pipe(
  Effect.withLogSpan("process_unsubscribe")
)

export const sendContactEmail = (props: EmailProps) => Effect.gen(function*() {
  const { sendEmail } = yield* Email

  yield* sendEmail({
    from: `${props.name} <contact@codzombiesguides.com>`,
    replyTo: props.email,
    to: 'codzombiesguidesteam@gmail.com',
    subject: 'Contact Form Submission',
    text: props.message,
  })
  return { success: true, message: "Thank you for contacting us! We will get back to you as soon as possible." }
}).pipe(
  Effect.withLogSpan("send_contact_email")
)

export const sendQuestReleaseBroadcast = (props: IQuestRelease) => {
  return createAndSendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Quest Guide: ${props.title}`,
      react: QuestReleaseEmail(props),
      name: `${props.title} Release`
    }).pipe(
      Effect.withLogSpan("send_quest_release_broadcast")
    )
}

export const sendZombieReleaseBroadcast = (props: IZombieRelease) => {
  return createAndSendBroadcast(props.title, {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <updates@codzombiesguides.com>",
      subject: `New ${props.type} Zombie Release: ${props.title}`,
      react: ZombieReleaseEmail(props),
      name: `${props.title} Release`
    }).pipe(
      Effect.withLogSpan("send_zombie_release_broadcast")
    )
}

export const sendLegalUpdateBroadcast = () => {
  return createAndSendBroadcast("Privacy Policy", {
      audienceId: env.RESEND_AUDIENCE_ID,
      from: "COD Zombies Guides <legal@codzombiesguides.com>",
      subject: `Privacy Policy Update Notice`,
      react: PrivacyPolicyUpdateEmail(),
      name: "Privacy Policy Update"
    }).pipe(
      Effect.withLogSpan("send_legal_update_broadcast")
    )
}

const createAndSendBroadcast = (title: string, payload: CreateBroadcastOptions) => Effect.gen(function*() {
  const { createBroadcast, sendBroadcast } = yield* Email

  const broadcast = yield* createBroadcast(payload)
  if (!broadcast) return yield* new CreateBroadcastError({
    message: "Failed to create broadcast",
    cause: new Error("No data was returned for the broadcast request.")
  })

  yield* sendBroadcast(broadcast.id)
  return { success: true, message: `${title} Broadcast sent successfully!` }
}).pipe(Effect.withLogSpan("send_broadcast"))