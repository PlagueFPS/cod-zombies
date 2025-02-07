"use server"
import { ContactFormSchema, FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction } from "@/lib/safe-action"
import { subscribeEmailUseCase, unsubscribeEmailUseCase } from "@/usecases/newsletter"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { sendContactEmailUseCase } from "@/usecases/email"

export const subscribeToNewsletter = createAction
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ parsedInput: { email } }) => {
    const result = await subscribeEmailUseCase(email)
    return result
  })

export const submitFeedbackForm = createAction
  .metadata({ actionName: "submitFeedbackForm" })
  .schema(FeedbackFormSchema)
  .action(async ({ parsedInput }) => {
    const result = await submitFeedbackUseCase(parsedInput)
    return result
  })

export const submitContactForm = createAction
  .metadata({ actionName: "submitContactForm" })
  .schema(ContactFormSchema)
  .action(async ({ parsedInput }) => {
    const result = await sendContactEmailUseCase(parsedInput)
    return result
  })

export const unsubscribeToNewsletter = createAction
.metadata({ actionName: "unsubscribeToNewsletter" })
.schema(NewsletterFormSchema)
.action(async ({ parsedInput: { email }}) => {
  const result = await unsubscribeEmailUseCase(email)
  return result
})