"use server"
import { FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction } from "@/lib/safe-action"
import { subscribeEmailUseCase } from "@/usecases/newsletter"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { rateLimitByIp } from "@/lib/ratelimit"

export const subscribeToNewsletter = createAction
  .use(async ({ next }) => {
    const { rateLimited, retryAfter } = await rateLimitByIp(1, 10)
    return next({ ctx: { rateLimited, retryAfter }})
  })
  .metadata({ actionName: "subscribeToNewsletter" })
  .schema(NewsletterFormSchema)
  .action(async ({ ctx, parsedInput: { email } }) => {
    if (ctx.rateLimited) return {
      success: false,
      message: `Too many requests! Please try again in ${ctx.retryAfter} ms.`
    }

    const result = await subscribeEmailUseCase(email)
    return result
  })

export const submitFeedbackForm = createAction
  .use(async ({ next }) => {
    const { rateLimited, retryAfter } = await rateLimitByIp(5, 10)
    return next({ ctx: { rateLimited, retryAfter }})
  })
  .metadata({ actionName: "submitFeedbackForm" })
  .schema(FeedbackFormSchema)
  .action(async ({ ctx, parsedInput }) => {
    if (ctx.rateLimited) return {
      success: false,
      message: `Too many requests! Please try again in ${ctx.retryAfter} ms.`
    }

    const result = await submitFeedbackUseCase(parsedInput)
    return result
  })