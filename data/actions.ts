"use server"
import { FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { createAction } from "@/lib/safe-action"
import { subscribeEmailUseCase } from "@/usecases/newsletter"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { headers } from "next/headers"
import { rateLimitByIp } from "@/lib/ratelimit"
import { sendInternalEmailUseCase } from "@/usecases/email"

export const subscribeToNewsletter = createAction
  .use(async ({ next }) => {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') ?? "127.0.0.1"
    const { rateLimited, retryAfter } = await rateLimitByIp(ip, 1, 10)
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
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') ?? "127.0.0.1"
    const { rateLimited, retryAfter } = await rateLimitByIp(ip, 5, 10)
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

    if (result.success) await sendInternalEmailUseCase({
      subject: 'New Feedback Submitted',
      message: `${parsedInput.name ?? "Someone"} submitted some feedback. Make sure to take a look.`
    })

    return result
  })