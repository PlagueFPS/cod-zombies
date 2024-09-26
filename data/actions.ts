"use server"
import { FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction } from "@/lib/safe-action"
import { subscribeEmailUseCase } from "@/usecases/newsletter"
import { submitFeedbackUseCase } from "@/usecases/feedback"

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