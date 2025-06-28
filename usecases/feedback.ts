import "server-only"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validation-schemas"
import { Effect } from "effect"
import { HttpBody, HttpClient } from "@effect/platform"

interface Input extends FeedbackForm {
  label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

export const submitFeedback = (input: Input) => Effect.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient
  const { title, label, feedback } = input
  yield* httpClient.post("https://projectplannerai.com/api/feedback", {
    headers: {
      "Content-Type": "application/json",
    },
    body: yield* HttpBody.json({
      projectId: env.PROJECT_PLANNER_ID,
      title: title ?? "Website Feedback",
      label: label ?? "other",
      feedback,
    }),
  })
  
  return { success: true, message: "Thank you for submitting! Your submission has been received." }
}).pipe(
  Effect.withLogSpan("submit_feedback")
)