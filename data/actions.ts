"use server"
import { ContactFormSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction } from "@/lib/safe-action"
import {  sendContactEmailUseCase, subscribeEmailUseCase } from "@/usecases/email"
import { submitFeedbackUseCase } from "@/usecases/feedback"

export const subscribeToNewsletter = createAction
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ parsedInput: { email } }) => {
    return await subscribeEmailUseCase(email)
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