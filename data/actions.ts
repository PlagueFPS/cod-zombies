"use server"
import { ContactFormSchema, DraftModeSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction, developmentAction, ratelimitAction } from "@/lib/safe-action"
import { requestUnsubscribeUseCase, sendContactEmailUseCase, subscribeEmailUseCase } from "@/usecases/email"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const subscribeToNewsletter = ratelimitAction
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ ctx, parsedInput: { email } }) => {
    if (ctx.limited) return {
      success: false,
      message: ctx.message,
      remaining: ctx.remaining
    }

    const result = await subscribeEmailUseCase(email)
    if (result.isErr()) {
      console.error(result.error)
      return {
        success: false,
        message: result.error.message 
      }
    }
    
    return { success: true, message: result.value.message }
  })

export const requestUnsubscribe = ratelimitAction
  .metadata({ actionName: "requestUnsubscribe"})
  .schema(NewsletterFormSchema)
  .action(async ({ ctx, parsedInput: { email }}) => {
    if (ctx.limited) return {
      success: false,
      message: ctx.message,
      remaining: ctx.remaining
    }

    const result = await requestUnsubscribeUseCase(email)
    if (result.isErr()) {
      console.error(result.error)
      return {
        success: false,
        message: result.error.message 
      }
    }
    
    return { success: true, message: result.value.message }
  })

export const submitFeedbackForm = createAction
  .metadata({ actionName: "submitFeedbackForm" })
  .schema(FeedbackFormSchema)
  .action(async ({ parsedInput }) => {
    const result = await submitFeedbackUseCase(parsedInput)
    if (result.isErr()) {
      console.error(result.error)
      return {
        success: false,
        message: result.error.message 
      }
    }
    
    return { success: true, message: result.value.message }
  })

export const submitContactForm = createAction
  .metadata({ actionName: "submitContactForm" })
  .schema(ContactFormSchema)
  .action(async ({ parsedInput }) => {
    const result = await sendContactEmailUseCase(parsedInput)
    if (result.isErr()) {
      console.error(result.error)
      return {
        success: false,
        message: result.error.message 
      }
    }
    
    return { success: true, message: result.value.message }
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