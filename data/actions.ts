"use server"
import { ContactFormSchema, DraftModeSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validation-schemas"
import { createAction } from "@/lib/action-helpers"
import { requestSubscribe, sendContactEmail, requestUnsubscribe } from "@/usecases/email"
import { submitFeedback } from "@/usecases/feedback"
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Effect } from "effect"
import { Email } from "@/lib/services/Email"
import { FetchHttpClient } from "@effect/platform"
import { IN_DEVELOPMENT } from "@/utils/constants"

export const subscribeToNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
  return requestSubscribe(email).pipe(
    Effect.tapError(Effect.logError),
    Effect.catchTags({
      ContactExistsError: (error) => Effect.succeed({ 
        success: false, 
        message: error.message
      })
    }),
    Effect.catchAll((_error) => Effect.succeed({ 
      success: false, 
      message: "Subscribe request failed due to a technical issue on our end. Please try again." 
    })),
    Effect.provide(Email.Default),
    Effect.runPromise
  )
})

export const unsubscribeFromNewsletter = createAction(NewsletterFormSchema, async ({ email }) => {
  return requestUnsubscribe(email).pipe(
    Effect.tapError(Effect.logError),
    Effect.catchTags({
      ContactNotFoundError: (error) => Effect.succeed({ 
        success: false, 
        message: error.message
      })
    }),
    Effect.catchAll((_error) => Effect.succeed({ 
      success: false, 
      message: "Unsubscribe request failed due to a technical issue on our end. Please try again." 
    })),
    Effect.provide(Email.Default),
    Effect.runPromise
  )
})

export const submitFeedbackForm = createAction(FeedbackFormSchema, async (parsedInput) => {
  return submitFeedback(parsedInput).pipe(
    Effect.tapError(Effect.logError),
    Effect.catchAll((_error) => Effect.succeed({ 
      success: false, 
      message: "Feedback submission failed due to a technical issue on our end. Please try again." 
    })),
    Effect.provide(FetchHttpClient.layer),
    Effect.runPromise
  )
})

export const submitContactForm = createAction(ContactFormSchema, async (parsedInput) => {
  return sendContactEmail(parsedInput).pipe(
    Effect.tapError(Effect.logError),
    Effect.catchAll((_error) => Effect.succeed({ 
      success: false, 
      message: "Contact form submission failed due to a technical issue on our end. Please try again." 
    })),
    Effect.provide(Email.Default),
    Effect.runPromise
  )
})

export const toggleDraftMode = createAction(DraftModeSchema, async ({ pathname }) => {
  if (!IN_DEVELOPMENT) return

  const draft = await draftMode()

  if (draft.isEnabled) {
    draft.disable()
    console.log("Draft mode disabled")
    revalidatePath(pathname)
    redirect(pathname)
  } 

    draft.enable()
    console.log("Draft mode enabled")
    revalidatePath(pathname)
    redirect(pathname)
})