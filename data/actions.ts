"use server"
import { ContactFormSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { ActionError, createAction } from "@/lib/safe-action"
import { requestUnsubscribeUseCase, sendContactEmailUseCase, subscribeEmailUseCase } from "@/usecases/email"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { draftMode } from "next/headers"
import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const subscribeToNewsletter = createAction
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ parsedInput: { email } }) => {
    return await subscribeEmailUseCase(email)
  })

export const requestUnsubscribe = createAction
  .metadata({ actionName: "requestUnsubscribe"})
  .schema(NewsletterFormSchema)
  .action(async ({ parsedInput: { email }}) => {
    return await requestUnsubscribeUseCase(email)
  })

export const submitFeedbackForm = createAction
  .metadata({ actionName: "submitFeedbackForm" })
  .schema(FeedbackFormSchema)
  .action(async ({ parsedInput }) => {
    return await submitFeedbackUseCase(parsedInput)
  })

export const submitContactForm = createAction
  .metadata({ actionName: "submitContactForm" })
  .schema(ContactFormSchema)
  .action(async ({ parsedInput }) => {
    return await sendContactEmailUseCase(parsedInput)
  })

export const toggleDraftMode = createAction
  .metadata({ actionName: "toggleDraftMode" })
  .schema(z.object({
    pathname: z.string()
  }))
  .use(async ({ next }) => {
    if (!IN_DEVELOPMENT) {
      throw new ActionError("This action is not available in production")
    }

    return next()
  })
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