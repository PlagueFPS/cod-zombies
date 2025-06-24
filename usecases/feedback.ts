import "server-only"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validationSchemas"
import { FetchError, TextParseError } from "@/types/Error"
import { Console, Effect } from "effect"

interface Input extends FeedbackForm {
  title?: string
  label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

export const submitFeedbackUseCase = (input: Input) => 
  Effect.gen(function* () {
    const { title, label, feedback } = input
    const res = yield* Effect.tryPromise({
      try: (signal) => fetch("https://projectplannerai.com/api/feedback", {
        signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: env.PROJECT_PLANNER_ID,
          title: title ?? "Website Feedback",
          label: label ?? "other",
          feedback,
        }),
      }),
      catch: (error) => new FetchError({
        message: "Failed to submit feedback due to a technical issue on our end. Please try again.",
        cause: error
      }),
    })

    if (!res.ok) {
      const resText = yield* Effect.tryPromise({
        try: () => res.text(),
        catch: (error) => new TextParseError({
          message: "Failed to submit feedback due to a technical issue on our end. Please try again.",
          cause: error
        }),
      })

      return yield* Effect.fail(new FetchError({
        message: "Failed to submit feedback due to a technical issue on our end. Please try again.",
        cause: resText
      }))
    }
    
    return { success: true, message: "Thank you for submitting! Your submission has been received." }
  }).pipe(
    Effect.withLogSpan("submit_feedback"),
    Effect.tapError(error => Console.error(error)),
    Effect.catchAll(error => Effect.succeed({ success: false, message: error.message }))
  )