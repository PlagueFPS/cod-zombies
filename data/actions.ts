"use server"
import { ContactFormSchema, DraftModeSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction, developmentAction, ratelimitAction } from "@/lib/safe-action"
import { requestSubscribe, sendContactEmail, requestUnsubscribe } from "@/usecases/email"
import { submitFeedback } from "@/usecases/feedback"
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Effect } from "effect"
import { Email } from "@/lib/services/Email"
import { FetchHttpClient } from "@effect/platform"

export const subscribeToNewsletter = ratelimitAction
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ ctx, parsedInput: { email } }) => {
    if (ctx.limited) return {
      success: false,
      message: ctx.message,
      remaining: ctx.remaining
    }

    return requestSubscribe(email).pipe(
      Effect.provide(Email.Default),
      Effect.runPromise
    )
  })

export const unsubscribeFromNewsletter = ratelimitAction
  .metadata({ actionName: "requestUnsubscribe"})
  .schema(NewsletterFormSchema)
  .action(async ({ ctx, parsedInput: { email }}) => {
    if (ctx.limited) return {
      success: false,
      message: ctx.message,
      remaining: ctx.remaining
    }

    return requestUnsubscribe(email).pipe(
      Effect.provide(Email.Default),
      Effect.runPromise
    )
  })

export const submitFeedbackForm = createAction
  .metadata({ actionName: "submitFeedbackForm" })
  .schema(FeedbackFormSchema)
  .action(async ({ parsedInput }) => {
    return submitFeedback(parsedInput).pipe(
      Effect.provide(FetchHttpClient.layer),
      Effect.runPromise
    )
  })

export const submitContactForm = createAction
  .metadata({ actionName: "submitContactForm" })
  .schema(ContactFormSchema)
  .action(async ({ parsedInput }) => {
    return sendContactEmail(parsedInput).pipe(
      Effect.provide(Email.Default),
      Effect.runPromise
    )
  })

export const toggleDraftMode = developmentAction
  .metadata({ actionName: "toggleDraftMode" })
  .schema(DraftModeSchema)
  .action(async ({ parsedInput: { pathname } }) => {
    const draft = await draftMode()
    if (draft.isEnabled) {
      draft.disable()
      console.log("Draft mode disabled")
      revalidatePath(pathname)
      redirect(pathname)
    } else {
      draft.enable()
      console.log("Draft mode enabled")
      revalidatePath(pathname)
      redirect(pathname)
    }
  })