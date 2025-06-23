import "server-only"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validationSchemas"
import { FetchError } from "@/types/Error"
import { Effect } from "effect"

interface Input extends FeedbackForm {
  title?: string
  label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

export const submitFeedbackUseCase = (input: Input) => 
  Effect.gen(function* () {
    const { title, label, feedback } = input
    const res = yield* Effect.tryPromise({
      try: () => fetch("https://projectplannerai.com/api/feedback", {
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
      catch: (error) => new FetchError("Failed to submit feedback due to a technical issue on our end. Please try again.", { cause: error }),
    })

    if (!res.ok) return yield* Effect.fail(new FetchError("Failed to submit feedback due to a technical issue on our end. Please try again.", { cause: res }))
    
    return { success: true, message: "Thank you for submitting! Your submission has been received." }
  }).pipe(
    Effect.withLogSpan("submitFeedbackUseCase"),
    Effect.catchTags({
      FETCH_ERROR: (error) => Effect.succeed({ success: false, message: error.message }),
    }),
  )